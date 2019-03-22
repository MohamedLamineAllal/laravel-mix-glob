<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// use App\Note;

class Main extends Controller
{
    public function previewSendNote(Request $request) {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email',
            'note' => 'required'
        ]);

        // Store on db
        // $note = new Note;
        // $note->name = $request->name;
        // $note->email = $request->email;
        // $note->note = $request->note;

        // $note->save();

        return response()->json([
            'msg' => 'note stored succesfully'
        ], 200);
    } 
}
