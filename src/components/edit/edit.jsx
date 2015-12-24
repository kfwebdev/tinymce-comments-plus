'use strict';
import React from 'react';

var emitter = tcp.emitter;

class EditComponent extends React.Component {
   constructor() {
    super();
    this._bind( [ 'editClick' ] );
    this.state = {
       hideEdit: false
    };

   }

   _bind( methods ) {
      methods.forEach( (method) => this[method] = this[method].bind(this) );
   }

   componentDidMount() {
     let that = this;
     emitter.addListener( 'toggleEdit', function( editId ) {
        that.toggleEdit( editId );
     });
   }

   toggleEdit( editId ) {
       if ( this.props.tcpGlobals.tcp_css_edit + this.props.commentId === editId ) {
          this.setState({ hideEdit: !this.state.hideEdit });
       }
   }

   editClick( event ) {
      event.preventDefault();
      emitter.emit( 'toggleEditor', this.props.tcpGlobals.tcp_css_editor + this.props.commentId );
   }

    render() {
        return(
                <a href="#" onClick={ this.editClick } style={ this.state.hideEdit ? { display:'none' }:{ display:'inline-block' } }>Edit</a>
        );
    }
}

module.exports = EditComponent;
