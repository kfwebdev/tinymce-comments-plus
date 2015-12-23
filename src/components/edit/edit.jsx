'use strict';
import React from 'react';
import FBEmitter from 'fbemitter';

var emitter = tcp.emitter || new FBEmitter.EventEmitter();

class EditComponent extends React.Component {
   constructor() {
    super();
    this._bind( [ '_editClick' ] );
   }

   _bind( methods ) {
      methods.forEach( (method) => this[method] = this[method].bind(this) );
   }

   componentDidMount() {
   }

   _editClick( event ) {
      event.preventDefault();
      emitter.emit( 'toggleEditor', this.props.editorId );
   }

    render() {
        return(
                <a href="#" onClick={this._editClick}>Edit</a>
        );
    }
}

EditComponent.defaultProps = {};

module.exports = EditComponent;
