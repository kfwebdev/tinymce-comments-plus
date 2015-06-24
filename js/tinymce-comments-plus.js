/**
 *
 * @package   tinymce-comments-plus
 * @author    Kentaro Fischer <webdev@kentarofischer.com>
 * @license   GPL-2.0+
 * @link      http://kentarofischer.com
 * @copyright 3-22-2015 Kentaro Fischer
 */

var tcp = {};

( function ( $ ) {
	"use strict";

	window.cl = console.dir.bind( console );
	if ( tcpGlobals.length ) {
		tcpGlobals = JSON.parse( tcpGlobals );
	}


	$(function () {
		tcp.EditModel = Backbone.Model.extend({
			defaults: {
				action: '',
				security: '',
				postId: 0,
				commentId: 0,
				content: ''
			}
		});


		tcp.EditView = Backbone.View.extend({
			initialize: function() {
				this.commentId = this.model.get( 'commentId' );
			},

			events: {
				'click .tcp-submit-edit' : 'submitEdit',
				'click .tcp-cancel-edit' : 'cancelEdit'
			},

			template: _.template('<textarea id="tcpCommentEditor<%= commentId %>" rows="8"><%= content %></textarea>' +
			'<div class="reply"><a href="javascript:void(0);" class="tcp-submit-edit">Submit</a> ' +
			'<a href="javascript:void(0);" class="tcp-cancel-edit">Cancel</a></div>'),

			render: function() {
				var $content = $( '.tcp-comment-content[data-tcp-comment-id=' + this.commentId + ']' );

				$content.hide();

				this.$el.html(
					this.template({
						commentId: this.commentId,
						content: $content.html()
					})
				);

				return this;
			},

			submitEdit: function() {
				var self = this,
					tinymceContent = tinymce.get( 'tcpCommentEditor' + this.commentId ).getContent(),
					$content = $( '.tcp-comment-content[data-tcp-comment-id=' + this.commentId + ']' );

				this.model.set( 'content', tinymceContent );
				this.model.set( 'action', tcpGlobals.updateCommentAction );

				var $commentPost = $.ajax({
					url: tcpGlobals.ajaxUrl,
					type: 'post',
					data: this.model.toJSON()
				})
					.done( function( data ){
						$content.html( data.comment_content );
						self.cancelEdit();
					})
					.fail( function( data ){
						cl('fail'); cl(data);
				});
			},

			cancelEdit: function() {
				// Remove old textarea tinyMCE editor instance
				tinymce.EditorManager.execCommand( 'mceRemoveEditor', true, 'tcpCommentEditor' + this.commentId );
				// Remove old inline toolbar created by old tinyMCE editor instance
				$( 'div.mce-inline-toolbar-grp' ).remove();
				// Remove this view
				this.$el.remove();
				$( '.tcp-comment-content[data-tcp-comment-id=' +  this.commentId + ']' ).show();
				$( '.tcp-edit-comment[data-tcp-comment-id=' +  this.commentId + ']' ).show();
			}

		}); /* /tcp.EditView */


		tcp.CommentsView = Backbone.View.extend({
			initialize: function() {
				// store reply comment form marker span
				this.$tcpSpan = this.$el.find('#tcpCommentFormSpan');
				// store reply comment form element
				this.$commentForm = this.$el.find('#tcpCommentFormSpan').parent();
			},

			el: '#comments',

			events: function() {
				var _events = {
					'click .comment-reply-link' : 'resetEditors',
					'click #cancel-comment-reply-link' : 'resetEditors',
					'click .tcp-edit-comment' : 'editComment'
				};
				_events['submit #' + this.$commentForm.attr( 'id' ) ] = 'submitForm';
				return _events;
			},

			submitForm: function( event ) {
				var self = this;

				event.preventDefault();

				$.ajax({
					url: this.$commentForm.attr( 'action' ),
					type: 'post',
					data: this.$commentForm.serialize()
				})
				.done( function( data ){
					var comments = $( data ).find( '#comments' );
					if ( comments.length ) {
						// replace #comments element with data response #comments element
						$( '#comments' ).replaceWith( comments );
						// restore tinymce editor to refreshed reply form
						self.resetEditors();
					}
				})
				.fail( function( data ){
					cl( 'fail' );
					cl( data );
				});
			},

			resetEditors: function() {
				// Remove old textarea tinyMCE editor instance
				tinymce.EditorManager.execCommand( 'mceRemoveEditor', true, 'comment' );
				// Remove old inline toolbar created by old tinyMCE editor instance
				$( 'div.mce-inline-toolbar-grp' ).remove();
				// Recreate new tinyMCE editor at new #comment textarea position
				tinymce.EditorManager.execCommand( 'mceAddEditor', true, 'comment' );
			},

			editComment: function( event ) {
					var $editLink = $( event.currentTarget ),
						postId = $editLink.attr( 'data-tcp-post-id' ),
						commentId = $editLink.attr( 'data-tcp-comment-id' ),
						editElement = 'tcpEditComment' + commentId,
						nonce = $editLink.attr( 'data-tcp-nc' );

					if ( $editLink.length &&
						 parseInt( postId ) > 0 &&
						 parseInt( commentId ) > 0 ) {
						$editLink.before('<div id="' + editElement + '"></div>');

						var	editModel = new tcp.EditModel({
									action: tcpGlobals.updateCommentAction,
									security: nonce,
									postId: postId,
									commentId: commentId
								}),
							editView = new tcp.EditView({
								el: '#' + editElement,
								model: editModel
							});

						$( '#comment-' + commentId + ' .comment-content' ).after( editView.render().el );
						tinymce.EditorManager.execCommand( 'mceAddEditor', true, 'tcpCommentEditor' + commentId );
						$editLink.hide();
					}
			}
		}); /* /tc.CommentsView */

		new tcp.CommentsView();

	});
}( jQuery ) );
