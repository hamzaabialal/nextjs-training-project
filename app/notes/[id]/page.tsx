'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function NoteDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const getNoteDetail = async () => {
      try {
        const res = await axios.get(`/api/notes/${id}`);
        setNote(res.data.data); // assuming backend sends { data: note }
        console.log('Note Detail:', res.data.data);
      } catch (error) {
        console.error('Error fetching note detail:', error);
      } finally {
        setLoading(false);
      }
    };

    getNoteDetail();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center">Loading note...</div>;
  }

  if (!note) {
    return (
      <div className="p-10 text-center text-red-500">
        Note not found.{' '}
        <button onClick={() => router.back()} className="underline text-blue-600">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100 p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{note.title}</h1>

        <span
          className={`inline-block text-xs mb-4 px-2 py-1 rounded-full ${
            note.priority === 'High'
              ? 'bg-red-100 text-red-700'
              : note.priority === 'Medium'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          Priority: {note.priority}
        </span>

        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{note.content}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {note.tags && note.tags.length > 0 ? (
            note.tags.map((tag: string, i: number) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))
          ) : (
            <span className="italic text-gray-400">No tags</span>
          )}
        </div>

        <div className="text-sm text-gray-500">
          Last updated: {new Date(note.updatedAt).toLocaleString()}
        </div>

        <button
          onClick={() => router.push('/notes')}
          className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ← Back to Notes
        </button>
      </div>
    </div>
  );
}