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

	<div className="tcp-option">
		<h3>
			TinyMCE Comments Plus Plugin
			<input type="checkbox" />
		</h3>
		<p>Enable / Disable entire plugin.</p>
	</div>
	<div className="tcp-option">
		<h4>
			Comment Editing
			<input type="checkbox" checked="checked" />
		</h4>
		<p>Enable / Disable comment editing.</p>
	</div>
	<div className="tcp-option">
		<h4>
			Comment Edit Duration
			<input type="range" />
		</h4>
		<p>Configure how long comments can be edited.</p>
	</div>
	<div className="tcp-option">
		<h4>
			Custom Classes
			<input type="button" value="Enable" />
		</h4>
		<p>Define custom classes for tinymce comments plus elements.</p>
	</div>
	<div className="tcp-option">
		<h4>
			Configure WordPress Comment IDs
			<input type="button" value="Enable" />
		</h4>
		<p>Specify element IDs if your theme uses non-standard IDs for WordPress comment forms.</p>
	</div>

	<script src="<?php echo plugins_url("../js/admin-settings.js", __FILE__ ); ?>"></script>

</div>
