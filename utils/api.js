// Szó források konfigurációja
export const WORD_SOURCES = {
  FREQUENCY: "frequency", // CSV - 172k szó gyakoriság szerint
  CEFR: "cefr", // CSV - 7989 szó, CEFR szintekkel
};

// Aktuális forrás (LocalStorage-ból)
export function getCurrentSource() {
  if (typeof window === "undefined") return WORD_SOURCES.FREQUENCY;
  return localStorage.getItem("wordSource") || WORD_SOURCES.FREQUENCY;
}

export function setCurrentSource(source) {
  if (typeof window === "undefined") return;
  localStorage.setItem("wordSource", source);
}

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

export function getCurrentCEFRLevel() {
  if (typeof window === "undefined") return CEFR_LEVELS.ALL;
  return localStorage.getItem("cefrLevel") || CEFR_LEVELS.ALL;
}

export function setCurrentCEFRLevel(level) {
  if (typeof window === "undefined") return;
  localStorage.setItem("cefrLevel", level);
}

// Frequency szintek
export const FREQUENCY_LEVELS = {
  TOP_1K: "1000",
  TOP_10K: "10000",
  TOP_50K: "50000",
  ALL: "all",
};

export function getCurrentFrequencyLevel() {
  if (typeof window === "undefined") return FREQUENCY_LEVELS.TOP_10K;
  return localStorage.getItem("frequencyLevel") || FREQUENCY_LEVELS.TOP_10K;
}

export function setCurrentFrequencyLevel(level) {
  if (typeof window === "undefined") return;
  localStorage.setItem("frequencyLevel", level);
}

// ====================================
// FREQUENCY CSV FUNCTIONS (172k szó)
// ====================================
let frequencyData = null;
async function loadFrequency() {
  if (frequencyData) return frequencyData;
  try {
    const response = await fetch("/data/valid_words_sorted_by_frequency.csv");
    const csvText = await response.text();
    const lines = csvText.split("\n").slice(1);
    frequencyData = lines
      .map((line) => {
        const parts = line.split(",");
        if (parts.length < 3) return null;
        const rank = parseInt(parts[0]?.trim());
        const word = parts[1]?.trim();
        const frequency = parseInt(parts[2]?.trim());
        if (!word || isNaN(rank)) return null;
        return { rank, word, frequency: frequency || 0 };
      })
      .filter((item) => item && item.word);
    console.log(`📊 Frequency betöltve: ${frequencyData.length} szó`);
    return frequencyData;
  } catch (error) {
    console.error("❌ Frequency betöltési hiba:", error);
    return [];
  }
}

export async function getRandomFrequencyWord(level = FREQUENCY_LEVELS.TOP_10K) {
  await loadFrequency();
  if (!frequencyData || frequencyData.length === 0) {
    throw new Error("Frequency lista nem elérhető");
  }
  let filteredWords = frequencyData;
  if (level !== FREQUENCY_LEVELS.ALL) {
    const maxRank = parseInt(level);
    filteredWords = frequencyData.filter((item) => item.rank <= maxRank);
  }
  if (filteredWords.length === 0) {
    throw new Error(`Nincs szó a(z) ${level} szinten`);
  }
  const randomIndex = Math.floor(Math.random() * filteredWords.length);
  const wordData = filteredWords[randomIndex];
  return {
    english: wordData.word,
    rank: wordData.rank,
    frequency: wordData.frequency,
    source: "frequency",
  };
}

export function getFrequencyWordCount(level = FREQUENCY_LEVELS.TOP_10K) {
  if (!frequencyData) {
    switch (level) {
      case FREQUENCY_LEVELS.TOP_1K:
        return 1000;
      case FREQUENCY_LEVELS.TOP_10K:
        return 10000;
      case FREQUENCY_LEVELS.TOP_50K:
        return 50000;
      case FREQUENCY_LEVELS.ALL:
        return 172000;
      default:
        return 10000;
    }
  }
  if (level === FREQUENCY_LEVELS.ALL) {
    return frequencyData.length;
  }
  const maxRank = parseInt(level);
  return frequencyData.filter((item) => item.rank <= maxRank).length;
}

// ====================================
// CSV CEFR FUNCTIONS (7989 szó)
// ====================================
let cefrData = null;
async function loadCEFR() {
  if (cefrData) return cefrData;
  try {
    const response = await fetch("/data/word_list_cefr.csv");
    const csvText = await response.text();
    const lines = csvText.split("\n").slice(1);
    cefrData = lines
      .map((line) => {
        const parts = line.split(";");
        if (parts.length < 3) return null;
        return {
          word: parts[0]?.trim(),
          pos: parts[1]?.trim(),
          cefr: parts[2]?.trim(),
        };
      })
      .filter((item) => item && item.word && item.cefr);
    console.log(`📚 CEFR betöltve: ${cefrData.length} szó`);
    return cefrData;
  } catch (error) {
    console.error("❌ CEFR betöltési hiba:", error);
    return [];
  }
}

export async function getRandomCEFRWord(level = CEFR_LEVELS.ALL) {
  await loadCEFR();
  if (!cefrData || cefrData.length === 0) {
    throw new Error("CEFR lista nem elérhető");
  }
  let filteredWords = cefrData;
  if (level !== CEFR_LEVELS.ALL) {
    filteredWords = cefrData.filter((item) => item.cefr === level);
  }
  if (filteredWords.length === 0) {
    throw new Error(`Nincs szó a(z) ${level} szinten`);
  }
  const randomIndex = Math.floor(Math.random() * filteredWords.length);
  const wordData = filteredWords[randomIndex];
  return {
    english: wordData.word,
    pos: wordData.pos,
    cefr: wordData.cefr,
    source: "cefr",
  };
}

export function getCEFRWordCount(level = CEFR_LEVELS.ALL) {
  if (!cefrData) return 7989;
  if (level === CEFR_LEVELS.ALL) {
    return cefrData.length;
  }
  return cefrData.filter((item) => item.cefr === level).length;
}

// ====================================
// MAGYAR FORDÍTÁS (a belső API-val) - JAVÍTOTT RÉSZ
// ====================================
export async function translateWord(englishWord) {
  console.log(`🔍 Fordítás kérése a belső API-tól: ${englishWord}`);
  try {
    const response = await fetch(
      `/api/translate?word=${encodeURIComponent(englishWord)}`
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API hiba: ${response.statusText}`);
    }
    const data = await response.json();
    const hungarianMeanings = data.translation;
    if (!hungarianMeanings || hungarianMeanings.length === 0) {
      return ["Nincs fordítás"];
    }
    console.log(`✅ Sikeres fordítás:`, hungarianMeanings);
    return hungarianMeanings;
  } catch (error) {
    console.error("❌ Hiba a belső fordítási API hívásakor:", error);
    return ["Fordítási hiba"];
  }
}

// ====================================
// UNIFIED API - Automatikus forrás választás
// ====================================
export async function getRandomWord() {
  const source = getCurrentSource();
  const cefrLevel = getCurrentCEFRLevel();
  const frequencyLevel = getCurrentFrequencyLevel();
  console.log("🎲 Random szó kérés:", { source, cefrLevel, frequencyLevel });
  let wordData;
  if (source === WORD_SOURCES.FREQUENCY) {
    wordData = await getRandomFrequencyWord(frequencyLevel);
  } else {
    wordData = await getRandomCEFRWord(cefrLevel);
  }
  console.log("📝 Angol szó:", wordData.english);
  const cached = getCachedTranslation(wordData.english);
  if (cached) {
    console.log("📦 Cache találat!");
    return {
      ...wordData,
      hungarian: cached.hungarian,
      cached: true,
    };
  }
  console.log("🌐 Nincs cache, API fordítás szükséges...");
  const hungarian = await translateWord(wordData.english);
  const result = {
    ...wordData,
    hungarian,
    cached: false,
  };
  console.log("💾 Cache mentés:", wordData.english);
  setCachedTranslation(wordData.english, result);
  console.log("🎉 Teljes eredmény:", result);
  return result;
}

export function getTotalWordsCount() {
  const source = getCurrentSource();
  const cefrLevel = getCurrentCEFRLevel();
  const frequencyLevel = getCurrentFrequencyLevel();
  if (source === WORD_SOURCES.FREQUENCY) {
    return getFrequencyWordCount(frequencyLevel);
  } else {
    return getCEFRWordCount(cefrLevel);
  }
}

// ====================================
// CACHE FUNCTIONS
// ====================================
export function getCachedTranslation(word) {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem(`translation_${word}`);
    if (cached) {
      const data = JSON.parse(cached);
      const cacheAge = Date.now() - data.timestamp;
      if (cacheAge < 7 * 24 * 60 * 60 * 1000) {
        return data.translation;
      }
    }
  } catch (error) {
    console.error("Cache read error:", error);
  }
  return null;
}

export function setCachedTranslation(word, translation) {
  if (typeof window === "undefined") return;
  try {
    const cacheData = {
      translation,
      timestamp: Date.now(),
    };
    localStorage.setItem(`translation_${word}`, JSON.stringify(cacheData));
  } catch (error) {
    console.error("Cache write error:", error);
  }
}

export function clearCache() {
  if (typeof window === "undefined") return 0;
  try {
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith("translation_")
    );
    keys.forEach((key) => localStorage.removeItem(key));
    return keys.length;
  } catch (error) {
    console.error("Cache clear error:", error);
    return 0;
  }
}
