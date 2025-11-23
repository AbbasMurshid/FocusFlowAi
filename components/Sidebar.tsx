'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
    SparklesIcon,
    Squares2X2Icon,
    ListBulletIcon,
    DocumentTextIcon,
    FireIcon,
    ChartBarIcon,
    ClockIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon,
} from '@heroicons/react/24/outline';

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const menuItems = [
        { name: 'Dashboard', href: '/dashboard', icon: Squares2X2Icon },
        { name: 'Tasks', href: '/dashboard/tasks', icon: ListBulletIcon },
        { name: 'Focus Timer', href: '/dashboard/focus', icon: ClockIcon },
        { name: 'Notes', href: '/dashboard/notes', icon: DocumentTextIcon },
        { name: 'Goals', href: '/dashboard/goals', icon: FireIcon },
        { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
        { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
    ];

    return (
        <aside className="w-64 glass-card m-4 p-6 flex flex-col h-[calc(100vh-2rem)]">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <SparklesIcon className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold font-heading">FocusFlow AI</span>
            </Link>

            {/* User Info */}
            <div className="glass-card p-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link key={item.name} href={item.href}>
                            <motion.div
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-gradient-to-r from-primary to-accent text-white'
                                    : 'hover:bg-white/5'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.name}</span>
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-all mt-4"
            >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="font-medium">Logout</span>
            </motion.button>
        </aside>
    );
}
