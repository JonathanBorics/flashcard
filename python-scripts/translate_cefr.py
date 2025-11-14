#!/usr/bin/env python3
"""
CEFR Word List Batch Translator
Használat: python translate_cefr.py
"""

import google.generativeai as genai
import csv
import json
import time
from pathlib import Path

# ============================================
# KONFIGURÁCIÓ
# ============================================
API_KEY = "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"
INPUT_CSV = "../public/data/word_list_cefr.csv"  # Relatív útvonal a CSV-hez
OUTPUT_JSON = "../public/data/cefr_dictionary.json"  # Output közvetlenül a Next.js data mappába
BATCH_SIZE = 30  # ⬅️ Csökkentve 30-ról 10-re (kevesebb kérés)
DELAY_BETWEEN_BATCHES = 3  # ⬅️ Növelve 3-ról 10-re (lassabb tempo)

# 🧪 TESZT MÓD - csak az első 50 szót fordítja le
TEST_MODE = False  # ⬅️ False = ÖSSZES szó (~8000), True = csak 50
TEST_WORD_LIMIT = 50

# ============================================
# GOOGLE GEMINI SETUP
# ============================================
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('models/gemini-2.5-flash')  # Működő modell!

# ============================================
# FORDÍTÓ FÜGGVÉNY
# ============================================
def translate_word_batch(words_batch):
    """
    Batch fordítás - egyszerre több szó
    Returns: dict {"word": ["magyar1", "magyar2", ...], ...}
    """
    words_text = ", ".join(words_batch)
    
    prompt = f"""Te egy professzionális angol-magyar fordító vagy.

Feladat: Fordítsd le ezeket az angol szavakat magyarra.
Minden szóhoz adj meg 2-5 leggyakoribb magyar jelentést.

KRITIKUS SZABÁLYOK:
1. CSAK ékezetes magyar karaktereket használj (á, é, í, ó, ö, ő, ú, ü, ű)
2. SOHA ne használj ã, Ã, vagy más nem-magyar karaktereket
3. Minden jelentés legyen KISBETŰS (kivéve tulajdonnevek)
4. Rövid, tömör fordítások (1-2 szó max, kivéve kifejezések)

Formátum (JSON):
{{
  "work": ["munka", "dolgozni", "működik"],
  "world": ["világ", "föld"],
  "example": ["példa", "minta"]
}}

Fordítandó szavak: {words_text}

CSAK a JSON-t add vissza, semmi mást! Ne írj markdown code block-okat!
"""
    
    try:
        response = model.generate_content(prompt)
        result_text = response.text.strip()
        
        # Clean up markdown code blocks if present
        if result_text.startswith('```json'):
            result_text = result_text[7:]
        elif result_text.startswith('```'):
            result_text = result_text[3:]
        
        if result_text.endswith('```'):
            result_text = result_text[:-3]
        
        result_text = result_text.strip()
        
        # Parse JSON
        translations = json.loads(result_text)
        
        # Validate and clean results
        cleaned = {}
        for word, meanings in translations.items():
            if isinstance(meanings, list):
                # Remove empty strings and limit to 5 meanings
                cleaned[word.lower()] = [m.strip() for m in meanings if m.strip()][:5]
            elif isinstance(meanings, str):
                cleaned[word.lower()] = [meanings.strip()]
        
        return cleaned
        
    except json.JSONDecodeError as e:
        print(f"  ⚠️  JSON parse hiba: {e}")
        print(f"  Raw response: {result_text[:200]}...")
        return {}
    except Exception as e:
        print(f"  ❌ API hiba: {e}")
        return {}

# ============================================
# FALLBACK: Egyedi szó fordítása
# ============================================
def translate_single_word(word):
    """Ha batch fail, próbáljuk egyenként"""
    try:
        result = translate_word_batch([word])
        return result.get(word.lower(), ["(fordítási hiba)"])
    except:
        return ["(fordítási hiba)"]

# ============================================
# CSV BEOLVASÁS - STRUKTURÁLT
# ============================================
def load_words_from_csv(csv_path):
    """
    Load words from CEFR CSV file with metadata
    Returns: list of dicts with word, pos, cefr info
    CSV format: word;pos;CEFR;...
    """
    word_entries = []
    
    if not Path(csv_path).exists():
        print(f"❌ Hiba: {csv_path} nem található!")
        print(f"   Jelenlegi mappa: {Path.cwd()}")
        return []
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter=';')
        
        # Skip header
        header = next(reader, None)
        print(f"📄 CSV header: {header}")
        
        for row in reader:
            if row and len(row) >= 3:
                word = row[0].strip()
                pos = row[1].strip() if len(row) > 1 else ""
                cefr = row[2].strip() if len(row) > 2 else ""
                
                if word and cefr:  # Must have word and CEFR level
                    word_entries.append({
                        'word': word,
                        'pos': pos,
                        'cefr': cefr
                    })
    
    return word_entries

# ============================================
# MAIN BATCH PROCESSING
# ============================================
def main():
    print("=" * 60)
    print("🚀 CEFR BATCH TRANSLATOR - Google Gemini")
    print("=" * 60)
    print()
    
    # Load word entries with metadata
    print(f"📚 CSV beolvasás: {INPUT_CSV}")
    word_entries = load_words_from_csv(INPUT_CSV)
    
    if not word_entries:
        print("❌ Nincs mit fordítani!")
        return
    
    print(f"✅ Összesen {len(word_entries)} bejegyzés betöltve")
    
    # Group by unique words for batch translation
    unique_words = {}
    for entry in word_entries:
        word = entry['word'].lower()
        if word not in unique_words:
            unique_words[word] = []
        unique_words[word].append(entry)
    
    print(f"📖 Egyedi szavak: {len(unique_words)}")
    print()
    
    # Load existing dictionary if exists
    dictionary = {}
    if Path(OUTPUT_JSON).exists():
        try:
            with open(OUTPUT_JSON, 'r', encoding='utf-8') as f:
                dictionary = json.load(f)
            print(f"📖 Meglévő szótár betöltve: {len(dictionary)} szó")
        except:
            print("⚠️  Meglévő szótár nem olvasható, új kezdése...")
    
    # Filter out already translated words
    words_to_translate = [w for w in unique_words.keys() if w not in dictionary]
    
    # 🧪 TESZT MÓD - csak első 50 szó
    if TEST_MODE:
        words_to_translate = words_to_translate[:TEST_WORD_LIMIT]
        print(f"🧪 TESZT MÓD: Csak {len(words_to_translate)} szót fordítunk!")
    
    print(f"🔄 Fordítandó szavak: {len(words_to_translate)}")
    print()
    
    if len(words_to_translate) == 0:
        print("✅ Minden szó már le van fordítva!")
        return
    
    # Batch processing - translate words only (not entries)
    total_batches = (len(words_to_translate) + BATCH_SIZE - 1) // BATCH_SIZE
    
    for i in range(0, len(words_to_translate), BATCH_SIZE):
        batch_words = words_to_translate[i:i+BATCH_SIZE]
        batch_num = i // BATCH_SIZE + 1
        
        print(f"📦 Batch {batch_num}/{total_batches} - {len(batch_words)} szó")
        print(f"   Szavak: {', '.join(batch_words[:5])}{'...' if len(batch_words) > 5 else ''}")
        
        try:
            # Translate batch (just the words, not metadata)
            translations = translate_word_batch(batch_words)
            
            if translations:
                # Add translations with full entry info
                for word in batch_words:
                    if word in translations:
                        # Get all entries for this word
                        entries = unique_words[word]
                        
                        # Create structured entries with meanings
                        word_data = []
                        for entry in entries:
                            word_data.append({
                                'meanings': translations[word],
                                'pos': entry['pos'],
                                'cefr': entry['cefr']
                            })
                        
                        dictionary[word] = word_data
                
                success_count = len(translations)
                print(f"   ✅ Sikeresen fordítva: {success_count}/{len(batch_words)} szó")
                
                # Handle failed words in batch
                failed_words = [w for w in batch_words if w not in translations]
                if failed_words:
                    print(f"   🔄 Egyedi próbálkozás: {len(failed_words)} szó...")
                    for word in failed_words:
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
                print(f"   ⚠️  Batch fail! Egyedi próbálkozás...")
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
            
            # Auto-save after each batch
            with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
                json.dump(dictionary, f, ensure_ascii=False, indent=2)
            
            print(f"   💾 Mentve! Összesen: {len(dictionary)} szó a szótárban")
            
        except Exception as e:
            print(f"   ❌ Hiba történt: {e}")
        
        print()
        
        # Rate limit protection
        if batch_num < total_batches:
            time.sleep(DELAY_BETWEEN_BATCHES)
    
    # Final summary
    print("=" * 60)
    print("🎉 FORDÍTÁS BEFEJEZVE!")
    print("=" * 60)
    print(f"✅ Összesen {len(dictionary)} egyedi szó lefordítva")
    print(f"📊 Összes bejegyzés: {len(word_entries)}")
    print(f"📁 Fájl: {OUTPUT_JSON}")
    print()
    
    # Show sample translations
    print("📋 Példa fordítások (struktúrával):")
    sample_words = list(dictionary.keys())[:3]
    for word in sample_words:
        print(f"\n  {word}:")
        for entry in dictionary[word]:
            meanings = ', '.join(entry['meanings'])
            print(f"    - {entry['pos']} ({entry['cefr']}): {meanings}")
    
    print()
    print("✨ Kész! Most már használhatod a Next.js appban!")


# ============================================
# RUN
# ============================================
if __name__ == "__main__":
    main()