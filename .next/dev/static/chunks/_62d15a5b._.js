(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/utils/api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ====================================
// ÚJ SZÓTÁR RENDSZER - cefr_dictionary.json
// ====================================
// CEFR szintek
__turbopack_context__.s([
    "CEFR_LEVELS",
    ()=>CEFR_LEVELS,
    "clearCache",
    ()=>clearCache,
    "getCEFRWordCount",
    ()=>getCEFRWordCount,
    "getCurrentCEFRLevel",
    ()=>getCurrentCEFRLevel,
    "getRandomWord",
    ()=>getRandomWord,
    "getStatsByLevel",
    ()=>getStatsByLevel,
    "getTotalWordsCount",
    ()=>getTotalWordsCount,
    "lookupWord",
    ()=>lookupWord,
    "setCurrentCEFRLevel",
    ()=>setCurrentCEFRLevel
]);
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
    return Object.keys(dict).filter((word)=>{
        const entries = dict[word];
        return entries.some((entry)=>entry.cefr === level);
    });
}
async function getRandomWord() {
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
        const matchingEntries = wordData.filter((e)=>e.cefr === level);
        selectedEntry = matchingEntries[Math.floor(Math.random() * matchingEntries.length)];
    }
    return {
        english: selectedWord,
        hungarian: selectedEntry.meanings,
        pos: selectedEntry.pos,
        cefr: selectedEntry.cefr,
        source: "cefr_dictionary"
    };
}
async function getTotalWordsCount() {
    const dict = await loadDictionary();
    const level = getCurrentCEFRLevel();
    if (!dict) return 0;
    const availableWords = filterWordsByLevel(dict, level);
    return availableWords.length;
}
function getCEFRWordCount(level = CEFR_LEVELS.ALL) {
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
            [CEFR_LEVELS.C2]: 535
        };
        return estimates[level] || 1000;
    }
    const availableWords = filterWordsByLevel(dictionary, level);
    return availableWords.length;
}
async function lookupWord(word) {
    const dict = await loadDictionary();
    const normalizedWord = word.toLowerCase().trim();
    if (dict[normalizedWord]) {
        return {
            found: true,
            word: normalizedWord,
            entries: dict[normalizedWord]
        };
    }
    return {
        found: false,
        word: normalizedWord,
        entries: []
    };
}
async function getStatsByLevel() {
    const dict = await loadDictionary();
    if (!dict) return {};
    const stats = {};
    Object.values(CEFR_LEVELS).forEach((level)=>{
        if (level !== CEFR_LEVELS.ALL) {
            stats[level] = filterWordsByLevel(dict, level).length;
        }
    });
    return stats;
}
function clearCache() {
    // Már nincs cache, de a függvény marad
    return 0;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/utils/progressTracker.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// LocalStorage kulcsok
__turbopack_context__.s([
    "addKnownWord",
    ()=>addKnownWord,
    "addUnknownWord",
    ()=>addUnknownWord,
    "calculateProgress",
    ()=>calculateProgress,
    "clearGameState",
    ()=>clearGameState,
    "clearKnownWords",
    ()=>clearKnownWords,
    "clearUnknownWords",
    ()=>clearUnknownWords,
    "getGameState",
    ()=>getGameState,
    "getKnownWords",
    ()=>getKnownWords,
    "getSessionStats",
    ()=>getSessionStats,
    "getStreak",
    ()=>getStreak,
    "getUnknownWords",
    ()=>getUnknownWords,
    "hasGameInProgress",
    ()=>hasGameInProgress,
    "removeUnknownWord",
    ()=>removeUnknownWord,
    "resetSessionStats",
    ()=>resetSessionStats,
    "saveGameState",
    ()=>saveGameState,
    "updateSessionStats",
    ()=>updateSessionStats,
    "updateStreak",
    ()=>updateStreak
]);
const KNOWN_WORDS_KEY = "knownWords";
const UNKNOWN_WORDS_KEY = "unknownWords";
const SESSION_STATS_KEY = "sessionStats";
const GAME_STATE_KEY = "gameState"; // ÚJ!
function getKnownWords() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const data = localStorage.getItem(KNOWN_WORDS_KEY);
        return data ? JSON.parse(data) : [];
    } catch  {
        return [];
    }
}
function addKnownWord(word) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
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
function clearKnownWords() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    localStorage.removeItem(KNOWN_WORDS_KEY);
}
function getUnknownWords() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const data = localStorage.getItem(UNKNOWN_WORDS_KEY);
        return data ? JSON.parse(data) : [];
    } catch  {
        return [];
    }
}
function addUnknownWord(word) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
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
function removeUnknownWord(word) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const unknown = getUnknownWords();
        const normalizedWord = word.toLowerCase().trim();
        const filtered = unknown.filter((w)=>w !== normalizedWord);
        localStorage.setItem(UNKNOWN_WORDS_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error("Hiba a nem tudott szó törlésekor:", error);
    }
}
function removeKnownWord(word) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const known = getKnownWords();
        const normalizedWord = word.toLowerCase().trim();
        const filtered = known.filter((w)=>w !== normalizedWord);
        localStorage.setItem(KNOWN_WORDS_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error("Hiba a tudott szó törlésekor:", error);
    }
}
function clearUnknownWords() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    localStorage.removeItem(UNKNOWN_WORDS_KEY);
}
function getSessionStats() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const data = localStorage.getItem(SESSION_STATS_KEY);
        return data ? JSON.parse(data) : {
            correct: 0,
            incorrect: 0,
            total: 0
        };
    } catch  {
        return {
            correct: 0,
            incorrect: 0,
            total: 0
        };
    }
}
function updateSessionStats(isCorrect) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
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
function resetSessionStats() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    localStorage.setItem(SESSION_STATS_KEY, JSON.stringify({
        correct: 0,
        incorrect: 0,
        total: 0
    }));
}
function saveGameState(state) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const gameState = {
            ...state,
            timestamp: Date.now()
        };
        localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
    } catch (error) {
        console.error("Hiba a játékállás mentésekor:", error);
    }
}
function getGameState() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
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
    } catch  {
        return null;
    }
}
function clearGameState() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    localStorage.removeItem(GAME_STATE_KEY);
}
function hasGameInProgress() {
    const state = getGameState();
    return state !== null;
}
function calculateProgress(totalWords, source, level) {
    const knownWords = getKnownWords();
    const unknownWords = getUnknownWords();
    const knownCount = knownWords.length;
    const unknownCount = unknownWords.length;
    const reviewedCount = knownCount + unknownCount;
    const percentage = totalWords > 0 ? (knownCount / totalWords * 100).toFixed(1) : 0;
    return {
        knownCount,
        unknownCount,
        reviewedCount,
        totalWords,
        percentage,
        source,
        level
    };
}
// ====================================
// 🆕 STREAK TRACKING
// ====================================
const STREAK_KEY = "dailyStreak";
function updateStreak() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const today = new Date().toDateString();
        const streakData = localStorage.getItem(STREAK_KEY);
        if (!streakData) {
            // Első alkalom
            localStorage.setItem(STREAK_KEY, JSON.stringify({
                count: 1,
                lastDate: today
            }));
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
            localStorage.setItem(STREAK_KEY, JSON.stringify({
                count: newCount,
                lastDate: today
            }));
            return newCount;
        }
        // Megszakadt a streak
        localStorage.setItem(STREAK_KEY, JSON.stringify({
            count: 1,
            lastDate: today
        }));
        return 1;
    } catch (error) {
        console.error("Streak frissítési hiba:", error);
        return 0;
    }
}
function getStreak() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
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
    } catch  {
        return 0;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/settings/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Settings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Container$2f$Container$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Container$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Container/Container.js [app-client] (ecmascript) <export default as Container>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Typography/Typography.js [app-client] (ecmascript) <export default as Typography>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Button/Button.js [app-client] (ecmascript) <export default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Paper$2f$Paper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Paper$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Paper/Paper.js [app-client] (ecmascript) <export default as Paper>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ToggleButtonGroup$2f$ToggleButtonGroup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleButtonGroup$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/ToggleButtonGroup/ToggleButtonGroup.js [app-client] (ecmascript) <export default as ToggleButtonGroup>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ToggleButton$2f$ToggleButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleButton$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/ToggleButton/ToggleButton.js [app-client] (ecmascript) <export default as ToggleButton>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Divider$2f$Divider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Divider$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Divider/Divider.js [app-client] (ecmascript) <export default as Divider>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Alert$2f$Alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Alert$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Alert/Alert.js [app-client] (ecmascript) <export default as Alert>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$ArrowBack$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/ArrowBack.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Delete$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/Delete.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$progressTracker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/progressTracker.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Toast$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Toast.js [app-client] (ecmascript)");
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
function Settings() {
    _s();
    const { showToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Toast$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const [cefrLevel, setCEFRLevelState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CEFR_LEVELS"].ALL);
    const [wordCount, setWordCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Settings.useEffect": ()=>{
            const level = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentCEFRLevel"])();
            setCEFRLevelState(level);
            updateWordCount(level);
        }
    }["Settings.useEffect"], []);
    const updateWordCount = async (level)=>{
        const count = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCEFRWordCount"])(level);
        setWordCount(count);
    };
    const handleCEFRLevelChange = (event, newLevel)=>{
        if (newLevel !== null) {
            setCEFRLevelState(newLevel);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setCurrentCEFRLevel"])(newLevel);
            updateWordCount(newLevel);
            showToast(`📚 CEFR szint: ${newLevel}`, "success");
        }
    };
    const handleResetProgress = ()=>{
        if (confirm("Biztosan törölni szeretnéd az ÖSSZES haladásodat?\n\n" + "Ez törli:\n" + "- Tudott szavak\n" + "- Nem tudott szavak\n" + "- Session statisztikák\n" + "- Mentett játékállás")) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$progressTracker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearKnownWords"])();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$progressTracker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearUnknownWords"])();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$progressTracker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resetSessionStats"])();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$progressTracker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearGameState"])();
            showToast("🗑️ Minden adat törölve!", "success");
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
                        alignItems: "center",
                        gap: 2,
                        mb: 4
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            passHref: true,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                                variant: "contained",
                                startIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$ArrowBack$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                    fileName: "[project]/app/settings/page.js",
                                    lineNumber: 98,
                                    columnNumber: 26
                                }, void 0),
                                className: "btn-primary",
                                sx: {
                                    borderRadius: 2
                                },
                                children: "Vissza"
                            }, void 0, false, {
                                fileName: "[project]/app/settings/page.js",
                                lineNumber: 96,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/settings/page.js",
                            lineNumber: 95,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                            variant: "h4",
                            fontWeight: "bold",
                            children: "⚙️ Beállítások"
                        }, void 0, false, {
                            fileName: "[project]/app/settings/page.js",
                            lineNumber: 108,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/settings/page.js",
                    lineNumber: 87,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Paper$2f$Paper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Paper$3e$__["Paper"], {
                    elevation: 3,
                    className: "stat-card slide-up",
                    sx: {
                        p: 3,
                        mb: 3,
                        borderRadius: 3
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                            variant: "h6",
                            fontWeight: "bold",
                            gutterBottom: true,
                            children: "📚 CEFR Szint"
                        }, void 0, false, {
                            fileName: "[project]/app/settings/page.js",
                            lineNumber: 119,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                            variant: "body2",
                            color: "text.secondary",
                            paragraph: true,
                            children: "Válaszd ki milyen nehézségű szavakat szeretnél gyakorolni"
                        }, void 0, false, {
                            fileName: "[project]/app/settings/page.js",
                            lineNumber: 123,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ToggleButtonGroup$2f$ToggleButtonGroup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleButtonGroup$3e$__["ToggleButtonGroup"], {
                            value: cefrLevel,
                            exclusive: true,
                            onChange: handleCEFRLevelChange,
                            fullWidth: true,
                            sx: {
                                mb: 2,
                                "& .MuiToggleButton-root": {
                                    py: 1.5,
                                    fontWeight: "bold",
                                    borderRadius: 2,
                                    "&.Mui-selected": {
                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        color: "white",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #5568d3 0%, #6a4193 100%)"
                                        }
                                    }
                                }
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ToggleButton$2f$ToggleButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleButton$3e$__["ToggleButton"], {
                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CEFR_LEVELS"].ALL,
                                    children: "Mind"
                                }, void 0, false, {
                                    fileName: "[project]/app/settings/page.js",
                                    lineNumber: 150,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ToggleButton$2f$ToggleButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleButton$3e$__["ToggleButton"], {
                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CEFR_LEVELS"].A1,
                                    children: "A1"
                                }, void 0, false, {
                                    fileName: "[project]/app/settings/page.js",
                                    lineNumber: 151,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ToggleButton$2f$ToggleButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleButton$3e$__["ToggleButton"], {
                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CEFR_LEVELS"].A2,
                                    children: "A2"
                                }, void 0, false, {
                                    fileName: "[project]/app/settings/page.js",
                                    lineNumber: 152,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ToggleButton$2f$ToggleButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleButton$3e$__["ToggleButton"], {
                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CEFR_LEVELS"].B1,
                                    children: "B1"
                                }, void 0, false, {
                                    fileName: "[project]/app/settings/page.js",
                                    lineNumber: 153,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ToggleButton$2f$ToggleButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleButton$3e$__["ToggleButton"], {
                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CEFR_LEVELS"].B2,
                                    children: "B2"
                                }, void 0, false, {
                                    fileName: "[project]/app/settings/page.js",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ToggleButton$2f$ToggleButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleButton$3e$__["ToggleButton"], {
                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CEFR_LEVELS"].C1,
                                    children: "C1"
                                }, void 0, false, {
                                    fileName: "[project]/app/settings/page.js",
                                    lineNumber: 155,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ToggleButton$2f$ToggleButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleButton$3e$__["ToggleButton"], {
                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CEFR_LEVELS"].C2,
                                    children: "C2"
                                }, void 0, false, {
                                    fileName: "[project]/app/settings/page.js",
                                    lineNumber: 156,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/settings/page.js",
                            lineNumber: 127,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Alert$2f$Alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Alert$3e$__["Alert"], {
                            severity: "info",
                            sx: {
                                borderRadius: 2
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                                variant: "body2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: wordCount.toLocaleString()
                                    }, void 0, false, {
                                        fileName: "[project]/app/settings/page.js",
                                        lineNumber: 161,
                                        columnNumber: 15
                                    }, this),
                                    " szó elérhető ezen a szinten"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/settings/page.js",
                                lineNumber: 160,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/settings/page.js",
                            lineNumber: 159,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Divider$2f$Divider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Divider$3e$__["Divider"], {
                            sx: {
                                my: 2
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/settings/page.js",
                            lineNumber: 166,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                            variant: "body2",
                            color: "text.secondary",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "CEFR Szintek magyarázata:"
                                }, void 0, false, {
                                    fileName: "[project]/app/settings/page.js",
                                    lineNumber: 169,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/app/settings/page.js",
                                    lineNumber: 170,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "A1-A2:"
                                }, void 0, false, {
                                    fileName: "[project]/app/settings/page.js",
                                    lineNumber: 171,
                                    columnNumber: 13
                                }, this),
                                " Kezdő (basic words)",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/app/settings/page.js",
                                    lineNumber: 172,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "B1-B2:"
                                }, void 0, false, {
                                    fileName: "[project]/app/settings/page.js",
                                    lineNumber: 173,
                                    columnNumber: 13
                                }, this),
                                " Középhaladó (everyday conversation)",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/app/settings/page.js",
                                    lineNumber: 174,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "C1-C2:"
                                }, void 0, false, {
                                    fileName: "[project]/app/settings/page.js",
                                    lineNumber: 175,
                                    columnNumber: 13
                                }, this),
                                " Haladó (advanced, professional)"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/settings/page.js",
                            lineNumber: 168,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/settings/page.js",
                    lineNumber: 114,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Paper$2f$Paper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Paper$3e$__["Paper"], {
                    elevation: 3,
                    className: "stat-card slide-up",
                    sx: {
                        p: 3,
                        borderRadius: 3,
                        background: "linear-gradient(135deg, rgba(245, 101, 101, 0.1) 0%, rgba(229, 62, 62, 0.05) 100%)",
                        border: "2px solid #f56565"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                            variant: "h6",
                            fontWeight: "bold",
                            gutterBottom: true,
                            color: "error",
                            children: "⚠️ Veszélyzóna"
                        }, void 0, false, {
                            fileName: "[project]/app/settings/page.js",
                            lineNumber: 191,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                            variant: "body2",
                            color: "text.secondary",
                            paragraph: true,
                            children: "Ezek a műveletek visszaállítják az ÖSSZES haladásodat!"
                        }, void 0, false, {
                            fileName: "[project]/app/settings/page.js",
                            lineNumber: 195,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                            variant: "contained",
                            color: "error",
                            fullWidth: true,
                            startIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Delete$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/app/settings/page.js",
                                lineNumber: 203,
                                columnNumber: 24
                            }, void 0),
                            onClick: handleResetProgress,
                            sx: {
                                py: 1.5,
                                fontWeight: "bold",
                                borderRadius: 2
                            },
                            children: "Minden adat törlése"
                        }, void 0, false, {
                            fileName: "[project]/app/settings/page.js",
                            lineNumber: 199,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/settings/page.js",
                    lineNumber: 180,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                    sx: {
                        mt: 3,
                        textAlign: "center"
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                        variant: "caption",
                        color: "text.secondary",
                        children: "💡 A beállítások azonnal érvénybe lépnek"
                    }, void 0, false, {
                        fileName: "[project]/app/settings/page.js",
                        lineNumber: 217,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/settings/page.js",
                    lineNumber: 216,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/settings/page.js",
            lineNumber: 77,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/settings/page.js",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_s(Settings, "h4Sn6DoXzpyxlQLJwDBMhYopByE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Toast$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = Settings;
var _c;
__turbopack_context__.k.register(_c, "Settings");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_62d15a5b._.js.map