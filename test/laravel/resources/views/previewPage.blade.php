@extends('layout.main')

@section('title')
    preview
@endsection

@section('content')
<script>
    var homeRoute = '{{route('home')}}';
    var reactHelloRoute = '{{route('react.hello')}}';
    var previewSendNoteRoute = '{{route('')}}';
</script>
    <div class="fluid-container">
        <div class="row">
            <div class="col-md-3">
                <div id="goHome" class="btn btn-primary rounded">
                    Home
                </div>
                <div id="goReactHello" class="btn btn-primary rounded">
                    React hello
                </div>
            </div>
        </div>
    </div>
    <div class="fluid-container">
        <div class="row">
            <div class="col-12">
                <h2>Write a note here</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="summernoteContainer">
                    <textarea id="writeNoteSummernote"></textarea
                </div>
            </div>
        </div>
    </div>

    <div id="sendNote" class="btn btn-primary rounded">
        Send >
    </div>
@endsection

@section('body_js_bottom')
    <script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js"></script> 
    <script src="http://netdna.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.js"></script> 
    <script src="http://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.11/summernote.js"></script>
@endsection

@section('head_btm')
    <link href="http://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.11/summernote.css" rel="stylesheet">
@endsection


