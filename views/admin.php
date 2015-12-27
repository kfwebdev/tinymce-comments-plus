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
				<legend>Comment Editing</legend>
				<p>Comments are Editable</p>
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
				<legend>Comment Editing Period</legend>
				<p>Comments can be edited for</p>
				<div class="expiration-control">
					<output></output>
					<input class="years" type="range" step="1" min="1" max="20160" data-tcp-nc="<?php echo $nonce ?>" <?php echo "value=\"" . $expiration_option . "\"" ?> />
				</div>
			</fieldset>
		</div>
		<div class="tcp-option">
			<fieldset class="customize-buttons">
				<?php
					$nonce = wp_create_nonce( tcp_ajax_custom_classes_open );
					$classes_option = get_option( tcp_ajax_custom_classes_open );
				?>
				<legend>Customize TinyMCE Toolbar Buttons</legend>
				<p>Configure toolbar row buttons in TinyMCE for comments</p>

				<div class="box">
					<div>Toolbar row 1 <input type="text"></div>
					<div>Toolbar row 2 <input type="text"></div>
					<div>Toolbar row 3 <input type="text"></div>
					<div>Toolbar row 4 <input type="text"></div>
				</div>
			</fieldset>
		</div>
		<div class="tcp-option">
			<fieldset class="custom-classes">
				<?php
					$nonce = wp_create_nonce( tcp_ajax_custom_classes_open );
					$classes_option = get_option( tcp_ajax_custom_classes_open );
				?>
				<legend>Custom Classes</legend>
				<p>Configure custom CSS classes for buttons and inputs</p>

				<div class="box">
					<label>TCP Button .tcp-button <input type="text" /></label>
					<label>TCP Edit Button .tcp-edit-comment <input type="text" /></label>
					<label>Reply Button .comment-reply-link <input type="text" /></label>
					<label>TCP Submit Edit .tcp-submit-edit <input type="text" /></label>
					<label>TCP Cancel Edit .tcp-cancel-edit <input type="text" /></label>
				</div>

			</fieldset>
			<fieldset class="wordpress-ids">
				<?php
					$nonce = wp_create_nonce( tcp_ajax_wordpress_ids_open );
					$ids_option = get_option( tcp_ajax_wordpress_ids_open );
				?>
				<legend>WordPress IDs</legend>
				<p>Some themes may use different element IDs for comments</p>

				<div class="box">
					<label>Comments List <input type="text" /></label>
					<label>Comment ID Prefix <input type="text" /></label>
					<label>Comment <input type="text" /></label>
					<label>Respond <input type="text" /></label>
					<label>Comment Form <input type="text" /></label>
					<label>Comment Reply Link <input type="text" /></label>
					<label>Cancel Comment Reply Link <input type="text" /></label>
					<label>Submit Comment <input type="text" /></label>
				</div>
			</fieldset>
		</div>
	</div>

</div>
