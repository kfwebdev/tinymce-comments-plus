'use strict';
import React from 'react';
import jQuery from 'jquery';

class EditComponent extends React.Component {
   constructor() {
    super();
    this. _editClick = this. _editClick.bind(this);
   }

   componentDidMount() {
   }

   _editClick( event ) {
      event.preventDefault();
      console.log(this);
   }

    render() {
        return(
                <a href="#" onClick={this._editClick}>Edit</a>
        );
    }
}

EditComponent.defaultProps = {
};

module.exports = EditComponent;
