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

	function isNumber( str ) {
	    var n = ~~Number( str );
	    return String( n ) === str && n >= 0;
	}

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

		toggleEditing: function( event ) {
			this.$input = this.$el.find( 'input[type=checkbox]' );
			this.nonce = this.$input.data( 'tcp-nc' ),
			this.checkValue = ( this.$input.is( ':checked' ) ? 'on' : 'off' );

			this.model.set( 'security', this.nonce );
			this.model.set( 'action', tcpGlobals.toggleEditingAction );
			this.model.set( 'content', this.checkValue );

			tcp.ajaxSaveOption( this.model.toJSON() );
		}
	});

	tcp.adjustExpiration = Backbone.View.extend({
		events: {
			'change input[type="range"]': 'changeExpiration',
			'mousemove input[type="range"]': 'changeExpiration',
			'mouseup input[type="range"]': 'updateExpiration',
		},

		initialize: function() {
			this.$input = this.$el.find( 'input[type=range]');
			this.$output = this.$el.find( 'output');
			this.nonce = this.$input.data( 'tcp-nc' );
			this.timeoutUpdate = false;
		},

		changeExpiration: function( event ) {
			this.expiration = event.currentTarget.value;
			if ( ! isNumber( this.expiration ) ) { this.expiration = 0; } // overwrite invalid inputs

			var expire = this.expiration * 3600000 * 12; // 3600000 == 1 hour in ms
			if ( expire > 0 ) { this.$output.val( 'in ' + humanizeDuration( expire ) ); }
			else { this.$output.val( 'Never' ); }
		},

		updateExpiration: function( event ) {
			var self = this;
			this.model.set( 'security', this.nonce );
			this.model.set( 'action', tcpGlobals.updateExpiration );
			this.model.set( 'content', this.expiration );

			clearTimeout( this.timeoutUpdate );
			this.timeoutUpdate = setTimeout( function(){
				tcp.ajaxSaveOption( self.model.toJSON() );
				clearTimeout( this.timeoutUpdate );
			}, 3000 );
		}
	});

	tcp.ajaxSaveOption = function( data ) {
		$.ajax({
			url: tcpGlobals.ajaxUrl,
			type: 'post',
			data: data
		})
		.fail( function( response ){
			cl( 'failed' );
			cl( response );
		})
		.then( function( response ){
			cl( 'done' );
			return response;
		});
	};

	new tcp.toggleEditing({
		el: $( '.tcp-option .comment-editing' ),
		model: new tcp.ajaxModel
	});

	new tcp.adjustExpiration({
		el: $( '.tcp-option .comment-expiration' ),
		model: new tcp.ajaxModel
	});

}( jQuery ) );
