/**
 * This is the main javascript file for the TinyMCE Comments Plus plugin's main administration view.
 *
 * This includes the header, options, and other information that should provide
 * The User Interface to the end administrator.
 *
 * @package   tinymce-comments-plus
 * @author    Kentaro Fischer <webdev@kentarofischer.com>
 * @license   GPL-2.0+
 * @link      http://kentarofischer.com
 * @copyright 3-22-2015 Kentaro Fischer
 */

var tcp = tcp || {};

( function ( $ ) {
	'use strict';

	window.cl = console.dir.bind( console );

	if ( typeof tcpGlobals != 'undefined' ) {
		tcpGlobals = JSON.parse( tcpGlobals );
	}

	tcp.ajaxModel = Backbone.Model.extend({
		defaults: {
			action: '',
			security: '',
			content: ''
		}
	});


	tcp.toggleEditing = Backbone.View.extend({
		events: {
			'click input[type="checkbox"]': 'toggleEditing'
		},

		initialize: function() {
		},

		toggleEditing: function( event ) {
			var $input = this.$el.find( 'input[type="checkbox"]' ),
				nonce = $input.data( 'tcp-nc' ),
				checkValue = ( $input.is( ':checked' ) ? 'on' : 'off' );

			this.model.set( 'security', nonce );
			this.model.set( 'action', tcpGlobals.toggleEditingAction );
			this.model.set( 'content', checkValue );

			$.ajax({
				url: tcpGlobals.ajaxUrl,
				type: 'post',
				data: this.model.toJSON()
			})
			.fail( function( data ){
				cl( 'fail' );
				cl( data );
			})
			.then( function( data ){

			});
		}
	});

	new tcp.toggleEditing({
		el: $( '.tcp-option .comment-editing' ),
		model: new tcp.ajaxModel
	});

}( jQuery ) );
