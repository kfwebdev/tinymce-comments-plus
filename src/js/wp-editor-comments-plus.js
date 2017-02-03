/**
 * This is the main javascript file for the WP Editor Comments Plus plugin's main administration view.
 *
 * @package   wp-editor-comments-plus
 * @author    Kentaro Fischer <webdev@kentarofischer.com>
 * @license   GPL-2.0+
 * @link      http://kentarofischer.com
 * @copyright 1-4-2015 Kentaro Fischer
 */

'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import wpecpBindEditors from './wpecp-bind-editors';
import wpecpFilePicker from './wpecp-file-picker';
import wpecpRespondView from './wpecp-respond-view';

var	$ = jQuery,
	wpecp = window.wpecp || {},
	wpecpGlobals = window.wpecpGlobals || {};

// console shortcut for debugging
if ( window.console && window.console.log && window.console.log.bind ) { window.cl = console.log.bind( console ); }
window.wpecp = wpecp;
wpecp.bindEditors = wpecpBindEditors;
wpecp.filePicker = wpecpFilePicker;
wpecp.respondView = wpecpRespondView;

wpecp.initWPECP = function() {
	if ( wpecpGlobals.length ) {
		window.wpecp.globals = JSON.parse( wpecpGlobals );
	}

	// bind edit, delete buttons and editor components
	wpecp.bindEditors();

	// bind respond element to reply form
	new wpecp.respondView({
		el: $( wpecp.globals.wpecp_id_respond )
	});
};

( function( $ ){
	$(function(){
		wpecp.initWPECP();
	});
})( jQuery );
