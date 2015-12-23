'use strict';
import React from 'react';
import FBEmitter from 'fbemitter';

var emitter = tcp.emitter || new FBEmitter.EventEmitter();
var toggles = 0;

class EditorComponent extends React.Component {
   constructor() {
      super();
      this._bind( [ '_toggleEditor' ] );
      this.state = {
         showEditor: false
      };
   }

   _bind( methods ) {
      methods.forEach( (method) => this[method] = this[method].bind(this) );
   }

   componentDidMount() {
      let _this = this;
      emitter.addListener( 'toggleEditor', function( editorId ) {
         _this._toggleEditor( editorId );
      });
   }

  _toggleEditor( editorId ) {
      if ( this.props.editorId === editorId ) {
         this.setState({ showEditor: !this.state.showEditor });
      }
  }

  render() {
      return(
        <div className="tcp-comment-editor" style={this.state.showEditor ? {display:'inline-block'}:{display:'none'}}>
          <textarea rows="8"></textarea>
          <div className="reply tcp-reply-container">
            <span className="spinner"></span><a href="javascript:void(0);" className={this.props.tcpGlobals.cssButton + ' ' + this.props.tcpGlobals.cssSubmitEditButton}>Submit</a>
            <a href="javascript:void(0);" className={this.props.tcpGlobals.cssButton + ' ' + this.props.tcpGlobals.cssCancelEditButton}>Cancel</a>
          </div>
        </div>
      );
  }
}

EditorComponent.defaultProps = { showEditor: false };

module.exports = EditorComponent;
