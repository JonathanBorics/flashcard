// translate_from_file.js
const fs = require("fs").promises;
const translate = require("@iamtraction/google-translate");

async function translateFromCSV(inputFile, outputFile) {
  // Fájl beolvasása
  const content = await fs.readFile(inputFile, "utf-8");
  const words = content.split("\n").filter((w) => w.trim());

  console.log(`📚 Found ${words.length} words to translate\n`);

  const results = [];
  const batchSize = 10;

  for (let i = 0; i < words.length; i += batchSize) {
    const batch = words.slice(i, i + batchSize);
    const progress = Math.round((i / words.length) * 100);

    console.log(
      `[${progress}%] Translating batch ${
        Math.floor(i / batchSize) + 1
      }/${Math.ceil(words.length / batchSize)}`
    );

    const promises = batch.map((word) =>
      translate(word.trim(), { from: "en", to: "hu" })
        .then((res) => ({
          word: word.trim(),
          translation: res.text,
          success: true,
        }))
        .catch((err) => ({
          word: word.trim(),
          error: err.message,
          success: false,
        }))
    );

    const batchResults = await Promise.all(promises);
    results.push(...batchResults);

    // Delay
    await new Promise((r) => setTimeout(r, 1500));
  }

  // Mentés JSON-ba
  await fs.writeFile(outputFile, JSON.stringify(results, null, 2));

  console.log(`\n✅ Saved to ${outputFile}`);

  const successful = results.filter((r) => r.success).length;
  console.log(`📊 ${successful}/${words.length} successful translations`);

  return results;
}

// Használat
translateFromCSV("word_list.txt", "translations.json").catch((err) =>
  console.error("Error:", err)
);
