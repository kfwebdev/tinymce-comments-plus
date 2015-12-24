'use strict';
import React from 'react';
import FBEmitter from 'fbemitter';

var emitter = tcp.emitter;

class EditorComponent extends React.Component {
   constructor() {
      super();
      this._bind( [ 'toggleEditor', 'cancelEditor', 'initTinyMCE' ] );
      this.state = {
         showEditor: false,
         tinyMCEcontent: '',
      };
   }

   _bind( methods ) {
      methods.forEach( (method) => this[method] = this[method].bind(this) );
   }

   componentDidMount() {
      let that = this;
      emitter.addListener( 'toggleEditor', function( editorId ) {
         that.toggleEditor( editorId );
      });
   }

  toggleEditor( editorId ) {
      if ( this.props.editorId === editorId ) {
         this.setState({ showEditor: !this.state.showEditor });

         // if showEditor was false (before setState above)
         if ( !this.state.showEditor ) {
           this.initTinyMCE();
         }
      }
  }

  cancelEditor() {
    this.setState({ showEditor: false });
    this.removeTinyMCE();
  }

  initTinyMCE() {
    let that = this;
    tinymce.init({
        selector: "textarea.tinyMCEeditor",
        setup : function(editor) {
            editor.on('change', function(e) {
                that.props.tinyMCEcontent(editor.getContent());
            });
        },
        plugins: [
            "wordpress wplink wpdialogs fullscreen paste"
        ],
        toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    });
    // update tinyMCE content
    tinyMCE.get( this.props.editorId ).setContent( 'this.props.htmlContent' );
  }

  removeTinyMCE() {
    tinymce.remove( '#' + this.props.editorId );
  }

  render() {
      return(
        <div className="tcp-comment-editor" style={this.state.showEditor ? {display:'inline-block'}:{display:'none'}}>
          <textarea id={this.props.editorId} className="tinyMCEeditor" rows="8"></textarea>
          <div className="reply tcp-reply-container">
            <span className="spinner"></span><a href="javascript:void(0);" className={this.props.tcpGlobals.cssButton + ' ' + this.props.tcpGlobals.cssSubmitEditButton}>Submit</a>
            <a href="javascript:void(0);" onClick={this.cancelEditor} className={this.props.tcpGlobals.cssButton + ' ' + this.props.tcpGlobals.cssCancelEditButton}>Cancel</a>
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

EditorComponent.defaultProps = { showEditor: false };

module.exports = EditorComponent;
