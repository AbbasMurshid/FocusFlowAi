// Utility functions for streak calculations

export interface StreakData {
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: string | null;
}

/**
 * Calculate streak from task completion dates
 * @param tasks Array of tasks with completion dates
 * @returns Streak data including current and longest streak
 */
export function calculateStreaks(tasks: any[]): StreakData {
    const completedTasks = tasks.filter((t: any) => t.status === 'completed' && t.updatedAt);

    if (completedTasks.length === 0) {
        return { currentStreak: 0, longestStreak: 0, lastActivityDate: null };
    }

    // Sort tasks by completion date (newest first)
    const sortedTasks = [...completedTasks].sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    // Get unique dates (YYYY-MM-DD format)
    const uniqueDates = Array.from(new Set(
        sortedTasks.map(t => new Date(t.updatedAt).toISOString().split('T')[0])
    )).sort().reverse(); // Most recent first

    if (uniqueDates.length === 0) {
        return { currentStreak: 0, longestStreak: 0, lastActivityDate: null };
    }

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Calculate current streak
    let currentStreak = 0;
    const latestDate = uniqueDates[0];

    // Check if streak is still active (completed today or yesterday)
    if (latestDate === today || latestDate === yesterday) {
        currentStreak = 1;
        let checkDate = new Date(latestDate);

        for (let i = 1; i < uniqueDates.length; i++) {
            const prevDate = new Date(uniqueDates[i]);
            const dayDiff = Math.floor((checkDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

            if (dayDiff === 1) {
                currentStreak++;
                checkDate = prevDate;
            } else {
                break;
            }
        }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 0; i < uniqueDates.length - 1; i++) {
        const currentDate = new Date(uniqueDates[i]);
        const nextDate = new Date(uniqueDates[i + 1]);
        const dayDiff = Math.floor((currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));

        if (dayDiff === 1) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
        }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return {
        currentStreak,
        longestStreak,
        lastActivityDate: latestDate
    };
}

/**
 * Get streak status label
 */
export function getStreakStatus(streak: number): string {
    if (streak === 0) return 'Start your streak!';
    if (streak === 1) return 'Keep it up!';
    if (streak < 7) return 'Building momentum! 🔥';
    if (streak < 30) return 'On fire! 🔥🔥';
    if (streak < 100) return 'Unstoppable! 🔥🔥🔥';
    return 'Legendary! 🏆';
}

/**
 * Get streak icon/emoji
 */
export function getStreakIcon(streak: number): string {
    if (streak === 0) return '📅';
    if (streak < 7) return '🔥';
    if (streak < 30) return '🔥🔥';
    if (streak < 100) return '🔥🔥🔥';
    return '🏆';
}
