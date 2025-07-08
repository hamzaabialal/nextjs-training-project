'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function EditNotePage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('Low');
  const [tags, setTags] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`/api/notes/${id}`);
        const data = res.data.data;

        setTitle(data.title);
        setContent(data.content);
        setPriority(data.priority);
        setTags(data.tags?.join(', '));
      } catch (err) {
        console.error('Failed to load note:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNote();
  }, [id]);

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    try {
      const updatedNote = {
        title,
        content,
        priority,
        tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      };

      const res = await axios.put(`/api/notes/${id}`, updatedNote);
      console.log(res.data);
      router.push('/notes');
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading note...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-100 p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">✏️ Edit Note</h1>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. urgent, work"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
