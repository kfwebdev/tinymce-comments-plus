<?php
/**
 * Represents the view for the administration dashboard.
 *
 * This includes the header, options, and other information that should provide
 * The User Interface to the end user.
 *
 * @package   tinymce-comments-plus
 * @author    Kentaro Fischer <webdev@kentarofischer.com>
 * @license   GPL-2.0+
 * @link      http://kentarofischer.com
 * @copyright 3-22-2015 Kentaro Fischer
 */
?>
<div class="wrap">

	<h2><?php echo esc_html( get_admin_page_title() ); ?></h2>

	<div class="tcp-settings">
		<div class="tcp-option">
			<fieldset class="comment-editing">
				<?php
					$nonce = wp_create_nonce( tcp_ajax_editing_enabled );
					$editing_option = get_option( tcp_ajax_editing_enabled );
				?>
				<legend><span class="dashicons dashicons-welcome-write-blog"></span> Comment Editing</legend>
				<p>Edit comments for logged in users</p>
				<div class="editing-control">
					<label for="editing"><?php if ( $editing_option == 'on' ) { ?>Enabled<?php } else { ?>Disabled<?php } ?></label>
					<input name="editing" type="checkbox" <?php if ( $editing_option == 'on' ) { ?>checked="checked"<?php } ?> data-tcp-nc="<?php echo $nonce ?>" />
				</div>
			</fieldset>
			<fieldset class="comment-expiration">
				<?php
					$nonce = wp_create_nonce( tcp_ajax_editing_expiration );
					$expiration_option = get_option( tcp_ajax_editing_expiration );
				?>
				<legend><span class="dashicons dashicons-clock"></span> Comment Editing Period</legend>
				<div class="confirmed">
					<span class="dashicons dashicons-yes"></span>
					<span class="message"></span>
				</div>
				<p>Time to allow comments to be edited</p>
				<div class="expiration-control">
					<output></output>
				</div>
				<input class="years" type="range" step="1" min="1" max="262981" data-tcp-nc="<?php echo $nonce ?>" <?php echo "value=\"" . $expiration_option . "\"" ?> />
			</fieldset>
		</div>
		<div class="tcp-option">
			<fieldset class="custom-classes">
				<?php
					$nonce = wp_create_nonce( tcp_ajax_custom_classes );
					$tcp_classes_all = get_option( tcp_ajax_custom_classes . '_all' );
					$tcp_classes_reply = get_option( tcp_ajax_custom_classes . '_reply' );
					$tcp_classes_edit = get_option( tcp_ajax_custom_classes . '_edit' );
					$tcp_classes_submit = get_option( tcp_ajax_custom_classes . '_submit' );
					$tcp_classes_cancel = get_option( tcp_ajax_custom_classes . '_cancel' );
				?>
				<legend><span class="dashicons dashicons-media-code"></span> Custom CSS</legend>
				<p>Add additional CSS classes for TinyMCE Comments Plus buttons and inputs</p>

				<div class="box" data-tcp-nc="<?php echo $nonce ?>">
					<div class="confirmed">
						<span class="dashicons dashicons-yes"></span>
						<span class="message"></span>
					</div>
					<label><span>All Buttons</span> <input type="text" value="<?php echo $tcp_classes_all ?>" data-tcp-field="_all" /></label>
					<label><span>WordPress Reply Button</span> <input type="text" value="<?php echo $tcp_classes_reply ?>" data-tcp-field="_reply" /></label>
					<label><span>Edit Button</span> <input type="text" value="<?php echo $tcp_classes_edit ?>" data-tcp-field="_edit" /></label>
					<label><span>Submit Edit Button</span> <input type="text" value="<?php echo $tcp_classes_submit ?>" data-tcp-field="_submit" /></label>
					<label><span>Cancel Edit Button</span> <input type="text" value="<?php echo $tcp_classes_cancel ?>" data-tcp-field="_cancel" /></label>
				</div>

			</fieldset>
			<fieldset class="wordpress-ids">
				<?php
					$nonce = wp_create_nonce( tcp_ajax_wordpress_ids );
					$wp_ids_list = get_option( tcp_ajax_wordpress_ids .'_list' );
					$wp_ids_respond = get_option( tcp_ajax_wordpress_ids .'_respond' );
					$wp_ids_form = get_option( tcp_ajax_wordpress_ids .'_form' );
					$wp_ids_reply = get_option( tcp_ajax_wordpress_ids .'_reply' );
					$wp_ids_cancel = get_option( tcp_ajax_wordpress_ids .'_cancel' );
					$wp_ids_submit = get_option( tcp_ajax_wordpress_ids .'_submit' );
				?>
				<legend><span class="dashicons dashicons-media-code"></span> WordPress IDs &amp; Classes</legend>
				<p>Some themes may use different element IDs or classes in comments.                                                                                                                                                           </p>

				<div class="box" data-tcp-nc="<?php echo $nonce ?>">
					<div class="confirmed">
						<span class="dashicons dashicons-yes"></span>
						<span class="message"></span>
					</div>
					<label><span>Comments List</span> <input type="text" placeholder="#comments" value="<?php echo $wp_ids_list ?>" data-tcp-field="_list" /></label>
					<!-- <label><span>Comment ID Prefix</span> <input type="text" placeholder="" /></label>
					<label><span>Comment</span> <input type="text" placeholder="" /></label> -->
					<label><span>Respond</span> <input type="text" placeholder="#respond" value="<?php echo $wp_ids_respond ?>" data-tcp-field="_respond" /></label>
					<label><span>Comment Form</span> <input type="text" placeholder="#commentform" value="<?php echo $wp_ids_form ?>" data-tcp-field="_form" /></label>
					<label><span>Comment Reply Link</span> <input type="text" placeholder=".comment-reply-link" value="<?php echo $wp_ids_reply ?>" data-tcp-field="_reply" /></label>
					<label><span>Cancel Comment Reply Link</span> <input type="text" placeholder="#cancel-comment-reply-link" value="<?php echo $wp_ids_cancel ?>" data-tcp-field="_cancel" /></label>
					<label><span>Submit Comment</span> <input type="text" placeholder="#submit" value="<?php echo $wp_ids_submit ?>" data-tcp-field="_submit" /></label>
				</div>
			</fieldset>
		</div>
		<div class="tcp-option">
			<fieldset class="customize-buttons">
				<?php
					$nonce = wp_create_nonce( tcp_ajax_custom_classes );
					$classes_option = get_option( tcp_ajax_custom_classes );
				?>
				<legend><span class="dashicons dashicons-editor-kitchensink"></span> Customize TinyMCE Toolbar Buttons</legend>
				<p>Configure toolbar row buttons in TinyMCE for comments</p>

				<div class="box">
					<label><span>Toolbar row 1</span> <input type="text"></label>
					<label><span>Toolbar row 2</span> <input type="text"></label>
					<label><span>Toolbar row 3</span> <input type="text"></label>
					<label><span>Toolbar row 4</span> <input type="text"></label>
				</div>
			</fieldset>
		</div>
	</div>

</div>
