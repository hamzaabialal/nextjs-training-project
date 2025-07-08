import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import {connect} from '@/dbConfig/dbConfig'
import Note from '@/models/Note'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connect();

  try {
    const { id } = params; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid Note ID' }, { status: 400 });
    }

    const note = await Note.findById(id).lean();

    if (!note) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ data: note }); // return under `data` to match frontend
  } catch (error: any) {
    console.error('GET /api/notes/[id] Error:', error.message);
    return NextResponse.json(
      { message: 'Error retrieving note', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req:NextRequest, { params } : { params: { id: string }} ){
    await connect()

    try {
        const { id } = params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid Note ID' }, { status: 400 });
        }
        const deletedNote = await Note.findByIdAndDelete(id);
        if (!deletedNote) {
            return NextResponse.json({ message: 'Note not found' }, { status: 404 });
        }
        return NextResponse.json({
            message: "Note is Deleted Successfully",
            id : deletedNote._id
        })
        
        
    } catch (error) {
    console.error('DELETE /api/notes/[id] Error:', error.message);
    return NextResponse.json(
      { message: 'Failed to delete note', error: error.message },
      { status: 500 }
    );
    }
}

export async function PUT(req:  NextRequest, { params }: { params : { id: string }}){
    await connect()
    const { id } = params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: 'Invalid Note ID' }, { status: 400 });
    }
    try {
        const rawBody = await req.text()
        const updatedData = JSON.parse(rawBody)
        const updatedNote = await Note.findByIdAndUpdate(id, updatedData, {
            new:true,
            runValidators: true
        })
        if (!updatedNote) {
              return NextResponse.json({ message: 'Note not found' }, { status: 404 });
        }
        return NextResponse.json({
            message: "Note updated successfully",
            data : updatedNote
        });


    } catch (error:any) {
    console.error('PUT /api/notes/[id] Error:', error.message);
    return NextResponse.json(
      { message: 'Failed to update note', error: error.message },
      { status: 500 }
    );
    }
}