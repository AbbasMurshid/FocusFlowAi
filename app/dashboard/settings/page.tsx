'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
    UserCircleIcon,
    AdjustmentsHorizontalIcon,
    ShieldCheckIcon,
    CloudArrowDownIcon,
    TrashIcon,
    ArrowPathIcon,
    MoonIcon,
    SunIcon,
    QrCodeIcon,
    CheckBadgeIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    // MFA State
    const [mfaSetup, setMfaSetup] = useState<{ secret: string; qrCodeUrl: string } | null>(null);
    const [mfaToken, setMfaToken] = useState('');
    const [showMfaSetup, setShowMfaSetup] = useState(false);

    // Confirmation Modals
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showDisableMfaConfirm, setShowDisableMfaConfirm] = useState(false);
    const [confirmInput, setConfirmInput] = useState('');

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                // Sync theme from DB if available
                if (data.user.preferences?.theme) {
                    setTheme(data.user.preferences.theme);
                }
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const updatePreferences = async (newPrefs: any) => {
        // If theme is being updated, update next-themes as well
        if (newPrefs.theme) {
            setTheme(newPrefs.theme);
        }

        try {
            const res = await fetch('/api/user/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ preferences: newPrefs }),
            });

            if (res.ok) {
                setUser({ ...user, preferences: { ...user.preferences, ...newPrefs } });
                toast.success('Settings saved');
            } else {
                throw new Error('Failed to update');
            }
        } catch (error) {
            toast.error('Failed to save settings');
        }
    };

    const handleMfaSetup = async () => {
        try {
            const res = await fetch('/api/auth/mfa/setup', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                setMfaSetup(data);
                setShowMfaSetup(true);
            } else {
                toast.error(data.error || 'Failed to setup MFA');
            }
        } catch (error) {
            toast.error('Error setting up MFA');
        }
    };

    const verifyMfa = async () => {
        try {
            const res = await fetch('/api/auth/mfa/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: mfaToken }),
            });

            if (res.ok) {
                toast.success('MFA Enabled Successfully!');
                setShowMfaSetup(false);
                setMfaSetup(null);
                setMfaToken('');
                fetchUserData(); // Refresh user to get updated mfaEnabled status
            } else {
                const data = await res.json();
                toast.error(data.error || 'Invalid token');
            }
        } catch (error) {
            toast.error('Verification failed');
        }
    };

    const handleDisableMfa = async () => {
        try {
            const res = await fetch('/api/user/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mfaEnabled: false }),
            });

            if (res.ok) {
                toast.success('MFA Disabled Successfully');
                setShowDisableMfaConfirm(false);
                fetchUserData();
            } else {
                toast.error('Failed to disable MFA');
            }
        } catch (error) {
            toast.error('Error disabling MFA');
        }
    };

    const handleExportData = async () => {
        try {
            const res = await fetch('/api/user/export');
            if (res.ok) {
                const data = await res.json();
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `focus-flow-data-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                toast.success('Data exported successfully');
            }
        } catch (error) {
            toast.error('Export failed');
        }
    };

    const handleDeleteAccount = async () => {
        if (confirmInput !== 'DELETE') return;
        try {
            const res = await fetch('/api/user/delete', { method: 'DELETE' });
            if (res.ok) {
                toast.success('Account deleted');
                window.location.href = '/';
            }
        } catch (error) {
            toast.error('Failed to delete account');
        }
    };

    const handleResetAccount = async () => {
        if (confirmInput !== 'RESET') return;
        try {
            const res = await fetch('/api/user/reset', { method: 'POST' });
            if (res.ok) {
                toast.success('Account reset successfully');
                setShowResetConfirm(false);
                setConfirmInput('');
            }
        } catch (error) {
            toast.error('Failed to reset account');
        }
    };

    const tabs = [
        { id: 'general', label: 'General', icon: UserCircleIcon },
        { id: 'focus', label: 'Focus Timer', icon: AdjustmentsHorizontalIcon },
        { id: 'security', label: 'Security', icon: ShieldCheckIcon },
        { id: 'data', label: 'Data & Privacy', icon: CloudArrowDownIcon },
    ];

    if (loading) return <div className="p-8 flex justify-center"><div className="loading-spinner" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">
                    <span className="gradient-text">Settings</span>
                </h1>
                <p className="text-gray-400 text-sm md:text-base">Manage your preferences and account</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="glass-card p-2 space-y-1 flex flex-row md:flex-col overflow-x-auto md:overflow-visible no-scrollbar">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-4 py-2 md:py-3 rounded-lg transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-primary/20 text-primary border border-primary/20'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium text-sm md:text-base">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            {/* GENERAL TAB */}
                            {activeTab === 'general' && (
                                <div className="glass-card p-5 md:p-8 space-y-6 md:space-y-8">
                                    <div>
                                        <h2 className="text-lg md:text-xl font-bold mb-4">Profile Information</h2>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1">Name</label>
                                                <input
                                                    type="text"
                                                    value={user?.name || ''}
                                                    disabled
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    value={user?.email || ''}
                                                    disabled
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/10 pt-6 md:pt-8">
                                        <h2 className="text-lg md:text-xl font-bold mb-4">Appearance</h2>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-white/5 gap-4">
                                            <div className="flex items-center gap-3">
                                                {theme === 'dark' ? (
                                                    <MoonIcon className="w-6 h-6 text-purple-400" />
                                                ) : (
                                                    <SunIcon className="w-6 h-6 text-yellow-400" />
                                                )}
                                                <div>
                                                    <p className="font-medium">Theme Mode</p>
                                                    <p className="text-sm text-gray-400">
                                                        Currently using {theme} mode
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => updatePreferences({ theme: theme === 'dark' ? 'light' : 'dark' })}
                                                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
                                            >
                                                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* FOCUS TAB */}
                            {activeTab === 'focus' && (
                                <div className="glass-card p-5 md:p-8 space-y-6 md:space-y-8">
                                    <div>
                                        <h2 className="text-lg md:text-xl font-bold mb-6">Timer Settings</h2>

                                        <div className="space-y-6">
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <label className="font-medium">Focus Duration</label>
                                                    <span className="text-primary">{user?.preferences?.focusDuration} min</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="5"
                                                    max="60"
                                                    step="5"
                                                    value={user?.preferences?.focusDuration || 25}
                                                    onChange={(e) => updatePreferences({ focusDuration: parseInt(e.target.value) })}
                                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                                />
                                                <p className="text-sm text-gray-400 mt-2">Length of your focus sessions</p>
                                            </div>

                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <label className="font-medium">Break Duration</label>
                                                    <span className="text-accent">{user?.preferences?.breakDuration} min</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="30"
                                                    step="1"
                                                    value={user?.preferences?.breakDuration || 5}
                                                    onChange={(e) => updatePreferences({ breakDuration: parseInt(e.target.value) })}
                                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                                                />
                                                <p className="text-sm text-gray-400 mt-2">Length of your short breaks</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SECURITY TAB */}
                            {activeTab === 'security' && (
                                <div className="glass-card p-5 md:p-8 space-y-6 md:space-y-8">
                                    {/* MFA Section */}
                                    <div>
                                        <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                                            <ShieldCheckIcon className="w-6 h-6 text-primary" />
                                            Two-Factor Authentication
                                        </h2>

                                        {user?.mfaEnabled ? (
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-green-500/10 border border-green-500/20 gap-4">
                                                <div className="flex items-center gap-3">
                                                    <CheckBadgeIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                                                    <div>
                                                        <p className="font-bold text-green-500">MFA is Enabled</p>
                                                        <p className="text-sm text-gray-400">Your account is secured with two-factor authentication.</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setShowDisableMfaConfirm(true)}
                                                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-sm font-medium"
                                                >
                                                    Disable
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <p className="text-gray-400 text-sm md:text-base">Add an extra layer of security to your account.</p>
                                                {!showMfaSetup ? (
                                                    <button
                                                        onClick={handleMfaSetup}
                                                        className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
                                                    >
                                                        <QrCodeIcon className="w-5 h-5" />
                                                        Setup MFA
                                                    </button>
                                                ) : (
                                                    <div className="p-4 md:p-6 rounded-xl bg-white/5 border border-white/10 space-y-6">
                                                        <div className="text-center">
                                                            <p className="mb-4 font-medium text-sm md:text-base">Scan this QR Code with your authenticator app</p>
                                                            {mfaSetup?.qrCodeUrl && (
                                                                <div className="bg-white p-2 rounded-lg inline-block">
                                                                    <Image
                                                                        src={mfaSetup.qrCodeUrl}
                                                                        alt="MFA QR Code"
                                                                        width={160}
                                                                        height={160}
                                                                    />
                                                                </div>
                                                            )}
                                                            <p className="mt-4 text-xs md:text-sm text-gray-400 font-mono bg-black/30 p-2 rounded break-all">
                                                                Secret: {mfaSetup?.secret}
                                                            </p>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-sm">Enter 6-digit code</label>
                                                            <div className="flex flex-col sm:flex-row gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={mfaToken}
                                                                    onChange={(e) => setMfaToken(e.target.value)}
                                                                    placeholder="000000"
                                                                    className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-center tracking-widest font-mono text-lg"
                                                                    maxLength={6}
                                                                />
                                                                <button
                                                                    onClick={verifyMfa}
                                                                    className="btn-primary w-full sm:w-auto"
                                                                >
                                                                    Verify
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Delete Account Section */}
                                    <div className="border-t border-white/10 pt-6 md:pt-8">
                                        <h2 className="text-lg md:text-xl font-bold mb-4 text-red-500 flex items-center gap-2">
                                            <ExclamationTriangleIcon className="w-6 h-6" />
                                            Danger Zone
                                        </h2>

                                        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div>
                                                <p className="font-bold text-red-400">Delete Account</p>
                                                <p className="text-sm text-gray-400">Permanently remove your account and all data.</p>
                                            </div>
                                            <button
                                                onClick={() => setShowDeleteConfirm(true)}
                                                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* DATA TAB */}
                            {activeTab === 'data' && (
                                <div className="glass-card p-5 md:p-8 space-y-6 md:space-y-8">
                                    <div>
                                        <h2 className="text-lg md:text-xl font-bold mb-4">Data Management</h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors">
                                                <CloudArrowDownIcon className="w-8 h-8 text-primary mb-4" />
                                                <h3 className="font-bold mb-2">Export Data</h3>
                                                <p className="text-sm text-gray-400 mb-4">
                                                    Download a copy of all your tasks, notes, and activity history in JSON format.
                                                </p>
                                                <button
                                                    onClick={handleExportData}
                                                    className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                                >
                                                    Download JSON
                                                </button>
                                            </div>

                                            <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/50 transition-colors">
                                                <ArrowPathIcon className="w-8 h-8 text-red-400 mb-4" />
                                                <h3 className="font-bold mb-2">Reset Account</h3>
                                                <p className="text-sm text-gray-400 mb-4">
                                                    Clear all your data (tasks, notes, stats) but keep your account active.
                                                </p>
                                                <button
                                                    onClick={() => setShowResetConfirm(true)}
                                                    className="w-full py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                                                >
                                                    Reset Data
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Confirmation Modals */}
            {(showDeleteConfirm || showResetConfirm || showDisableMfaConfirm) && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0f1115] border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl"
                    >
                        <h3 className="text-xl md:text-2xl font-bold mb-4 text-red-500">
                            {showDeleteConfirm ? 'Delete Account?' : showResetConfirm ? 'Reset Account Data?' : 'Disable MFA?'}
                        </h3>
                        <p className="text-gray-400 mb-6 text-sm md:text-base">
                            {showDeleteConfirm
                                ? 'This action cannot be undone. This will permanently delete your account and remove all your data from our servers.'
                                : showResetConfirm
                                    ? 'This will delete all your tasks, notes, goals, and history. Your account will remain active but start fresh.'
                                    : 'Are you sure you want to disable Two-Factor Authentication? Your account will be less secure.'
                            }
                        </p>

                        <div className="space-y-4">
                            {(showDeleteConfirm || showResetConfirm) && (
                                <div>
                                    <label className="block text-sm mb-2">
                                        Type <span className="font-mono font-bold text-white">{showDeleteConfirm ? 'DELETE' : 'RESET'}</span> to confirm
                                    </label>
                                    <input
                                        type="text"
                                        value={confirmInput}
                                        onChange={(e) => setConfirmInput(e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2"
                                        placeholder={showDeleteConfirm ? 'DELETE' : 'RESET'}
                                    />
                                </div>
                            )}

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setShowResetConfirm(false);
                                        setShowDisableMfaConfirm(false);
                                        setConfirmInput('');
                                    }}
                                    className="px-4 py-2 rounded-lg hover:bg-white/10 text-sm md:text-base"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={
                                        showDeleteConfirm ? handleDeleteAccount :
                                            showResetConfirm ? handleResetAccount :
                                                handleDisableMfa
                                    }
                                    disabled={(showDeleteConfirm || showResetConfirm) && confirmInput !== (showDeleteConfirm ? 'DELETE' : 'RESET')}
                                    className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm md:text-base"
                                >
                                    Confirm {showDeleteConfirm ? 'Delete' : showResetConfirm ? 'Reset' : 'Disable'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
