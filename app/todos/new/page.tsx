'use client';

import { useRouter } from "next/navigation";

import axios from "axios";

import { useState } from 'react';

export default function NewTodoPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [priority, setPriority] = useState('Low');
  const [tags, setTags] = useState('');

  const handleSubmit = async () => {
    const todo = {  
      name,
      priority,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    try {
        const response = await axios.post("/api/todos/", todo);
        console.log("Todo Creation success", response.data)
        router.push("/todos")

    } catch (error:any) {
        console.log("Login Failed", error.message)    
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">➕ Add New Todo</h1>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Task name"
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg text-black"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Comma separated tags"
          className="w-full p-2 border border-gray-300 rounded-lg text-black"
        />

        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Save Todo
        </button>
      </div>
    </div>
  );
}
