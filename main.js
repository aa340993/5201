const errorMessage = document.getElementById('error_message');
function showError(msg) {
    errorMessage.classList.add('show');
    errorMessage.innerText = 'Error: ' + msg;
}


var uploadedMultiple = false;
document.getElementById('new_upload_btn').onclick = function () {

    document.body.classList.remove('result');
}

document.getElementById('multiple_new_upload_btn').onclick = function () {
    document.body.classList.remove('result');
    document.body.classList.remove('uploading');
    document.body.classList.remove('multiple');
    document.getElementById('multiple_upload_result_wrapper').style.display = 'none';
    document.getElementById('result_wrapper').style.display = 'none';
}
document.getElementById('copy_url_btn').onclick = function () {
    copyToClipboard(document.getElementById('result_img_link').href);
    document.getElementById('copy_url_btn_text').innerText = 'Copied!';
}
document.getElementById('show_qr_btn').onclick = function () {
    window.open('https://chart.apis.google.com/chart?cht=qr&chs=300x300&chld=L|2&chl=' + encodeURIComponent(document.getElementById(`result_img_link`).href), 'w', 'location=no,status=yes,menubar=no,scrollbars=no,resizable=yes,width=500,height=500,modal=yes,dependent=yes');
}


window.addEventListener("paste", function (e) {
    retrieveImageFromClipboardAsBlob(e, function (imageBlob) {
        uploadFile(imageBlob);
        umami?.track('start: clipboard', { 'type': 'start' });
    });
}, false);

function retrieveImageFromClipboardAsBlob(pasteEvent, callback) {
    if (pasteEvent.clipboardData == false) {
        if (typeof (callback) == "function") {
            callback(undefined);
        }
    };

    var items = pasteEvent.clipboardData.items;

    if (items == undefined) {
        if (typeof (callback) == "function") {
            callback(undefined);
        }
    };

    for (var i = 0; i < items.length; i++) {
        // Skip content if not image
        if (items[i].type.indexOf("image") == -1) continue;
        // Retrieve image on clipboard as blob
        var blob = items[i].getAsFile();

        if (typeof (callback) == "function") {
            callback(blob);
        }
    }
}

let dropArea = document.body;
let fileUploadArea = document.getElementById('file_upload_area');
let dragTimer;


const uploadURL = 'https://upload.img.onl/';

const preventDefaults = e => {
    e.preventDefault();
    e.stopPropagation();
};

const highlight = () => {
    dropArea.classList.add('dragAndDrop');
};

const unhighlight = () => {
    dropArea.classList.remove('dragAndDrop');
};

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, e => {
        dragTimer = window.setTimeout(unhighlight, 25);
    }, false);
});

dropArea.addEventListener('dragover', () => {
    window.clearTimeout(dragTimer);
}, false);


// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;

    if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.contains('Files'))) {
        // uploadFile(files[0]);
        handleUploadFiles(files)
        console.log(files);
        umami?.track('start: drop'), { 'type': 'start' };
    }

}



var fileSelect = document.getElementById('file-select');

function handleUploadFiles(files) {
    console.log(files);

    if (files.length > 1 || uploadedMultiple) {
        if (files.length > 20) {
            alert('You can\'t upload more than 20 images at once.');
        } else {
            uploadFiles(files);
        }
    } else {
        uploadFile(files[0]);
    }
}

fileSelect.onchange = (event) => {
    event.preventDefault();

    handleUploadFiles(fileSelect.files);
    umami?.track('start: input', { 'type': 'start' });
}
let upload_confirm_dialog = document.getElementById('upload_confirm_dialog');
let terms_checkbox = document.getElementById('termsCheckbox');
let terms_agree_button = document.getElementById('terms_agree_button');
let singleUploadFileTemp;
let multipleUploadFilesTemp;
terms_checkbox.onchange = () => {
    terms_agree_button.disabled = !terms_checkbox.checked;
};
terms_agree_button.onclick = () => {
    document.body.classList.remove('confirmTerms');
    localStorage.setItem('termsAccepted', true);
    upload_confirm_dialog.style.display = 'none';
    if (singleUploadFileTemp) {
        uploadFile(singleUploadFileTemp);
    } else if (multipleUploadFilesTemp) {
        uploadFiles(multipleUploadFilesTemp);
    }
};
function checkAcceptedTerms() {
    return true;
    let termsAccepted = false;
    try {
        termsAccepted = JSON.parse(localStorage.getItem('termsAccepted')) || false;
    } catch { }

    if (!termsAccepted) {
        document.body.classList.add('confirmTerms');
        upload_confirm_dialog.style.display = 'block';
    }
    return termsAccepted;
}

function uploadFiles(files) {
    errorMessage.classList.remove('show');

    multipleUploadFilesTemp = files;
    if (!checkAcceptedTerms()) return;

    uploadedMultiple = true;
    var uploadedCount = 0;
    var filesCount = files.length;
    document.body.classList.add('uploading');
    document.body.classList.add('multiple');
    document.getElementById('multiple_upload_result_wrapper').style.display = 'block';
    document.getElementById('result_wrapper').style.display = 'none';

    const index_token = Date.now();

    var uploadDelay = 100;
    if (filesCount > 2) {
        uploadDelay = 200;
    }
    if (filesCount > 5) {
        uploadDelay = 350;
    }
    if (filesCount > 7) {
        uploadDelay = 850;
    }
    if (filesCount > 12) {
        uploadDelay = 1250;
    }
    if (filesCount > 18) {
        uploadDelay = 1400;
    }
    if (filesCount > 32) {
        uploadDelay = 1800;
    }
    if (filesCount > 48) {
        uploadDelay = 3200;
    }
    if (filesCount > 64) {
        uploadDelay = 6400;
    }

    uploadDelay *= 2;

    Array.from(files).forEach((file, index) => {
        setTimeout(() => {
            index = index_token + '_' + index;
            const template = `
            <div id="image_item_${index}" class="image_item loading">

            <div class="image_item_first_wrapper">
            <div class="image_item_preview">
            <img id="image_item_preview_${index}" src="">
            </div>
            <div class="image_item_url">
            <a id="image_item_url_${index}" target="_blank">
            &nbsp;
            </a>
            </div>
            </div>
            <div class="image_item_second_wrapper">
            <div id="image_copy_button_wrapper_${index}" class="image_copy_button_wrapper">
            <button id="copy_url_btn_${index}" class="copy_url_btn  button multiple noselect" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
            </svg>
            <span id="copy_url_btn_text_${index}">Copy URL</span>
            </button>
            </div>
            <div id="image_item_status_${index}" class="image_item_status">
            uploading...
            </div>
            </div>
            </div>`;

            document.getElementById('upload_list').insertAdjacentHTML('beforeend', template);

            document.getElementById(`copy_url_btn_${index}`).onclick = () => {
                copyToClipboard(document.getElementById(`image_item_url_${index}`).href);
                document.getElementById(`copy_url_btn_text_${index}`).innerText = 'Copied!';
            }

            // Check the file type.
            if (!file.type.match('image.*')) {
                document.getElementById(`image_item_status_${index}`).innerText = file.name + ' — this file is not an image!';
                document.getElementById(`image_item_status_${index}`).classList.add('error');
                document.getElementById(`image_item_${index}`).classList.remove('loading');
                return;
            }

            var formData = new FormData();
            // Add the file to the request.
            formData.append('imgFile', file, file.name);


            var xhr = new XMLHttpRequest();
            xhr.open('POST', uploadURL, true);


            document.getElementById(`image_item_preview_${index}`).src = URL.createObjectURL(file);

            document.getElementById(`uploading_status_multiple`).innerText = `Uploading… (${uploadedCount} of ${filesCount})`;
            xhr.upload.onprogress = e => {

                if (!e.lengthComputable) return;
                document.getElementById(`image_item_${index}`).style.setProperty('--upload-progress', (e.loaded / e.total) * 100 * 0.5 + '%');

                if ((e.loaded / e.total) === 1) {
                    document.getElementById(`image_item_status_${index}`).innerText = ' processing…';
                }

            };
            xhr.onerror = () => {
                document.getElementById(`image_item_status_${index}`).innerText = 'Network error occurred!';
                document.getElementById(`image_item_status_${index}`).classList.add('error');
                document.getElementById(`image_item_${index}`).classList.remove('loading');
            };
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const responseJSON = JSON.parse(xhr.responseText);
                    if (responseJSON.success) {
                        uploadedCount++;
                        // document.getElementById('result_img').src = responseJSON.url;
                        document.getElementById(`copy_url_btn_${index}`).style.display = 'inline-flex';
                        const resultAlink = document.getElementById(`image_item_url_${index}`);
                        resultAlink.href = responseJSON.url;
                        resultAlink.innerText = responseJSON.url;

                        document.getElementById(`image_item_status_${index}`).innerText = 'uploaded';
                        document.getElementById(`image_copy_button_wrapper_${index}`).style.visibility = 'visible';
                        document.getElementById(`image_item_status_${index}`).classList.add('success');
                        document.getElementById(`image_item_${index}`).classList.remove('loading');

                        if (filesCount === uploadedCount) {
                            document.getElementById(`uploading_status_multiple`).innerText = `Uploading complete!`;
                        } else {
                            document.getElementById(`uploading_status_multiple`).innerText = `Uploading… (${uploadedCount} of ${filesCount})`;
                        }


                        const uploads = JSON.parse(localStorage.getItem('uploads')) || [];
                        uploads.push({
                            timestamp: + new Date(),
                            url: responseJSON.url,
                            name: file.name
                        });
                        localStorage.setItem('uploads', JSON.stringify(uploads));

                        umami?.track('upload: success', { type: 'upload' });
                    } else {
                        document.getElementById(`image_item_status_${index}`).innerText = responseJSON.error;
                        document.getElementById(`image_item_status_${index}`).classList.add('error');
                        document.getElementById(`image_item_${index}`).classList.remove('loading');
                        umami?.track('upload: ' + responseJSON.error, { type: 'upload' });
                    }
                } else {
                    const responseJSON = JSON.parse(xhr.responseText);
                    document.getElementById(`image_item_status_${index}`).innerText = responseJSON.error;
                    document.getElementById(`image_item_status_${index}`).classList.add('error');
                    document.getElementById(`image_item_${index}`).classList.remove('loading');
                    umami?.track('upload: ' + responseJSON.error, { type: 'upload' });
                }
            };
            // Send the Data.
            xhr.send(formData);


        }, index * uploadDelay);
    });

    fileSelect.value = null;
}

function uploadFile(file) {
    document.body.classList.remove('result');
    errorMessage.classList.remove('show');

    singleUploadFileTemp = file;
    if (!checkAcceptedTerms()) return;

    document.getElementById('result_img_wrapper_link').href = '';
    document.getElementById('copy_url_btn_text').innerText = 'Copy to clipboard';
    // Check the file type.
    if (!file.type.match('image.*')) {
        showError('This file is not an image!');
        return;
    }
    document.body.classList.add('uploading');

    var formData = new FormData();

    // Add the file to the request.
    formData.append('imgFile', file, file.name);


    var xhr = new XMLHttpRequest();
    xhr.open('POST', uploadURL, true);


    document.getElementById('result_img').src = URL.createObjectURL(file);

    xhr.onload = () => {
        document.body.classList.remove('uploading');
        if (xhr.status === 200) {
            const responseJSON = JSON.parse(xhr.responseText);
            if (responseJSON.success) {

                document.body.classList.add('result');

                // document.getElementById('result_img').src = responseJSON.url;

                const resultAlink = document.getElementById('result_img_link');
                resultAlink.href = responseJSON.url;
                resultAlink.innerText = responseJSON.url;

                document.getElementById('result_img_wrapper_link').href = responseJSON.url;

                const uploads = JSON.parse(localStorage.getItem('uploads')) || [];
                uploads.push({
                    timestamp: + new Date(),
                    url: responseJSON.url,
                    name: file.name
                });
                localStorage.setItem('uploads', JSON.stringify(uploads));
                umami?.track('upload: success', { type: 'upload' });

                // TODO: show image and URL in UI
            } else {
                showError(responseJSON.error);
                umami?.track('upload: ' + responseJSON.error, { type: 'upload' });
            }
        } else {
            const responseJSON = JSON.parse(xhr.responseText);
            showError(responseJSON.error);
            umami?.track('upload: ' + responseJSON.error, { type: 'upload' });
        }
    };
    // Send the Data.
    xhr.send(formData);

    fileSelect.value = null;
}

function copyToClipboard(str) {
    var el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    var selected =
        document.getSelection().rangeCount > 0
            ? document.getSelection().getRangeAt(0)
            : false;
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
    }
};
