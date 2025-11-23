# Fix script to replace malformed backtick escapes
$content = Get-Content "app\dashboard\tasks\page.tsx" -Raw
# Remove the malformed line and replace with correct JSX
$content = $content -replace '\</AnimatePresence\>`r`n`r`n.*?`r`n\}', @"
</AnimatePresence>

            {/* Streak Celebration Popup */}
            <StreakCelebration 
                show={showCelebration}
                streakCount={celebrationStreak}
                onClose={closeCelebration}
            />
        </div>
    );
}
"@
Set-Content "app\dashboard\tasks\page.tsx" $content -NoNewline
Write-Host "Fixed tasks page!"
