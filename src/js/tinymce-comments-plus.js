/**
 *
 * @package   tinymce-comments-plus
 * @author    Kentaro Fischer <webdev@kentarofischer.com>
 * @license   GPL-2.0+
 * @link      http://kentarofischer.com
 * @copyright 3-22-2015 Kentaro Fischer
 */

'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

// if ( window.console && window.console.dir.bind ) { window.cl = console.dir.bind( console ); }

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

	tcp.RespondView = Backbone.View.extend({
		events: function() {
			var _events = {};

			_events[ 'click ' + tcp.globals.tcp_id_cancel_comment_reply ] = 'resetEditor';
			_events[ 'submit' ] = 'submitForm';

			return _events;
		},

		initialize: function() {
			this.$commentForm = this.$el.find( 'form' );
			this.$textArea = this.$el.find( 'textarea' );
			this.$submitButton = this.$commentForm.find( 'input[type=submit]' );
			this.$submitButton.addClass( tcp.globals.cssButton + ' ' + tcp.globals.cssSubmitButton )
		},

		resetEditor: function() {
			tcp.resetEditor();
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
				self.$el.find( tcp.globals.tcp_id_cancel_comment_reply ).click();
				self.$submitButton.attr( 'disabled', false );
				self.$submitButton.val( submitText );
				tinyMCE.activeEditor.setContent( '' );
				tcp.resetEditor();

				var
					$commentData = $( data ).find( tcp.globals.tcp_id_comments ),
					$commentsList = $( tcp.globals.tcp_id_comments )
				;

				if ( $commentData.length ) {

					// replace #comments element with data response #comments element
					$commentsList.replaceWith( $commentData );

					// rebind React components
					tcp.bindEditors();

					// reset tinymce editor in replaced #comments list
					tcp.resetEditor();

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
	tcp.resetEditor = function() {
		// Remove old textarea tinyMCE editor instance
		tinymce.EditorManager.execCommand( 'mceRemoveEditor', true, 'comment' );
		// Remove old inline toolbar created by old tinyMCE editor instance
		// $( 'div.mce-inline-toolbar-grp' ).remove();
		// Recreate new tinyMCE editor at new #comment textarea position
		tinymce.EditorManager.execCommand( 'mceAddEditor', true, 'comment' );
		tinymce.activeEditor.focus();
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

		new tcp.RespondView({
			el: $( tcp.globals.tcp_id_respond )
		});

		$( '.' + tcp.globals.tcp_css_comment_reply_button ).on( 'click', function() {
			setTimeout( function() {
				tcp.resetEditor();

				$( tcp.globals.tcp_id_cancel_comment_reply ).on( 'click', function() {
					// reset editor after move
					setTimeout( function() {
						tcp.resetEditor();
					}, 500 );
				});

			}, 500 );
		});
	}

};

( function( $ ){
   $(function(){
      tcp.initTcp();
		tcp.bindEditors();
   });
})( jQuery );
