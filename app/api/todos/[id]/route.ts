// app/api/todos/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connect } from '@/dbConfig/dbConfig';
import Todo from '@/models/Todo';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();

  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid Todo ID' }, { status: 400 });
    }

    const start = Date.now();
    const todo = await Todo.findById(id).lean();
    const end = Date.now();
    console.log(`Detail Query Time: ${end - start}ms`);

    if (!todo) {
      return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json({ data: todo });
  } catch (error: any) {
    console.error('GET /api/todos/[id] Error:', error.message);
    return NextResponse.json(
      { message: 'Error retrieving todo', error: error.message },
      { status: 500 }
    );
  }
}


export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();

  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid Todo ID' }, { status: 400 });
  }

  try {
    const rawBody = await req.text();
    const updateData = JSON.parse(rawBody);

    const updatedTodo = await Todo.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTodo) {
      return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Todo updated successfully',
      data: updatedTodo,
    });
  } catch (error: any) {
    console.error('PUT /api/todos/[id] Error:', error.message);
    return NextResponse.json(
      { message: 'Failed to update todo', error: error.message },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connect();

  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid Todo ID' }, { status: 400 });
  }

  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Todo successfully deleted ✅',
      id: deletedTodo._id,
    });
  } catch (error: any) {
    console.error('DELETE /api/todos/[id] Error:', error.message);
    return NextResponse.json(
      { message: 'Failed to delete todo', error: error.message },
      { status: 500 }
    );
  }
}