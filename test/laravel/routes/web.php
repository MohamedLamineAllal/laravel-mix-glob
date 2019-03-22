<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('home');
})->name('home');

Route::group(['prefix' => 'preview'], function () {
    Route::get('/', function () {
        return view('previewPage');
    })->name('preview');
    
    Route::post('sendNote','Main@previewSendNote')->name('preview.SendNote');
});