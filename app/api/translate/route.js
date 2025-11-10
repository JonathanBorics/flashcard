import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const dynamic = "force-dynamic";

// =================================================================
// Szolgáltatói Függvények
// =================================================================

// 1. SZOLGÁLTATÓ: Helyi Mini-Szótár
let miniDictionary = null;
async function getFromLocalDictionary(word) {
  try {
    if (miniDictionary === null) {
      const jsonPath = path.join(
        process.cwd(),
        "public",
        "data",
        "mini_dictionary.json"
      );
      const jsonData = await fs.readFile(jsonPath, "utf-8");
      miniDictionary = JSON.parse(jsonData);
    }
    const result = miniDictionary[word.toLowerCase()];
    return result || [];
  } catch (error) {
    miniDictionary = {};
    return [];
  }
}

// 2. SZOLGÁLTATÓ: Deep-Translator (Google - gyors fordítás)
async function getQuickTranslation(word) {
  try {
    const response = await fetch(
      "https://deep-translator-api.azurewebsites.net/google/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "auto", target: "hu", text: word }),
      }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.translation ? [data.translation.toLowerCase()] : [];
  } catch (error) {
    return [];
  }
}

// 3. SZOLGÁLTATÓ: Deep-Translator (PONS - több szótári jelentés)
async function getDictionaryMeanings(word) {
  try {
    const response = await fetch(
      "https://deep-translator-api.azurewebsites.net/pons/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "en", target: "hu", text: word }),
      }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data.translation)
      ? data.translation.map((t) => t.toLowerCase())
      : [];
  } catch (error) {
    return [];
  }
}

// 4. SZOLGÁLTATÓ: Dictionary API (CSAK végső tartalék definíció)
async function getEnglishDefinition(word) {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
        word
      )}`
    );
    if (!response.ok) return null;
    const data = await response.json();
    const definition = data[0]?.meanings?.[0]?.definitions?.[0]?.definition;
    return definition ? `(def.) ${definition}` : null;
  } catch (error) {
    return null;
  }
}

// =================================================================
// Fő API Logika
// =================================================================
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get("word");

  if (!word) {
    return NextResponse.json({ error: 'A "word" paraméter kötelező.' });
  }

  // 1. LÉPÉS: Keresés a helyi szótárban
  let finalMeanings = await getFromLocalDictionary(word);

  // 2. LÉPÉS: Ha nincs helyi találat, hívjuk a külső API-kat
  if (finalMeanings.length === 0) {
    const [quick, dictionary] = await Promise.all([
      getQuickTranslation(word),
      getDictionaryMeanings(word),
    ]);

    // Összefésüljük a MAGYAR eredményeket
    const combined = [...new Set([...quick, ...dictionary])];
    finalMeanings = combined.filter(Boolean);
  }

  // 3. LÉPÉS: Végső tartalék, ha egyik magyar forrás sem működött
  if (finalMeanings.length === 0) {
    const definition = await getEnglishDefinition(word);
    if (definition) {
      finalMeanings.push(definition);
    }
  }

  if (finalMeanings.length === 0) {
    // A synonyms kulcsot üresen küldjük, hogy a UI ne jelenítsen meg semmit
    return NextResponse.json({
      translation: ["Nincs elérhető fordítás"],
      synonyms: [],
    });
  }

  // A synonyms kulcsot üresen küldjük
  return NextResponse.json({ translation: finalMeanings, synonyms: [] });
}
// import { NextResponse } from 'next/server';
// import path from 'path';
// import { promises as fs } from 'fs';

// export const dynamic = 'force-dynamic';

// let superDictionary = null;
// async function getFromLocalDictionary(word) {
//   try {
//     if (superDictionary === null) {
//       console.log('📚 Szuper-szótár betöltése...');
//       const jsonPath = path.join(process.cwd(), 'public', 'data', 'super_dictionary.json');
//       const jsonData = await fs.readFile(jsonPath, 'utf-8');
//       superDictionary = JSON.parse(jsonData);
//       console.log('✅ Szuper-szótár sikeresen betöltve.');
//     }
//     const result = superDictionary[word.toLowerCase()];
//     return result || [];
//   } catch (error) {
//     console.error(`❌ Hiba a szuper-szótár olvasásakor: ${error.message}`);
//     superDictionary = {};
//     return [];
//   }
// }

// // Végső tartalék angol definíció
// async function getEnglishDefinition(word) {
//   try {
//     const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
//     if (!response.ok) return null;
//     const data = await response.json();
//     const definition = data[0]?.meanings?.[0]?.definitions?.[0]?.definition;
//     return definition ? `(def.) ${definition}` : null;
//   } catch (error) {
//     return null;
//   }
// }

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const word = searchParams.get('word');

//   if (!word) {
//     return NextResponse.json({ translation: [], synonyms: [] });
//   }

//   // 1. LÉPÉS: Keresés a Szuper-szótárban
//   let finalMeanings = await getFromLocalDictionary(word);

//   // 2. LÉPÉS: Végső tartalék, ha a szó valamiért nincs a szótárunkban
//   if (finalMeanings.length === 0) {
//     console.log(`‼️ '${word}' nincs a szuper-szótárban. Próbálkozás angol definícióval.`);
//     const definition = await getEnglishDefinition(word);
//     if (definition) {
//       finalMeanings.push(definition);
//     }
//   }

//   if (finalMeanings.length === 0) {
//     return NextResponse.json({ translation: ["Nincs elérhető fordítás"], synonyms: [] });
//   }

//   return NextResponse.json({ translation: finalMeanings, synonyms: [] });
// }
