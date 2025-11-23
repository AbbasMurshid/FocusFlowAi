'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { EnvelopeIcon, LockClosedIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // MFA State
    const [showMfaInput, setShowMfaInput] = useState(false);
    const [mfaToken, setMfaToken] = useState('');
    const [tempUserId, setTempUserId] = useState('');

    const { login, verifyMfaLogin } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await login(email, password);
            if (data && data.mfaRequired) {
                setTempUserId(data.userId);
                setShowMfaInput(true);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
        }
    };

    const handleMfaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await verifyMfaLogin(tempUserId, mfaToken);
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl float-animation"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl float-animation" style={{ animationDelay: '1s' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card p-8 md:p-10">
                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                <SparklesIcon className="w-8 h-8" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold font-heading mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-400">Sign in to continue your productivity journey</p>
                    </div>

                    {/* Login Form */}
                    {!showMfaInput ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <EnvelopeIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full pl-12"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <LockClosedIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        className="w-full pl-12"
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Signing in...
                                    </span>
                                ) : (
                                    'Sign In'
                                )}
                            </motion.button>
                        </form>
                    ) : (
                        <form onSubmit={handleMfaSubmit} className="space-y-6">
                            <div className="text-center mb-6">
                                <p className="text-sm text-gray-400">Enter the 6-digit code from your authenticator app</p>
                            </div>
                            <div>
                                <label htmlFor="mfaToken" className="block text-sm font-medium mb-2">
                                    Authentication Code
                                </label>
                                <div className="relative">
                                    <LockClosedIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        id="mfaToken"
                                        type="text"
                                        value={mfaToken}
                                        onChange={(e) => setMfaToken(e.target.value)}
                                        placeholder="000000"
                                        required
                                        maxLength={6}
                                        className="w-full pl-12 text-center tracking-widest font-mono text-lg"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Verifying...
                                    </span>
                                ) : (
                                    'Verify Code'
                                )}
                            </motion.button>

                            <button
                                type="button"
                                onClick={() => setShowMfaInput(false)}
                                className="w-full text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Back to Login
                            </button>
                        </form>
                    )}

                    {/* Divider */}
                    <div className="my-8 flex items-center gap-4">
                        <div className="flex-1 h-px bg-white/10"></div>
                        <span className="text-sm text-gray-400">OR</span>
                        <div className="flex-1 h-px bg-white/10"></div>
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center text-gray-400">
                        Don't have an account?{' '}
                        <Link href="/auth/register" className="text-accent hover:text-accent/80 transition-colors font-medium">
                            Sign up for free
                        </Link>
                    </p>

                    {/* Back to Home */}
                    <div className="mt-6 text-center">
                        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                            ← Back to home
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
