<?php
/**
 * Fired when the plugin is uninstalled.
 *
 * @package   tinymce-comments-plus
 * @author    Kentaro Fischer <webdev@kentarofischer.com>
 * @license   GPL-2.0+
 * @link      http://kentarofischer.com
 * @copyright 3-22-2015 Kentaro Fischer
 */

// If uninstall, not called from WordPress, then exit
if (!defined("WP_UNINSTALL_PLUGIN")) {
	exit;
}
