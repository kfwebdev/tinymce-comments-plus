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

'use strict';

var
	tcp = window.tcp || {},
	tcpGlobals = window.tcpGlobals || {},
	$ = jQuery
;

window.cl = console.dir.bind( console );

tcp.initAdmin = function() {

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


	tcp.ajaxSaveOption = function( data ) {
		return $.ajax({
			url: tcpGlobals.ajaxUrl,
			type: 'post',
			data: data
		});
	};


	tcp.editingEnabled = Backbone.View.extend({
		events: {
			'click input[type="checkbox"]': 'editingEnabled',
			'click label': 'editingEnabled'
		},

		editingEnabled: function( event ) {
			var self = this;
			this.$input = this.$el.find( 'input[type=checkbox]' );
			this.$label = this.$el.find( 'label' );
			this.nonce = this.$input.data( 'tcp-nc' );

			// Toggle check box if click element is label
			if ( event.currentTarget == this.$label[0] ) {
				this.$input.prop( 'checked', ( this.$input.is( ':checked' ) ? false : true ) );
			}

			this.checkValue = ( this.$input.is( ':checked' ) ? 'on' : 'off' );

			this.model.set( 'security', this.nonce );
			this.model.set( 'action', tcpGlobals.editingEnabledAction );
			this.model.set( 'content', this.checkValue );

			tcp.ajaxSaveOption( this.model.toJSON() )
			.done( function( response ) {
				self.$label.text( ( self.$input.is( ':checked' ) ? 'Enabled' : 'Disabled' ) );
			});
		}
	});


	tcp.adjustExpiration = Backbone.View.extend({
		events: {
			'change input[type="range"]': 'changeExpiration',
			'mousemove input[type="range"]': 'changeExpiration',
			'touchmove input[type="range"]': 'changeExpiration',
			'mouseup input[type="range"]': 'editingExpiration',
			'touchend input[type="range"]': 'editingExpiration'
		},

		initialize: function() {
			this.$input = this.$el.find( 'input[type=range]' );
			this.$output = this.$el.find( 'output' );
			this.nonce = this.$input.data( 'tcp-nc' );
			this.timeoutUpdate = false;
			this.changeExpiration( false );
		},

		changeExpiration: function( event ) {
			if ( ! event ) { this.expiration = parseInt( this.$input.val() ); }
			else { this.expiration = parseInt( event.currentTarget.value ); }
			if ( ! _.isNumber( this.expiration ) ) { this.expiration = 1; } // overwrite invalid inputs

			var expire = this.expiration * 1000 * 60;
			if ( this.expiration == this.$input.prop( 'max' ) ) {
				this.$output.text( 'Forever' );
			}
			else { this.$output.text( humanizeDuration( expire ) ); }
		},

		editingExpiration: function( event ) {
			var self = this;
			this.model.set( 'security', this.nonce );
			this.model.set( 'action', tcpGlobals.editingExpirationAction );
			this.model.set( 'content', this.expiration );

			clearTimeout( this.timeoutUpdate );
			this.timeoutUpdate = setTimeout( function(){
				tcp.ajaxSaveOption( self.model.toJSON() );
				clearTimeout( this.timeoutUpdate );
			}, tcpGlobals.optionUpdateDelay );
		}
	});

	tcp.customClasses = Backbone.View.extend({
		events: {
			'click input[type="button"]': 'toggleList'
		},

		initialize: function() {
			this.$input = this.$el.find( 'input[type=button]' );
			this.$box = this.$el.find( '.box' );
			this.nonce = this.$input.data( 'tcp-nc' );
			this.listOpen = ( this.$box.is( ':visible' ) ? 'yes' : 'no' );
		},

		toggleList: function() {
			this.listOpen = ( this.listOpen == 'yes' ? 'no' : 'yes' );
			this.$input.val( ( this.listOpen == 'yes' ? 'Hide' : 'Show' ) );
			this.$box.slideToggle();

			this.model.set( 'security', this.nonce );
			this.model.set( 'action', tcpGlobals.customClassesOpenAction );
			this.model.set( 'content', this.listOpen );

			tcp.ajaxSaveOption( this.model.toJSON() );
		}
	});

	tcp.wordpressIds = Backbone.View.extend({
		events: {
			'click input[type="button"]': 'toggleList'
		},

		initialize: function() {
			this.$input = this.$el.find( 'input[type=button]' );
			this.$box = this.$el.find( '.box' );
			this.nonce = this.$input.data( 'tcp-nc' );
			this.listOpen = ( this.$box.is( ':visible' ) ? 'yes' : 'no' );
		},

		toggleList: function() {
			this.listOpen = ( this.listOpen == 'yes' ? 'no' : 'yes' );
			this.$input.val( ( this.listOpen == 'yes' ? 'Hide' : 'Show' ) );
			this.$box.slideToggle();

			this.model.set( 'security', this.nonce );
			this.model.set( 'action', tcpGlobals.wordpressIdsOpenAction );
			this.model.set( 'content', this.listOpen );

			tcp.ajaxSaveOption( this.model.toJSON() );
		}
	});

	new tcp.editingEnabled({
		el: $( '.tcp-option .comment-editing' ),
		model: new tcp.ajaxModel
	});

	new tcp.adjustExpiration({
		el: $( '.tcp-option .comment-expiration' ),
		model: new tcp.ajaxModel
	});

	new tcp.customClasses({
		el: $( '.tcp-option .custom-classes' ),
		model: new tcp.ajaxModel
	});

	new tcp.wordpressIds({
		el: $( '.tcp-option .wordpress-ids' ),
		model: new tcp.ajaxModel
	});

};

( function( $ ){
	$( function() {
		if ( $( '.tcp-settings' ).length ) {
			tcp.initAdmin();
		}
	});
}( jQuery ) );
