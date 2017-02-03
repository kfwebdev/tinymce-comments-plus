'use strict';

var $ = jQuery;

var wpecpRespondView = Backbone.View.extend({
	events: function() {
		var _events = {};

		_events[ 'submit' ] = 'submitForm';

		return _events;
	},

	initialize: function() {
		this.$commentForm = $( wpecp.globals.wpecp_id_comment_form );
		this.$textArea = $( wpecp.globals.wpecp_id_comment_textarea );
		this.$submitButton = $( wpecp.globals.wpecp_id_submit_comment );
		this.$submitButton.addClass( wpecp.globals.wpecp_css_button + ' ' + wpecp.globals.wpecp_css_submit_button );
		this.disableSubmit = false;
	},

	submitForm: function( event ) {
		event.preventDefault();

		var self = this,
			content = tinyMCE.activeEditor.getContent(),
			submitText = this.$submitButton.val();

		this.$textArea.html( content );
		this.$submitButton.val( 'Posting...' );
		this.$submitButton.attr( 'disabled', true );

		if ( ! this.disableSubmit ) {
			this.disableSubmit = true;

			$.ajax({
				url: this.$commentForm.attr( 'action' ),
				type: 'post',
				data: this.$commentForm.serialize()
			})
			.done( function( data ){
				self.$el.find( wpecp.globals.wpecp_id_cancel_comment_reply ).click();
				self.$submitButton.attr( 'disabled', false );
				self.$submitButton.val( submitText );
				tinymce.activeEditor.setContent( '' );

				var
					$commentData = $( data ).find( wpecp.globals.wpecp_id_comments ),
					$commentsList = $( wpecp.globals.wpecp_id_comments )
				;

				if ( $commentData.length ) {
					// remove tinymce editor before comments data is updated
					tinymce.EditorManager.execCommand( 'mceRemoveEditor', true, 'comment' );

					// replace #comments element with data response #comments element
					$commentsList.replaceWith( $commentData );

					// rebind React components
					wpecp.bindEditors();

					// restore the tinymce editor in the #respond element
					tinymce.EditorManager.execCommand( 'mceAddEditor', true, 'comment' );
				}
			})
			.fail( function( data ){
				// error
			})
			.then( function( data ){
				self.disableSubmit = false;
			});
		}
	}
});

export default wpecpRespondView;