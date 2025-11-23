'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
    id: string;
    email: string;
    name: string;
    preferences: {
        theme: string;
        notifications: boolean;
        focusDuration: number;
        breakDuration: number;
    };
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<any>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
    verifyMfaLogin: (userId: string, token: string) => Promise<void>;
    verifyEmail: (email: string, code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Check if verification is required (403 Forbidden)
                if (response.status === 403 && data.requiresVerification) {
                    toast.error('Please verify your email address');
                    router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
                    return;
                }
                throw new Error(data.error || 'Login failed');
            }

            // Check for MFA requirement
            if (data.mfaRequired) {
                return data; // Return data so UI can handle MFA flow
            }

            setUser(data.user);
            toast.success('Welcome back! 🚀');
            router.push('/dashboard');
            return data;
        } catch (error: any) {
            // Don't show error toast if we already handled the redirect
            if (error.message !== 'Login failed' && !error.message.includes('verify')) {
                toast.error(error.message || 'Login failed');
            }
            throw error;
        }
    };

    const verifyMfaLogin = async (userId: string, token: string) => {
        try {
            const response = await fetch('/api/auth/login/mfa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, token }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'MFA verification failed');
            }

            setUser(data.user);
            toast.success('Welcome back! 🚀');
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.message || 'MFA verification failed');
            throw error;
        }
    };

    const verifyEmail = async (email: string, code: string) => {
        try {
            const response = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Verification failed');
            }

            setUser(data.user);
            toast.success('Email verified successfully! 🎉');
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.message || 'Verification failed');
            throw error;
        }
    };

    const register = async (email: string, password: string, name: string) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            if (data.requiresVerification) {
                toast.success('Please check your email for verification code');
                router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
                return;
            }

            setUser(data.user);
            toast.success('Account created successfully! 🎉');
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.message || 'Registration failed');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            toast.success('Logged out successfully');
            router.push('/');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, verifyMfaLogin, verifyEmail }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
