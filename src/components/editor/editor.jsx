'use strict';
import React from 'react';

var
  wpecp = window.wpecp || {},
  $ = jQuery
;

wpecp.Spinner = require( '../spinner/spinner' );

class EditorComponent extends React.Component {
   constructor() {
      super();
      this._bind( [ 'componentDidMount', 'toggleEditor', 'cancelEditor', 'initTinyMCE', 'submitEdit' ] );
      this.state = {
         showEditor: false,
         tinyMCEcontent: '',
         showSpinner: false,
         disableSubmit: false
      };
   }

   _bind( methods ) {
      methods.forEach( ( method ) => this[ method ] = this[ method ].bind( this ) );
   }

   componentDidMount() {
      let that = this;
      let commentContent = $( '#' + this.props.contentId ).html();
      this.setState({
        tinyMCEcontent: commentContent
      });
      $( window ).on( 'wpecpToggleEditor', function( event ) {
         that.toggleEditor( event.editorId );
      });
   }

  toggleEditor( editorId ) {
      if ( this.props.editorId === editorId ) {
         this.setState({
           showEditor: !this.state.showEditor
         });

         // if showEditor was false (before setState above)
         if ( !this.state.showEditor ) {
           $( '#' + this.props.contentId ).hide();
           $( window ).trigger({
             type: 'wpecpToggleEdit',
             editId: this.props.editId
           });
           this.initTinyMCE();
         }
      }
  }

  cancelEditor() {
    $( '#' + this.props.contentId ).show();
    $( window ).trigger({
      type: 'wpecpToggleEdit',
      editId: this.props.editId
    });
    this.setState({ showEditor: false });
    this.removeTinyMCE();
  }

  initTinyMCE() {
    let that = this;
    let toolbars = [
      this.props.wpecpGlobals.wpecp_toolbar1,
      this.props.wpecpGlobals.wpecp_toolbar2,
      this.props.wpecpGlobals.wpecp_toolbar3,
      this.props.wpecpGlobals.wpecp_toolbar4
    ];
    // if wpecp_show_toolbars is true then set toolbar to toolbars array.
    // else set toolbar to false to hide all toolbars.
    let toolbar = ( this.props.wpecpGlobals.wpecp_show_toolbars ) ? toolbars : false;
    const filePickerSettings = {
      postId: this.props.postId,
      imageUploadNonce: this.props.imageUploadNonce
    };

    tinymce.init({
      content_css: this.props.wpecpGlobals.editorStyles,
      convert_urls: false,
      file_picker_callback: function(callback, value, meta) {
        wpecp.filePicker(callback, value, meta, filePickerSettings);
      },
      file_browser_callback_types: 'image',
      height: '100%',
      image_description: true,
      images_upload_url: this.props.wpecpGlobals.ajaxUrl,
      menubar: false,
      plugins: [
        this.props.wpecpGlobals.wpecp_plugins
      ],
      relative_urls: false,
      remove_script_host: false,
      selector: 'textarea#' + this.props.editorId,
      setup : function(editor) {
        editor.on('change', function(e) {
          that.setState({
            tinyMCEcontent: editor.getContent()
          });
        });

        editor.on('remove', function() {
        });
      },
      toolbar: toolbar,
      wpeditimage_disable_captions: true
    });

    // update tinyMCE content
    tinyMCE.get( this.props.editorId ).setContent( this.state.tinyMCEcontent );

    if ( typeof wpecp.focusTimeout !== 'undefined' ) {
      clearTimeout( wpecp.focusTimeout );
    }
    tinyMCE.get( this.props.editorId ).focus();
  }

  submitEdit() {
    let
      that = this,
      re_action = /^[a-z_]+$/,
      $content = $( '#' + this.props.contentId ),
      re_int = /^[0-9]+$/,
      nonce = $content.data( this.props.wpecpGlobals.wpecp_css_nonce ),
      re_nonce = /^[a-zA-Z0-9]+$/,
      commentEditData = {
        action: this.props.wpecpGlobals.updateCommentAction,
        security: nonce,
        // postId: postId,
        commentId: this.props.commentId,
        content: this.state.tinyMCEcontent
      }
    ;

    // validate action
    if ( ! re_action.test( this.props.wpecpGlobals.updateCommentAction ) ) { return false; }
    // validate commentId
    if ( ! re_int.test( this.props.commentId ) ) { return false; }
    // validate postId
    if ( ! re_int.test( this.props.postId ) ) { return false; }
    // validate update nonce
    if ( ! re_nonce.test( this.props.updateNonce ) ) { return false; }

    if ( ! this.state.disableSubmit ) {
      this.setState({
        showSpinner: true,
        disableSubmit: true
      });

      $.ajax({
        url: this.props.wpecpGlobals.ajaxUrl,
        type: 'post',
        data: $.param( commentEditData )
      })
      .done( function( data ){
        $content.html( data.comment_content );
        that.cancelEditor();
      })
      .fail( function( data ){
        // error
      })
      .then( function() {
        that.setState({
          showSpinner: false,
          disableSubmit: false
        });
      });
    }
  }

  removeTinyMCE() {
    tinymce.get( this.props.editorId ).remove();
  }

  render() {
      return(
        <div className={ this.props.wpecpGlobals.editor } style={ this.state.showEditor ? { display:'block' }:{ display:'none' } }>
          <textarea id={ this.props.editorId } rows="8"></textarea>
          <div className={ this.props.wpecpGlobals.wpecp_css_edit_container }>
            <a href="javascript:void(0);" onClick={ this.submitEdit } className={
              this.props.wpecpGlobals.wpecp_css_button + ' ' +
              this.props.wpecpGlobals.wpecp_css_button_custom + ' ' +
              this.props.wpecpGlobals.wpecp_css_submit_edit_button + ' ' +
              this.props.wpecpGlobals.wpecp_css_submit_button_custom }>Submit</a>
            <wpecp.Spinner wpecpGlobals={ this.props.wpecpGlobals } spinnerId={ 'editor-spinner' + this.props.commentId } showSpinner={ this.state.showSpinner } />
            <a href="javascript:void(0);" onClick={ this.cancelEditor } className={
                this.props.wpecpGlobals.wpecp_css_button + ' ' +
                this.props.wpecpGlobals.wpecp_css_button_custom + ' ' +
                this.props.wpecpGlobals.wpecp_css_cancel_edit_button + ' ' +
                this.props.wpecpGlobals.wpecp_css_cancel_button_custom }>Cancel</a>
          </div>
        </div>
      );
  }

  componentWillUnmount() {
    if ( tinymce.get( this.props.editorId ) ) {
      this.removeTinyMCE();
    }
  }
}

module.exports = EditorComponent;
