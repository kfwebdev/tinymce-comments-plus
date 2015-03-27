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

var tcp = tcp || {};

( function ( $ ) {
	"use strict";

	$(function () {
		window.cl = console.dir.bind( console );

		tcp.EditView = Backbone.View.extend({
			el: '#tcpEditComment',

			events: {
				'click .tcp-edit-comment' : 'editComment',
				'click .tcp-cancel-edit' : 'cancelEdit'
			},

			render: function() {
				$( this ).before( '<textarea id="tcpCommentEditor" rows="12"> ' + $content.html() + '</textarea>' );
				$( this ).before( '<a href="javascript:void(0);" class="tcp-cancel-edit">Cancel Edit</a>' );
				tinymce.EditorManager.execCommand( 'mceAddEditor', true, 'tcpEditComment' );
			},

			cancelEdit: function() {
				// Remove old textarea tinyMCE editor instance
				tinymce.EditorManager.execCommand( 'mceRemoveEditor', true, 'tcpCommentEditor' );
			}
		});

		tcp.CommentsView = Backbone.View.extend({
			el: '#comments',

			events: {
				'click .comment-reply-link' : 'reAddEditors',
				'click #cancel-comment-reply-link' : 'reAddEditors',
				'click .tcp-edit-comment' : 'editComment'
			},

			reAddEditors: function() {
				// Remove old textarea tinyMCE editor instance
				tinymce.EditorManager.execCommand( 'mceRemoveEditor', true, 'comment' );
				// Remove old inline toolbar created by old tinyMCE editor instance
				$( 'div.mce-inline-toolbar-grp' ).remove();
				// Recreate new tinyMCE editor at new #comment textarea position
				tinymce.EditorManager.execCommand( 'mceAddEditor', true, 'comment' );
			},

			editComment: function( event ) {
				var $editLink = $( event.currentTarget ),
						commentId = $editLink.attr( 'data-comment-id' );

				if ( parseInt( commentId ) > 0 ) {
					var $content = $editLink.siblings( '.comment-content' );
					$content.hide();
					var editView = new tcp.EditView({ commentId: commentId });
				}
			}
		});

		new tcp.CommentsView();

	});
}( jQuery ) );
