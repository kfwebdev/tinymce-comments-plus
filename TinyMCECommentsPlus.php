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
class TinyMCECommentsPlus {
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
	 * Public Javascript Global Variables
	 *
	 * @since    1.0.0
	 *
	 * @var      string
	 */
	private $tcp_javascript_globals = array();

	/**
	 * Initialize the plugin by setting localization, filters, and administration functions.
	 *
	 * @since     1.0.0
	 */
	private function __construct() {

		define( 'tcp_javascript_globals', 'tcpGlobals' );
		define( 'ajax_action_update_comment', 'update_comment' );

		$this->tcp_javascript_globals = array(
			'ajaxUrl' => admin_url( 'admin-ajax.php' )
		);

		// Load plugin text domain
		add_action("init", array($this, "load_plugin_textdomain"));

		// Add the options page and menu item.
		add_action("admin_menu", array($this, "add_plugin_admin_menu"));

		// Load admin style sheet and JavaScript.
		add_action("admin_enqueue_scripts", array($this, "enqueue_admin_styles"));
		add_action("admin_enqueue_scripts", array($this, "enqueue_admin_scripts"));

		// Load public-facing style sheet and JavaScript.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_styles' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );

		add_action( 'wp_ajax_nopriv_' . ajax_action_update_comment, array( $this, 'action_ajax_request' ) );
		add_action( 'wp_ajax_' . ajax_action_update_comment, array( $this, 'action_ajax_request' ) );

		add_action( 'comment_form', array( $this, 'action_comment_form' ), 11 );

		// Define custom functionality. Read more about actions and filters: http://codex.wordpress.org/Plugin_API#Hooks.2C_Actions_and_Filters
		add_filter( 'preprocess_comment', array( $this, 'filter_customize_allowed_tags' ), 11 );
		add_filter( 'comment_form_field_comment', array( $this, 'filter_tinymce_editor' ) );
		add_filter( 'comment_form_defaults', array( $this, 'filter_comment_form_defaults' ), 11 );
		add_filter( 'comment_reply_link', array( $this, 'filter_comment_edit_link' ), 10, 3 );
		add_filter( 'comment_text', array( $this, 'filter_comment_editing' ), 11, 2 );
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
		wp_enqueue_script( $this->plugin_slug . "-plugin-script", plugins_url( "js/" . $this->plugin_slug . ".js", __FILE__ ), array( 'jquery', 'backbone', 'underscore' ),
			$this->version );

		wp_localize_script( $this->plugin_slug . '-plugin-script', tcp_javascript_globals, json_encode( $this->tcp_javascript_globals ) );
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
	* check if current user can edit comment
	* @since    1.0.0
	*/
	public function user_can_edit( $comment_user_id ) {
		global $current_user;
		if ( ! $current_user ) { get_currentuserinfo(); }
		$can_edit = current_user_can( 'moderate_comments' );

		// if user can moderate comments (admin) then user can edit
		if ( $can_edit ) { return true; }
		// else if user is comment author then user can edit
		else if ( $comment_user_id == $current_user->ID ) { return true; }
		// else user cannot edit
		else { return false; }
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
	 * @since    1.0.0
	 */
	public function action_comment_form() {
		// marker for comment form
		echo '<span style="display:none;" id="tcpCommentFormSpan"></span>' . PHP_EOL;
	}


	/**
	 * @since    1.0.0
	 */
	public function tcp_update_comment( $post_id, $comment_id, $content ) {
		global 	$post,
				$current_user;

		get_currentuserinfo();
		$comment = get_comment( $comment_id );

		if ( ! current_user_can( 'edit_posts' ) &&
			 $current_user->ID != $comment->user_id ) { wp_send_json_error( 'permission denied' ); }

		$update = array(
			'comment_ID' => $comment_id,
			'comment_content' => $content
		);

		if ( wp_update_comment( $update ) ) {
			wp_send_json( $update );
		} else {
			wp_send_json_error( 'failed to update comment' );
		}
	}

	/**
	 * @since    1.0.0
	 */
	public function action_ajax_request() {
		global $allowedtags;
		// add additional tags to allowed tags in comments
		$allowedtags = array_merge( $allowedtags, $this->tcp_new_tags() );

		// validate ajax request variables
		$result = false;
		$action = sanitize_key( $_REQUEST[ 'action' ] );
		$post_id = intval( $_REQUEST[ 'postId'] );
		$comment_id = intval( $_REQUEST[ 'commentId' ] );
		$content = wp_kses( $_REQUEST[ 'content' ], $allowedtags );
		$security = sanitize_text_field( $_REQUEST[ 'security' ] );

		// check for valid ajax request variables
		if ( ! $action ||
			 ! $post_id ||
			 ! $comment_id ||
			 ! $security ) { wp_send_json_error( 'bad request' ); }

		switch ( $action ) {
			case ajax_action_update_comment:
				// check ajax referer's security nonce
				check_ajax_referer( ajax_action_update_comment . $comment_id, 'security' );

				$result = $this->tcp_update_comment( $post_id, $comment_id, $content );
			break;
		}

		wp_send_json( $result );
	}


	/**
	 * @since    1.0.0
	 */
	public function filter_tinymce_editor() {
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
	public function filter_comment_form_defaults( $defaults ) {
		$comment_form_id = $defaults[ 'id_form' ];
		$tcp_form_id_span = '<span style="display:none;" data-tcp-comment-form-id="' . $comment_form_id . '"></span>';
		echo $tcp_form_id_span;
		return $defaults;
	}

	/**
	 * @since    1.0.0
	 */
	public function filter_comment_editing( $content, $comment ) {

		if ( ! $this->user_can_edit( $comment->user_id ) ) { return $content; }

		$comment_id = $comment->comment_ID;
		$post_id = $comment->comment_post_ID;
		$original_content = $content;

		$tcp_content = sprintf( '<div class="tcp-comment-content" data-tcp-post-id="%d" data-tcp-comment-id="%d">' . $content . '</div>', $post_id, $comment_id );

		return $tcp_content;
	}

	/**
	 * @since    1.0.0
	 */
	public function filter_comment_edit_link( $args, $comment, $post ) {
		if ( ! $this->user_can_edit( $post->user_id ) ) { return $args; }

		$post_id = $post->comment_post_ID;
		$comment_id = $post->comment_ID;
		$nonce = wp_create_nonce( ajax_action_update_comment . $comment_id );

		$tcp_edit_link = '<a href="javascript:void(0);" class="tcp-edit-comment" data-tcp-post-id="' . $post_id. '" ';
		$tcp_edit_link .= 'data-tcp-comment-id="' . $comment_id . '" data-tcp-nc="' . $nonce .'">Edit</a>' . PHP_EOL;

		$args = $tcp_edit_link . $args;

		return $args;
	}

	/**
	* customise list of allowed HTML tags in comments
	* @since    1.0.0
	*/
	public function tcp_new_tags() {
		// additionally allowed tags
		$new_tags = array(
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

		return $new_tags;
	}

	/**
	* customise list of allowed HTML tags in comments
	* @since    1.0.0
	*/
	public function filter_customize_allowed_tags( $comment_data ) {
				global $allowedtags;

				$allowedtags = array_merge( $allowedtags, $this->tcp_new_tags() );

				return $comment_data;
	}

}
