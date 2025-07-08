'use client';
import axios from "axios";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TodoListPage() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
  const fetchTodos = async () => {
    try {
      const res = await axios.get('/api/todos');
      console.log(res.data.todos);          
      setTodos(res.data.todos);
    } catch (error) {
      console.log("GET API Error", error);
    }
  };

  fetchTodos();
}, []);

console.log(todos.length);



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-slate-100 to-blue-50 px-4 py-8">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📝 Todo List</h1>
          <Link
            href="/todos/new"
            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            + Add New
          </Link>
        </div>
        {todos.length > 0 ? (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
  key={todo._id}
  className="flex flex-col gap-1 px-4 py-3 bg-gray-100 rounded-lg shadow-sm"
>
  <div className="flex justify-between items-center">
    <span className="text-lg font-semibold text-gray-800">{todo.name}</span>
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
        todo.priority === 'High'
          ? 'bg-red-100 text-red-700'
          : todo.priority === 'Medium'
          ? 'bg-yellow-100 text-yellow-700'
          : 'bg-green-100 text-green-700'
      }`}
    >
      {todo.priority}
    </span>
  </div>

  <div className="text-sm text-gray-600">
    <span>
      ✅ Completed:{" "}
      <span className={todo.isCompleted ? "text-green-600" : "text-red-600"}>
        {todo.isCompleted ? "Yes" : "No"}
      </span>
    </span>
  </div>

  <div className="text-sm text-gray-600">
    <span>🏷️ Tags: </span>
    {todo.tags?.length > 0 ? (
      <span className="flex flex-wrap gap-1">
        {todo.tags.map((tag: string, idx: number) => (
          <span
            key={idx}
            className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </span>
    ) : (
      <span className="italic text-gray-400">No tags</span>
    )}
  </div>

  <div className="text-xs text-gray-400 mt-1">
    <span>📅 Created: {new Date(todo.createdAt).toLocaleString()}</span>
    <br />
    <span>🕒 Updated: {new Date(todo.updatedAt).toLocaleString()}</span>
  </div>
  <div className="flex justify-end mt-2">
  <Link
    href={`/todos/${todo._id}`}
    className="text-sm text-blue-600 hover:text-blue-800 underline"
  >
    🔍 View Details
  </Link>
<Link
  href={`/todos/${todo._id}/edit`}
  className="text-sm text-green-600 hover:text-green-800 underline"
>
  ✏️ Update
</Link>
 <button
    onClick={async () => {
      if (confirm("Are you sure you want to delete this todo?")) {
        try {
          const res = await axios.delete(`/api/todos/${todo._id}`);
          alert(res.data.message);
          window.location.reload();
        } catch (error) {
          console.error("Failed to delete todo", error);
          alert("Delete failed!");
        }
      }
    }}
    className="text-sm text-red-600 hover:text-red-800 underline"
  >
    🗑️ Delete
  </button>
</div>

</li>

            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No tasks found. Create one 👆</p>
        )}
      </div>
    </div>
  );
}
