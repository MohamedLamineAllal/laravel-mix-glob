import InnerloAlert from './innerlo';

$(function () {
    let warningIcon = document.getElementById('warningIcon') 
    let alert = new InnerloAlert({
        icon: warningIcon
    }).setDialogBtns("confirm", {
        confirm: {
            className: "btn btn-danger",
            innerHTML: "Confirm",
            events: {
                click: goToPreview // add passing data to click event handler later
            }
        },
        cancel: {
            className: "btn btn-warning",
            innerHTML: "Cancel"
        }
    })
    .updateText('title', 'Cool your mix is nice, do you want to go to ')
    .renderBtnsAltern('confirm');
});


let goToPreviewBtn = document.getElementById('goToPreviewBtn');

goToPreviewBtn.addEventListener('click', function () {
    alert.cshow();
});


function goToPreview() {
    window.location.href = previewRoute; 
}