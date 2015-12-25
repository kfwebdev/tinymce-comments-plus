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

tcp.Edit = require( '../components/edit/edit' );
tcp.Editor = require( '../components/editor/editor' );

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


	// Reset tinymce editors
	tcp.resetEditors = function() {
		// Remove old textarea tinyMCE editor instance
		tinymce.EditorManager.execCommand( 'mceRemoveEditor', true, 'comment' );
		// Remove old inline toolbar created by old tinyMCE editor instance
		$( 'div.mce-inline-toolbar-grp' ).remove();
		// Recreate new tinyMCE editor at new #comment textarea position
		tinymce.EditorManager.execCommand( 'mceAddEditor', true, 'comment' );
	};


	tcp.bindEditors = function() {
		// bind edit components
		$( '.' + tcp.globals.tcp_css_edit ).each(function(){
			let commentId = $( this ).data( tcp.globals.tcp_css_comment_id ),
					editId = tcp.globals.tcp_css_edit + commentId,
					editorId = tcp.globals.tcp_css_editor + commentId;
			ReactDOM.render(<tcp.Edit tcpGlobals={ tcp.globals } commentId={ commentId } editId={ editId } editorId={ editorId } />, this );
		});

		// bind editor components
		$( '.' + tcp.globals.tcp_css_editor ).each(function(){
			let commentId = $( this ).data( tcp.globals.tcp_css_comment_id ),
					editId = tcp.globals.tcp_css_edit + commentId,
					editorId = tcp.globals.tcp_css_editor + commentId,
					contentId = tcp.globals.tcp_css_comment_content + commentId;
			ReactDOM.render(<tcp.Editor tcpGlobals={ tcp.globals } commentId={ commentId } editId={ editId } editorId={ editorId } contentId={ contentId } />, this );
		});

		$( '.comment-reply-link' ).on( 'click', function() {
			tcp.resetEditors();
			tinyMCE.activeEditor.focus();
			$( '#' + tcp.globals.tcp_id_cancel_comment_reply_id ).on( 'click', function() {
				tcp.resetEditors();
				tinyMCE.activeEditor.focus();
			});
		});
	}

};

( function( $ ){
   $(function(){
      tcp.initTcp();
			tcp.bindEditors();
   });
})( jQuery );
