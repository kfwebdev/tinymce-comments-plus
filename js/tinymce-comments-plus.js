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

(function ($) {
	"use strict";
	$(function () {

		$( document ).on( 'click', '.comment-reply-link, #cancel-comment-reply-link',	function(){
			// Remove old textarea tinyMCE editor instance
			tinymce.EditorManager.execCommand('mceRemoveEditor', true, 'comment');
			// Remove old inline toolbar created by old tinyMCE editor instance
			$( 'div.mce-inline-toolbar-grp' ).remove();
			// Recreate new tinyMCE editor at new #comment textarea position
			tinymce.EditorManager.execCommand('mceAddEditor', true, 'comment');
		});

	});
}( jQuery ));
