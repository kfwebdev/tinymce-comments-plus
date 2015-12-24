'use strict';
import React from 'react';

var emitter = tcp.emitter;

class EditComponent extends React.Component {
   constructor() {
    super();
    this._bind( [ 'editClick' ] );
   }

   _bind( methods ) {
      methods.forEach( (method) => this[method] = this[method].bind(this) );
   }

   componentDidMount() {
   }

   editClick( event ) {
      event.preventDefault();
      emitter.emit( 'toggleEditor', this.props.tcpGlobals.tcp_css_editor + this.props.commentId );
   }

    render() {
        return(
                <a href="#" onClick={this.editClick}>Edit</a>
        );
    }
}

EditComponent.defaultProps = {};

module.exports = EditComponent;
