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
"[project]/app/api/translate/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const dynamic = "force-dynamic";
// RapidAPI Free Google Translator
async function translateWithRapidAPI(word) {
    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) {
        console.error("❌ RAPIDAPI_KEY nincs beállítva a .env.local fájlban!");
        return [];
    }
    try {
        const response = await fetch("https://free-google-translator.p.rapidapi.com/external-api/free-google-translator", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-rapidapi-host": "free-google-translator.p.rapidapi.com",
                "x-rapidapi-key": apiKey
            },
            body: JSON.stringify({
                from: "en",
                to: "hu",
                query: word
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Status: ${response.status}, Body: ${errorText}`);
        }
        const data = await response.json();
        console.log("📦 RapidAPI válasz:", data);
        // A válasz lehet string vagy object
        let translation;
        if (typeof data.translation === "string") {
            translation = data.translation;
        } else if (data.translate) {
            translation = data.translate;
        } else if (typeof data === "string") {
            translation = data;
        }
        if (translation) {
            return [
                translation.toLowerCase()
            ];
        }
        return [];
    } catch (error) {
        console.error("❌ RapidAPI hiba:", error.message);
        return [];
    }
}
// Fallback: Dictionary API (angol definíciók)
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
        console.warn("⚠️ Dictionary API hiba:", error.message);
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
    console.log("🔍 Fordítás kérés:", word);
    // 1. RapidAPI fordítás
    const rapidTranslation = await translateWithRapidAPI(word);
    if (rapidTranslation.length > 0) {
        console.log("✅ Sikeres RapidAPI fordítás:", rapidTranslation);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            translation: rapidTranslation
        });
    }
    // 2. Fallback: Angol definíció
    console.log("⚠️ RapidAPI nem működött, angol definíció...");
    const definitions = await getDictionaryDefinitions(word);
    if (definitions.length > 0) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            translation: definitions
        });
    }
    // 3. Végső fallback
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        translation: [
            "Nincs elérhető fordítás"
        ]
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__83b9861d._.js.map