'use strict';
import React from 'react';

var
  $ = jQuery
;

class EditorComponent extends React.Component {
   constructor() {
      super();
      this._bind( [ 'componentDidMount', 'toggleEditor', 'cancelEditor', 'initTinyMCE', 'submitEdit' ] );
      this.state = {
         showEditor: false,
         tinyMCEcontent: ''
      };
   }

   _bind( methods ) {
      methods.forEach( (method) => this[method] = this[method].bind(this) );
   }

   componentDidMount() {
      let that = this,
          commentContent = $( '#' + this.props.contentId ).html();
      this.setState({ tinyMCEcontent: commentContent });
      $( window ).on( 'toggleEditor', function( event ) {
         that.toggleEditor( event.editorId );
      });
   }

  toggleEditor( editorId ) {
      if ( this.props.editorId === editorId ) {
         this.setState({ showEditor: !this.state.showEditor });

         // if showEditor was false (before setState above)
         if ( !this.state.showEditor ) {
           $( '#' + this.props.contentId ).hide();
           $( window ).trigger({
             type: 'toggleEdit',
             editId: this.props.editId
           });
           this.initTinyMCE();
         }
      }
  }

  cancelEditor() {
    $( '#' + this.props.contentId ).show();
    $( window ).trigger({
      type: 'toggleEdit',
      editId: this.props.editId
    });
    this.setState({ showEditor: false });
    this.removeTinyMCE();
  }

  initTinyMCE() {
    let that = this;
    tinymce.init({
        menubar: false,
        selector: "textarea.tinyMCEeditor",
        content_css: this.props.tcpGlobals.editorStyles,
        setup : function(editor) {
          editor.on('change', function(e) {
            that.setState({ tinyMCEcontent: editor.getContent()});
          });
        },
        plugins: [
          "charmap, colorpicker, fullscreen, lists, paste, tabfocus, textcolor, wordpress, wpdialogs, wpemoji, wplink, wpview"
        ],
        toolbar: [
          "bold italic strikethrough bullist numlist blockquote hr alignleft aligncenter alignright image link unlink wp_more spellchecker wp_adv",
          "formatselect underline alignjustify forecolor pastetext removeformat charmap outdent indent undo redo wp_help"
        ]
    });
    // update tinyMCE content
    tinyMCE.get( this.props.editorId ).setContent( this.state.tinyMCEcontent );
  }

  submitEdit() {
    let
      that = this,
      re_action = /^[a-z_]+$/,
      $content = $( '#' + this.props.contentId ),
      postId = $content.data( this.props.tcpGlobals.tcp_css_comment_id ),
      re_postId = /^[0-9]+$/,
      re_commentId = /^[0-9]+$/,
      nonce = $content.data( this.props.tcpGlobals.tcp_css_nonce ),
      re_nonce = /^[a-zA-Z0-9]+$/,
      commentEditData = {
        action: this.props.tcpGlobals.updateCommentAction,
        security: nonce,
        postId: postId,
        commentId: this.props.commentId,
        content: this.state.tinyMCEcontent
      }
    ;

    // validate action
    if ( ! re_action.test( this.props.tcpGlobals.updateCommentAction ) ) { return false; }
    // validate postId
    if ( ! re_postId.test( postId ) ) { return false; }
    // validate commentId
    if ( ! re_commentId.test( this.props.commentId ) ) { return false; }
    // validate nonce
    if ( ! re_nonce.test( nonce ) ) { return false; }

    $.ajax({
      url: this.props.tcpGlobals.ajaxUrl,
      type: 'post',
      data: $.param( commentEditData )
    })
    .done( function( data ){
      $content.html( data.comment_content );
      that.cancelEditor();
    })
    .fail( function( data ){
      // error
    });
  }

  removeTinyMCE() {
    tinymce.remove( this.props.editorId );
  }

  render() {
      return(
        <div className={ tcpGlobals.editor } style={ this.state.showEditor ? { display:'inline-block' }:{ display:'none' }}>
          <textarea id={ this.props.editorId } className="tinyMCEeditor" rows="8"></textarea>
          <div className="reply tcp-reply-container">
            <span className="spinner"></span><a href="javascript:void(0);" onClick={ this.submitEdit } className={ this.props.tcpGlobals.tcp_css_button + ' ' + this.props.tcpGlobals.tcp_css_submit_edit_button + ' comment-reply-link' }>Submit</a>
            <a href="javascript:void(0);" onClick={ this.cancelEditor } className={ this.props.tcpGlobals.tcp_css_button + ' ' + this.props.tcpGlobals.tcp_css_cancel_edit_button + ' comment-reply-link' }>Cancel</a>
          </div>
        </div>
      );
  }

  componentWillUnmount() {
    if ( tinyMCE.get( this.props.editorId ) ) {
      this.removeTinyMCE();
    }
  }
}

module.exports = EditorComponent;
