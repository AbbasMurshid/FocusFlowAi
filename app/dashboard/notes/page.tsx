'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlusIcon,
    DocumentTextIcon,
    SparklesIcon,
    MagnifyingGlassIcon,
    TrashIcon,
    PencilIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

interface Note {
    _id: string;
    title: string;
    content: string;
    summary: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [noteForm, setNoteForm] = useState({
        title: '',
        content: '',
        tags: '',
    });
    const [generatingSummary, setGeneratingSummary] = useState(false);
    const [summaryResult, setSummaryResult] = useState('');

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await fetch('/api/notes');
            if (response.ok) {
                const data = await response.json();
                setNotes(data.notes);
            }
        } catch (error) {
            toast.error('Failed to fetch notes');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNote = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!noteForm.title.trim() || !noteForm.content.trim()) {
            toast.error('Title and content are required');
            return;
        }

        try {
            const url = editingNoteId ? `/api/notes/${editingNoteId}` : '/api/notes';
            const method = editingNoteId ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: noteForm.title,
                    content: noteForm.content,
                    tags: noteForm.tags ? noteForm.tags.split(',').map(t => t.trim()) : [],
                    summary: summaryResult // Save generated summary if any
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (editingNoteId) {
                    setNotes(notes.map(n => n._id === editingNoteId ? data.note : n));
                    toast.success('Note updated successfully! 📝');
                } else {
                    setNotes([data.note, ...notes]);
                    toast.success('Note created successfully! 📝');
                }
                resetForm();
            }
        } catch (error) {
            toast.error(editingNoteId ? 'Failed to update note' : 'Failed to create note');
        }
    };

    const handleDeleteNote = async (id: string) => {
        if (!confirm('Are you sure you want to delete this note?')) return;

        try {
            const response = await fetch(`/api/notes/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setNotes(notes.filter(n => n._id !== id));
                if (selectedNote?._id === id) {
                    setSelectedNote(null);
                }
                toast.success('Note deleted');
            }
        } catch (error) {
            toast.error('Failed to delete note');
        }
    };

    const generateSummary = async (content: string) => {
        if (!content.trim()) {
            toast.error('Please write some content first');
            return;
        }

        setGeneratingSummary(true);
        try {
            const response = await fetch('/api/ai/summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            if (response.ok) {
                const data = await response.json();
                setSummaryResult(data.summary);
                toast.success('Summary generated! ✨');
            } else {
                toast.error('Failed to generate summary');
            }
        } catch (error) {
            toast.error('Failed to generate summary');
        } finally {
            setGeneratingSummary(false);
        }
    };

    const openEditModal = (note: Note) => {
        setNoteForm({
            title: note.title,
            content: note.content,
            tags: note.tags ? note.tags.join(', ') : '',
        });
        setSummaryResult(note.summary || '');
        setEditingNoteId(note._id);
        setShowCreateModal(true);
    };

    const resetForm = () => {
        setNoteForm({ title: '', content: '', tags: '' });
        setSummaryResult('');
        setEditingNoteId(null);
        setShowCreateModal(false);
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="skeleton h-12 w-64 rounded-xl"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="skeleton h-64 rounded-2xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold font-heading mb-2">
                        <span className="gradient-text">Notes</span>
                    </h1>
                    <p className="text-gray-400">Capture your thoughts and ideas</p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        resetForm();
                        setShowCreateModal(true);
                    }}
                    className="btn-primary flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    New Note
                </motion.button>
            </div>

            {/* Search */}
            <div className="glass-card p-4">
                <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12"
                    />
                </div>
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredNotes.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full glass-card p-12 text-center"
                        >
                            <DocumentTextIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
                            <p className="text-gray-400 mb-6">Start capturing your ideas!</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    resetForm();
                                    setShowCreateModal(true);
                                }}
                                className="btn-primary"
                            >
                                Create First Note
                            </motion.button>
                        </motion.div>
                    ) : (
                        filteredNotes.map(note => (
                            <motion.div
                                key={note._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedNote(note)}
                                className="glass-card p-6 card-hover cursor-pointer flex flex-col h-full"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-xl font-bold line-clamp-2 flex-1 pr-2">{note.title}</h3>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openEditModal(note);
                                            }}
                                            className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
                                            title="Edit Note"
                                        >
                                            <PencilIcon className="w-5 h-5 text-gray-400 hover:text-blue-400" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteNote(note._id);
                                            }}
                                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Delete Note"
                                        >
                                            <TrashIcon className="w-5 h-5 text-gray-400 hover:text-red-400" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-gray-400 text-sm line-clamp-4 mb-4 flex-grow">
                                    {note.content}
                                </p>

                                {note.summary && (
                                    <div className="mb-4 p-3 bg-white/5 rounded-lg text-xs text-gray-300 line-clamp-3">
                                        <span className="font-semibold text-accent block mb-1">AI Summary:</span>
                                        <ReactMarkdown>{note.summary}</ReactMarkdown>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {note.tags?.slice(0, 3).map((tag, index) => (
                                        <span key={index} className="px-2 py-1 rounded-lg bg-white/5 text-xs">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-gray-500">
                                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEditModal(note);
                                            generateSummary(note.content);
                                        }}
                                        className="flex items-center gap-1 text-accent hover:text-white transition-colors"
                                    >
                                        <SparklesIcon className="w-3 h-3" />
                                        Summarize
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Create/Edit Note Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={resetForm}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="glass-card p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <DocumentTextIcon className="w-7 h-7 text-accent" />
                                    {editingNoteId ? 'Edit Note' : 'Create New Note'}
                                </h2>

                                <form onSubmit={handleSaveNote} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={noteForm.title}
                                            onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                                            placeholder="Enter note title"
                                            className="w-full"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Content *
                                        </label>
                                        <textarea
                                            value={noteForm.content}
                                            onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                                            placeholder="Write your note content here..."
                                            rows={12}
                                            className="w-full resize-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Tags (comma-separated)
                                        </label>
                                        <input
                                            type="text"
                                            value={noteForm.tags}
                                            onChange={(e) => setNoteForm({ ...noteForm, tags: e.target.value })}
                                            placeholder="e.g., ideas, work, personal"
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={() => generateSummary(noteForm.content)}
                                            disabled={generatingSummary}
                                            className="btn-secondary py-3 flex items-center gap-2 disabled:opacity-50"
                                        >
                                            <SparklesIcon className="w-5 h-5" />
                                            {generatingSummary ? 'Generating...' : '✨ Generate AI Summary'}
                                        </motion.button>
                                    </div>

                                    {/* AI Summary Result */}
                                    {summaryResult && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="glass-card p-5 space-y-2"
                                        >
                                            <h4 className="font-semibold text-accent flex items-center gap-2">
                                                <SparklesIcon className="w-5 h-5" />
                                                AI Summary:
                                            </h4>
                                            <div className="text-gray-300 text-sm leading-relaxed max-h-60 overflow-y-auto prose prose-invert prose-sm">
                                                <ReactMarkdown>{summaryResult}</ReactMarkdown>
                                            </div>
                                        </motion.div>
                                    )}

                                    <div className="flex gap-3 pt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="flex-1 btn-primary py-4"
                                        >
                                            {editingNoteId ? 'Update Note' : 'Create Note'}
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={resetForm}
                                            className="flex-1 btn-secondary py-4"
                                        >
                                            Cancel
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* View Note Modal (Read-only view) */}
            <AnimatePresence>
                {selectedNote && !showCreateModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedNote(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="glass-card p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-3xl font-bold">{selectedNote.title}</h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditModal(selectedNote)}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <PencilIcon className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteNote(selectedNote._id)}
                                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <TrashIcon className="w-6 h-6 text-red-400" />
                                        </button>
                                    </div>
                                </div>

                                <div className="text-gray-300 whitespace-pre-wrap mb-6 leading-relaxed">
                                    {selectedNote.content}
                                </div>

                                {selectedNote.summary && (
                                    <div className="mb-6 p-4 bg-white/5 rounded-xl">
                                        <h4 className="font-semibold text-accent mb-2 flex items-center gap-2">
                                            <SparklesIcon className="w-4 h-4" />
                                            AI Summary
                                        </h4>
                                        <div className="text-sm text-gray-300 prose prose-invert prose-sm">
                                            <ReactMarkdown>{selectedNote.summary}</ReactMarkdown>
                                        </div>
                                    </div>
                                )}

                                {selectedNote.tags && selectedNote.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {selectedNote.tags.map((tag, index) => (
                                            <span key={index} className="px-3 py-1 rounded-lg bg-white/10 text-sm">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="text-sm text-gray-500 mb-6">
                                    Created: {new Date(selectedNote.createdAt).toLocaleString()}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedNote(null)}
                                    className="btn-primary w-full py-3"
                                >
                                    Close
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
