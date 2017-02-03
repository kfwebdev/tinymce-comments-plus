'use strict';

var $ = jQuery;

var wpecpFilePicker = function(callback, value, meta, settings) {
    var formData = new FormData();
    var wpecpFileInput = document.createElement('input');
    var wpecpFileInputId = 'wpecpFileInput';
    wpecpFileInput.setAttribute('accept', 'image/*');
    wpecpFileInput.setAttribute('id', wpecpFileInputId);
    wpecpFileInput.setAttribute('name', wpecpFileInputId);
    wpecpFileInput.setAttribute('type', 'file');

    wpecpFileInput.onchange = function() {
        var wpecpFile = this.files[0];
        var blobCache = tinymce.activeEditor.editorUpload.blobCache;
        var blobTime = (new Date()).getTime();
        var blobId = `blobid${blobTime}`;
        var blobInfo = blobCache.create(blobId, wpecpFile);
        blobCache.add(blobInfo);

        formData.append('action', wpecp.globals.imageUploadAction);
        formData.append(wpecp.globals.imageUploadName, wpecpFile);
        formData.append('postId', settings.postId);
        formData.append('security', settings.imageUploadNonce);

        $.ajax({
            contentType: false,
            data: formData,
            dataType: 'json',
            processData: false,
            type: 'POST',
            url: wpecp.globals.ajaxUrl
        })
        .then(function(response) {
            var cancelSettings = {
                attachmentId: response.data.imageAttachmentId,
                postId: settings.postId,
                security: settings.imageUploadNonce
            };
            wpecp.bindCancelClick(tinymce.activeEditor, cancelSettings);
            callback(
                response.data.imageUrl, 
                { title: response.data.imageFilename }
            );
            $(`#${wpecpFileInputId}`).remove();
        });
    };

    $('body').append(wpecpFileInput);
    $(`#${wpecpFileInputId}`).click();
};

export default wpecpFilePicker;