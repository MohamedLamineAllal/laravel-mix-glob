import axios from 'axios';
import {InnerloAlert} from '../innerlo';
import LoadingSprite from '../../../node_modules/loading-sprite/dist/js/esm/loadingSprite.js'

$(function () {
    let loader = new LoadingSprite({ // <---------------------!!!!!!
        // loaderDOM: ,
        loaderClass: 'sk-cube-grid',
        // zIndex: 1000000000,
        blackBack: true,
        // backBackground: 'rgba(0,0,0,0.2)',
        // holderStyle: {
        //     // any style here
        // },
        // container: someComponent,    // loaderWidth: '100px',
        // loaderHeight: '100px',
        // loaderWidth: '100px',
        // loaderHeight: '100px',
    });

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

    sendNote.addEventListener('click' , function () {
        loader.show();
        axios.post(previewSendNoteRoute, {

        })
        .then(function (resp) {
            loader.hide();
        })
        .catch(function (err) {

        });
    });
});