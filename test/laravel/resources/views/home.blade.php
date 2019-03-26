@extends('layout.main')

@section('title')
Home
@endsection

@section('content')
<script>
    var previewRoute = '{{route('preview')}}';
</script>
<button id="goToPreviewBtn" class="btn btn-primary rounded">
    Go to preview
</button>


<svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
    <linearGradient id="a">
        <stop offset="0" stop-color="#e93e3a" />
        <stop offset=".355" stop-color="#ed683c" />
        <stop offset=".705" stop-color="#f3903f" />
        <stop offset="1" stop-color="#fdc70c" />
    </linearGradient>
    <linearGradient id="b" gradientTransform="matrix(.704062 0 0 -.704062 -7.555432 510.266872)" gradientUnits="userSpaceOnUse"
        x1="363.6045" x2="363.6045" xlink:href="#a" y1="-3.8121" y2="816.9458" />
    <linearGradient id="c" gradientTransform="matrix(.704062 0 0 -.704062 -7.555432 510.266872)" gradientUnits="userSpaceOnUse"
        x1="363.6202" x2="363.6202" xlink:href="#a" y1="-3.8121" y2="816.9458" />
</svg>

<div style="display: none;">
    <svg id="warningIcon" viewBox="-8 0 511 511.99984" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <path d="m493.09375 465.5625-215.800781-447.738281c-7.964844-15.921875-27.328125-22.375-43.253907-14.414063-6.308593 3.15625-11.40625 8.292969-14.515624 14.625l-215.609376 447.300782c-7.964843 15.921874-1.519531 35.289062 14.40625 43.253906 4.480469 2.242187 9.421876 3.410156 14.433594 3.410156h431.40625c17.804688-.003906 32.234375-14.441406 32.230469-32.246094-.003906-4.921875-1.128906-9.773437-3.296875-14.191406zm-28.933594 14.199219-431.296875-.210938 215.496094-447.523437 215.878906 447.734375zm0 0"
            fill="url(#b)" />
        <g fill="url(#c)">
            <path d="m232.335938 383.046875h32.238281v32.238281h-32.238281zm0 0" />
            <path d="m232.335938 157.382812h32.238281v193.429688h-32.238281zm0 0" />
        </g>
    </svg>
</div>
@endsection