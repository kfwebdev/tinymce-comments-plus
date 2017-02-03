'use strict';
import React from 'react';

var $ = jQuery;

wpecp.Spinner = require( '../spinner/spinner' );

class DeleteComponent extends React.Component {
    constructor() {
        super();
        this._bind(['deleteClick']);
        this.state = {
            showSpinner: false,
            disableDelete: false
        };
    }

    _bind(methods) {
        methods.forEach((method) => this[method] = this[method].bind(this));
    }

    deleteClick(event) {
        event.preventDefault();
        const that = this,
            nonce = this.props.deleteNonce,
            confirmDelete = confirm('Are you sure you want to delete this comment?');
        if (confirmDelete && !this.state.disableDelete) {
            this.setState({
                showSpinner: true,
                disableDelete: true
            });

            $.ajax({
                url: this.props.wpecpGlobals.ajaxUrl,
                type: 'post',
                data: $.param({
                    action: this.props.wpecpGlobals.deleteCommentAction,
                    security: nonce,
                    commentId: this.props.commentId
                })
            })
            .done( function( data ){
                const $comments = $( that.props.wpecpGlobals.wpecp_id_comments );
                const $deletedComment = $comments.find(`${that.props.wpecpGlobals.wpecp_id_comment}${that.props.commentId}`);
                if ($deletedComment.length) {
                    $deletedComment.remove();
                }
            })
            .fail( function( data ){
                // error
            })
            .then( function() {
                that.setState({
                showSpinner: false,
                disableDelete: false
                });
            });
        }
    }

    render() {
        return (
            <div className={ this.props.wpecpGlobals.wpecp_css_delete_container }>
                <a href = "javascript:void(0);"
                    className = {
                        this.props.wpecpGlobals.wpecp_css_button + ' ' +
                        this.props.wpecpGlobals.wpecp_css_delete_button + ' ' +
                        this.props.wpecpGlobals.wpecp_css_button_custom + ' ' +
                        this.props.wpecpGlobals.wpecp_css_delete_button_custom
                    }
                    id = { this.props.deleteId }
                    onClick = { this.deleteClick }>Delete</a>
                <wpecp.Spinner wpecpGlobals={ this.props.wpecpGlobals } spinnerId={ 'delete-spinner' + this.props.commentId } showSpinner={ this.state.showSpinner } />
            </div>
        );
    }
}

module.exports = DeleteComponent;
