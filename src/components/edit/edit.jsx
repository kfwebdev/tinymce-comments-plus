'use strict';
import React from 'react';
class EditComponent extends React.Component {
    componentDidMount() {
    }

    onEditClick( event ) {
      event.preventDefault();
    }

    render() {
        return(
                <a href="#" onClick={this.onEditClick}>Edit</a>
        );
    }
}

EditComponent.defaultProps = {
};

module.exports = EditComponent;
