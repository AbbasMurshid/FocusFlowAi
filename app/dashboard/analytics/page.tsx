'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ChartBarIcon,
    ClockIcon,
    CheckCircleIcon,
    FireIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import { calculateStreaks, getStreakStatus } from '@/lib/streaks';

export default function AnalyticsPage() {
    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        completionRate: 0,
        totalFocusTime: 0,
        focusSessions: 0,
        activeGoals: 0,
        totalNotes: 0,
        weeklyTasks: [] as number[],
        currentStreak: 0,
        longestStreak: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const [tasksRes, focusRes, goalsRes, notesRes] = await Promise.all([
                fetch('/api/tasks'),
                fetch('/api/focus'),
                fetch('/api/goals'),
                fetch('/api/notes'),
            ]);

            const tasks = tasksRes.ok ? (await tasksRes.json()).tasks : [];
            const sessions = focusRes.ok ? (await focusRes.json()).sessions : [];
            const goals = goalsRes.ok ? (await goalsRes.json()).goals : [];
            const notes = notesRes.ok ? (await notesRes.json()).notes : [];

            const completed = tasks.filter((t: any) => t.status === 'completed');
            const totalFocusMinutes = sessions.reduce((sum: number, s: any) => sum + (s.duration || 0), 0);

            // Calculate streaks
            const streakData = calculateStreaks(tasks);

            // Calculate weekly activity (using LOCAL timezone, not UTC)
            const weeklyStats = new Array(7).fill(0);
            const today = new Date();
            const last7Dates: string[] = [];

            // Create local date strings for the last 7 days
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                // Use local date string format YYYY-MM-DD
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                last7Dates.push(`${year}-${month}-${day}`);
            }

            completed.forEach((task: any) => {
                // Convert task updatedAt to local date string
                const taskDate = new Date(task.updatedAt);
                const year = taskDate.getFullYear();
                const month = String(taskDate.getMonth() + 1).padStart(2, '0');
                const day = String(taskDate.getDate()).padStart(2, '0');
                const localTaskDate = `${year}-${month}-${day}`;

                const index = last7Dates.indexOf(localTaskDate);
                if (index !== -1) {
                    weeklyStats[index]++;
                }
            });

            setStats({
                totalTasks: tasks.length,
                completedTasks: completed.length,
                completionRate: tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0,
                totalFocusTime: totalFocusMinutes,
                focusSessions: sessions.length,
                activeGoals: goals.length,
                totalNotes: notes.length,
                weeklyTasks: weeklyStats,
                currentStreak: streakData.currentStreak,
                longestStreak: streakData.longestStreak,
            });
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const statCards = [
        {
            title: 'Total Tasks',
            value: stats.totalTasks,
            icon: CheckCircleIcon,
            color: 'from-blue-500 to-cyan-500',
            description: `${stats.completedTasks} completed`,
        },
        {
            title: 'Completion Rate',
            value: `${stats.completionRate}%`,
            icon: ChartBarIcon,
            color: 'from-green-500 to-emerald-500',
            description: 'Task completion',
        },
        {
            title: 'Focus Time',
            value: formatTime(stats.totalFocusTime),
            icon: ClockIcon,
            color: 'from-purple-500 to-pink-500',
            description: `${stats.focusSessions} sessions`,
        },
        {
            title: 'Active Goals',
            value: stats.activeGoals,
            icon: FireIcon,
            color: 'from-orange-500 to-red-500',
            description: 'In progress',
        },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="skeleton h-12 w-64 rounded-xl"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="skeleton h-40 rounded-2xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold font-heading mb-2">
                    <span className="gradient-text">Analytics</span>
                </h1>
                <p className="text-gray-400">Track your productivity insights</p>
            </div>

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
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-sm text-gray-400 mb-1">{stat.title}</h3>
                            <p className="text-3xl font-bold mb-1">{stat.value}</p>
                            <p className="text-xs text-gray-500">{stat.description}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Streak Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-8 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <FireIcon className="w-7 h-7 text-orange-400" />
                        Streak Tracker
                    </h2>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-6 rounded-xl bg-white/5">
                        <div className="text-5xl font-bold text-orange-400 mb-2">
                            {stats.currentStreak} 🔥
                        </div>
                        <p className="text-gray-400 text-sm">Current Streak</p>
                        <p className="text-accent text-xs mt-1">{getStreakStatus(stats.currentStreak)}</p>
                    </div>

                    <div className="text-center p-6 rounded-xl bg-white/5">
                        <div className="text-5xl font-bold text-yellow-400 mb-2">
                            {stats.longestStreak} 🏆
                        </div>
                        <p className="text-gray-400 text-sm">Longest Streak</p>
                        <p className="text-yellow-400 text-xs mt-1">Personal Best</p>
                    </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-white/5">
                    <p className="text-sm text-gray-400 text-center">
                        {stats.currentStreak === 0
                            ? "Complete a task today to start your streak! 🚀"
                            : stats.currentStreak === stats.longestStreak
                                ? `You're on your best streak ever! Keep it going! 💪`
                                : `${stats.longestStreak - stats.currentStreak} days to beat your record!`
                        }
                    </p>
                </div>
            </motion.div>

            {/* Weekly Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-8"
            >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <CalendarIcon className="w-7 h-7 text-primary" />
                    Weekly Activity
                </h2>

                <div className="relative h-64 mb-8">
                    {(() => {
                        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        const today = new Date();
                        const last7Days = [];
                        for (let i = 6; i >= 0; i--) {
                            const d = new Date(today);
                            d.setDate(today.getDate() - i);
                            last7Days.push(days[d.getDay()]);
                        }

                        // Fixed scale: 10 tasks = 100% height
                        const maxScale = 10;
                        const points = stats.weeklyTasks.map((value, index) => {
                            const x = (index / 6) * 100;
                            const y = 100 - ((Math.min(value, maxScale) / maxScale) * 85);
                            return { x, y, value };
                        });

                        const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                        const areaPath = `M 0 100 L ${points.map(p => `${p.x} ${p.y}`).join(' L ')} L 100 100 Z`;

                        return (
                            <>
                                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    {/* Grid lines */}
                                    {[20, 40, 60, 80].map(y => (
                                        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" />
                                    ))}

                                    {/* Gradient fill */}
                                    <motion.path
                                        d={areaPath}
                                        fill="url(#areaGradient)"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.4 }}
                                        transition={{ duration: 1 }}
                                    />

                                    {/* Line */}
                                    <motion.path
                                        d={linePath}
                                        fill="none"
                                        stroke="url(#lineGradient)"
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />

                                    {/* Points */}
                                    {points.map((p, idx) => (
                                        <motion.circle
                                            key={idx}
                                            cx={p.x}
                                            cy={p.y}
                                            r={p.value > 0 ? "2" : "1"}
                                            fill={p.value > 0 ? "#6366f1" : "rgba(255,255,255,0.3)"}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 1 + idx * 0.1 }}
                                        />
                                    ))}

                                    <defs>
                                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
                                        </linearGradient>
                                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#6366f1" />
                                            <stop offset="50%" stopColor="#8b5cf6" />
                                            <stop offset="100%" stopColor="#06b6d4" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                {/* Labels */}
                                <div className="absolute inset-0 flex items-end justify-between pointer-events-none">
                                    {last7Days.map((day, idx) => (
                                        <div key={day} className="flex-1 flex flex-col items-center gap-2 relative group pointer-events-auto">
                                            <div className="h-full flex items-center">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 px-3 py-2 rounded-lg text-xs whitespace-nowrap absolute bottom-full mb-2">
                                                    <p className="font-semibold text-primary">{day}</p>
                                                    <p className="text-white">{stats.weeklyTasks[idx]} tasks</p>
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-400 font-medium">{day}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        );
                    })()}
                </div>
            </motion.div>

            {/* Insights */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card p-8"
            >
                <h2 className="text-2xl font-bold mb-6">📊 Productivity Insights</h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                        <div>
                            <h4 className="font-semibold mb-1">Average Focus Session</h4>
                            <p className="text-gray-400 text-sm">
                                {stats.focusSessions > 0
                                    ? formatTime(Math.round(stats.totalFocusTime / stats.focusSessions))
                                    : '0m'} per session
                            </p>
                        </div>
                        <div className="text-3xl">⏰</div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                        <div>
                            <h4 className="font-semibold mb-1">Total Notes Created</h4>
                            <p className="text-gray-400 text-sm">{stats.totalNotes} notes captured</p>
                        </div>
                        <div className="text-3xl">📝</div>
                    </div>
                </div>
            </motion.div>

            {/* Motivational Message */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="glass-card p-8 text-center gradient-border"
            >
                <h3 className="text-2xl font-bold mb-3 gradient-text">
                    {stats.completionRate >= 80
                        ? "🌟 Outstanding Performance!"
                        : stats.completionRate >= 50
                            ? "💪 Keep Up the Great Work!"
                            : "🚀 Let's Boost Your Productivity!"
                    }
                </h3>
                <p className="text-gray-400">
                    {stats.completionRate >= 80
                        ? "You're crushing your goals! Your dedication is inspiring."
                        : stats.completionRate >= 50
                            ? "You're making solid progress. Stay focused and consistent!"
                            : "Small steps lead to big achievements. You've got this!"
                    }
                </p>
            </motion.div>
        </div>
    );
}
