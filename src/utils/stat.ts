export function getCurrentRound(): "morning" | "afternoon" | null {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 9 && hour < 12) return "morning";
  if (hour >= 13 && hour < 16) return "afternoon";
  return null;
}

export function getTodayDocId(): string | null {
  const round = getCurrentRound();
  if (!round) return null;

  const today = new Date().toISOString().split("T")[0];
  return `${today}_${round}`;
}
