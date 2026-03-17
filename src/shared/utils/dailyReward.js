const DAILY_REWARD_LAST_SHOWN_KEY = 'daily_reward_last_shown';

const getLocalDateKey = () => {
    const now = new Date();
    const yyyy = String(now.getFullYear());
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const shouldShowDailyReward = (dailyStreak) => {
    if (!dailyStreak) return false;
    const rewardGranted = Boolean(dailyStreak.reward_granted_today);
    if (rewardGranted) return false;
    const lastShown = localStorage.getItem(DAILY_REWARD_LAST_SHOWN_KEY);
    return lastShown !== getLocalDateKey();
};

const markDailyRewardShown = () => {
    localStorage.setItem(DAILY_REWARD_LAST_SHOWN_KEY, getLocalDateKey());
};

export { DAILY_REWARD_LAST_SHOWN_KEY, getLocalDateKey, shouldShowDailyReward, markDailyRewardShown };
