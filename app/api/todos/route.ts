import {connect} from '@/dbConfig/dbConfig'
import Todo from '@/models/Todo'
import { NextRequest, NextResponse } from 'next/server'

export const runtime ='nodejs';

export async function POST(request: NextRequest){
    await connect();
    try {
        const rawBody = await request.text();
        console.log("Raw Body: ", rawBody )
        const reqBody = JSON.parse(rawBody);

        const {name, priority, tags} = reqBody
        const newTodo = new Todo({
            name,
            priority,
            tags
        })
        const SavedTodo = await newTodo.save()
        return NextResponse.json({
            message:"Todo is Created Successfully",
            todo :{
                id: SavedTodo._id,
                name: SavedTodo.name,
                priority: SavedTodo.priority,
                tags :  SavedTodo.tags,
                isCompleted: SavedTodo.isCompleted,
                createdAt: SavedTodo.createdAt,
                updatedAt: SavedTodo.updatedAt
            }
        })
    } catch (error:any) {
    console.error("Todo API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });  
    }
}


export async function GET(request: NextRequest){
    console.log("/api/notes hit");
    await connect()
    console.log("Connected to DB");

    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get("search")
        let filter = {};
        if (search){
            filter = {
                name :{ $regex: search, $options: "i"},
            };
        }

        const todos = await Todo.find(filter).sort({ createdAt: -1 });
        return NextResponse.json({
            todos
        })
    } catch (error:any) {
    console.error('Todo GET API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });   
    }
}