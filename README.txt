# tinymce-comments-plus
WordPress plugin to enhance comments with the TinyMCE Editor, Inline Comment Editing and Asynchronous Posting.

=== tinymce-comments-plus ===
Contributors: kfwebdev
Donate link: http://kentarofischer.com
Tags: comments, spam
Requires at least: 3.5.1
Tested up to: 3.6
Stable tag: 1.0.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Enhance WordPress comments with the TinyMCE Editor, inline Comment Editing and asynchronous comment posting.

== Description ==

TinyMCE Comments Plus brings many features of WordPress's content editor TinyMCE to your website's comments.

=Richer Comment Content=
TinyMCE Comments Plus enables users to more easily and quickly format their comments with formatting, colors, links and more.

=Configurable Editing=
Logged in users can edit comments after posting them with the TinyMCE editor. This feature can be set to expire after certain period or disabled entirely.

=Asynchronous Comment Posting=
With TinyMCE Comments Plus, comments on your site are submitted asynchronously so your user's browsing experience is not interrupted.

=Customize Editor Toolbars=
The editor in TinyMCE Comments Plus can be configured to support up to 4 toolbars. Customize the editor's buttons to fit your site's needs. Choose from buttons supported in standard WordPress installations by referencing this [list](http://archive.tinymce.com/wiki.php/TinyMCE3x:Buttons/controls). Be aware that some buttons may not be supported by the TinyMCE plugins standard to WordPress.

== Installation ==

1. Upload `` to the `/wp-content/plugins/` directory
1. Activate the plugin through the "Plugins" menu in WordPress
1. That's it! (Configure settings to your preference in Settings -> TinyMCE Comments Plus Settings)

== Frequently Asked Questions ==

= Why do the buttons not match my site / look weird? =

TinyMCE Comments Plus does it's best to integrate into your site's theme. Different themes may require some help with CSS classes to look and position buttons right. Use the Custom CSS settings include CSS classes that tell the TinyMCE Comments Plus buttons how to look and where to position themselves.

= Um why doesn't this plugin work with my theme? =

Uh oh, where to begin. It's possible your theme uses different IDs than the default WordPress IDs. To accommodate this, you can update the TinyMCE Comments Plus Settings -> WordPress IDs & Classes inputs with any IDs that don't match the default IDs (shown in the empty input boxes). In case this starts to get too technical, feel free to reach out for help in the plugin page's [support](https://wordpress.org/support/plugin/tinymce-comments-plus) tab.

== Screenshots ==

1. This screen shot description corresponds to screenshot-1.(png|jpg|jpeg|gif). Note that the screenshot is taken from
the /assets directory or the directory that contains the stable readme.txt (tags or trunk). Screenshots in the /assets
directory take precedence. For example, `/assets/screenshot-1.png` would win over `/tags/4.3/screenshot-1.png`
(or jpg, jpeg, gif).
2. This is the second screen shot

== Changelog ==

= 1.0 =
* Initial Commit
