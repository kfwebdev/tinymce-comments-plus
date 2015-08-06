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
					$nonce = wp_create_nonce( ajax_action_toggle_editing );
					$option = get_option( ajax_action_toggle_editing );
				?>
				<legend>Comment editing</legend>
				<p>Comment Editing</p>
				<input type="checkbox" <?php if ( $option == 'on' ) { ?>checked="checked"<?php } ?> data-tcp-nc="<?php echo $nonce ?>" />
			</fieldset>
			<fieldset class="comment-expiration">
				<?php
					$nonce = wp_create_nonce( ajax_action_update_expiration );
					$option = get_option( ajax_action_update_expiration ); echo $option . 'wtf';
				?>
				<legend>Comment Edit Expiration</legend>
				<p>Expire Comments</p>
				<div class="expiration-control">
					<output></output>
					<input class="years" type="range" step="1" min="0" max="28" data-tcp-nc="<?php echo $nonce ?>" <?php echo "value=\"" . $option . "\"" ?> />
				</div>
			</fieldset>
		</div>
		<div class="tcp-option">
			<fieldset class="custom-classes">
				<legend>Custom Classes</legend>
				<p>Custom Classes</p>
				<input type="button" value="Expand" />

				<div class="box">
					<label>Comments List <input type="text" /></label>
				</div>

			</fieldset>
			<fieldset class="wordpress-ids">
				<legend>WordPress IDs</legend>
				<p>Configure WordPress Comment IDs</p>
				<input type="button" value="Expand" />

				<div class="box">
					<label>Comments List <input type="text" /></label>
				</div>

			</fieldset>
		</div>
		<div class="tcp-option">
			<fieldset class="toggle-plugin">
				<legend>Enable / Disable Plugin</legend>
				<p>TinyMCE Comments Plus Plugin</p>
				<input type="checkbox" />
			</fieldset>
			<fieldset>
				<legend>Enable / Disable Plugin</legend>
				<p>TinyMCE Comments Plus Plugin</p>
				<input type="checkbox" />
		</fieldset>
		</div>
	</div>

</div>
