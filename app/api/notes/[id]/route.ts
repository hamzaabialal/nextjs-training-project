import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connect } from "@/dbConfig/dbConfig";
import Todo from "@/models/Todo";

// ✅ GET /api/todos/[id]
export async function GET(req: NextRequest, context: any) {
  await connect();
  const id = context.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid Todo ID" }, { status: 400 });
  }

  try {
    const todo = await Todo.findById(id).lean();
    if (!todo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ data: todo });
  } catch (error: any) {
    console.error("GET /api/todos/[id] Error:", error.message);
    return NextResponse.json(
      { message: "Error retrieving todo", error: error.message },
      { status: 500 }
    );
  }
}

// ✅ PUT /api/todos/[id]
export async function PUT(req: NextRequest, context: any) {
  await connect();
  const id = context.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid Todo ID" }, { status: 400 });
  }

  try {
    const updateData = await req.json();

    const updatedTodo = await Todo.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTodo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Todo updated successfully",
      data: updatedTodo,
    });
  } catch (error: any) {
    console.error("PUT /api/todos/[id] Error:", error.message);
    return NextResponse.json(
      { message: "Failed to update todo", error: error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE /api/todos/[id]
export async function DELETE(req: NextRequest, context: any) {
  await connect();
  const id = context.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid Todo ID" }, { status: 400 });
  }

  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Todo deleted successfully",
      id: deletedTodo._id,
    });
  } catch (error: any) {
    console.error("DELETE /api/todos/[id] Error:", error.message);
    return NextResponse.json(
      { message: "Failed to delete todo", error: error.message },
      { status: 500 }
    );
  }
}