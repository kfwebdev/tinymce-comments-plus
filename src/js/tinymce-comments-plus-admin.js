'use strict';

import humanizeDuration from 'humanize-duration';

var
	tcp = window.tcp || {},
	tcpGlobals = window.tcpGlobals || {},
	$ = jQuery
;

if ( window.console && window.console.log && window.console.log.bind ) { window.cl = console.log.bind( console ); }

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
			case 17: // ctrl
			case 18: // alt
			case 19: // pause/break
			case 27: // escape
			// page up, page down, end, home, left/up/right/down arrows, insert
			case ( key >= 33 && key <= 45 ):
			// windows keys, select key
			case ( key >= 91 && key <= 93 ):
			// function keys F1-F12
			case ( key >= 112 && key <= 123 ):
			// num & scroll lock
			case ( key >= 144 && key <= 145 ):
				return false;
			break;

			default:
				return true;
			break;
		}
	}

	tcp.validHtmlClassKey = function( key ) {
		return key.replace( /([^0-9a-z-_ ])+/gi ) ? true : false;
	}

	tcp.sanitizeHtmlClass = function( string ) {
		return string.replace( /([^0-9a-z-_ ])+/gi, '' );
	}

	tcp.validHtmlIdKey = function( key ) {
		return key.replace( /([^0-9a-z-_.# ])+/gi ) ? true : false;
	}

	tcp.sanitizeHtmlId = function( string ) {
		return string.replace( /([^0-9a-z-_.# ])+/gi, '' );
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
			'change input': 'changeExpiration'
		},

		initialize: function() {
			var that = this;

			this.$expiration = this.$el.find( '.expiration-control' );
			this.$days = this.$el.find('.days > input');
			this.$hours = this.$el.find('.hours > input');
			this.$minutes = this.$el.find('.minutes > input');
			this.$seconds = this.$el.find('.seconds > input');
			this.$confirmed = this.$el.find( '.confirmed' );
			this.nonce = this.$expiration.data( 'tcp-nc' );
			this.timeoutUpdate = false;

			this.$days.spinner({
				min: 0,
				spin: function( event, ui ) {
					event.target.value = ui.value;
					that.changeExpiration( event );
				}
			});

			this.$hours.spinner({
				spin: function ( event, ui ) {
					if (ui.value >= 24) {
						that.$hours.spinner('value', ui.value - 24);
						that.$days.spinner('stepUp');
						return false;
					} else if (ui.value < 0) {
						that.$hours.spinner('value', ui.value + 24);
						that.$days.spinner('stepDown');
						return false;
					}
					event.target.value = ui.value;
					that.changeExpiration( event );
      	}
			});

			this.$minutes.spinner({
				spin: function ( event, ui ) {
					if (ui.value >= 60) {
						that.$minutes.spinner('value', ui.value - 60);
						that.$hours.spinner('stepUp');
						return false;
					} else if (ui.value < 0) {
						that.$minutes.spinner('value', ui.value + 60);
						that.$hours.spinner('stepDown');
						return false;
					}
					event.target.value = ui.value;
					that.changeExpiration( event );
      	}
			});

			this.$seconds.spinner({
				spin: function ( event, ui ) {
					if (ui.value >= 60) {
						that.$seconds.spinner('value', ui.value - 60);
						that.$minutes.spinner('stepUp');
						return false;
					} else if (ui.value < 0) {
						that.$seconds.spinner('value', ui.value + 60);
						that.$minutes.spinner('stepDown');
						return false;
					}
					event.target.value = ui.value;
					that.changeExpiration( event );
				}
      });
		},

		updateExpirationValues: function() {
			this.days = parseInt( this.$days.spinner('value') )  * 24 * 60 * 60;
			this.hours = parseInt( this.$hours.spinner('value') ) * 60 * 60;
			this.minutes = parseInt( this.$minutes.spinner('value') ) * 60;
			this.seconds = parseInt( this.$seconds.spinner('value') );
		},

		changeExpiration: function( event ) {
			this.updateExpirationValues();

			switch( event.target.name ) {
				case 'days': this.days = parseInt( event.target.value ) * 24 * 60 * 60; break;
				case 'hours': this.hours = parseInt( event.target.value ) * 60 * 60; break;
				case 'minutes': this.minutes = parseInt( event.target.value ) * 60; break;
				case 'seconds': this.seconds = parseInt( event.target.value ); break;
			}

			this.expiration = Math.floor( this.days + this.hours + this.minutes + this.seconds );

			this.updateExpiration();
		},

		updateExpiration: function() {
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

	tcp.customToolbars = Backbone.View.extend({
		events: {
			'keyup': 'updateToolbars'
		},

		initialize: function() {
			this.$box = this.$el.find( '.box' );
			this.$confirmed = this.$box.find( '.confirmed' );
			this.nonce = this.$box.data( 'tcp-nc' );
			this.listOpen = ( this.$box.is( ':visible' ) ? 'yes' : 'no' );
		},

		updateToolbars: function( event ) {
			var
				that = this,
				charCode = (typeof event.which == "number") ? event.which : event.keyCode,
				keyChar = String.fromCharCode( charCode )
			;

			// validate input key and character input
			if ( ! tcp.validInputKey( event.which ) ||
					 ! tcp.validHtmlClassKey( keyChar ) ) {
				event.preventDefault();
				return false;
			}

			this.content = {};
			this.$inputs = this.$el.find( 'input[type=text]' );
			$.each( this.$inputs, function( key, input ){
				let field = $( input ).data( 'tcp-field' );
				// sanitize input data
				that.content[ field ] = tcp.sanitizeHtmlClass( input.value );
				// update input with clean data
				$( input ).val( that.content[ field ] );
			});

			this.model.set( 'security', this.nonce );
			this.model.set( 'action', tcpGlobals.customToolbarsAction );
			this.model.set( 'content', this.content );

			clearTimeout( this.timeoutUpdate );

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

	tcp.customClasses = Backbone.View.extend({
		events: {
			'keyup': 'handleKeypress'
		},

		initialize: function() {
			this.$box = this.$el.find( '.box' );
			this.$confirmed = this.$box.find( '.confirmed' );
			this.nonce = this.$box.data( 'tcp-nc' );
			this.timeoutUpdate = false;
		},

		handleKeypress: function( event ) {
			var
				that = this,
				charCode = (typeof event.which == "number") ? event.which : event.keyCode,
				keyChar = String.fromCharCode( charCode )
			;

			// validate input key and character input
			if ( ! tcp.validInputKey( event.which ) ||
					 ! tcp.validHtmlClassKey( keyChar ) ) {
				event.preventDefault();
				return false;
			}

			this.content = {};
			this.$inputs = this.$el.find( 'input[type=text]' );
			$.each( this.$inputs, function( key, input ){
				let field = $( input ).data( 'tcp-field' );
				// sanitize input data
				that.content[ field ] = tcp.sanitizeHtmlClass( input.value );
				// update input with clean data
				$( input ).val( that.content[ field ] );
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
			'keyup': 'updateIDs'
		},

		initialize: function() {
			this.$box = this.$el.find( '.box' );
			this.$confirmed = this.$box.find( '.confirmed' );
			this.nonce = this.$box.data( 'tcp-nc' );
			this.listOpen = ( this.$box.is( ':visible' ) ? 'yes' : 'no' );
		},

		updateIDs: function( event ) {
			var
				that = this,
				charCode = (typeof event.which == "number") ? event.which : event.keyCode,
				keyChar = String.fromCharCode( charCode )
			;

			// validate input key and character input
			if ( ! tcp.validInputKey( event.which ) ||
					 ! tcp.validHtmlIdKey( keyChar ) ) {
				event.preventDefault();
				return false;
			}

			this.content = {};
			this.$inputs = this.$el.find( 'input[type=text]' );
			$.each( this.$inputs, function( key, input ){
				let field = $( input ).data( 'tcp-field' );
				// sanitize input data
				that.content[ field ] = tcp.sanitizeHtmlId( input.value );
				// update input with clean data
				$( input ).val( that.content[ field ] );
			});

			this.model.set( 'security', this.nonce );
			this.model.set( 'action', tcpGlobals.wordpressIdsAction );
			this.model.set( 'content', this.content );

			clearTimeout( this.timeoutUpdate );

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
