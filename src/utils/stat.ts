export function getCurrentRound(): "morning" | "afternoon" | null {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  const totalMinutes = hour * 60 + minute;

  // 09:30 = 9*60 + 30 = 570
  // 12:00 = 720
  if (totalMinutes >= 570 && totalMinutes < 720) return "morning";

  // 13:30 = 810
  // 16:30 = 990
  if (totalMinutes >= 810 && totalMinutes < 990) return "afternoon";

  return null;
}

// Service window shown to riders: the current round, or the next one if between rounds.
export function getNextTramTime(): { start: string; end: string } {
  const now = new Date();
  const totalMinutes = now.getHours() * 60 + now.getMinutes();

  const MORNING = { start: "09:30", end: "12:00" };
  const AFTERNOON = { start: "13:30", end: "16:30" };

  // Morning round ends 12:00; afterwards show the afternoon round until 16:30.
  if (totalMinutes >= 12 * 60 && totalMinutes < 16 * 60 + 30) return AFTERNOON;
  return MORNING;
}

export function getTodayDocId(): string | null {
  const round = getCurrentRound();
  if (!round) return null;

  const today = new Date().toISOString().split("T")[0];
  return `${today}_${round}`;
}
