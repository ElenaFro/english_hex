const shouldShowDailyReward = (dailyStreak) => {
    if (!dailyStreak) return false;
    const rewardGranted = Boolean(dailyStreak.reward_granted_today);
    const visitedToday = Boolean(dailyStreak.visited_today);
    if (rewardGranted) return false;
    return !visitedToday;
};

export { shouldShowDailyReward };
