// File: app/todos/[id]/edit/page.tsx

'use client';

import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TodoEditPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [todo, setTodo] = useState({
    name: '',
    priority: 'Low',
    isCompleted: false,
    tags: [],
  });

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const res = await axios.get(`/api/todos/${id}`);
        setTodo(res.data.data);
      } catch (err) {
        console.error('Failed to fetch todo', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`/api/todos/${id}`, todo);
      console.log("Todo Updated:", res.data);
      router.push('/todos');
    } catch (err) {
      console.error("Failed to update todo", err);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading Todo for edit...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">✏️ Update Todo</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Task Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded text-black"
            value={todo.name}
            onChange={(e) => setTodo({ ...todo, name: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            className="w-full px-3 py-2 border rounded text-black"
            value={todo.priority}
            onChange={(e) => setTodo({ ...todo, priority: e.target.value })}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded text-black"
            value={todo.tags.join(', ')}
            onChange={(e) =>
              setTodo({ ...todo, tags: e.target.value.split(',').map((tag) => tag.trim()) })
            }
          />
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={(e) => setTodo({ ...todo, isCompleted: e.target.checked })}
            />
            <span className="text-sm">Mark as Completed</span>
          </label>
        </div>

        <button
          onClick={handleUpdate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          ✅ Update Todo
        </button>
      </div>
    </div>
  );
}