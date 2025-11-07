module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[project]/app/api/translate/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
;
;
;
const dynamic = "force-dynamic";
// =================================================================
// Szolgáltatói Függvények
// =================================================================
// 1. SZOLGÁLTATÓ: Helyi Mini-Szótár
let miniDictionary = null;
async function getFromLocalDictionary(word) {
    try {
        if (miniDictionary === null) {
            const jsonPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "public", "data", "mini_dictionary.json");
            const jsonData = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(jsonPath, "utf-8");
            miniDictionary = JSON.parse(jsonData);
        }
        const result = miniDictionary[word.toLowerCase()];
        return result || [];
    } catch (error) {
        console.error(`❌ Hiba a helyi szótár olvasásakor: ${error.message}`);
        miniDictionary = {};
        return [];
    }
}
// 2. SZOLGÁLTATÓ: Deep-Translator API (A megbízható, ingyenes API szerver)
async function getDeepTranslator(word) {
    try {
        console.log(`📡 Próbálkozás a Deep-Translator API-val...`);
        const response = await fetch("https://deep-translator-api.azurewebsites.net/google/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                source: "auto",
                target: "hu",
                text: word
            })
        });
        if (!response.ok) {
            throw new Error(`Status: ${response.status}`);
        }
        const data = await response.json();
        return data.translation ? [
            data.translation.toLowerCase()
        ] : [];
    } catch (error) {
        console.warn(`⚠️ Deep-Translator API hiba: ${error.message}`);
        return [];
    }
}
// 3. SZOLGÁLTATÓ: Dictionary (Végső tartalék)
async function getDictionaryDefinitions(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        if (!response.ok) return [];
        const data = await response.json();
        const definition = data[0]?.meanings?.[0]?.definitions?.[0]?.definition;
        return definition ? [
            `(def.) ${definition}`
        ] : [];
    } catch (error) {
        console.warn(`⚠️ Dictionary API hiba: ${error.message}`);
        return [];
    }
}
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const word = searchParams.get("word");
    if (!word) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'A "word" paraméter kötelező.'
        }, {
            status: 400
        });
    }
    let finalMeanings = [];
    // 1. LÉPÉS: Keresés a helyi szótárban
    const localResults = await getFromLocalDictionary(word);
    if (localResults.length > 0) {
        finalMeanings.push(...localResults);
    }
    // 2. LÉPÉS: Ha nincs helyi találat, jöhet a Deep-Translator API
    if (finalMeanings.length === 0) {
        const deepLResults = await getDeepTranslator(word);
        if (deepLResults.length > 0) {
            finalMeanings.push(...deepLResults);
        }
    }
    // 3. LÉPÉS: Végső tartalék
    if (finalMeanings.length === 0) {
        const definitions = await getDictionaryDefinitions(word);
        finalMeanings.push(...definitions);
    }
    if (finalMeanings.length === 0) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            translation: [
                "Nincs elérhető fordítás"
            ]
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        translation: finalMeanings
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__745107b6._.js.map