/**
 *
 * @package   tinymce-comments-plus
 * @author    Kentaro Fischer <webdev@kentarofischer.com>
 * @license   GPL-2.0+
 * @link      http://kentarofischer.com
 * @copyright 3-22-2015 Kentaro Fischer
 */

'use strict';

// import jQuery from 'jquery';
// import Backbone from 'backbone';
// import _ from 'underscore';
import React from 'react';
import ReactDOM from 'react-dom';

window.cl = console.dir.bind( console );

var
	tcp = window.tcp || {},
	tcpGlobals = window.tcpGlobals || {},
	$ = jQuery
;

window.tcp = tcp;

tcp.initTcp = function() {
	if ( tcpGlobals.length ) {
		window.tcp.globals = JSON.parse( tcpGlobals );
	}


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

		events: function() {
			var _events = {};
			_events[ 'click .' + tcp.globals.cssSubmitEditButton ] = 'submitEdit';
			_events[ 'click .' + tcp.globals.cssCancelEditButton ] = 'cancelEdit';

			return _events;
		},

		template: _.template('<textarea id="tcpCommentEditor<%= commentId %>" rows="8"><%= content %></textarea>' +
		'<div class="reply tcp-reply-container"><span class="spinner" style="display:none;"></span><a href="javascript:void(0);" class="' + tcp.globals.cssButton + ' ' + tcp.globals.cssSubmitEditButton + '">Submit</a> ' +
		'<a href="javascript:void(0);" class="' + tcp.globals.cssButton + ' ' + tcp.globals.cssCancelEditButton + '">Cancel</a></div>'),

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
				$spinner = this.$el.find( '.spinner' ),
				$submitEdit = this.$el.find( '.' + tcp.globals.cssSubmitEditButton ),
				tinymceContent = tinymce.get( 'tcpCommentEditor' + this.commentId ).getContent(),
				$content = $( '.tcp-comment-content[data-tcp-comment-id=' + this.commentId + ']' );

			this.model.set( 'content', tinymceContent );
			this.model.set( 'action', tcp.globals.updateCommentAction );

			$spinner.show();
			$submitEdit.attr( 'disabled', true );
			$submitEdit.text( 'Submitting' );
			this.events[ 'click .' + tcp.globals.cssSubmitEditButton ] = undefined;
			this.delegateEvents( this.events );

			var $commentPost = $.ajax({
				url: tcp.globals.ajaxUrl,
				type: 'post',
				data: this.model.toJSON()
			})
			.done( function( data ){
				$submitEdit.attr( 'disabled', false );
				$submitEdit.text( 'Submitted' );
				$content.html( data.comment_content );
				self.cancelEdit();
			})
			.fail( function( data ){
				// error
			})
			.then( function(){
				$spinner.hide();
				self.events[ 'click .' + tcp.globals.cssSubmitEditButton ] = 'submitEdit';
				self.delegateEvents( this.events );
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





	tcp.RespondView = Backbone.View.extend({
		events: function() {
			var _events = {};

			_events[ 'click #' + tcp.globals.idCancelCommentReply ] = 'resetEditors';
			_events[ 'submit' ] = 'submitForm';

			return _events;
		},

		initialize: function() {
			this.$commentForm = this.$el.find( 'form' );
			this.$textArea = this.$el.find( 'textarea' );
			this.$submitButton = this.$commentForm.find( 'input[type=submit]' );
			this.$submitButton.addClass( tcp.globals.cssButton + ' ' + tcp.globals.cssSubmitButton )
			// tcp.resetEditors();
		},

		resetEditors: function() {
			tcp.resetEditors();
		},

		submitForm: function( event ) {
			event.preventDefault();

			var self = this,
				content = tinyMCE.activeEditor.getContent(),
				submitText = this.$submitButton.val();

			this.$textArea.html( content );
			this.$submitButton.val( 'Posting...' );
			this.$submitButton.attr( 'disabled', true );

			$.ajax({
				url: this.$commentForm.attr( 'action' ),
				type: 'post',
				data: this.$commentForm.serialize()
			})
			.done( function( data ){
				self.$el.find( '#' + tcp.globals.idCancelCommentReply ).click();
				self.$submitButton.attr( 'disabled', false );
				self.$submitButton.val( submitText );
				tinyMCE.activeEditor.setContent('');
				tcp.resetEditors();

				var
					$commentData = $( data ).find( tcp.globals.commentsList ),
					$commentsList = $( tcp.globals.commentsList )
				;

				if ( $commentData.length ) {

					// replace #comments element with data response #comments element
					$commentsList.replaceWith( $commentData );

					tcp.views.comments = new tcp.CommentsView({
						el: $( tcp.globals.commentsList )
					});

					// restore tinymce editor to refreshed reply form
					tcp.resetEditors();

					// // scroll to latest comment
					// var $commentsList = $comments.find( '.comment' );
					// if ( $commentsList.length ) {
					// 	var $lastComment = $commentsList[ $commentsList.length - 1 ];
					// 	if ( $lastComment.offsetHeight ) {
					// 		$( 'html, body' ).animate({
					// 			scrollTop: $lastComment.offsetHeight
					// 		}, 1500 );
					// 	}
					// }
				}
			})
			.fail( function( data ){
				// error
			});
		}
	});





	tcp.CommentsView = Backbone.View.extend({
		events: function() {
			var _events = {};
			_events[ 'click .' + tcp.globals.cssEditButton ] = 'resetEditors';
			_events[ 'click .' + tcp.globals.cssCommentReplyButton ] = 'resetEditors';
			_events[ 'click .' + tcp.globals.cssEditButton ] = 'editComment';

			return _events;
		},

		initialize: function() {
			this.$el.find( '.' + tcp.globals.cssCommentReplyButton ).addClass( tcp.globals.cssButton );
		},

		resetEditors: function() {
			tcp.resetEditors();
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
				$editLink.before('<div id="' + editElement + '" class="tcp-comment-editor"></div>');

				var	editModel = new tcp.EditModel({
						action: tcp.globals.updateCommentAction,
						security: nonce,
						postId: postId,
						commentId: commentId
					}),
					editView = new tcp.EditView({
						el: '#' + editElement,
						model: editModel
				});

				$( '#comment-' + commentId + ' .tcp-comment-content[data-tcp-comment-id=' + commentId + ']' ).after( editView.render().el );
				tinymce.EditorManager.execCommand( 'mceAddEditor', true, 'tcpCommentEditor' + commentId );
				$editLink.hide();
			}
		}
	}); /* /tcp.CommentsView */




	// Reset tinymce editors
	tcp.resetEditors = function() {
		// Remove old textarea tinyMCE editor instance
		tinymce.EditorManager.execCommand( 'mceRemoveEditor', true, 'comment' );
		// Remove old inline toolbar created by old tinyMCE editor instance
		$( 'div.mce-inline-toolbar-grp' ).remove();
		// Recreate new tinyMCE editor at new #comment textarea position
		tinymce.EditorManager.execCommand( 'mceAddEditor', true, 'comment' );
	};


	// Instantiate views on document ready
	// tcp.views = {};
	//
	// tcp.views.comments = new tcp.CommentsView({
	// 	el: $( tcp.globals.commentsList )
	// });
	//
	// tcp.views.respond = new tcp.RespondView({
	// 	el: $( tcp.globals.commentFormSpan ).parent().parent()
	// });


	tcp.Edit = require( '../components/edit/edit' );
	tcp.Editor = require( '../components/editor/editor' );

	$( '.tcp-edit' ).each(function(){
		let commentId = $(this).data('tcp-comment-id'),
		editorId = 'tcp-editor' + commentId;
		ReactDOM.render(<tcp.Edit editorId={editorId} />, this );
	});

	// $( '.tcp-editor' ).each(function(){
	// 	ReactDOM.render(<tcp.Editor tcpGlobals={tcp.globals} showEditor="false" />, this );
	// });

};

( function( $ ){
   $(function(){
      tcp.initTcp();
   });
})( jQuery );
