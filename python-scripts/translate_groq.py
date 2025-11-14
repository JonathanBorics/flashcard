#!/usr/bin/env python3
"""
CEFR Translator - Groq API (GYORS & NAGY LIMIT!)
"""

from groq import Groq
import csv
import json
import time
from pathlib import Path

# ============================================
# KONFIGURÁCIÓ
# ============================================
API_KEY = "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"
INPUT_CSV = "../public/data/word_list_cefr.csv"
OUTPUT_JSON = "../public/data/cefr_dictionary.json"
BATCH_SIZE = 30  # Groq gyors, vissza 30-ra!
DELAY_BETWEEN_BATCHES = 2  # Gyorsabb!

TEST_MODE = False
TEST_WORD_LIMIT = 50

# ============================================
# GROQ SETUP
# ============================================
client = Groq(api_key=API_KEY)

# ============================================
# FORDÍTÓ FÜGGVÉNY
# ============================================
def translate_word_batch(words_batch):
    words_text = ", ".join(words_batch)
    
    prompt = f"""Te egy angol-magyar fordító vagy.

Fordítsd le ezeket magyarra, 2-5 jelentéssel:
{words_text}

JSON formátum:
{{
  "work": ["munka", "dolgozni"],
  "world": ["világ", "föld"]
}}

CSAK a JSON-t add vissza!"""
    
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # Gyors és okos!
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        
        result_text = response.choices[0].message.content.strip()
        
        # Clean up
        if result_text.startswith('```json'):
            result_text = result_text[7:]
        elif result_text.startswith('```'):
            result_text = result_text[3:]
        if result_text.endswith('```'):
            result_text = result_text[:-3]
        
        result_text = result_text.strip()
        translations = json.loads(result_text)
        
        # Clean
        cleaned = {}
        for word, meanings in translations.items():
            if isinstance(meanings, list):
                cleaned[word.lower()] = [m.strip() for m in meanings if m.strip()][:5]
            elif isinstance(meanings, str):
                cleaned[word.lower()] = [meanings.strip()]
        
        return cleaned
        
    except json.JSONDecodeError as e:
        print(f"  ⚠️  JSON hiba: {e}")
        return {}
    except Exception as e:
        print(f"  ❌ API hiba: {e}")
        return {}

def translate_single_word(word):
    try:
        result = translate_word_batch([word])
        return result.get(word.lower(), ["(fordítási hiba)"])
    except:
        return ["(fordítási hiba)"]

# ============================================
# CSV BEOLVASÁS
# ============================================
def load_words_from_csv(csv_path):
    word_entries = []
    
    if not Path(csv_path).exists():
        print(f"❌ Hiba: {csv_path} nem található!")
        return []
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter=';')
        header = next(reader, None)
        
        for row in reader:
            if row and len(row) >= 3:
                word = row[0].strip()
                pos = row[1].strip() if len(row) > 1 else ""
                cefr = row[2].strip() if len(row) > 2 else ""
                
                if word and cefr:
                    word_entries.append({
                        'word': word,
                        'pos': pos,
                        'cefr': cefr
                    })
    
    return word_entries

# ============================================
# MAIN
# ============================================
def main():
    print("=" * 60)
    print("🚀 CEFR TRANSLATOR - Groq (GYORS!)")
    print("=" * 60)
    print()
    
    if API_KEY == "YOUR_GROQ_API_KEY_HERE":
        print("❌ API kulcs nincs beállítva!")
        print("   Regisztrálj: https://console.groq.com")
        return
    
    print(f"📚 CSV beolvasás: {INPUT_CSV}")
    word_entries = load_words_from_csv(INPUT_CSV)
    
    if not word_entries:
        print("❌ Nincs mit fordítani!")
        return
    
    print(f"✅ Összesen {len(word_entries)} bejegyzés")
    
    # Group by words
    unique_words = {}
    for entry in word_entries:
        word = entry['word'].lower()
        if word not in unique_words:
            unique_words[word] = []
        unique_words[word].append(entry)
    
    print(f"📖 Egyedi szavak: {len(unique_words)}")
    
    # Load existing
    dictionary = {}
    if Path(OUTPUT_JSON).exists():
        try:
            with open(OUTPUT_JSON, 'r', encoding='utf-8') as f:
                dictionary = json.load(f)
            print(f"📖 Meglévő: {len(dictionary)} szó")
        except:
            print("⚠️  Új szótár...")
    
    # Filter
    words_to_translate = [w for w in unique_words.keys() if w not in dictionary]
    
    if TEST_MODE:
        words_to_translate = words_to_translate[:TEST_WORD_LIMIT]
        print(f"🧪 TESZT: {len(words_to_translate)} szó")
    
    print(f"🔄 Fordítandó: {len(words_to_translate)}")
    print()
    
    if len(words_to_translate) == 0:
        print("✅ Minden kész!")
        return
    
    # Batch processing
    total_batches = (len(words_to_translate) + BATCH_SIZE - 1) // BATCH_SIZE
    
    for i in range(0, len(words_to_translate), BATCH_SIZE):
        batch_words = words_to_translate[i:i+BATCH_SIZE]
        batch_num = i // BATCH_SIZE + 1
        
        print(f"📦 Batch {batch_num}/{total_batches} - {len(batch_words)} szó")
        print(f"   {', '.join(batch_words[:5])}...")
        
        try:
            translations = translate_word_batch(batch_words)
            
            if translations:
                for word in batch_words:
                    if word in translations:
                        entries = unique_words[word]
                        word_data = []
                        for entry in entries:
                            word_data.append({
                                'meanings': translations[word],
                                'pos': entry['pos'],
                                'cefr': entry['cefr']
                            })
                        dictionary[word] = word_data
                
                print(f"   ✅ {len(translations)}/{len(batch_words)} szó")
                
                # Failed words
                failed = [w for w in batch_words if w not in translations]
                if failed:
                    print(f"   🔄 Egyedi: {len(failed)} szó...")
                    for word in failed:
                        meanings = translate_single_word(word)
                        entries = unique_words[word]
                        word_data = []
                        for entry in entries:
                            word_data.append({
                                'meanings': meanings,
                                'pos': entry['pos'],
                                'cefr': entry['cefr']
                            })
                        dictionary[word] = word_data
                        time.sleep(1)
            else:
                print(f"   ⚠️  Batch fail!")
                for word in batch_words:
                    meanings = translate_single_word(word)
                    entries = unique_words[word]
                    word_data = []
                    for entry in entries:
                        word_data.append({
                            'meanings': meanings,
                            'pos': entry['pos'],
                            'cefr': entry['cefr']
                        })
                    dictionary[word] = word_data
                    time.sleep(1)
            
            # Save
            with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
                json.dump(dictionary, f, ensure_ascii=False, indent=2)
            
            print(f"   💾 Mentve! Össz: {len(dictionary)} szó")
            
        except Exception as e:
            print(f"   ❌ Hiba: {e}")
        
        print()
        
        if batch_num < total_batches:
            time.sleep(DELAY_BETWEEN_BATCHES)
    
    # Summary
    print("=" * 60)
    print("🎉 KÉSZ!")
    print("=" * 60)
    print(f"✅ {len(dictionary)} szó lefordítva")
    print(f"📁 {OUTPUT_JSON}")

if __name__ == "__main__":
    main()