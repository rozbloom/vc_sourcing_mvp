// components/company-notes.tsx
'use client';

import React, { useState, useEffect } from 'react';

type Note = {
    id: string;
    text: string;
    timestamp: string;
};

interface Props {
    companyId: string;
}

export default function CompanyNotes({ companyId }: Props) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNoteText, setNewNoteText] = useState('');
    const STORAGE_KEY = `vc_notes_${companyId}`;

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setNotes(JSON.parse(saved));
    }, [STORAGE_KEY]);

    const saveToStorage = (updated: Note[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setNotes(updated);
    };

    const addNote = () => {
        if (!newNoteText.trim()) return;
        const note: Note = {
            id: Date.now().toString(),
            text: newNoteText.trim(),
            timestamp: new Date().toISOString(),
        };
        saveToStorage([note, ...notes]);
        setNewNoteText('');
    };

    const deleteNote = (id: string) => {
        saveToStorage(notes.filter(n => n.id !== id));
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border p-6">
            <h3 className="text-lg font-semibold mb-4">Notes</h3>

            <div className="flex gap-2 mb-6">
                <textarea
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Add private note about this company..."
                    className="flex-1 min-h-[80px] p-3 border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={addNote}
                    disabled={!newNoteText.trim()}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 self-start mt-1"
                >
                    Save
                </button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {notes.length === 0 && (
                    <p className="text-gray-500 italic text-center py-6">No notes yet.</p>
                )}
                {notes.map((note) => (
                    <div key={note.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
                        <p className="text-sm whitespace-pre-wrap">{note.text}</p>
                        <div className="mt-3 flex justify-between text-xs text-gray-500">
                            <span>
                                {new Date(note.timestamp).toLocaleDateString()} at{' '}
                                {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <button onClick={() => deleteNote(note.id)} className="text-red-600 hover:text-red-800">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}