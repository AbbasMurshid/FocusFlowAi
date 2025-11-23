import { useState, useEffect } from 'react';
import { calculateStreaks } from './streaks';

/**
 * Hook to manage streak celebration logic
 * Automatically detects when streak increases and triggers celebration
 */
export function useStreakCelebration(tasks: any[]) {
    const [showCelebration, setShowCelebration] = useState(false);
    const [celebrationStreak, setCelebrationStreak] = useState(0);

    useEffect(() => {
        if (tasks.length === 0) return;

        const streakData = calculateStreaks(tasks);
        const currentStreak = streakData.currentStreak;

        // Get previous streak from localStorage
        const previousStreak = parseInt(localStorage.getItem('userStreak') || '0');

        // Check if streak increased
        if (currentStreak > previousStreak && currentStreak > 0) {
            // Trigger celebration!
            setCelebrationStreak(currentStreak);
            setShowCelebration(true);
        }

        // Update stored streak
        localStorage.setItem('userStreak', currentStreak.toString());
    }, [tasks]);

    const closeCelebration = () => setShowCelebration(false);

    return {
        showCelebration,
        celebrationStreak,
        closeCelebration,
    };
}
