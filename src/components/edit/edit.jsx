'use strict';
var React = require('react');
module.exports = React.createClass({
    componentDidMount: function() {
    },

    onEditClick: function(event) {
      event.preventDefault();
    },

    render: function() {
        return(
                <a href="#" onClick={this.onEditClick}>Edit</a>
        );
    }
})
