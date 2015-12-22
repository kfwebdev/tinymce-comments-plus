'use strict';
import React from 'react';
class EditorComponent extends React.Component {
  componentDidMount() {
  }

  getInitialState() {
    return { showEditor: false };
  }

  onEditClick(event) {
    event.preventDefault();
  }

  render() {
      return(
        <div className="tcp-comment-editor">
          <textarea rows="8"></textarea>
          <div className="reply tcp-reply-container">
            <span className="spinner"></span><a href="javascript:void(0);" className={this.props.tcpGlobals.cssButton + ' ' + this.props.tcpGlobals.cssSubmitEditButton}>Submit</a>
            <a href="javascript:void(0);" className={this.props.tcpGlobals.cssButton + ' ' + this.props.tcpGlobals.cssCancelEditButton}>Cancel</a>
          </div>
        </div>
      );
  }
}

EditorComponent.defaultProps = {};

module.exports = EditorComponent;
