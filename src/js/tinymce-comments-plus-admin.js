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


	// Admin Confirmation Notices

	tcp.confirmationSaving = function( view ) {
		view.$confirmed
			.find( '.dashicons' )
			.attr( 'class', 'dashicons dashicons-update' );
		view.$confirmed
			.removeClass( 'fade' )
			.addClass( 'saving' )
			.find( '.message' )
			.text( 'Saving...' );
		view.$confirmed.show();
	}

	tcp.confirmationFail = function( view ) {
		view.$confirmed
			.find( '.dashicons' )
			.attr( 'class', 'dashicons dashicons-no' );
		view.$confirmed
			.addClass( 'fail' )
			.find( '.message' )
			.text( 'Failed to Save!' );
		view.$confirmed.show();
		tcp.confirmationFade( view );
	}

	tcp.confirmationDone = function( view ) {
		view.$confirmed
			.find( '.dashicons' )
			.attr( 'class', 'dashicons dashicons-yes' );
		view.$confirmed
			.removeClass( 'saving' )
			.find( '.message' )
			.text( view.confirmationMessage );
		view.$confirmed.show();
		tcp.confirmationFade( view );
	}

	tcp.confirmationFade = function( view ) {
		clearTimeout( view.fadeAnimation );
		clearTimeout( view.hideAnimation );
		view.fadeAnimation = setTimeout( function(){
			view.$confirmed.addClass('fade');
		}, tcpGlobals.optionConfirmationDelay );
		view.hideAnimation = setTimeout( function(){
			view.$confirmed.hide();
			// add 1000ms to optionConfirmationDelay for fade animation
		}, tcpGlobals.optionConfirmationDelay + 1000 );
	}

	tcp.validInputKey = function( key ) {
		switch ( key ) {
			// skip non input keys
			case 9: // tab
			case 13: // enter
			case 16: // shift
			case 19: // pause/break
			case 27: // escape
			// page up, page down, end, home, left/up/right/down arrows, insert
			case (key >= 33 && key <= 45):
			// windows keys, select key
			case (key >= 91 && key <= 93):
			// function keys F1-F12
			case (key >= 112 && key <= 123):
			// num & scroll lock
			case (key >= 144 && key <= 145):
				return false;
			break;

			default:
				return true;
			break;
		}
	}


	// Admin Views

	tcp.editingEnabled = Backbone.View.extend({
		events: {
			'click input[type="checkbox"]': 'editingEnabled',
			'click label': 'editingEnabled'
		},

		editingEnabled: function( event ) {
			var that = this;
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
				that.$label.text( ( that.$input.is( ':checked' ) ? 'Enabled' : 'Disabled' ) );
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
			this.$confirmed = this.$el.find( '.confirmed' );
			this.nonce = this.$input.data( 'tcp-nc' );
			this.timeoutUpdate = false;
			this.changeExpiration( false );
		},

		changeExpiration: function( event ) {
			if ( ! event ) { this.expiration = parseInt( this.$input.val() ); }
			else { this.expiration = parseInt( event.currentTarget.value ); }
			// overwrite invalid inputs
			if ( ! _.isNumber( this.expiration ) ) { this.expiration = 1; }

			var expire = this.expiration * 1000 * 60;
			if ( this.expiration == this.$input.prop( 'max' ) ) {
				this.$output.text( 'Forever' );
			}
			else { this.$output.text( humanizeDuration( expire ) ); }
		},

		editingExpiration: function( event ) {
			var that = this;
			this.model.set( 'security', this.nonce );
			this.model.set( 'action', tcpGlobals.editingExpirationAction );
			this.model.set( 'content', this.expiration );

			clearTimeout( this.timeoutUpdate );

			this.timeoutUpdate = setTimeout( function(){
				tcp.confirmationSaving( that );
				tcp.ajaxSaveOption( that.model.toJSON() )
				.fail(function( data ) {
					tcp.confirmationFail( that );
				})
				.done(function( data ) {
					that.confirmationMessage = 'Editing Period Saved';
					tcp.confirmationDone( that );
				});
				clearTimeout( that.timeoutUpdate );
			}, tcpGlobals.optionUpdateDelay );
		}
	});

	tcp.customClasses = Backbone.View.extend({
		events: {
			'keyup': 'updateClasses'
		},

		initialize: function() {
			this.$box = this.$el.find( '.box' );
			this.$confirmed = this.$box.find( '.confirmed' );
			this.nonce = this.$box.data( 'tcp-nc' );
			this.timeoutUpdate = false;
		},

		updateClasses: function( event ) {
			var	that = this;

			// validate input key before processing update
			if ( ! tcp.validInputKey( event.which ) ) {
				return false;
			}

			this.content = {};
			this.$inputs = this.$el.find( 'input[type=text]' );
			$.each( this.$inputs, function( key, input ){
				let field = $( input ).data( 'tcp-field' );
				that.content[ field ] = input.value;
			});

			this.model.set( 'security', this.nonce );
			this.model.set( 'action', tcpGlobals.customClassesAction );
			this.model.set( 'content', this.content );

			clearTimeout( this.timeoutUpdate );

			this.timeoutUpdate = setTimeout( function(){
				tcp.confirmationSaving( that );
				tcp.ajaxSaveOption( that.model.toJSON() )
				.fail(function( data ) {
					tcp.confirmationFail( that );
				})
				.done(function( data ) {
					that.confirmationMessage = 'CSS Classes Saved';
					tcp.confirmationDone( that );
				});
				clearTimeout( that.timeoutUpdate );
			}, tcpGlobals.optionUpdateDelay );
		}
	});

	tcp.wordpressIds = Backbone.View.extend({
		events: {
			'change input[type="text"]': 'updateIDs'
		},

		initialize: function() {
			this.$box = this.$el.find( '.box' );
			this.$confirmed = this.$box.find( '.confirmed' );
			this.nonce = this.$box.data( 'tcp-nc' );
			this.listOpen = ( this.$box.is( ':visible' ) ? 'yes' : 'no' );
		},

		updateIDs: function() {
			var that = this;

			this.content = {};
			this.$inputs = this.$el.find( 'input[type=text]' );
			$.each( this.$inputs, function( key, input ){
				let field = $( input ).data( 'tcp-field' );
				that.content[ field ] = input.value;
			});

			this.model.set( 'security', this.nonce );
			this.model.set( 'action', tcpGlobals.wordpressIdsAction );
			this.model.set( 'content', this.content );

			clearTimeout( this.timeoutUpdate );
			clearTimeout( this.fadeAnimation );
			clearTimeout( this.hideAnimation );

			this.timeoutUpdate = setTimeout( function(){
				tcp.confirmationSaving( that );
				tcp.ajaxSaveOption( that.model.toJSON() )
				.fail(function( data ) {
					tcp.confirmationFail( that );
				})
				.done(function( data ) {
					that.confirmationMessage = 'WordPress IDs & Classes Saved';
					tcp.confirmationDone( that );
				});
				clearTimeout( that.timeoutUpdate );
			}, tcpGlobals.optionUpdateDelay );
		}
	});

	tcp.customToolbars = Backbone.View.extend({
		events: {
			'change input[type="text"]': 'updateToolbars'
		},

		initialize: function() {
			this.$box = this.$el.find( '.box' );
			this.$confirmed = this.$box.find( '.confirmed' );
			this.nonce = this.$box.data( 'tcp-nc' );
			this.listOpen = ( this.$box.is( ':visible' ) ? 'yes' : 'no' );
		},

		updateToolbars: function() {
			var that = this;

			this.content = {};
			this.$inputs = this.$el.find( 'input[type=text]' );
			$.each( this.$inputs, function( key, input ){
				let field = $( input ).data( 'tcp-field' );
				that.content[ field ] = input.value;
			});

			this.model.set( 'security', this.nonce );
			this.model.set( 'action', tcpGlobals.customToolbarsAction );
			this.model.set( 'content', this.content );

			clearTimeout( this.timeoutUpdate );
			clearTimeout( this.fadeAnimation );
			clearTimeout( this.hideAnimation );

			this.timeoutUpdate = setTimeout( function(){
				tcp.confirmationSaving( that );
				tcp.ajaxSaveOption( that.model.toJSON() )
				.fail(function( data ) {
					tcp.confirmationFail( that );
				})
				.done(function( data ) {
					that.confirmationMessage = 'Toolbar layouts Saved';
					tcp.confirmationDone( that );
				});
				clearTimeout( that.timeoutUpdate );
			}, tcpGlobals.optionUpdateDelay );
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

	new tcp.customToolbars({
		el: $( '.tcp-option .custom-toolbars' ),
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
