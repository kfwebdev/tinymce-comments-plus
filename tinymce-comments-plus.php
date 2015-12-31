<?php
/**
 * TinyMCE Comments Plus
 *
 * Enhance WordPress comments with the TinyMCE Editor, Inline Comment Editing and Asynchronous Posting.
 *
 * @package   tinymce-comments-plus
 * @author    Kentaro Fischer <webdev@kentarofischer.com>
 * @license   GPL-2.0+
 * @link      http://kentarofischer.com
 * @copyright 3-22-2015 Kentaro Fischer
 *
 * @wordpress-plugin
 * Plugin Name: TinyMCE Comments Plus
 * Plugin URI:  http://kentarofischer.com
 * Description: Enhance WordPress comments with the TinyMCE Editor, Inline Comment Editing and Asynchronous Posting.
 * Version:     1.0.0
 * Author:      Kentaro Fischer
 * Author URI:  http://kentarofischer.com
 * Text Domain: tinymce-comments-plus-locale
 * License:     GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Domain Path: /lang
 */

// If this file is called directly, abort.
if (!defined("WPINC")) {
	die;
}

if ( ! class_exists( 'FirePHP' ) ) { require( 'fb.php' ); }

define( 'tcp_plugin_dir', plugin_dir_path( __FILE__ ) );
define( 'tcp_plugin_file', plugin_basename( __FILE__ ) );

require_once( tcp_plugin_dir . "TinyMCECommentsPlus.php");

// Register hooks that are fired when the plugin is activated, deactivated, and uninstalled, respectively.
register_activation_hook(__FILE__, array("TinyMCECommentsPlus", "activate"));
register_deactivation_hook(__FILE__, array("TinyMCECommentsPlus", "deactivate"));


TinyMCECommentsPlus::get_instance();
