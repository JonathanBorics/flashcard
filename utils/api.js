// ====================================
// ÚJ SZÓTÁR RENDSZER - cefr_dictionary.json
// ====================================

// CEFR szintek
export const CEFR_LEVELS = {
  ALL: "all",
  A1: "A1",
  A2: "A2",
  B1: "B1",
  B2: "B2",
  C1: "C1",
  C2: "C2",
};

// Aktuális szint (LocalStorage)
export function getCurrentCEFRLevel() {
  if (typeof window === "undefined") return CEFR_LEVELS.ALL;
  return localStorage.getItem("cefrLevel") || CEFR_LEVELS.ALL;
}

export function setCurrentCEFRLevel(level) {
  if (typeof window === "undefined") return;
  localStorage.setItem("cefrLevel", level);
}

// ====================================
// SZÓTÁR BETÖLTÉS
// ====================================
let dictionary = null;

async function loadDictionary() {
  if (dictionary) return dictionary;

  try {
    const response = await fetch("/data/cefr_dictionary.json");
    if (!response.ok) throw new Error("Dictionary not found");

    dictionary = await response.json();
    console.log(`📚 Szótár betöltve: ${Object.keys(dictionary).length} szó`);
    return dictionary;
  } catch (error) {
    console.error("❌ Szótár betöltési hiba:", error);
    return {};
  }
}

// ====================================
// SZAVAK SZŰRÉSE CEFR SZERINT
// ====================================
function filterWordsByLevel(dict, level) {
  if (level === CEFR_LEVELS.ALL) {
    return Object.keys(dict);
  }

  // Csak azok a szavak, amelyeknek van adott szintű bejegyzése
  return Object.keys(dict).filter((word) => {
    const entries = dict[word];
    return entries.some((entry) => entry.cefr === level);
  });
}

// ====================================
// RANDOM SZÓ VÁLASZTÁS
// ====================================
export async function getRandomWord() {
  const dict = await loadDictionary();
  const level = getCurrentCEFRLevel();

  if (!dict || Object.keys(dict).length === 0) {
    throw new Error("Szótár nem elérhető");
  }

  // Szűrés CEFR szint szerint
  const availableWords = filterWordsByLevel(dict, level);

  if (availableWords.length === 0) {
    throw new Error(`Nincs szó a(z) ${level} szinten`);
  }

  // Random szó választása
  const randomIndex = Math.floor(Math.random() * availableWords.length);
  const selectedWord = availableWords[randomIndex];
  const wordData = dict[selectedWord];

  // Ha több bejegyzés van, válasszunk a megfelelő szintből
  let selectedEntry;
  if (level === CEFR_LEVELS.ALL) {
    // Random bejegyzés
    selectedEntry = wordData[Math.floor(Math.random() * wordData.length)];
  } else {
    // Adott szintű bejegyzés
    const matchingEntries = wordData.filter((e) => e.cefr === level);
    selectedEntry =
      matchingEntries[Math.floor(Math.random() * matchingEntries.length)];
  }

  return {
    english: selectedWord,
    hungarian: selectedEntry.meanings,
    pos: selectedEntry.pos,
    cefr: selectedEntry.cefr,
    source: "cefr_dictionary",
  };
}

// ====================================
// ÖSSZES SZÓ SZÁMA
// ====================================
export async function getTotalWordsCount() {
  const dict = await loadDictionary();
  const level = getCurrentCEFRLevel();

  if (!dict) return 0;

  const availableWords = filterWordsByLevel(dict, level);
  return availableWords.length;
}

export function getCEFRWordCount(level = CEFR_LEVELS.ALL) {
  // Becslés ha még nincs betöltve
  if (!dictionary) {
    if (level === CEFR_LEVELS.ALL) return 7035;

    // Becsült százalékok szintenként
    const estimates = {
      [CEFR_LEVELS.A1]: 1000,
      [CEFR_LEVELS.A2]: 1200,
      [CEFR_LEVELS.B1]: 1500,
      [CEFR_LEVELS.B2]: 1800,
      [CEFR_LEVELS.C1]: 1000,
      [CEFR_LEVELS.C2]: 535,
    };

    return estimates[level] || 1000;
  }

  const availableWords = filterWordsByLevel(dictionary, level);
  return availableWords.length;
}

// ====================================
// WORD LOOKUP (keresés szótárban)
// ====================================
export async function lookupWord(word) {
  const dict = await loadDictionary();
  const normalizedWord = word.toLowerCase().trim();

  if (dict[normalizedWord]) {
    return {
      found: true,
      word: normalizedWord,
      entries: dict[normalizedWord],
    };
  }

  return {
    found: false,
    word: normalizedWord,
    entries: [],
  };
}

// ====================================
// STATISTICS HELPER
// ====================================
export async function getStatsByLevel() {
  const dict = await loadDictionary();

  if (!dict) return {};

  const stats = {};

  Object.values(CEFR_LEVELS).forEach((level) => {
    if (level !== CEFR_LEVELS.ALL) {
      stats[level] = filterWordsByLevel(dict, level).length;
    }
  });

  return stats;
}

// ====================================
// CACHE (Már nincs rá szükség, de megtartjuk kompatibilitásért)
// ====================================
export function clearCache() {
  // Már nincs cache, de a függvény marad
  return 0;
}
