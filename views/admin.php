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
				<legend>Comment editing</legend>
				<h4>Comment Editing</h4>
				<?php
					$nonce = wp_create_nonce( ajax_action_toggle_editing );
					$option = get_option( ajax_action_toggle_editing );
				?>
				<input type="checkbox" <?php if ( $option == 'on' ) { ?>checked="checked"<?php } ?> data-tcp-nc="<?php echo $nonce ?>" />
			</fieldset>
			<fieldset class="comment-expiration">
				<legend>Comment Edit Expiration</legend>
				<h4>Expire Comments</h4>
				<input type="datetime" />
				<input type="range" />
			</fieldset>
		</div>
		<div class="tcp-option">
			<fieldset class="custom-classes">
				<legend>Custom Classes</legend>
				<h4>Custom Classes</h4>
				<input type="button" value="Expand" />

				<div class="box">
					<label>Comments List <input type="text" /></label>
				</div>

			</fieldset>
			<fieldset class="wordpress-ids">
				<legend>WordPress IDs</legend>
				<h4>Configure WordPress Comment IDs</h4>
				<input type="button" value="Expand" />

				<div class="box">
					<label>Comments List <input type="text" /></label>
				</div>

			</fieldset>
		</div>
		<div class="tcp-option">
			<fieldset class="toggle-plugin">
				<legend>Enable / Disable Plugin</legend>
				<h4>TinyMCE Comments Plus Plugin</h4>
				<input type="checkbox" />
			</fieldset>
			<fieldset>
				<legend>Enable / Disable Plugin</legend>
				<h4>TinyMCE Comments Plus Plugin</h4>
				<input type="checkbox" />
		</fieldset>
		</div>
	</div>

</div>
