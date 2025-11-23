'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
    SparklesIcon,
    CheckCircleIcon,
    ClockIcon,
    FireIcon,
    ChartBarIcon,
    LightBulbIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { calculateStreaks, getStreakStatus, getStreakIcon } from '@/lib/streaks';
import StreakCelebration from '@/components/StreakCelebration';

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        focusSessions: 0,
        activeGoals: 0,
        currentStreak: 0,
        longestStreak: 0,
    });
    const [recentTasks, setRecentTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showStreakCelebration, setShowStreakCelebration] = useState(false);
    const [celebrationStreak, setCelebrationStreak] = useState(0);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch tasks
            const tasksResponse = await fetch('/api/tasks');
            if (tasksResponse.ok) {
                const { tasks } = await tasksResponse.json();
                const completed = tasks.filter((t: any) => t.status === 'completed');

                // Calculate streaks
                const streakData = calculateStreaks(tasks);

                setStats(prev => ({
                    ...prev,
                    totalTasks: tasks.length,
                    completedTasks: completed.length,
                    currentStreak: streakData.currentStreak,
                    longestStreak: streakData.longestStreak,
                }));

                setRecentTasks(tasks.slice(0, 5));
            }

            // Fetch goals
            const goalsResponse = await fetch('/api/goals');
            if (goalsResponse.ok) {
                const { goals } = await goalsResponse.json();
                setStats(prev => ({
                    ...prev,
                    activeGoals: goals.length,
                }));
            }

            // Fetch focus sessions
            const focusResponse = await fetch('/api/focus?limit=10');
            if (focusResponse.ok) {
                const { sessions } = await focusResponse.json();
                setStats(prev => ({
                    ...prev,
                    focusSessions: sessions.length,
                }));
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Current Streak',
            value: `${stats.currentStreak}${getStreakIcon(stats.currentStreak)}`,
            icon: FireIcon,
            color: 'from-orange-500 to-red-500',
            subtitle: getStreakStatus(stats.currentStreak),
        },
        {
            title: 'Total Tasks',
            value: stats.totalTasks,
            icon: CheckCircleIcon,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            title: 'Completed',
            value: stats.completedTasks,
            icon: SparklesIcon,
            color: 'from-green-500 to-emerald-500',
        },
        {
            title: 'Focus Sessions',
            value: stats.focusSessions,
            icon: ClockIcon,
            color: 'from-purple-500 to-pink-500',
        },
        {
            title: 'Active Goals',
            value: stats.activeGoals,
            icon: ChartBarIcon,
            color: 'from-purple-500 to-indigo-500',
        },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="skeleton h-12 w-64 rounded-xl"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="skeleton h-32 rounded-2xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-4xl font-bold font-heading mb-2">
                    Welcome back, <span className="gradient-text">{user?.name}!</span>
                </h1>
                <p className="text-gray-400">Here's your productivity overview</p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="glass-card p-6 card-hover"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                            <p className="text-gray-400 text-sm">{stat.title}</p>
                            {stat.subtitle && <p className="text-xs text-accent mt-1">{stat.subtitle}</p>}
                        </motion.div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6"
            >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <LightBulbIcon className="w-7 h-7 text-accent" />
                    Quick Actions
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.location.href = '/dashboard/tasks'}
                        className="btn-primary py-4"
                    >
                        Create New Task
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.location.href = '/dashboard/focus'}
                        className="btn-secondary py-4"
                    >
                        Start Focus Session
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.location.href = '/dashboard/notes'}
                        className="btn-secondary py-4"
                    >
                        Write Note
                    </motion.button>
                </div>
            </motion.div>

            {/* Recent Tasks */}
            {recentTasks.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6"
                >
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <ChartBarIcon className="w-7 h-7 text-primary" />
                        Recent Tasks
                    </h2>

                    <div className="space-y-3">
                        {recentTasks.map((task) => (
                            <div
                                key={task._id}
                                className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <CheckCircleIcon
                                        className={`w-5 h-5 ${task.status === 'completed' ? 'text-green-400' : 'text-gray-400'
                                            }`}
                                    />
                                    <span className={task.status === 'completed' ? 'line-through text-gray-500' : ''}>
                                        {task.title}
                                    </span>
                                </div>
                                <span className={`text-xs px-3 py-1 rounded-full ${task.priority === 'high' ? 'bg-red-400/10 text-red-400' :
                                    task.priority === 'medium' ? 'bg-yellow-400/10 text-yellow-400' :
                                        'bg-blue-400/10 text-blue-400'
                                    }`}>
                                    {task.priority}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Motivational Quote */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-8 text-center gradient-border"
            >
                <SparklesIcon className="w-12 h-12 text-accent mx-auto mb-4" />
                <p className="text-2xl font-semibold mb-2 gradient-text">
                    "The secret of getting ahead is getting started."
                </p>
                <p className="text-gray-400">- Mark Twain</p>
            </motion.div>
        </div>
    );
}
