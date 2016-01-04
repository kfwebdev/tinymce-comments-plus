/**
 * This is the main javascript file for the TinyMCE Comments Plus plugin's main administration view.
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

	tcp.RespondView = Backbone.View.extend({
		events: function() {
			var _events = {};

			_events[ 'submit' ] = 'submitForm';

			return _events;
		},

		initialize: function() {
			this.$commentForm = this.$el.find( 'form' );
			this.$textArea = this.$el.find( 'textarea' );
			this.$submitButton = this.$commentForm.find( 'input[type=submit]' );
			this.$submitButton.addClass( tcp.globals.cssButton + ' ' + tcp.globals.cssSubmitButton )
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
				tinymce.activeEditor.setContent( '' );

				var
					$commentData = $( data ).find( tcp.globals.tcp_id_comments ),
					$commentsList = $( tcp.globals.tcp_id_comments )
				;

				if ( $commentData.length ) {
					// remove tinymce editor before comments data is updated
					tinymce.EditorManager.execCommand( 'mceRemoveEditor', true, 'comment' );

					// replace #comments element with data response #comments element
					$commentsList.replaceWith( $commentData );

					// rebind React components
					tcp.bindEditors();

					// restore the tinymce editor in the #respond element
					tinymce.EditorManager.execCommand( 'mceAddEditor', true, 'comment' );
				}
			})
			.fail( function( data ){
				// error
			});
		}
	});

	tcp.bindEditors = function() {
		// include edit component
		tcp.Edit = require( '../components/edit/edit' );

		// bind edit components
		$( '.' + tcp.globals.tcp_css_edit ).each(function(){
			let commentId = $( this ).data( tcp.globals.tcp_css_comment_id ),
					editId = tcp.globals.tcp_css_edit + commentId,
					editorId = tcp.globals.tcp_css_editor + commentId,
					commentReplyLink = $( this ).siblings( '.' + tcp.globals.tcp_css_comment_reply_button )[ 0 ];

			// tcp.bindReply( commentReplyLink, true );
			ReactDOM.render(<tcp.Edit tcpGlobals={ tcp.globals } commentId={ commentId } editId={ editId } editorId={ editorId } />, this );
		});

		// include editor component
		tcp.Editor = require( '../components/editor/editor' );

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

	};

};

( function( $ ){
   $(function(){
      tcp.initTcp();
		tcp.bindEditors();
   });
})( jQuery );
