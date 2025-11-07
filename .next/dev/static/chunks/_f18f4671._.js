(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/utils/api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Szó források konfigurációja
__turbopack_context__.s([
    "CEFR_LEVELS",
    ()=>CEFR_LEVELS,
    "FREQUENCY_LEVELS",
    ()=>FREQUENCY_LEVELS,
    "WORD_SOURCES",
    ()=>WORD_SOURCES,
    "clearCache",
    ()=>clearCache,
    "getCEFRWordCount",
    ()=>getCEFRWordCount,
    "getCachedTranslation",
    ()=>getCachedTranslation,
    "getCurrentCEFRLevel",
    ()=>getCurrentCEFRLevel,
    "getCurrentFrequencyLevel",
    ()=>getCurrentFrequencyLevel,
    "getCurrentSource",
    ()=>getCurrentSource,
    "getFrequencyWordCount",
    ()=>getFrequencyWordCount,
    "getRandomCEFRWord",
    ()=>getRandomCEFRWord,
    "getRandomFrequencyWord",
    ()=>getRandomFrequencyWord,
    "getRandomWord",
    ()=>getRandomWord,
    "getTotalWordsCount",
    ()=>getTotalWordsCount,
    "setCachedTranslation",
    ()=>setCachedTranslation,
    "setCurrentCEFRLevel",
    ()=>setCurrentCEFRLevel,
    "setCurrentFrequencyLevel",
    ()=>setCurrentFrequencyLevel,
    "setCurrentSource",
    ()=>setCurrentSource,
    "translateWord",
    ()=>translateWord
]);
const WORD_SOURCES = {
    FREQUENCY: "frequency",
    CEFR: "cefr"
};
function getCurrentSource() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return localStorage.getItem("wordSource") || WORD_SOURCES.FREQUENCY;
}
function setCurrentSource(source) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    localStorage.setItem("wordSource", source);
}
const CEFR_LEVELS = {
    ALL: "all",
    A1: "A1",
    A2: "A2",
    B1: "B1",
    B2: "B2",
    C1: "C1",
    C2: "C2"
};
function getCurrentCEFRLevel() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return localStorage.getItem("cefrLevel") || CEFR_LEVELS.ALL;
}
function setCurrentCEFRLevel(level) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    localStorage.setItem("cefrLevel", level);
}
const FREQUENCY_LEVELS = {
    TOP_1K: "1000",
    TOP_10K: "10000",
    TOP_50K: "50000",
    ALL: "all"
};
function getCurrentFrequencyLevel() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return localStorage.getItem("frequencyLevel") || FREQUENCY_LEVELS.TOP_10K;
}
function setCurrentFrequencyLevel(level) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
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
        frequencyData = lines.map((line)=>{
            const parts = line.split(",");
            if (parts.length < 3) return null;
            const rank = parseInt(parts[0]?.trim());
            const word = parts[1]?.trim();
            const frequency = parseInt(parts[2]?.trim());
            if (!word || isNaN(rank)) return null;
            return {
                rank,
                word,
                frequency: frequency || 0
            };
        }).filter((item)=>item && item.word);
        console.log(`📊 Frequency betöltve: ${frequencyData.length} szó`);
        return frequencyData;
    } catch (error) {
        console.error("❌ Frequency betöltési hiba:", error);
        return [];
    }
}
async function getRandomFrequencyWord(level = FREQUENCY_LEVELS.TOP_10K) {
    await loadFrequency();
    if (!frequencyData || frequencyData.length === 0) {
        throw new Error("Frequency lista nem elérhető");
    }
    let filteredWords = frequencyData;
    if (level !== FREQUENCY_LEVELS.ALL) {
        const maxRank = parseInt(level);
        filteredWords = frequencyData.filter((item)=>item.rank <= maxRank);
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
        source: "frequency"
    };
}
function getFrequencyWordCount(level = FREQUENCY_LEVELS.TOP_10K) {
    if (!frequencyData) {
        switch(level){
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
    return frequencyData.filter((item)=>item.rank <= maxRank).length;
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
        cefrData = lines.map((line)=>{
            const parts = line.split(";");
            if (parts.length < 3) return null;
            return {
                word: parts[0]?.trim(),
                pos: parts[1]?.trim(),
                cefr: parts[2]?.trim()
            };
        }).filter((item)=>item && item.word && item.cefr);
        console.log(`📚 CEFR betöltve: ${cefrData.length} szó`);
        return cefrData;
    } catch (error) {
        console.error("❌ CEFR betöltési hiba:", error);
        return [];
    }
}
async function getRandomCEFRWord(level = CEFR_LEVELS.ALL) {
    await loadCEFR();
    if (!cefrData || cefrData.length === 0) {
        throw new Error("CEFR lista nem elérhető");
    }
    let filteredWords = cefrData;
    if (level !== CEFR_LEVELS.ALL) {
        filteredWords = cefrData.filter((item)=>item.cefr === level);
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
        source: "cefr"
    };
}
function getCEFRWordCount(level = CEFR_LEVELS.ALL) {
    if (!cefrData) return 7989;
    if (level === CEFR_LEVELS.ALL) {
        return cefrData.length;
    }
    return cefrData.filter((item)=>item.cefr === level).length;
}
async function translateWord(englishWord) {
    console.log(`🔍 Fordítás kérése a belső API-tól: ${englishWord}`);
    try {
        const response = await fetch(`/api/translate?word=${encodeURIComponent(englishWord)}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API hiba: ${response.statusText}`);
        }
        const data = await response.json();
        const hungarianMeanings = data.translation;
        if (!hungarianMeanings || hungarianMeanings.length === 0) {
            return [
                "Nincs fordítás"
            ];
        }
        console.log(`✅ Sikeres fordítás:`, hungarianMeanings);
        return hungarianMeanings;
    } catch (error) {
        console.error("❌ Hiba a belső fordítási API hívásakor:", error);
        return [
            "Fordítási hiba"
        ];
    }
}
async function getRandomWord() {
    const source = getCurrentSource();
    const cefrLevel = getCurrentCEFRLevel();
    const frequencyLevel = getCurrentFrequencyLevel();
    console.log("🎲 Random szó kérés:", {
        source,
        cefrLevel,
        frequencyLevel
    });
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
            cached: true
        };
    }
    console.log("🌐 Nincs cache, API fordítás szükséges...");
    const hungarian = await translateWord(wordData.english);
    const result = {
        ...wordData,
        hungarian,
        cached: false
    };
    console.log("💾 Cache mentés:", wordData.english);
    setCachedTranslation(wordData.english, result);
    console.log("🎉 Teljes eredmény:", result);
    return result;
}
function getTotalWordsCount() {
    const source = getCurrentSource();
    const cefrLevel = getCurrentCEFRLevel();
    const frequencyLevel = getCurrentFrequencyLevel();
    if (source === WORD_SOURCES.FREQUENCY) {
        return getFrequencyWordCount(frequencyLevel);
    } else {
        return getCEFRWordCount(cefrLevel);
    }
}
function getCachedTranslation(word) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
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
function setCachedTranslation(word, translation) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const cacheData = {
            translation,
            timestamp: Date.now()
        };
        localStorage.setItem(`translation_${word}`, JSON.stringify(cacheData));
    } catch (error) {
        console.error("Cache write error:", error);
    }
}
function clearCache() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const keys = Object.keys(localStorage).filter((key)=>key.startsWith("translation_"));
        keys.forEach((key)=>localStorage.removeItem(key));
        return keys.length;
    } catch (error) {
        console.error("Cache clear error:", error);
        return 0;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/flashcards/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Flashcards
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Container$2f$Container$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Container$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Container/Container.js [app-client] (ecmascript) <export default as Container>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Typography/Typography.js [app-client] (ecmascript) <export default as Typography>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Button/Button.js [app-client] (ecmascript) <export default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Paper$2f$Paper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Paper$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Paper/Paper.js [app-client] (ecmascript) <export default as Paper>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/IconButton/IconButton.js [app-client] (ecmascript) <export default as IconButton>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$LinearProgress$2f$LinearProgress$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LinearProgress$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/LinearProgress/LinearProgress.js [app-client] (ecmascript) <export default as LinearProgress>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CircularProgress$2f$CircularProgress$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircularProgress$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/CircularProgress/CircularProgress.js [app-client] (ecmascript) <export default as CircularProgress>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Alert$2f$Alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Alert$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Alert/Alert.js [app-client] (ecmascript) <export default as Alert>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Chip/Chip.js [app-client] (ecmascript) <export default as Chip>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$VolumeUp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/VolumeUp.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$NavigateNext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/NavigateNext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Home$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/Home.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Refresh$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/Refresh.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/Settings.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CloudDownload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/CloudDownload.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/api.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
function Flashcards() {
    _s();
    const [currentWord, setCurrentWord] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isFlipped, setIsFlipped] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [wordsLearned, setWordsLearned] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [usedWords, setUsedWords] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [wordSource, setWordSource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORD_SOURCES"].FREQUENCY);
    const [cefrLevel, setCefrLevel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("ALL");
    const [frequencyLevel, setFrequencyLevel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("10000");
    // Forrás és szint betöltése
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Flashcards.useEffect": ()=>{
            setWordSource((0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentSource"])());
            setCefrLevel((0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentCEFRLevel"])());
            setFrequencyLevel((0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentFrequencyLevel"])());
        }
    }["Flashcards.useEffect"], []);
    // Random szó betöltése API-ból
    const loadRandomWord = async ()=>{
        setLoading(true);
        setError(null);
        setIsFlipped(false);
        try {
            let wordData;
            let attempts = 0;
            const maxAttempts = 50;
            // Próbálj új szót húzni (ami még nem volt)
            do {
                wordData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRandomWord"])();
                attempts++;
            }while (usedWords.includes(wordData.english) && attempts < maxAttempts)
            // Ha minden szót láttunk, kezdjük elölről
            if (usedWords.includes(wordData.english)) {
                setUsedWords([]);
            }
            setCurrentWord(wordData);
            setUsedWords([
                ...usedWords,
                wordData.english
            ]);
        } catch (err) {
            console.error("Szó betöltési hiba:", err);
            setError(err.message || "Hiba történt a szó betöltésekor. Próbáld újra!");
        } finally{
            setLoading(false);
        }
    };
    // Első szó betöltése
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Flashcards.useEffect": ()=>{
            loadRandomWord();
        }
    }["Flashcards.useEffect"], []);
    // Kártya megfordítása
    const handleFlip = ()=>{
        if (!loading) {
            setIsFlipped(!isFlipped);
        }
    };
    // Következő szó
    const handleNext = ()=>{
        setWordsLearned(wordsLearned + 1);
        loadRandomWord();
    };
    // Hang lejátszása
    const playSound = ()=>{
        if (!currentWord) return;
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(currentWord.english);
            utterance.lang = "en-US";
            utterance.rate = 0.8;
            window.speechSynthesis.speak(utterance);
        } else {
            alert("A böngésző nem támogatja a hanglejátszást");
        }
    };
    // Újrakezdés
    const handleRestart = ()=>{
        setUsedWords([]);
        setWordsLearned(0);
        loadRandomWord();
    };
    const totalWords = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalWordsCount"])();
    const progress = wordsLearned / totalWords * 100;
    // Forrás címke
    const getSourceLabel = ()=>{
        if (wordSource === __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORD_SOURCES"].FREQUENCY) {
            const levelLabel = {
                1000: "Top 1k",
                10000: "Top 10k",
                50000: "Top 50k",
                all: "Összes"
            }[frequencyLevel] || "Top 10k";
            return `📊 ${levelLabel}`;
        } else {
            return `🎓 CEFR${cefrLevel !== "ALL" ? ` (${cefrLevel})` : ""}`;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Container$2f$Container$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Container$3e$__["Container"], {
        maxWidth: "sm",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
            sx: {
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                py: 4
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                    sx: {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            passHref: true,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__["IconButton"], {
                                color: "primary",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Home$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                    fileName: "[project]/app/flashcards/page.js",
                                    lineNumber: 167,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/flashcards/page.js",
                                lineNumber: 166,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/flashcards/page.js",
                            lineNumber: 165,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                            sx: {
                                display: "flex",
                                alignItems: "center",
                                gap: 1
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                    variant: "h6",
                                    color: "text.secondary",
                                    children: [
                                        wordsLearned,
                                        " / ",
                                        totalWords.toLocaleString()
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/flashcards/page.js",
                                    lineNumber: 172,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__["Chip"], {
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$CloudDownload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/app/flashcards/page.js",
                                        lineNumber: 176,
                                        columnNumber: 21
                                    }, void 0),
                                    label: "API",
                                    size: "small",
                                    color: "primary",
                                    variant: "outlined"
                                }, void 0, false, {
                                    fileName: "[project]/app/flashcards/page.js",
                                    lineNumber: 175,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/flashcards/page.js",
                            lineNumber: 171,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                            sx: {
                                display: "flex",
                                gap: 1
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/settings",
                                    passHref: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__["IconButton"], {
                                        color: "primary",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/app/flashcards/page.js",
                                            lineNumber: 187,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/flashcards/page.js",
                                        lineNumber: 186,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/flashcards/page.js",
                                    lineNumber: 185,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__["IconButton"], {
                                    color: "primary",
                                    onClick: handleRestart,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Refresh$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/app/flashcards/page.js",
                                        lineNumber: 191,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/flashcards/page.js",
                                    lineNumber: 190,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/flashcards/page.js",
                            lineNumber: 184,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/flashcards/page.js",
                    lineNumber: 157,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$LinearProgress$2f$LinearProgress$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LinearProgress$3e$__["LinearProgress"], {
                    variant: "determinate",
                    value: progress,
                    sx: {
                        mb: 2,
                        height: 8,
                        borderRadius: 4
                    }
                }, void 0, false, {
                    fileName: "[project]/app/flashcards/page.js",
                    lineNumber: 197,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                    sx: {
                        display: "flex",
                        gap: 1,
                        justifyContent: "center",
                        mb: 2
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__["Chip"], {
                            label: getSourceLabel(),
                            color: "secondary",
                            size: "small"
                        }, void 0, false, {
                            fileName: "[project]/app/flashcards/page.js",
                            lineNumber: 205,
                            columnNumber: 11
                        }, this),
                        currentWord?.cached && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__["Chip"], {
                            label: "📦 Cache",
                            size: "small",
                            variant: "outlined"
                        }, void 0, false, {
                            fileName: "[project]/app/flashcards/page.js",
                            lineNumber: 207,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/flashcards/page.js",
                    lineNumber: 204,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Alert$2f$Alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Alert$3e$__["Alert"], {
                    severity: "error",
                    sx: {
                        mb: 3
                    },
                    onClose: ()=>setError(null),
                    children: error
                }, void 0, false, {
                    fileName: "[project]/app/flashcards/page.js",
                    lineNumber: 213,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Paper$2f$Paper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Paper$3e$__["Paper"], {
                    elevation: 6,
                    onClick: handleFlip,
                    sx: {
                        minHeight: 400,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: loading ? "wait" : "pointer",
                        p: 4,
                        mb: 3,
                        borderRadius: 4,
                        transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)",
                        transformStyle: "preserve-3d",
                        "&:hover": {
                            boxShadow: loading ? 6 : 12
                        },
                        opacity: loading ? 0.6 : 1
                    },
                    children: loading ? // Loading állapot
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                        sx: {
                            textAlign: "center"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CircularProgress$2f$CircularProgress$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircularProgress$3e$__["CircularProgress"], {
                                size: 60,
                                sx: {
                                    mb: 3
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/flashcards/page.js",
                                lineNumber: 244,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                variant: "h6",
                                color: "text.secondary",
                                children: "Szó betöltése..."
                            }, void 0, false, {
                                fileName: "[project]/app/flashcards/page.js",
                                lineNumber: 245,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/flashcards/page.js",
                        lineNumber: 243,
                        columnNumber: 13
                    }, this) : currentWord ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                        sx: {
                            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)",
                            backfaceVisibility: "hidden",
                            textAlign: "center",
                            width: "100%"
                        },
                        children: !isFlipped ? // Előlap - Angol szó
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                    variant: "h2",
                                    component: "div",
                                    fontWeight: "bold",
                                    color: "primary",
                                    sx: {
                                        mb: 2,
                                        wordBreak: "break-word"
                                    },
                                    children: currentWord.english
                                }, void 0, false, {
                                    fileName: "[project]/app/flashcards/page.js",
                                    lineNumber: 261,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                    sx: {
                                        display: "flex",
                                        gap: 1,
                                        justifyContent: "center",
                                        mb: 3
                                    },
                                    children: [
                                        currentWord.rank && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__["Chip"], {
                                            label: `#${currentWord.rank}`,
                                            color: "success",
                                            size: "small"
                                        }, void 0, false, {
                                            fileName: "[project]/app/flashcards/page.js",
                                            lineNumber: 282,
                                            columnNumber: 23
                                        }, this),
                                        currentWord.cefr && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__["Chip"], {
                                            label: `${currentWord.cefr} • ${currentWord.pos || "word"}`,
                                            color: "secondary",
                                            size: "small"
                                        }, void 0, false, {
                                            fileName: "[project]/app/flashcards/page.js",
                                            lineNumber: 291,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/flashcards/page.js",
                                    lineNumber: 272,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                    variant: "body1",
                                    color: "text.secondary",
                                    children: "Kattints a megfordításhoz"
                                }, void 0, false, {
                                    fileName: "[project]/app/flashcards/page.js",
                                    lineNumber: 301,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__["IconButton"], {
                                    color: "secondary",
                                    onClick: (e)=>{
                                        e.stopPropagation();
                                        playSound();
                                    },
                                    sx: {
                                        mt: 3
                                    },
                                    size: "large",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$VolumeUp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        fontSize: "large"
                                    }, void 0, false, {
                                        fileName: "[project]/app/flashcards/page.js",
                                        lineNumber: 314,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/flashcards/page.js",
                                    lineNumber: 305,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true) : // Hátlap - Magyar jelentés(ek)
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                    variant: "h5",
                                    component: "div",
                                    color: "text.secondary",
                                    gutterBottom: true,
                                    sx: {
                                        mb: 3
                                    },
                                    children: currentWord.english
                                }, void 0, false, {
                                    fileName: "[project]/app/flashcards/page.js",
                                    lineNumber: 320,
                                    columnNumber: 19
                                }, this),
                                currentWord.hungarian && currentWord.hungarian.map((meaning, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                        variant: currentWord.hungarian.length === 1 ? "h3" : "h4",
                                        component: "div",
                                        fontWeight: "bold",
                                        color: "secondary",
                                        sx: {
                                            mb: 1,
                                            wordBreak: "break-word"
                                        },
                                        children: meaning
                                    }, index, false, {
                                        fileName: "[project]/app/flashcards/page.js",
                                        lineNumber: 332,
                                        columnNumber: 23
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                    variant: "body1",
                                    color: "text.secondary",
                                    sx: {
                                        mt: 3
                                    },
                                    children: "Kattints újra az angol szóhoz"
                                }, void 0, false, {
                                    fileName: "[project]/app/flashcards/page.js",
                                    lineNumber: 346,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/app/flashcards/page.js",
                        lineNumber: 250,
                        columnNumber: 13
                    }, this) : // Hiba állapot
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                        variant: "h6",
                        color: "error",
                        children: "Nem sikerült betölteni a szót"
                    }, void 0, false, {
                        fileName: "[project]/app/flashcards/page.js",
                        lineNumber: 358,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/flashcards/page.js",
                    lineNumber: 219,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                    variant: "contained",
                    size: "large",
                    endIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$NavigateNext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/app/flashcards/page.js",
                        lineNumber: 368,
                        columnNumber: 20
                    }, void 0),
                    onClick: handleNext,
                    disabled: loading,
                    fullWidth: true,
                    sx: {
                        py: 2,
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        boxShadow: 3
                    },
                    children: loading ? "Betöltés..." : "Következő szó"
                }, void 0, false, {
                    fileName: "[project]/app/flashcards/page.js",
                    lineNumber: 365,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                    sx: {
                        mt: 3,
                        textAlign: "center"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                            variant: "body2",
                            color: "text.secondary",
                            sx: {
                                mb: 1
                            },
                            children: "💡 Kattints a kártyára a magyar jelentés megtekintéséhez"
                        }, void 0, false, {
                            fileName: "[project]/app/flashcards/page.js",
                            lineNumber: 384,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                            variant: "caption",
                            color: "text.secondary",
                            children: "🎯 Beállítások → Válaszd ki a nehézségi szintet"
                        }, void 0, false, {
                            fileName: "[project]/app/flashcards/page.js",
                            lineNumber: 388,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/flashcards/page.js",
                    lineNumber: 383,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/flashcards/page.js",
            lineNumber: 147,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/flashcards/page.js",
        lineNumber: 146,
        columnNumber: 5
    }, this);
}
_s(Flashcards, "HWe+31Dn3sJyF/+ztNdFSQiJPyE=");
_c = Flashcards;
var _c;
__turbopack_context__.k.register(_c, "Flashcards");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_f18f4671._.js.map