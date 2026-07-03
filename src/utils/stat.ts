export function getCurrentRound(): "morning" | "afternoon" | null {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  const totalMinutes = hour * 60 + minute;

  // 09:30 = 9*60 + 30 = 570
  // 12:00 = 720
  if (totalMinutes >= 570 && totalMinutes < 720) return "morning";

  // 13:00 = 780
  // 16:00 = 960
  if (totalMinutes >= 780 && totalMinutes < 960) return "afternoon";

  return null;
}

export function getNextTramTime() {
  const now = new Date();
  const totalMinutes = now.getHours() * 60 + now.getMinutes();

  const MORNING_START = 9 * 60 + 30; // 09:30
  const MORNING_END = 12 * 60; // 12:00

  const AFTERNOON_START = 13 * 60; // 13:00
  const AFTERNOON_END = 16 * 60; // 16:00

  if (totalMinutes < MORNING_START) {
    return "09:30";
  }

  if (totalMinutes >= MORNING_START && totalMinutes < MORNING_END) {
    return "09:30";
  }

  if (totalMinutes >= MORNING_END && totalMinutes < AFTERNOON_START) {
    return "13:00";
  }

  if (totalMinutes >= AFTERNOON_START && totalMinutes < AFTERNOON_END) {
    return "13:00";
  }

  return "09:30";
}

export function getTodayDocId(): string | null {
  const round = getCurrentRound();
  if (!round) return null;

  const today = new Date().toISOString().split("T")[0];
  return `${today}_${round}`;
}
