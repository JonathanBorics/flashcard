// LocalStorage kulcsok
const KNOWN_WORDS_KEY = "knownWords";
const UNKNOWN_WORDS_KEY = "unknownWords";
const SESSION_STATS_KEY = "sessionStats";

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
    if (!known.includes(word)) {
      known.push(word);
      localStorage.setItem(KNOWN_WORDS_KEY, JSON.stringify(known));
    }
    // Ha volt unknown-ban, töröljük
    removeUnknownWord(word);
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
    if (!unknown.includes(word)) {
      unknown.push(word);
      localStorage.setItem(UNKNOWN_WORDS_KEY, JSON.stringify(unknown));
    }
    // Ha volt known-ban, töröljük
    removeKnownWord(word);
  } catch (error) {
    console.error("Hiba a nem tudott szó mentésekor:", error);
  }
}

export function removeUnknownWord(word) {
  if (typeof window === "undefined") return;
  try {
    const unknown = getUnknownWords();
    const filtered = unknown.filter((w) => w !== word);
    localStorage.setItem(UNKNOWN_WORDS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Hiba a nem tudott szó törlésekor:", error);
  }
}

function removeKnownWord(word) {
  if (typeof window === "undefined") return;
  try {
    const known = getKnownWords();
    const filtered = known.filter((w) => w !== word);
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
// SESSION STATS
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
