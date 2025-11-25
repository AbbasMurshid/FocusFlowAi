'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    PlayIcon,
    PauseIcon,
    ArrowPathIcon,
    ClockIcon,
    FireIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

type TimerType = 'focus' | 'short-break' | 'long-break';

import { useAuth } from '@/contexts/AuthContext';

export default function FocusPage() {
    const { user } = useAuth();
    const [timerType, setTimerType] = useState<TimerType>('focus');
    // Initialize with user preference or default
    const [timeLeft, setTimeLeft] = useState((user?.preferences?.focusDuration || 25) * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [completedSessions, setCompletedSessions] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const timerDurations = {
        'focus': (user?.preferences?.focusDuration || 25) * 60,
        'short-break': (user?.preferences?.breakDuration || 5) * 60,
        'long-break': 15 * 60,
    };

    // Update timer when user preferences change, but only if timer is not running and matches the current type default
    useEffect(() => {
        if (!isRunning) {
            setTimeLeft(timerDurations[timerType]);
        }
    }, [user?.preferences?.focusDuration, user?.preferences?.breakDuration, timerType]);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleTimerComplete();
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, timeLeft]);

    const handleTimerComplete = async () => {
        setIsRunning(false);

        // Save session to database
        try {
            await fetch('/api/focus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: timerType,
                    duration: timerDurations[timerType] / 60,
                }),
            });
        } catch (error) {
            console.error('Failed to save focus session:', error);
        }

        if (timerType === 'focus') {
            setCompletedSessions(prev => prev + 1);
            toast.success('🎉 Focus session completed!');

            // Auto-switch to break
            const nextType = completedSessions > 0 && completedSessions % 4 === 0
                ? 'long-break'
                : 'short-break';
            switchTimer(nextType);
        } else {
            toast.success('Break completed! Ready to focus?');
            switchTimer('focus');
        }
    };

    const switchTimer = (type: TimerType) => {
        setTimerType(type);
        setTimeLeft(timerDurations[type]);
        setIsRunning(false);
    };

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(timerDurations[timerType]);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((timerDurations[timerType] - timeLeft) / timerDurations[timerType]) * 100;

    const timerConfig = {
        'focus': {
            label: 'Focus Time',
            color: 'from-primary to-accent',
            icon: ClockIcon,
        },
        'short-break': {
            label: 'Short Break',
            color: 'from-green-500 to-emerald-500',
            icon: ClockIcon,
        },
        'long-break': {
            label: 'Long Break',
            color: 'from-blue-500 to-cyan-500',
            icon: ClockIcon,
        },
    };

    const config = timerConfig[timerType];
    const TimerIcon = config.icon;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold font-heading mb-2">
                    <span className="gradient-text">Focus Timer</span>
                </h1>
                <p className="text-gray-400">Stay focused with the Pomodoro technique</p>
            </div>

            {/* Main Timer Card */}
            <div className="max-w-2xl mx-auto">
                <div className="glass-card p-6 md:p-12 text-center relative overflow-hidden">
                    {/* Background gradient effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-5 pointer-events-none`}></div>

                    {/* Timer Type Selector */}
                    <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8 relative z-10">
                        {(['focus', 'short-break', 'long-break'] as const).map((type) => (
                            <motion.button
                                key={type}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => switchTimer(type)}
                                disabled={isRunning}
                                className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium transition-all text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed ${timerType === type
                                    ? 'bg-gradient-to-r from-primary to-accent text-white'
                                    : 'bg-white/5 hover:bg-white/10'
                                    }`}
                            >
                                {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </motion.button>
                        ))}
                    </div>

                    {/* Circular Progress */}
                    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-6 md:mb-8">
                        {/* Background Circle */}
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="8%"
                                fill="none"
                            />
                            {/* Progress Circle */}
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                stroke="url(#gradient)"
                                strokeWidth="8%"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 45}%`}
                                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}%`}
                                className="transition-all duration-1000"
                                style={{ strokeDasharray: '283%', strokeDashoffset: `${283 * (1 - progress / 100)}%` }}
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" className="text-primary" style={{ stopColor: '#6C5CE7' }} />
                                    <stop offset="100%" className="text-accent" style={{ stopColor: '#00CEC9' }} />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Timer Display */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <TimerIcon className="w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-4 text-gray-400" />
                            <div className="text-5xl md:text-7xl font-bold font-mono gradient-text">
                                {formatTime(timeLeft)}
                            </div>
                            <p className="text-gray-400 mt-2 md:mt-4 text-base md:text-lg">{config.label}</p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center gap-4 relative z-10">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTimer}
                            className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center shadow-lg`}
                        >
                            {isRunning ? (
                                <PauseIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                            ) : (
                                <PlayIcon className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" />
                            )}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={resetTimer}
                            className="w-14 h-14 md:w-16 md:h-16 rounded-full glass-card flex items-center justify-center"
                        >
                            <ArrowPathIcon className="w-6 h-6 md:w-7 md:h-7 text-gray-300" />
                        </motion.button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="glass-card p-4 md:p-6 text-center">
                        <FireIcon className="w-8 h-8 md:w-10 md:h-10 text-orange-400 mx-auto mb-2 md:mb-3" />
                        <div className="text-2xl md:text-3xl font-bold mb-1">{completedSessions}</div>
                        <div className="text-gray-400 text-xs md:text-sm">Completed Sessions</div>
                    </div>

                    <div className="glass-card p-4 md:p-6 text-center">
                        <ClockIcon className="w-8 h-8 md:w-10 md:h-10 text-blue-400 mx-auto mb-2 md:mb-3" />
                        <div className="text-2xl md:text-3xl font-bold mb-1">
                            {Math.floor((completedSessions * 25) / 60)}h {(completedSessions * 25) % 60}m
                        </div>
                        <div className="text-gray-400 text-xs md:text-sm">Total Focus Time</div>
                    </div>
                </div>
            </div>

            {/* Tips */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-2xl mx-auto glass-card p-6"
            >
                <h3 className="text-xl font-bold mb-4">Focus Tips</h3>
                <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>Eliminate distractions before starting a focus session</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>Take breaks seriously - they help maintain productivity</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>After 4 focus sessions, take a longer break (15-30 minutes)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>Use breaks to stretch, hydrate, or take a short walk</span>
                    </li>
                </ul>
            </motion.div>
        </div>
    );
}
