/**
 * Represents the view for the public-facing component of the plugin.
 *
 * This typically includes any information, if any, that is rendered to the
 * frontend of the theme when the plugin is activated.
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
	if ( tcpGlobals.length ) { tcpGlobals = JSON.parse( tcpGlobals ); }


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
			el: '#tcpEditComment',

			events: {
				'click .tcp-submit-edit' : 'submitEdit',
				'click .tcp-cancel-edit' : 'cancelEdit'
			},

			template: _.template('<textarea id="tcpCommentEditor" rows="8"><%= content %></textarea>' +
			'<a href="javascript:void(0);" class="tcp-submit-edit">Submit Edit</a> | ' +
			'<a href="javascript:void(0);" class="tcp-cancel-edit">Cancel Edit</a>'),

			render: function() {
				var $content = $( '.tcp-comment-content[data-tcp-comment-id=' + this.model.get( 'commentId' ) + ']' );

				$content.hide();
				this.$el.html(
					this.template({
						content: $content.html()
						})
				);

				return this;
			},

			submitEdit: function() {
				var self = this,
					tinymceContent = tinymce.get( 'tcpCommentEditor' ).getContent(),
					$content = $( '.tcp-comment-content[data-tcp-comment-id=' + this.model.get( 'commentId' ) + ']' );
				this.model.set( 'content', tinymceContent );
				this.model.set( 'action', 'update_comment' );

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
				tinymce.EditorManager.execCommand( 'mceRemoveEditor', true, 'tcpCommentEditor' );
				// Remove old inline toolbar created by old tinyMCE editor instance
				$( 'div.mce-inline-toolbar-grp' ).remove();
				// Remove this view
				this.$el.remove();
				$( '.tcp-comment-content[data-tcp-comment-id=' + this.model.get( 'commentId' ) + ']' ).show();
				$( '.tcp-edit-comment[data-tcp-comment-id=' + this.model.get( 'commentId' ) + ']' ).show();
			}

		}); /* /tcp.EditView */


		tcp.CommentsView = Backbone.View.extend({
			el: '#comments',

			events: {
				'click .comment-reply-link' : 'resetEditors',
				'click #cancel-comment-reply-link' : 'resetEditors',
				'click .tcp-edit-comment' : 'editComment'
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
							nonce = $editLink.attr( 'data-tcp-nc' );

					if ( $editLink.length &&
							parseInt( postId ) > 0 &&
							parseInt( commentId ) > 0 ) {
						$editLink.before('<div id="tcpEditComment"></div>');

						var	editModel = new tcp.EditModel({
									security: nonce,
									postId: postId,
									commentId: commentId
								}),
							editView = new tcp.EditView({ model: editModel });

						$( editView.el ).append( editView.render().el );
						tinymce.EditorManager.execCommand( 'mceAddEditor', true, 'tcpCommentEditor' );
						$editLink.hide();
					}
			}
		}); /* /tc.CommentsView */

		new tcp.CommentsView();

	});
}( jQuery ) );
