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
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/punycode [external] (punycode, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$vitalets$2f$google$2d$translate$2d$api$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@vitalets/google-translate-api/dist/esm/index.js [app-route] (ecmascript)");
;
;
const dynamic = "force-dynamic";
// =================================================================
// Szolgáltatói Függvények (külön-külön, cserélhetően)
// =================================================================
// 1. SZOLGÁLTATÓ: LibreTranslate (Az új, elsődleges forrásunk)
async function getLibreTranslate(word) {
    try {
        const response = await fetch("https://translate.argosopentech.com/translate", {
            method: "POST",
            body: JSON.stringify({
                q: word,
                source: "en",
                target: "hu"
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const data = await response.json();
        return data.translatedText ? [
            data.translatedText.toLowerCase()
        ] : [];
    } catch (error) {
        console.warn(`⚠️ LibreTranslate API hiba: ${error.message}`);
        return []; // Hiba esetén üres tömböt adunk vissza
    }
}
// 2. SZOLGÁLTATÓ: Google Translate
async function getGoogleTranslate(word) {
    try {
        const { text } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$vitalets$2f$google$2d$translate$2d$api$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["translate"])(word, {
            to: "hu"
        });
        return text.split(",").map((m)=>m.trim().toLowerCase()).filter(Boolean);
    } catch (error) {
        console.warn(`⚠️ Google Translate API hiba: ${error.message}`);
        return [];
    }
}
// 3. SZOLGÁLTATÓ: Glosbe
async function getGlosbeTranslations(word) {
    try {
        const url = `https://glosbe.com/gapi/translate?from=eng&dest=hun&format=json&phrase=${encodeURIComponent(word)}`;
        const response = await fetch(url);
        if (!response.ok) return [];
        const data = await response.json();
        return data.tuc?.map((item)=>item.phrase?.text.toLowerCase()).filter(Boolean).slice(0, 5) || [];
    } catch (error) {
        console.warn(`⚠️ Glosbe API hiba: ${error.message}`);
        return [];
    }
}
// 4. SZOLGÁLTATÓ: Dictionary (Végső tartalék)
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
    // Próbálkozási sorrend (a szolgáltatók lánca)
    const providers = [
        {
            name: "LibreTranslate",
            func: getLibreTranslate
        },
        {
            name: "GoogleTranslate",
            func: getGoogleTranslate
        },
        {
            name: "Glosbe",
            func: getGlosbeTranslations
        }
    ];
    // Megpróbáljuk a magyar fordítókat sorban
    for (const provider of providers){
        const results = await provider.func(word);
        if (results.length > 0) {
            finalMeanings.push(...results);
            console.log(`✅ Sikeres találat a(z) ${provider.name} szolgáltatótól:`, results);
        }
    }
    // A magyar eredmények összefésülése és tisztítása
    finalMeanings = [
        ...new Set(finalMeanings)
    ].filter(Boolean);
    // Végső Tartalék - CSAK HA EGYIK MAGYAR FORDÍTÓ SEM MŰKÖDÖTT
    if (finalMeanings.length === 0) {
        console.log("‼️ Egyik magyar fordító sem működött. Végső próbálkozás angol definícióval.");
        const definitions = await getDictionaryDefinitions(word);
        finalMeanings.push(...definitions);
    }
    // Ha végképp semmi nincs, akkor adjuk fel.
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

//# sourceMappingURL=%5Broot-of-the-server%5D__13957e34._.js.map