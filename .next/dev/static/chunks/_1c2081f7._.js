(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/app/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Container$2f$Container$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Container$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Container/Container.js [app-client] (ecmascript) <export default as Container>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Typography/Typography.js [app-client] (ecmascript) <export default as Typography>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Button/Button.js [app-client] (ecmascript) <export default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Paper$2f$Paper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Paper$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Paper/Paper.js [app-client] (ecmascript) <export default as Paper>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Chip/Chip.js [app-client] (ecmascript) <export default as Chip>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$School$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/School.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PlayArrow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/PlayArrow.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$FitnessCenter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/FitnessCenter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$progressTracker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/progressTracker.js [app-client] (ecmascript)");
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
function Home() {
    _s();
    const [unknownCount, setUnknownCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            // Betöltjük a nem tudott szavak számát
            const words = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$progressTracker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUnknownWords"])();
            setUnknownCount(words.length);
        }
    }["Home.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Container$2f$Container$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Container$3e$__["Container"], {
        maxWidth: "sm",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
            sx: {
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 4,
                py: 4
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Paper$2f$Paper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Paper$3e$__["Paper"], {
                    elevation: 3,
                    sx: {
                        p: 4,
                        textAlign: "center",
                        width: "100%",
                        borderRadius: 3
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$School$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sx: {
                                fontSize: 80,
                                color: "primary.main",
                                mb: 2
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/page.js",
                            lineNumber: 40,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                            variant: "h3",
                            component: "h1",
                            gutterBottom: true,
                            fontWeight: "bold",
                            children: "Angol Tanuló"
                        }, void 0, false, {
                            fileName: "[project]/app/page.js",
                            lineNumber: 42,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                            variant: "h6",
                            color: "text.secondary",
                            paragraph: true,
                            children: "Flashcard Játék"
                        }, void 0, false, {
                            fileName: "[project]/app/page.js",
                            lineNumber: 51,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                            variant: "body1",
                            color: "text.secondary",
                            paragraph: true,
                            sx: {
                                mb: 4
                            },
                            children: "Tanulj angolul szórakozva! Random szavak, magyar jelentések, és hangos kiejtés segítségével."
                        }, void 0, false, {
                            fileName: "[project]/app/page.js",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                            sx: {
                                display: "flex",
                                flexDirection: "column",
                                gap: 2
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/flashcards",
                                    passHref: true,
                                    style: {
                                        textDecoration: "none"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                                        variant: "contained",
                                        size: "large",
                                        startIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$PlayArrow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/app/page.js",
                                            lineNumber: 75,
                                            columnNumber: 28
                                        }, void 0),
                                        fullWidth: true,
                                        sx: {
                                            py: 1.5,
                                            px: 4,
                                            fontSize: "1.1rem",
                                            fontWeight: "bold",
                                            boxShadow: 3,
                                            "&:hover": {
                                                boxShadow: 6,
                                                transform: "translateY(-2px)"
                                            },
                                            transition: "all 0.3s ease"
                                        },
                                        children: "Kezdés"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.js",
                                        lineNumber: 72,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/page.js",
                                    lineNumber: 67,
                                    columnNumber: 13
                                }, this),
                                unknownCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/flashcards/practice",
                                    passHref: true,
                                    style: {
                                        textDecoration: "none"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                                        variant: "contained",
                                        color: "error",
                                        size: "large",
                                        startIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$FitnessCenter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/app/page.js",
                                            lineNumber: 105,
                                            columnNumber: 30
                                        }, void 0),
                                        fullWidth: true,
                                        sx: {
                                            py: 1.5,
                                            px: 4,
                                            fontSize: "1.1rem",
                                            fontWeight: "bold",
                                            boxShadow: 3,
                                            "&:hover": {
                                                boxShadow: 6,
                                                transform: "translateY(-2px)"
                                            },
                                            transition: "all 0.3s ease",
                                            position: "relative"
                                        },
                                        children: [
                                            "Gyakorlás",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chip$3e$__["Chip"], {
                                                label: unknownCount,
                                                size: "small",
                                                color: "warning",
                                                sx: {
                                                    position: "absolute",
                                                    right: 16,
                                                    fontWeight: "bold"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.js",
                                                lineNumber: 122,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.js",
                                        lineNumber: 101,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/page.js",
                                    lineNumber: 96,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.js",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.js",
                    lineNumber: 31,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                    sx: {
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        alignItems: "center"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                            variant: "body2",
                            color: "text.secondary",
                            children: "💡 Tipp: Telepítsd az appot a kezdőképernyőre!"
                        }, void 0, false, {
                            fileName: "[project]/app/page.js",
                            lineNumber: 146,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/settings",
                            passHref: true,
                            style: {
                                textDecoration: "none"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                                size: "small",
                                variant: "text",
                                children: "⚙️ Beállítások (Fájl választás)"
                            }, void 0, false, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 151,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/page.js",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this),
                        unknownCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                            variant: "caption",
                            color: "error.main",
                            sx: {
                                mt: 1,
                                fontWeight: "bold"
                            },
                            children: [
                                "❌ ",
                                unknownCount,
                                " szót még nem tudsz - gyakorold őket!"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.js",
                            lineNumber: 157,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.js",
                    lineNumber: 138,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/page.js",
            lineNumber: 20,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/page.js",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_s(Home, "jDnA6h0wZFynNs1yWPRZfv3S24k=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_1c2081f7._.js.map