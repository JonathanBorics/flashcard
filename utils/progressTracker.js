// LocalStorage kulcsok
const KNOWN_WORDS_KEY = "knownWords";
const UNKNOWN_WORDS_KEY = "unknownWords";
const SESSION_STATS_KEY = "sessionStats";
const GAME_STATE_KEY = "gameState"; // ÚJ!

// ====================================
// TUDOTT SZAVAK
// ====================================
export function getKnownWords() {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(KNOWN_WORDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addKnownWord(word) {
  if (typeof window === "undefined") return;
  try {
    const known = getKnownWords();
    const normalizedWord = word.toLowerCase().trim();

    if (!known.includes(normalizedWord)) {
      known.push(normalizedWord);
      localStorage.setItem(KNOWN_WORDS_KEY, JSON.stringify(known));
    }
    // Ha volt unknown-ban, töröljük
    removeUnknownWord(normalizedWord);
  } catch (error) {
    console.error("Hiba a tudott szó mentésekor:", error);
  }
}

export function clearKnownWords() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KNOWN_WORDS_KEY);
}

// ====================================
// NEM TUDOTT SZAVAK
// ====================================
export function getUnknownWords() {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(UNKNOWN_WORDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addUnknownWord(word) {
  if (typeof window === "undefined") return;
  try {
    const unknown = getUnknownWords();
    const normalizedWord = word.toLowerCase().trim();

    if (!unknown.includes(normalizedWord)) {
      unknown.push(normalizedWord);
      localStorage.setItem(UNKNOWN_WORDS_KEY, JSON.stringify(unknown));
    }
    // Ha volt known-ban, töröljük
    removeKnownWord(normalizedWord);
  } catch (error) {
    console.error("Hiba a nem tudott szó mentésekor:", error);
  }
}

export function removeUnknownWord(word) {
  if (typeof window === "undefined") return;
  try {
    const unknown = getUnknownWords();
    const normalizedWord = word.toLowerCase().trim();
    const filtered = unknown.filter((w) => w !== normalizedWord);
    localStorage.setItem(UNKNOWN_WORDS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Hiba a nem tudott szó törlésekor:", error);
  }
}

function removeKnownWord(word) {
  if (typeof window === "undefined") return;
  try {
    const known = getKnownWords();
    const normalizedWord = word.toLowerCase().trim();
    const filtered = known.filter((w) => w !== normalizedWord);
    localStorage.setItem(KNOWN_WORDS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Hiba a tudott szó törlésekor:", error);
  }
}

export function clearUnknownWords() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(UNKNOWN_WORDS_KEY);
}

// ====================================
// SESSION STATS (Nem nullázódik!)
// ====================================
export function getSessionStats() {
  if (typeof window === "undefined")
    return { correct: 0, incorrect: 0, total: 0 };
  try {
    const data = localStorage.getItem(SESSION_STATS_KEY);
    return data ? JSON.parse(data) : { correct: 0, incorrect: 0, total: 0 };
  } catch {
    return { correct: 0, incorrect: 0, total: 0 };
  }
}

export function updateSessionStats(isCorrect) {
  if (typeof window === "undefined") return;
  try {
    const stats = getSessionStats();
    stats.total += 1;
    if (isCorrect) {
      stats.correct += 1;
    } else {
      stats.incorrect += 1;
    }
    localStorage.setItem(SESSION_STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error("Hiba a session stats mentésekor:", error);
  }
}

export function resetSessionStats() {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    SESSION_STATS_KEY,
    JSON.stringify({ correct: 0, incorrect: 0, total: 0 })
  );
}

// ====================================
// 🆕 GAME STATE MENTÉS
// ====================================
export function saveGameState(state) {
  if (typeof window === "undefined") return;
  try {
    const gameState = {
      ...state,
      timestamp: Date.now(),
    };
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
  } catch (error) {
    console.error("Hiba a játékállás mentésekor:", error);
  }
}

export function getGameState() {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(GAME_STATE_KEY);
    if (!data) return null;

    const state = JSON.parse(data);

    // Ellenőrizzük hogy nem túl régi-e (24 óra)
    const age = Date.now() - state.timestamp;
    if (age > 24 * 60 * 60 * 1000) {
      clearGameState();
      return null;
    }

    return state;
  } catch {
    return null;
  }
}

export function clearGameState() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GAME_STATE_KEY);
}

export function hasGameInProgress() {
  const state = getGameState();
  return state !== null;
}

// ====================================
// STATISZTIKA SZÁMÍTÁS
// ====================================
export function calculateProgress(totalWords, source, level) {
  const knownWords = getKnownWords();
  const unknownWords = getUnknownWords();

  const knownCount = knownWords.length;
  const unknownCount = unknownWords.length;
  const reviewedCount = knownCount + unknownCount;

  const percentage =
    totalWords > 0 ? ((knownCount / totalWords) * 100).toFixed(1) : 0;

  return {
    knownCount,
    unknownCount,
    reviewedCount,
    totalWords,
    percentage,
    source,
    level,
  };
}

// ====================================
// 🆕 STREAK TRACKING
// ====================================
const STREAK_KEY = "dailyStreak";

export function updateStreak() {
  if (typeof window === "undefined") return;

  try {
    const today = new Date().toDateString();
    const streakData = localStorage.getItem(STREAK_KEY);

    if (!streakData) {
      // Első alkalom
      localStorage.setItem(
        STREAK_KEY,
        JSON.stringify({
          count: 1,
          lastDate: today,
        })
      );
      return 1;
    }

    const { count, lastDate } = JSON.parse(streakData);

    if (lastDate === today) {
      // Ma már játszott
      return count;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastDate === yesterday.toDateString()) {
      // Folytatódik a streak
      const newCount = count + 1;
      localStorage.setItem(
        STREAK_KEY,
        JSON.stringify({
          count: newCount,
          lastDate: today,
        })
      );
      return newCount;
    }

    // Megszakadt a streak
    localStorage.setItem(
      STREAK_KEY,
      JSON.stringify({
        count: 1,
        lastDate: today,
      })
    );
    return 1;
  } catch (error) {
    console.error("Streak frissítési hiba:", error);
    return 0;
  }
}

export function getStreak() {
  if (typeof window === "undefined") return 0;

  try {
    const streakData = localStorage.getItem(STREAK_KEY);
    if (!streakData) return 0;

    const { count, lastDate } = JSON.parse(streakData);
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Ha ma vagy tegnap volt, érvényes
    if (lastDate === today || lastDate === yesterday.toDateString()) {
      return count;
    }

    // Megszakadt
    return 0;
  } catch {
    return 0;
  }
}
