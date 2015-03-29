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

	$(function () {
		window.cl = console.dir.bind( console );

		tcp.EditView = Backbone.View.extend({
			el: '#tcpEditComment',

			events: {
				'click .tcp-cancel-edit' : 'cancelEdit'
			},

			template: _.template('<textarea id="tcpCommentEditor" rows="12"><%= content %></textarea>' +
			'<a href="javascript:void(0);" class="tcp-cancel-edit">Cancel Edit</a>'),

			initialize: function( model ) {
				this.model = model;
			},

			render: function() { cl(this.$el);
				this.$el.html( this.template({ content: this.model.content }) );
				return this;
			},

			cancelEdit: function() {
				// Remove old textarea tinyMCE editor instance
				tinymce.EditorManager.execCommand( 'mceRemoveEditor', true, 'tcpCommentEditor' );
				// Remove old inline toolbar created by old tinyMCE editor instance
				$( 'div.mce-inline-toolbar-grp' ).remove();
				// Remove this view
				this.$el.remove();
			}

		}); /* /tcp.EditView */


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
							$content = $editLink.siblings( '.comment-content' );

					if ( $editLink.length ) {
						$content.hide();
						$editLink.before('<div id="tcpEditComment"></div>');
						var	editView = new tcp.EditView({ content: $content.html() });
						$( editView.el ).append( editView.render().el );
						tinymce.EditorManager.execCommand( 'mceAddEditor', true, 'tcpCommentEditor' );
					}
			}
		}); /* /tc.CommentsView */

		new tcp.CommentsView();

	});
}( jQuery ) );
