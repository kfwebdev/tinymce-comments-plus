<?php
/**
 * TinyMCE Comments Plus
 *
 * @package   tinymce-comments-plus
 * @author    Kentaro Fischer <webdev@kentarofischer.com>
 * @license   GPL-2.0+
 * @link      http://kentarofischer.com
 * @copyright 3-22-2015 Kentaro Fischer
 */

/**
 * TinyMCE Comments Plus class.
 *
 * @package TinyMCECommentsPlus
 * @author  Kentaro Fischer <webdev@kentarofischer.com>
 */
class TinyMCECommentsPlus{
	/**
	 * Plugin version, used for cache-busting of style and script file references.
	 *
	 * @since   1.0.0
	 *
	 * @var     string
	 */
	protected $version = "1.0.0";

	/**
	 * Unique identifier for your plugin.
	 *
	 * Use this value (not the variable name) as the text domain when internationalizing strings of text. It should
	 * match the Text Domain file header in the main plugin file.
	 *
	 * @since    1.0.0
	 *
	 * @var      string
	 */
	protected $plugin_slug = "tinymce-comments-plus";

	/**
	 * Instance of this class.
	 *
	 * @since    1.0.0
	 *
	 * @var      object
	 */
	protected static $instance = null;

	/**
	 * Slug of the plugin screen.
	 *
	 * @since    1.0.0
	 *
	 * @var      string
	 */
	protected $plugin_screen_hook_suffix = null;

	/**
	 * Initialize the plugin by setting localization, filters, and administration functions.
	 *
	 * @since     1.0.0
	 */
	private function __construct() {

		// Load plugin text domain
		add_action("init", array($this, "load_plugin_textdomain"));

		// Add the options page and menu item.
		add_action("admin_menu", array($this, "add_plugin_admin_menu"));

		// Load admin style sheet and JavaScript.
		add_action("admin_enqueue_scripts", array($this, "enqueue_admin_styles"));
		add_action("admin_enqueue_scripts", array($this, "enqueue_admin_scripts"));

		// Load public-facing style sheet and JavaScript.
		add_action("wp_enqueue_scripts", array($this, "enqueue_styles"));
		add_action("wp_enqueue_scripts", array($this, "enqueue_scripts"));

		// Define custom functionality. Read more about actions and filters: http://codex.wordpress.org/Plugin_API#Hooks.2C_Actions_and_Filters
		add_filter( 'preprocess_comment', array( $this, 'filter_customize_allowed_tags' ), 11 );
		add_filter( 'comment_form_field_comment', array( $this, 'filter_tinymce_editor' ) );
		add_filter( 'comment_reply_link', array( $this, 'filter_comment_reply_edit_link' ), 10, 3 );

	}

	/**
	 * Return an instance of this class.
	 *
	 * @since     1.0.0
	 *
	 * @return    object    A single instance of this class.
	 */
	public static function get_instance() {

		// If the single instance hasn"t been set, set it now.
		if (null == self::$instance) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	/**
	 * Fired when the plugin is activated.
	 *
	 * @since    1.0.0
	 *
	 * @param    boolean $network_wide    True if WPMU superadmin uses "Network Activate" action, false if WPMU is disabled or plugin is activated on an individual blog.
	 */
	public static function activate($network_wide) {
		// TODO: Define activation functionality here
	}

	/**
	 * Fired when the plugin is deactivated.
	 *
	 * @since    1.0.0
	 *
	 * @param    boolean $network_wide    True if WPMU superadmin uses "Network Deactivate" action, false if WPMU is disabled or plugin is deactivated on an individual blog.
	 */
	public static function deactivate($network_wide) {
		// TODO: Define deactivation functionality here
	}

	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		$domain = $this->plugin_slug;
		$locale = apply_filters("plugin_locale", get_locale(), $domain);

		load_textdomain($domain, WP_LANG_DIR . "/" . $domain . "/" . $domain . "-" . $locale . ".mo");
		load_plugin_textdomain($domain, false, dirname(plugin_basename(__FILE__)) . "/lang/");
	}

	/**
	 * Register and enqueue admin-specific style sheet.
	 *
	 * @since     1.0.0
	 *
	 * @return    null    Return early if no settings page is registered.
	 */
	public function enqueue_admin_styles() {

		if (!isset($this->plugin_screen_hook_suffix)) {
			return;
		}

		$screen = get_current_screen();
		if ($screen->id == $this->plugin_screen_hook_suffix) {
			wp_enqueue_style($this->plugin_slug . "-admin-styles", plugins_url("css/admin.css", __FILE__), array(),
				$this->version);
		}

	}

	/**
	 * Register and enqueue admin-specific JavaScript.
	 *
	 * @since     1.0.0
	 *
	 * @return    null    Return early if no settings page is registered.
	 */
	public function enqueue_admin_scripts() {

		if (!isset($this->plugin_screen_hook_suffix)) {
			return;
		}

		$screen = get_current_screen();
		if ($screen->id == $this->plugin_screen_hook_suffix) {
			wp_enqueue_script($this->plugin_slug . "-admin-script", plugins_url("js/tinymce-comments-plus-admin.js", __FILE__),
				array("jquery"), $this->version);
		}

	}

	/**
	 * Register and enqueue public-facing style sheet.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {
		wp_enqueue_style($this->plugin_slug . "-plugin-styles", plugins_url("css/" . $this->plugin_slug . ".css", __FILE__), array(),
			$this->version);
	}

	/**
	 * Register and enqueues public-facing JavaScript files.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
		wp_enqueue_script($this->plugin_slug . "-plugin-script", plugins_url("js/" . $this->plugin_slug . ".js", __FILE__), array( 'jquery', 'backbone' ),
			$this->version);
	}

	/**
	 * Register the administration menu for this plugin into the WordPress Dashboard menu.
	 *
	 * @since    1.0.0
	 */
	public function add_plugin_admin_menu() {
		$this->plugin_screen_hook_suffix = add_plugins_page(__("TinyMCE Comments Plus - Administration", $this->plugin_slug),
			__("TinyMCE Comments Plus", $this->plugin_slug), "read", $this->plugin_slug, array($this, "display_plugin_admin_page"));
	}

	/**
	 * Render the settings page for this plugin.
	 *
	 * @since    1.0.0
	 */
	public function display_plugin_admin_page() {
		include_once("views/admin.php");
	}

	/**
	 * NOTE:  Actions are points in the execution of a page or process
	 *        lifecycle that WordPress fires.
	 *
	 *        WordPress Actions: http://codex.wordpress.org/Plugin_API#Actions
	 *        Action Reference:  http://codex.wordpress.org/Plugin_API/Action_Reference
	 *
	 * @since    1.0.0
	 */
	public function action_method_name() {
		// TODO: Define your action hook callback here
	}

	/**
	 * NOTE:  Filters are points of execution in which WordPress modifies data
	 *        before saving it or sending it to the browser.
	 *
	 *        WordPress Filters: http://codex.wordpress.org/Plugin_API#Filters
	 *        Filter Reference:  http://codex.wordpress.org/Plugin_API/Filter_Reference
	 *
	 * @since    1.0.0
	 */
	public function filter_method_name() {
		// TODO: Define your filter hook callback here
	}

	/**
	 * @since    1.0.0
	 */
	public function filter_tinymce_editor($test) {
		global $post;

	  ob_start();

	  wp_editor( '', 'comment',
			array(
		    'textarea_rows' => 12,
		    'teeny' => false,
		    'quicktags' => false,
		    'media_buttons' => false
	  		)
			);

	  $editor = ob_get_contents();

	  ob_end_clean();

	  //make sure comment media is attached to parent post
	  //$editor = str_replace( 'post_id=0', 'post_id='.get_the_ID(), $editor );

	  return $editor;
	}

	/**
	 * @since    1.0.0
	 */
	public function filter_comment_reply_edit_link( $args, $comment, $post ) {
		$comment_id = $post->comment_ID;
		echo '<a href="javascript:void(0)" class="tcp-edit-comment" data-comment-id="' . $comment_id . '">Edit</a>' . PHP_EOL;
		return $args;
	}

	/**
	* customise list of allowed HTML tags in comments
	* @since    1.0.0
	*/
	public function filter_customize_allowed_tags( $comment_data ) {
				global $allowedtags;

				// add wanted tags
				$newTags = array(
					'a' => array(
						'href' => true,
						'title' => true,
						'target' => true
					),
					'del' => true,
					'h1' => array(
						'style' => true
					),
					'h2' => array(
						'style' => true
					),
					'h3' => array(
						'style' => true
					),
					'h4' => array(
						'style' => true
					),
					'h5' => array(
						'style' => true
					),
					'h6' => array(
						'style' => true
					),
					'img' => array(
						'style' => true,
						'title' => true
					),
					'ol' => array(
						'style' => true,
						'li' => array(
							'style' => true
						)
					),
					'p' => array(
						'style' => true
					),
					'pre' => true,
					'span' => array(
						'style' => true
					),
					'ul' => array(
						'style' => true,
						'li' => array(
							'style' => true
						)
					)
				);

				$allowedtags = array_merge( $allowedtags, $newTags );

				return $comment_data;
	}

}
