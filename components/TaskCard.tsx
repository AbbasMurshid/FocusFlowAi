'use client';

import { motion } from 'framer-motion';
import {
    CheckCircleIcon,
    ClockIcon,
    FlagIcon,
    TrashIcon,
    PencilIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    deadline?: string;
    tags?: string[];
}

interface TaskCardProps {
    task: Task;
    onUpdate: (id: string, updates: Partial<Task>) => void;
    onDelete: (id: string) => void;
}

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
    const priorityColors = {
        low: 'text-blue-400 bg-blue-400/10',
        medium: 'text-yellow-400 bg-yellow-400/10',
        high: 'text-red-400 bg-red-400/10',
    };

    const statusColors = {
        'todo': 'text-gray-400',
        'in-progress': 'text-accent',
        'completed': 'text-green-400',
    };

    const toggleComplete = () => {
        const newStatus = task.status === 'completed' ? 'todo' : 'completed';
        onUpdate(task._id, { status: newStatus });
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.01 }}
            className={`glass-card p-6 card-hover ${task.status === 'completed' ? 'opacity-60' : ''}`}
        >
            <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex items-start gap-4 w-full">
                    {/* Checkbox */}
                    <button
                        onClick={toggleComplete}
                        className="flex-shrink-0 mt-1 transition-transform hover:scale-110"
                    >
                        {task.status === 'completed' ? (
                            <CheckCircleSolid className="w-6 h-6 text-green-400" />
                        ) : (
                            <CheckCircleIcon className="w-6 h-6 text-gray-400 hover:text-accent" />
                        )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-semibold mb-2 ${task.status === 'completed' ? 'line-through' : ''}`}>
                            {task.title}
                        </h3>

                        {task.description && (
                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                {task.description}
                            </p>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                            {/* Priority */}
                            <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg ${priorityColors[task.priority]}`}>
                                <FlagIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="capitalize">{task.priority}</span>
                            </div>

                            {/* Status */}
                            <div className={`flex items-center gap-1 ${statusColors[task.status]}`}>
                                <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="capitalize">{task.status.replace('-', ' ')}</span>
                            </div>

                            {/* Tags */}
                            {task.tags && task.tags.length > 0 && (
                                <div className="flex gap-2">
                                    {task.tags.slice(0, 2).map((tag, index) => (
                                        <span key={index} className="px-2 py-1 rounded-lg bg-white/5 text-xs">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 w-full sm:w-auto justify-end sm:justify-start border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0 mt-2 sm:mt-0">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onUpdate(task._id, {})}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <PencilIcon className="w-5 h-5 text-gray-400 hover:text-accent" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(task._id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                        <TrashIcon className="w-5 h-5 text-gray-400 hover:text-red-400" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
