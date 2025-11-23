'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
    SparklesIcon,
    RocketLaunchIcon,
    BoltIcon,
    ChartBarIcon,
    ClockIcon,
    LightBulbIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    const features = [
        {
            icon: <SparklesIcon className="w-8 h-8" />,
            title: 'AI Task Planner',
            description: 'Intelligent task prioritization and scheduling with GPT-powered insights',
        },
        {
            icon: <ClockIcon className="w-8 h-8" />,
            title: 'Smart Focus Timer',
            description: 'Pomodoro technique enhanced with AI-driven break recommendations',
        },
        {
            icon: <ChartBarIcon className="w-8 h-8" />,
            title: 'Goal Tracking',
            description: 'Visual progress tracking with milestone management and analytics',
        },
        {
            icon: <LightBulbIcon className="w-8 h-8" />,
            title: 'AI Coaching',
            description: 'Personalized productivity tips and motivational guidance',
        },
        {
            icon: <BoltIcon className="w-8 h-8" />,
            title: 'Auto Scheduling',
            description: 'Generate optimized daily schedules based on your tasks and energy',
        },
        {
            icon: <RocketLaunchIcon className="w-8 h-8" />,
            title: 'Smart Notes',
            description: 'AI-powered note summarization and key insight extraction',
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="pulse-animation">
                    <SparklesIcon className="w-16 h-16 text-primary" />
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl float-animation"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl float-animation" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex justify-center mb-6">
                            <div className="glass-card px-6 py-3 inline-flex items-center gap-2">
                                <SparklesIcon className="w-5 h-5 text-accent" />
                                <span className="text-sm font-medium">AI-Powered Productivity</span>
                            </div>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold font-heading mb-6">
                            Welcome to <br />
                            <span className="gradient-text">FocusFlow AI</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
                            Transform your productivity with AI-powered task planning, smart scheduling,
                            and intelligent focus tracking. Work smarter, not harder.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => router.push('/auth/register')}
                                className="btn-primary text-lg px-8 py-4"
                            >
                                Get Started Free
                                <RocketLaunchIcon className="w-6 h-6 inline-block ml-2" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => router.push('/auth/login')}
                                className="btn-secondary text-lg px-8 py-4"
                            >
                                Sign In
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
                            Supercharge Your <span className="gradient-text">Productivity</span>
                        </h2>
                        <p className="text-xl text-gray-300">
                            Powered by cutting-edge AI technology
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.02 }}
                                className="glass-card p-8 card-hover cursor-pointer"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-300">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto glass-card p-12 text-center"
                >
                    <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
                        Ready to <span className="gradient-text">Transform</span> Your Workflow?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Join thousands of productive users who trust FocusFlow AI
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push('/auth/register')}
                        className="btn-primary text-lg px-10 py-5"
                    >
                        Start Your Free Journey
                        <SparklesIcon className="w-6 h-6 inline-block ml-2" />
                    </motion.button>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-white/10">
                <div className="max-w-7xl mx-auto text-center text-gray-400">
                    <p>&copy; 2025 FocusFlow AI. Powered by Groq & LLaMA 3.1</p>
                </div>
            </footer>
        </main>
    );
}
