import {connect} from '@/dbConfig/dbConfig'
import Note from '@/models/Note'
import { NextRequest, NextResponse } from 'next/server'


export async function GET(request: NextRequest){
    await connect()
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get("search")
        const priority_search = searchParams.get("priority")
        const tag_search = searchParams.get("tag") 
        let filter: any = {} 
        if (search) {
            filter.title = { $regex: search, $options: "i"}
        }
        if (priority_search){
            filter.priority = { $regex: priority_search, $options: "i"
            }
        }
        if (tag_search) {
            filter.tags = {
                $regex : tag_search, $options:"i"
            }
        }
        

        const notes = await Note.find(filter).sort({createdAt: -1})
        return NextResponse.json({
            notes
        })
    } catch (error: any) {
        console.log("GET api of Notes error", error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function POST(request: NextRequest){
    await connect()
    try {
        const rawBody = await request.text()
        console.log("Raw Body: ", rawBody )
        const reqBody = JSON.parse(rawBody)
        const {title, content, priority, tags} = reqBody
        const newNote = new Note({
            title,
            content,
            priority,
            tags
        })
        const savedNote = await newNote.save()
        return NextResponse.json({
            message: "Note is Created Successfully",
            note:{
                id: savedNote._id,
                title: savedNote.title,
                content: savedNote.content,
                priority:savedNote.priority,
                tags: savedNote.tags,
                createdAt: savedNote.createdAt,
                updatedAt: savedNote.updatedAt
            }
        })
    } catch (error:any) {
        console.error("Note API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });  
    }
}