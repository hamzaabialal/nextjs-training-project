'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(`/api/notes/?search=${search}`);
        console.log(res.data.notes);
        setNotes(res.data.notes);
      } catch (error: any) {
        console.log('GET Notes API Error', error);
      }
    };

    fetchNotes();
  }, [search]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">🗒️ Notes</h1>
          <Link
            href="/notes/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + New Note
          </Link>

        </div>
                          <input
  type="text"
  placeholder="🔎 Search by title..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black-400 text-black"
/>

        {notes.length > 0 ? (
          <ul className="space-y-4">
            {notes.map((note: any) => (
              <li
                key={note._id}
                className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {note.title}
                  </h2>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      note.priority === 'High'
                        ? 'bg-red-100 text-red-700'
                        : note.priority === 'Medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {note.priority}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-2">{note.content}</p>

                <div className="flex flex-wrap gap-2 text-sm text-blue-600">
                  {note.tags && note.tags.length > 0 ? (
                    note.tags.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="italic text-gray-400">No tags</span>
                  )}
                </div>

                <div className="mt-2 text-xs text-gray-400">
                  <p>🕒 Updated: {new Date(note.updatedAt).toLocaleString()}</p>
                  <Link
      href={`/notes/${note._id}`}
      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
    >
      🔍 View Details
    </Link>
    <Link
      href={`/notes/${note._id}/edit`}
      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
    >
      Update Note
    </Link>
     <button
        onClick={async () => {
          if (confirm("Are you sure you want to delete this note?")) {
            try {
              const res = await axios.delete(`/api/notes/${note._id}`);
              alert(res.data.message);
              window.location.reload();
            } catch (error) {
              console.error("Failed to delete note", error);
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
          <p className="text-center text-gray-500 italic">
            No notes found. Create one above 👆
          </p>
        )}
      </div>
    </div>
  );
}