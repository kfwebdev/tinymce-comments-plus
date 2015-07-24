'use strict';
var tcpa = tcpa || {};

(function () {
    var PluginToggle = React.createClass({
        render: function() {
            return (
                <div class="tcp-option">
            		<h3>
            			TinyMCE Comments Plus Plugin
            			<input type="checkbox" />
            		</h3>
            		<p>Enable / Disable entire plugin.</p>
            	</div>
            );
        }
    });


    var CommentEditing = React.createClass({
        render: function() {
            return (
                <div class="tcp-option">
            		<h4>
            			Comment Editing
            			<input type="checkbox" checked="checked" />
            		</h4>
            		<p>Enable / Disable comment editing.</p>
            	</div>
            );
        }
    });


    var CommentEditDuration = React.createClass({
        render: function() {
            return (
                <div class="tcp-option">
            		<h4>
            			Comment Edit Duration
            			<input type="range" />
            		</h4>
            		<p>Configure how long comments can be edited.</p>
            	</div>
            );
        }
    });


    var CustomClasses = React.createClass({
        render: function() {
            return (
                <div class="tcp-option">
            		<h4>
            			Custom Classes
            			<input type="button" value="Enable" />
            		</h4>
            		<p>Define custom classes for tinymce comments plus elements.</p>
            	</div>
            );
        }
    });


    var ConfigureWordPressIds = React.createClass({
        render: function() {
            return (
                <div class="tcp-option">
            		<h4>
            			Configure WordPress Comment IDs
            			<input type="button" value="Enable" />
            		</h4>
            		<p>Specify element IDs if your theme uses non-standard IDs for WordPress comment forms.</p>
            	</div>
            );
        }
    });


    var AdminSettings = React.createClass({
        render: function() {
            return(
                <div>
                    <PluginToggle />
                    <CommentEditing />
                    <CommentEditDuration />
                    <CustomClasses />
                    <ConfigureWordPressIds />
                </div>
            );
        }
    });


    React.render(
        <AdminSettings />,
        document.getElementById( 'tcpAdminSettings' )
    );

})();
