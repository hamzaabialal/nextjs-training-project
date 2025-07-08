// app/todos/[id]/page.tsx
'use client';

import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TodoDetailPage() {
  const params = useParams();
  const todoId = params?.id;
  const [todo, setTodo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!todoId) return;

    const getTodoDetail = async () => {
      try {
        const res = await axios.get(`/api/todos/${todoId}`);
        setTodo(res.data.data);
      } catch (error) {
        console.error('Error fetching todo detail:', error);
      } finally {
        setLoading(false);
      }
    };

    getTodoDetail();
  }, [todoId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Todo not found 🚫
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">📌 Todo Details</h1>

        <div className="text-lg font-semibold text-gray-900">{todo.name}</div>

        <div className="flex gap-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              todo.priority === 'High'
                ? 'bg-red-100 text-red-800'
                : todo.priority === 'Medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {todo.priority}
          </span>

          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              todo.isCompleted
                ? 'bg-green-200 text-green-900'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {todo.isCompleted ? 'Completed ✅' : 'Not Completed ❌'}
          </span>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Tags</h3>
          <div className="flex flex-wrap gap-2 mt-1">
            {todo.tags?.length > 0 ? (
              todo.tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))
            ) : (
              <span className="text-xs italic text-gray-400">No tags</span>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-500">
          <p>📅 Created At: {new Date(todo.createdAt).toLocaleString()}</p>
          <p>🕒 Updated At: {new Date(todo.updatedAt).toLocaleString()}</p>
        </div>

        <Link
          href="/todos"
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          ← Back to Todo List
        </Link>
      </div>
    </div>
  );
}
