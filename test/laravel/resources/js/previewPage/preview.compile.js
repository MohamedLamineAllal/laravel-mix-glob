import axios from 'axios';
import {InnerloAlert} from 'innerlo';
import LoadingBar from 'loadingBar'


$(function () {
    let writeNoteSummernote = $(document.getElementById('writeNoteSummernote'));
    
    writeNoteSummernote.summernote({
        placeholder: 'write your note here',
        tabsize: 2,
        height: 100,
        minHeight: 100
    });

    let goHome = document.getElementById('goHome');
    let goReactHello = document.getElementById('goReactHello');
    let sendNote = document.getElementById('sendNote');

    goHome.addEventListener('click', function () {
        window.location.href = homeRoute;
    });

    goReactHello.addEventListener('click', function () {
        window.location.href = reactHelloRoute;
    });

    sendNoe.addEventListener('click' , function () {
        axios.post(previewSendNoteRoute, {

        })
        .then(function (resp) {

        })
        .catch(function (err) {

        });
    });
});