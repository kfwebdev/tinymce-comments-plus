'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

var $ = jQuery;

function bindCancelClick(editor, settings) {
    editor.windowManager.windows[0].on('click', function(event){ 
        const clickText = $(event.target).text().toLowerCase();
        if (clickText === 'cancel') { 
            $.ajax({
                url: wpecp.globals.ajaxUrl,
                type: 'post',
                data: $.param({
                    action: wpecp.globals.imageUploadCancelAction,
                    attachmentId: settings.attachmentId,
                    postId: settings.postId,
                    security: settings.security
                })
            });
        }
    });
}

var wpecpBindEditors = function() {
	// include edit component
	wpecp.Edit = require( '../components/edit/edit' );
	// include delete component
	wpecp.Delete = require( '../components/delete/delete' );
	// include editor component
	wpecp.Editor = require( '../components/editor/editor' );

	wpecp.bindCancelClick = bindCancelClick;

	// bind button components
	$( wpecp.globals.wpecp_id_comment_reply ).each(function(){
		const $editButton = $(this).siblings('.wpecp-edit'),
			$deleteButton = $(this).siblings('.wpecp-delete');

		$(this).addClass(`${wpecp.globals.wpecp_css_button} ${wpecp.globals.wpecp_css_reply_button}`);

		if ($editButton.length) {
			const commentId = $editButton.data( wpecp.globals.wpecp_css_comment_id ),
				editId = wpecp.globals.wpecp_css_edit + commentId,
				editorId = wpecp.globals.wpecp_css_editor + commentId;

			ReactDOM.render(
				<wpecp.Edit
					wpecpGlobals={ wpecp.globals }
					commentId={ commentId }
					editId={ editId }
					editorId={ editorId }
				/>,
				$editButton[0]
			);
		}

		if ($deleteButton.length) {
			const commentId = $deleteButton.data( wpecp.globals.wpecp_css_comment_id ),
				deleteId = wpecp.globals.wpecp_css_delete + commentId,
				deleteNonce = $deleteButton.data( wpecp.globals.wpecp_css_nonce );

			ReactDOM.render(
				<wpecp.Delete
					wpecpGlobals={ wpecp.globals }
					commentId={ commentId }
					deleteId={ deleteId }
					deleteNonce={ deleteNonce }
				/>,
				$deleteButton[0]
			);
		}
	});

	// bind editor components
	$( '.' + wpecp.globals.wpecp_css_editor ).each(function(){
		let commentId = $( this ).data( wpecp.globals.wpecp_css_comment_id ),
			contentId = wpecp.globals.wpecp_css_comment_content + commentId,
			editId = wpecp.globals.wpecp_css_edit + commentId,
			editorId = wpecp.globals.wpecp_css_editor + commentId,
			imageUploadNonce = $( this ).data( wpecp.globals.wpecp_image_upload_nonce ),
			postId = $( this ).data( wpecp.globals.wpecp_css_post_id ),
			updateNonce = $( this ).data( wpecp.globals.wpecp_css_nonce );

		ReactDOM.render(
			<wpecp.Editor
				commentId={ commentId }
				contentId={ contentId }
				editId={ editId }
				editorId={ editorId }
				imageUploadNonce={ imageUploadNonce }
				postId={ postId }
				updateNonce={ updateNonce }
				wpecpGlobals={ wpecp.globals }
			/>,
			this
		);
	});
};

export default wpecpBindEditors;