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
	 *
	 * @since     1.0.0
	 */
	private function __construct() {
		define( 'tcp_prefix', 'tcp_' );
		define( tcp_prefix . 'javascript_globals', 'tcpGlobals' );
		define( tcp_prefix . 'ajax_prefix', 'tcp_ajax_' );
		define( tcp_ajax_prefix . 'option_update_delay', 2000 );
		define( tcp_ajax_prefix . 'confirmation_delay', 3000 );
		define( tcp_ajax_prefix . 'add_comment', tcp_prefix . 'add_comment' );
		define( tcp_ajax_prefix . 'update_comment', tcp_prefix . 'update_comment' );
		define( tcp_ajax_prefix . 'editing_enabled', tcp_prefix . 'editing_enabled' );
		define( tcp_ajax_prefix . 'editing_expiration', tcp_prefix . 'editing_expiration' );
		define( tcp_ajax_prefix . 'custom_classes', tcp_prefix . 'custom_classes' );
		define( tcp_ajax_prefix . 'wordpress_ids', tcp_prefix . 'wordpress_ids' );
		define( tcp_ajax_prefix . 'custom_toolbars', tcp_prefix . 'custom_toolbars' );

		define( tcp_prefix . 'toolbar1', 'bold italic strikethrough bullist numlist blockquote hr alignleft aligncenter alignright image link unlink wp_more spellchecker wp_adv' );
		define( tcp_prefix . 'toolbar2', 'formatselect underline alignjustify forecolor pastetext removeformat charmap outdent indent undo redo wp_help' );
		define( tcp_prefix . 'plugins', 'charmap,colorpicker,fullscreen,lists,paste,tabfocus,textcolor,wordpress,wpdialogs,wpemoji,wplink,wpview' );

		define( tcp_prefix . 'regex_html_class', '/([^0-9a-z-_ ])+/i' );
		define( tcp_prefix . 'regex_html_id', '/([^0-9a-z-_.# ])+/i' );

		// CSS Classes
		define( tcp_prefix . 'css_prefix', tcp_prefix . 'css_' );
		define( tcp_prefix . 'id_prefix', tcp_prefix . 'id_' );
		define( tcp_css_prefix . 'button_class', 'tcp-button' );
		define( tcp_css_prefix . 'edit_container', 'tcp-edit-container' );
		define( tcp_css_prefix . 'edit_button_class', 'tcp-edit-comment' );
		define( tcp_css_prefix . 'reply_button_class', 'tcp-reply-comment' );
		define( tcp_css_prefix . 'submit_button_class', 'tcp-submit-comment' );
		define( tcp_css_prefix . 'submit_edit_button_class', 'tcp-submit-edit' );
		define( tcp_css_prefix . 'cancel_edit_button_class', 'tcp-cancel-edit' );
		define( tcp_css_prefix . 'comment_reply_button_class', 'comment-reply-link' );
		define( tcp_css_prefix . 'comment_content', tcp_prefix . 'comment_content' );
		define( tcp_css_prefix . 'edit', 'tcp-edit' );
		define( tcp_css_prefix . 'editor', 'tcp-editor' );
		define( tcp_css_prefix . 'post_id', tcp_prefix . 'post_id' );
		define( tcp_css_prefix . 'comment_id', tcp_prefix . 'comment_id' );
		define( tcp_css_prefix . 'nonce', tcp_prefix . 'nonce' );

		// WordPress IDs
		define( tcp_id_prefix . 'comments', '#comments' );
		define( tcp_id_prefix . 'respond', '#respond' );
		define( tcp_id_prefix . 'comment_form', '#commentform' );
		define( tcp_id_prefix . 'cancel_comment_reply', '#cancel-comment-reply-link' );
		define( tcp_id_prefix . 'submit_comment', '#submit' );


		// Retrieve Options

		// TCP Custom CSS Button Classes
		$this->option_custom_classes_all = preg_replace( tcp_regex_html_class, '', get_option( tcp_ajax_custom_classes . '_all' ) );
		$this->option_custom_classes_reply = preg_replace( tcp_regex_html_class, '', get_option( tcp_ajax_custom_classes . '_reply' ) );
		$this->option_custom_classes_edit = preg_replace( tcp_regex_html_class, '', get_option( tcp_ajax_custom_classes . '_edit' ) );
		$this->option_custom_classes_submit = preg_replace( tcp_regex_html_class, '', get_option( tcp_ajax_custom_classes . '_submit' ) );
		$this->option_custom_classes_cancel = preg_replace( tcp_regex_html_class, '', get_option( tcp_ajax_custom_classes . '_cancel' ) );

		// sanitize WordPress options
		$this->option_editing_enabled = sanitize_html_class( get_option( tcp_ajax_editing_enabled ) );
		$this->option_editing_enabled = ( $this->option_editing_enabled === 'off' ) ? 'off' : 'on';
		$this->option_editing_expiration = sanitize_key( get_option( tcp_ajax_editing_expiration ) );

		$this->option_toolbar1 = preg_replace( tcp_regex_html_class, '', get_option( tcp_ajax_custom_toolbars . '_toolbar1' ) );
		$this->option_toolbar1 = ( empty( trim( $this->option_toolbar1 ) ) ) ? tcp_toolbar1 : $this->option_toolbar1;
		$this->option_toolbar2 = preg_replace( tcp_regex_html_class, '', get_option( tcp_ajax_custom_toolbars . '_toolbar2' ) );
		$this->option_toolbar2 = ( empty( trim( $this->option_toolbar2 ) ) ) ? tcp_toolbar2 : $this->option_toolbar2;
		$this->option_toolbar3 = preg_replace( tcp_regex_html_class, '', get_option( tcp_ajax_custom_toolbars . '_toolbar3' ) );
		$this->option_toolbar3 = ( empty( trim( $this->option_toolbar3 ) ) ) ? '' : $this->option_toolbar3;
		$this->option_toolbar4 = preg_replace( tcp_regex_html_class, '', get_option( tcp_ajax_custom_toolbars . '_toolbar4' ) );
		$this->option_toolbar4 = ( empty( trim( $this->option_toolbar4 ) ) ) ? '' : $this->option_toolbar4;

		$this->option_wp_id_comments = preg_replace( tcp_regex_html_id, '', get_option( tcp_ajax_wordpress_ids . '_comments' ) );
		$this->option_wp_id_comments = ( empty( trim( $this->option_wp_id_comments ) ) ) ? tcp_id_comments : $this->option_wp_id_comments;
		$this->option_wp_id_respond = preg_replace( tcp_regex_html_id, '', get_option( tcp_ajax_wordpress_ids . '_respond' ) );
		$this->option_wp_id_respond = ( empty( trim( $this->option_wp_id_respond ) ) ) ? tcp_id_respond : $this->option_wp_id_respond;
		$this->option_wp_id_comment_form = preg_replace( tcp_regex_html_id, '', get_option( tcp_ajax_wordpress_ids . '_comment_form' ) );
		$this->option_wp_id_comment_form = ( empty( trim( $this->option_wp_id_comment_form ) ) ) ? tcp_id_comment_form : $this->option_wp_id_comment_form;
		$this->option_wp_id_comment_reply_link = preg_replace( tcp_regex_html_id, '', get_option( tcp_ajax_wordpress_ids . '_reply' ) );
		$this->option_wp_id_comment_reply_link = ( empty( trim( $this->option_wp_id_comment_reply_link ) ) ) ? tcp_css_comment_reply_button_class : $this->option_wp_id_comment_reply_link;
		$this->option_wp_id_cancel_comment_reply = preg_replace( tcp_regex_html_id, '', get_option( tcp_ajax_wordpress_ids . '_cancel' ) );
		$this->option_wp_id_cancel_comment_reply = ( empty( trim( $this->option_wp_id_cancel_comment_reply ) ) ) ? tcp_id_cancel_comment_reply : $this->option_wp_id_cancel_comment_reply;
		$this->option_wp_id_submit_comment = preg_replace( tcp_regex_html_id, '', get_option( tcp_ajax_wordpress_ids . '_submit' ) );
		$this->option_wp_id_submit_comment = ( empty( trim( $this->option_wp_id_submit_comment ) ) ) ? tcp_id_submit_comment : $this->option_wp_id_submit_comment;

		add_filter( 'plugin_action_links_' . tcp_plugin_file, array( $this, 'add_plugin_action_links' ), 10, 4 );

		// Ajax methods
		add_action( 'wp_ajax_nopriv_' . tcp_ajax_add_comment, array( $this, 'action_ajax_request' ) );
		add_action( 'wp_ajax_' . tcp_ajax_add_comment, array( $this, 'action_ajax_request' ) );
		add_action( 'wp_ajax_nopriv_' . tcp_ajax_update_comment, array( $this, 'action_ajax_request' ) );
		add_action( 'wp_ajax_' . tcp_ajax_update_comment, array( $this, 'action_ajax_request' ) );
		add_action( 'wp_ajax_nopriv_' . tcp_ajax_editing_enabled, array( $this, 'action_ajax_request' ) );
		add_action( 'wp_ajax_' . tcp_ajax_editing_enabled, array( $this, 'action_ajax_request' ) );
		add_action( 'wp_ajax_nopriv_' . tcp_ajax_editing_expiration, array( $this, 'action_ajax_request' ) );
		add_action( 'wp_ajax_' . tcp_ajax_editing_expiration, array( $this, 'action_ajax_request' ) );
		add_action( 'wp_ajax_nopriv_' . tcp_ajax_custom_classes, array( $this, 'action_ajax_request' ) );
		add_action( 'wp_ajax_' . tcp_ajax_custom_classes, array( $this, 'action_ajax_request' ) );
		add_action( 'wp_ajax_nopriv_' . tcp_ajax_wordpress_ids, array( $this, 'action_ajax_request' ) );
		add_action( 'wp_ajax_' . tcp_ajax_wordpress_ids, array( $this, 'action_ajax_request' ) );
		add_action( 'wp_ajax_nopriv_' . tcp_ajax_custom_toolbars, array( $this, 'action_ajax_request' ) );
		add_action( 'wp_ajax_' . tcp_ajax_custom_toolbars, array( $this, 'action_ajax_request' ) );

		// initialize admin functions
		// Add the options page and menu item.
		add_action( 'admin_menu', array( $this, 'add_plugin_admin_menu' ) );

		// Load admin style sheet and JavaScript.
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_styles' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ) );

		// Load plugin text domain
		add_action( 'init', array( $this, 'load_plugin_textdomain' ) );
		// load tinymce comments plus
		add_action( 'init', array( $this, 'initialize_tinymce_comments_plus' ) );
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
	 * Add plugin settings link
	 *
	 * @since    1.0.0
	 */
	public function add_plugin_action_links ( $actions, $plugin_file, $plugin_data, $context ) {
		$tcp_plugin_links = array(
			'settings' => '<a href="' . admin_url( 'options-general.php?page=' . $this->plugin_slug ) . '">Settings</a>',
		);
		return array_merge( $actions, $tcp_plugin_links );
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
	 * Initialize the plugin functions.
	 *
	 * @since    1.0.0
	 */
	public function initialize_tinymce_comments_plus() {
		if ( is_admin() ) { return; }

		// Editor JavaScript Globals
		$this->tcp_plugin_javascript_globals = array(
			'ajaxUrl' => admin_url( 'admin-ajax.php' ),
			'editorStyles' => includes_url( "js/tinymce/skins/wordpress/wp-content.css", __FILE__ ),
			'optionUpdateDelay' => tcp_ajax_option_update_delay,
			'addCommentAction' => tcp_ajax_add_comment,
			'updateCommentAction' => tcp_ajax_update_comment,

			tcp_prefix . 'toolbar1' => $this->option_toolbar1,
			tcp_prefix . 'toolbar2' => $this->option_toolbar2,
			tcp_prefix . 'toolbar3' => $this->option_toolbar3,
			tcp_prefix . 'toolbar4' => $this->option_toolbar4,

			// Classes
			tcp_css_prefix . 'button' => tcp_css_button_class,
			tcp_css_prefix . 'edit_button' => tcp_css_edit_button_class,
			tcp_css_prefix . 'reply_button' => tcp_css_reply_button_class,
			tcp_css_prefix . 'submit_button' => tcp_css_submit_button_class,
			tcp_css_prefix . 'edit_container' => tcp_css_edit_container,
			tcp_css_prefix . 'submit_edit_button' => tcp_css_submit_edit_button_class,
			tcp_css_prefix . 'cancel_edit_button' => tcp_css_cancel_edit_button_class,
			tcp_css_prefix . 'comment_reply_button' => tcp_css_comment_reply_button_class,
			tcp_css_prefix . 'edit' => tcp_css_edit,
			tcp_css_prefix . 'editor' => tcp_css_editor,
			tcp_css_prefix . 'comment_content' => tcp_css_comment_content,
			tcp_css_prefix . 'post_id' => tcp_css_comment_id,
			tcp_css_prefix . 'comment_id' => tcp_css_comment_id,
			tcp_css_prefix . 'nonce' => tcp_css_nonce,
			tcp_css_prefix . 'button_custom' => $this->option_custom_classes_all,
			tcp_css_prefix . 'reply_button_custom' => $this->option_custom_classes_reply,
			tcp_css_prefix . 'edit_button_custom' => $this->option_custom_classes_edit,
			tcp_css_prefix . 'submit_button_custom' => $this->option_custom_classes_submit,
			tcp_css_prefix . 'cancel_button_custom' => $this->option_custom_classes_cancel,
			// IDs
			tcp_id_prefix . 'comments' => $this->option_wp_id_comments,
			tcp_id_prefix . 'respond' => $this->option_wp_id_respond,
			tcp_id_prefix . 'comment_form' => $this->option_wp_id_comment_form,
			tcp_id_prefix . 'comment_reply' => $this->option_wp_id_comment_reply_link,
			tcp_id_prefix . 'cancel_comment_reply' => $this->option_wp_id_cancel_comment_reply,
			tcp_id_prefix . 'submit_comment' => $this->option_wp_id_submit_comment

		);

		// Load public-facing style sheet and JavaScript.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_styles' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );

		// add_action( 'comment_form', array( $this, 'action_comment_form' ), 999 );

		// Define custom functionality.
		add_filter( 'tiny_mce_before_init', array( $this, 'filter_format_tinymce' ), 999 );
		add_filter( 'mce_buttons', array( $this, 'filter_tinymce_buttons_1' ), 999, 2 );
		add_filter( 'mce_buttons_2', array( $this, 'filter_tinymce_buttons_2' ), 999 );
		add_filter( 'preprocess_comment', array( $this, 'filter_customize_allowed_tags' ), 999 );
		add_filter( 'comment_form_defaults', array( $this, 'filter_comment_form_defaults' ), 999 );
		add_filter( 'comment_form_field_comment', array( $this, 'filter_tinymce_editor' ), 999 );
		add_filter( 'comment_reply_link', array( $this, 'filter_comment_reply_link' ), 999, 3 );
		add_filter( 'comment_reply_link_args', array( $this, 'filter_comment_reply_link_args' ), 999, 3 );
		add_filter( 'comment_text', array( $this, 'filter_comment_editing' ), 999, 2 );
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
			wp_enqueue_style( "jquery-ui", plugins_url( "src/styles/jquery-ui.min.css", __FILE__ ), array(), $this->version );
		}

	}

	/**
	 * Register and enqueue public-facing style sheet.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {
		global $wp_version;
		wp_enqueue_style( $this->plugin_slug . "-dashicons-css", includes_url( "css/dashicons.min.css", __FILE__ ) );
		wp_enqueue_style( $this->plugin_slug . "-editor-buttons-css", includes_url( "css/editor.min.css", __FILE__ ) );
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

		if ( $screen->id == $this->plugin_screen_hook_suffix ) {

			// Admin JavaScript Globals
			$this->tcp_admin_javascript_globals = array(
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'optionUpdateDelay' => tcp_ajax_option_update_delay,
				'optionConfirmationDelay' => tcp_ajax_confirmation_delay,
				'editingEnabledAction' => tcp_ajax_editing_enabled,
				'editingExpirationAction' => tcp_ajax_editing_expiration,
				'customClassesAction' => tcp_ajax_custom_classes,
				'wordpressIdsAction' => tcp_ajax_wordpress_ids,
				'customToolbarsAction' => tcp_ajax_custom_toolbars
			);

			wp_enqueue_script( 'jquery-ui-core', array( 'jquery' ) );
			wp_enqueue_script( 'jquery-ui-spinner', array( 'jquery-ui-core' ) );
			wp_register_script( $this->plugin_slug . "-admin-script", plugins_url( "dist/assets/app.js", __FILE__), array( 'jquery', 'backbone' ), $this->version );
			// wp_register_script( $this->plugin_slug . '-admin-script', 'http://localhost:8000/assets/app.js', array( 'jquery', 'backbone', 'underscore' ),	$this->version, false );

			wp_localize_script( $this->plugin_slug . '-admin-script', tcp_javascript_globals, json_encode( $this->tcp_admin_javascript_globals ) );
			wp_enqueue_script( $this->plugin_slug . '-admin-script' );

		}

	}

	/**
	 * Register and enqueues public-facing JavaScript files.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
		if ( comments_open() ) {
			// replace comment-reply to handle tinymce form moves
		  wp_deregister_script( 'comment-reply' );

			wp_register_script( $this->plugin_slug . "-plugin-script", plugins_url( "dist/assets/app.js", __FILE__ ), array( 'jquery', 'backbone' ),	$this->version, false );
			// wp_register_script( $this->plugin_slug . '-plugin-script', 'http://localhost:8000/assets/app.js', array( 'jquery', 'backbone', 'underscore' ),	$this->version, true );
			// Instantiate Javascript Globals for plugin script
			wp_localize_script( $this->plugin_slug . '-plugin-script', tcp_javascript_globals, json_encode( $this->tcp_plugin_javascript_globals ) );
			wp_enqueue_script( $this->plugin_slug . '-plugin-script' );
		}
	}

	/**
	 * Register the administration menu for this plugin into the WordPress Dashboard menu.
	 *
	 * @since    1.0.0
	 */
	public function add_plugin_admin_menu() {
		if ( current_user_can( 'administrator' ) ) {
			$this->plugin_screen_hook_suffix = add_options_page( __( "TinyMCE Comments Plus - Settings", $this->plugin_slug ),
				__( "TinyMCE Comments Plus", $this->plugin_slug ), "read", $this->plugin_slug, array( $this, "display_plugin_admin_page" ) );
		}
	}

	/**
	 * Render the settings page for this plugin.
	 *
	 * @since    1.0.0
	 */
	public function display_plugin_admin_page() {
		if ( current_user_can( 'administrator' ) ) {
			include_once("views/admin.php");
		}
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
	 * @since    1.0.0
	 */
	// public function action_comment_form( $post_id ) {
	// 	// marker for comment form
	// 	$nonce = wp_create_nonce( tcp_ajax_add_comment . $post_id );
	//
	// 	// enable tinymce editor on comment form
	// 	$this->filter_tinymce_editor();
	//
	// }


	/**
	 * @since    1.0.0
	 */
	public function tcp_add_comment( $post_id, $content ) {
		global 	$post,
				$current_user;

		get_currentuserinfo();

		if ( ! current_user_can( 'edit_posts' ) ) { wp_send_json_error( 'permission denied' ); }

		$add_comment = array(
			'comment_post_ID' => $post_id,
			'comment_content' => $content,
			'user_id' => $current_user->ID,
			'comment_author' => $current_user->display_name,
			'comment_author_url' => $current_user->user_url,
			'comment_author_email' => $current_user->user_email
		);

		if ( wp_new_comment( $add_comment ) ) {
			wp_send_json( $add_comment );
		} else {
			wp_send_json_error( 'failed to update comment' );
		}
	}

	/**
	 * @since    1.0.0
	 */
	public function tcp_update_comment( $post_id, $comment_id, $content ) {
		global 	$post,
				$current_user;

		get_currentuserinfo();
		$comment = get_comment( $comment_id );
		$comment_age = current_time( 'timestamp' ) - strtotime( $comment->comment_date );
		$comment_age = floor( $comment_age / 60 );

		if ( ! current_user_can( 'edit_posts' ) &&
			 $current_user->ID != $comment->user_id ) { wp_send_json_error( 'permission denied' ); }

		// comment editing has expiration period
		if ( $this->option_editing_expiration > 0 &&
			// if the comment is past editing period expiration
			$comment_age > $this->option_editing_expiration &&
			// user is not an administrator
			! current_user_can( 'administrator' ) ) { wp_send_json_error( 'permission denied' ); }

		$update = array(
			'comment_ID' => $comment_id,
			'comment_content' => stripslashes( $content )
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
	public function tcp_save_option( $option, $value ) {
		if ( ! current_user_can( 'manage_options' ) ) { wp_send_json_error( 'permission denied' ); }
		return update_option( $option, $value );
	}

	/**
	 * @since    1.0.0
	 */
	public function action_ajax_request() {

		// validate ajax request variables
		$result = false;
		$action = sanitize_key( $_REQUEST[ 'action' ] );
		$security = sanitize_text_field( $_REQUEST[ 'security' ] );

		// check for valid ajax request variables
		if ( ! $action ||
			 ! $security ) { wp_send_json_error( 'bad request' ); }

		global $allowedtags;
 		// add additional tags to allowed tags in comments
 		$allowedtags = array_merge( $allowedtags, $this->tcp_new_tags() );

		switch ( $action ) {
			case tcp_ajax_add_comment:
				$post_id = intval( $_REQUEST[ 'postId' ] );
				$comment_id = intval( $_REQUEST[ 'commentId' ] );
				$content = wp_kses( $_REQUEST[ 'content' ], $allowedtags );
				// check ajax referer's security nonce
				check_ajax_referer( tcp_ajax_add_comment . $post_id, 'security' );

				$result = $this->tcp_add_comment( $post_id, $content );
			break;

			case tcp_ajax_update_comment:
				$post_id = intval( $_REQUEST[ 'postId' ] );
				$comment_id = intval( $_REQUEST[ 'commentId' ] );
				$content = wp_kses( $_REQUEST[ 'content' ], $allowedtags );
				if ( ! $comment_id ) { wp_send_json_error( 'bad request' ); }
				// check ajax referer's security nonce
				check_ajax_referer( tcp_ajax_update_comment . $comment_id, 'security' );

				$result = $this->tcp_update_comment( $post_id, $comment_id, $content );
			break;

			case tcp_ajax_editing_enabled:
				check_ajax_referer( tcp_ajax_editing_enabled, 'security' );
				$content = sanitize_key( $_REQUEST[ 'content' ] );
				$result = $this->tcp_save_option( tcp_ajax_editing_enabled, $content );
			break;

			case tcp_ajax_editing_expiration:
				check_ajax_referer( tcp_ajax_editing_expiration, 'security' );
				$content = sanitize_key( $_REQUEST[ 'content' ] );
				$result = $this->tcp_save_option( tcp_ajax_editing_expiration, $content );
			break;

			case tcp_ajax_custom_classes:
				check_ajax_referer( tcp_ajax_custom_classes, 'security' );
				foreach( $_REQUEST[ 'content' ] as $key => $option ) {
					$option = preg_replace( tcp_regex_html_class, '', $option );
					if ( ! sanitize_key( $key ) ) { $result = false; }
					else { $result = $this->tcp_save_option( tcp_ajax_custom_classes . $key, $option ); }
				}

				$result = true;
			break;

			case tcp_ajax_wordpress_ids:
				check_ajax_referer( tcp_ajax_wordpress_ids, 'security' );
				foreach( $_REQUEST[ 'content' ] as $key => $option ) {
					$option = preg_replace( tcp_regex_html_id, '', $option );
					if ( ! sanitize_key( $key ) ) { $result = false; break; }
					else { $result = $this->tcp_save_option( tcp_ajax_wordpress_ids . $key, $option ); }
				}

				$result = true;
			break;

			case tcp_ajax_custom_toolbars:
				check_ajax_referer( tcp_ajax_custom_toolbars, 'security' );
				foreach( $_REQUEST[ 'content' ] as $key => $option ) {
					$option = preg_replace( tcp_regex_html_class, '', strtolower( $option ) );
					if ( ! sanitize_key( $key ) ) { $result = false; break; }
					else { $result = $this->tcp_save_option( tcp_ajax_custom_toolbars . $key, $option ); }
				}
				$result = true;
			break;
		}

		wp_send_json( $result );
	}


	/**
	 * @since    1.0.0
	 */
	 public function filter_tinymce_buttons_1( $buttons, $editor_id ) {
		 $buttons = explode( ' ', $this->option_toolbar1 );

		 return $buttons;
	 }

	/**
	 * @since    1.0.0
	 */
	 public function filter_tinymce_buttons_2( $buttons ) {
		 $buttons = explode( ' ', $this->option_toolbar2 );

		 return $buttons;
	 }

	/**
	 * @since    1.0.0
	 */
	 public function filter_format_tinymce( $args ) {
	 	$args['remove_linebreaks'] = false;
	 	$args['gecko_spellcheck'] = true;
	 	$args['keep_styles'] = true;
	 	$args['accessibility_focus'] = true;
	 	$args['tabfocus_elements'] = 'major-publishing-actions';
	 	$args['media_strict'] = false;
	 	$args['paste_data_images'] = true;
	 	$args['paste_remove_styles'] = false;
	 	$args['paste_remove_spans'] = false;
	 	$args['paste_strip_class_attributes'] = 'none';
	 	$args['paste_text_use_dialog'] = true;
	 	$args['wpeditimage_disable_captions'] = true;
		$args['plugins'] = tcp_plugins;
	 	//$args['content_css'] = get_template_directory_uri() . "/editor-style.css";
	 	$args['wpautop'] = true;
	 	$args['apply_source_formatting'] = false;
	  $args['block_formats'] = "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4";
	 	$args['toolbar1'] = $this->option_toolbar1;
	 	$args['toolbar2'] = $this->option_toolbar2;
	 	$args['toolbar3'] = $this->option_toolbar3;
	 	$args['toolbar4'] = $this->option_toolbar4;

	 	return $args;
	 }

	/**
	 * @since    1.0.0
	 */
	public function filter_comment_form_defaults( $args ) {
		$args[ 'comment_field' ] = $this->filter_tinymce_editor();

		return $args;
	}

	/**
	 * @since    1.0.0
	 */
	public function filter_tinymce_editor() {
	  ob_start();

	  wp_editor( '', 'comment',
			array(
				'skin' => 'wp_theme',
			    'textarea_rows' => 12,
			    'teeny' => false,
				'tinymce' => array(
					'plugins' => 'inlinepopups, wordpress, wplink, wpdialogs',
					'theme_advanced_buttons1' => $this->option_toolbar1,
          'theme_advanced_buttons2' => $this->option_toolbar2,
					'theme_advanced_buttons3' => $this->option_toolbar3,
          'theme_advanced_buttons4' => $this->option_toolbar4
				),
			    'quicktags' => false,
			    'media_buttons' => false
	  		)
	  );

	  $editor = ob_get_contents();

	  ob_end_clean();

	  return $editor;
	}

	/**
	 * @since    1.0.0
	 */
	public function filter_comment_editing( $content, $comment ) {

		if ( ! $this->user_can_edit( $comment->user_id ) ) { return $content; }

		$comment_id = $comment->comment_ID;
		$post_id = $comment->comment_post_ID;
		$nonce = wp_create_nonce( tcp_ajax_update_comment . $comment_id );

		$tcp_content = sprintf(
			'<div class="' . tcp_css_comment_content . '"
						id="' . tcp_css_comment_content . '%d"
						data-' . tcp_css_post_id . '="%d"
						data-' . tcp_css_comment_id . '="%d"
						data-' . tcp_css_nonce . '="%s">%s</div>',
			$comment_id,
			$post_id,
			$comment_id,
			$nonce,
			$content
		);

		$tcp_editor = sprintf(
			'<div class="' . tcp_css_editor . '"
						data-' . tcp_css_comment_id . '="%d"></div>',
			$comment_id
		);

		return $tcp_content . $tcp_editor;
	}

	/**
	 * @since    1.0.0
	 */
	public function filter_comment_reply_link( $args ) {
		global $current_user;

		// insert custom CSS classes
		$custom_classes = $this->option_custom_classes_all . ' ' . $this->option_custom_classes_reply;
		$args = str_replace( "class='" . $this->option_wp_id_comment_reply_link . "' ", $this->option_wp_id_comment_reply_link. " " . $custom_classes . "'", $args );

		return $args;
	}

	/**
	 * @since    1.0.0
	 */
	public function filter_comment_reply_link_args( $args, $comment, $post ) {
		global $current_user;

		$comment_age = current_time( 'timestamp' ) - strtotime( $comment->comment_date );
		$comment_age = floor( $comment_age / 60 );

		// Insert edit button targets
		// If editing option is enabled
		if ( ( $this->option_editing_enabled === 'on' &&
				// if user is logged in
				is_user_logged_in() &&
				// if user created this comment
				$comment->user_id == $current_user->ID &&
				// if comment editing does not expire
				( $this->option_editing_expiration == 0 ||
				// or comment editing has not expired
					$comment_age <= $this->option_editing_expiration )
			) ||
			// Or user is administrator
			current_user_can( 'administrator' )
			) {

			$nonce = wp_create_nonce( tcp_ajax_update_comment . $comment->comment_ID );

			$tcp_edit_link = '<div class="' . tcp_css_edit . '" data-' . tcp_css_comment_id . '="' . $comment->comment_ID . '"></div>' . PHP_EOL;

			$args[ 'before' ] .= $tcp_edit_link;
		}

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
