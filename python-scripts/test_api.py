#!/usr/bin/env python3
"""
TESZT SCRIPT - Kipróbálás néhány szóval
"""

import google.generativeai as genai
import json

# API Key
API_KEY = "AIzaSyBuX-zr59Qv5a6jThQAmyD4lg6Dh3jhbQc"

# Setup
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('models/gemini-2.5-flash')  # Stabil és gyors!

# Teszt szavak
test_words = ["work", "world", "example", "learning", "computer"]

print("🧪 TESZT FORDÍTÁS - 5 szó")
print("=" * 50)
print()

prompt = f"""Te egy professzionális angol-magyar fordító vagy.

Feladat: Fordítsd le ezeket az angol szavakat magyarra.
Minden szóhoz adj meg 2-4 leggyakoribb magyar jelentést.

KRITIKUS SZABÁLYOK:
1. CSAK ékezetes magyar karaktereket használj (á, é, í, ó, ö, ő, ú, ü, ű)
2. Minden jelentés legyen KISBETŰS
3. Rövid, tömör fordítások

Formátum (JSON):
{{
  "work": ["munka", "dolgozni", "működik"],
  "world": ["világ", "föld"]
}}

Fordítandó szavak: {", ".join(test_words)}

CSAK a JSON-t add vissza, semmi mást!
"""

try:
    print("📤 API hívás...")
    response = model.generate_content(prompt)
    result_text = response.text.strip()
    
    print("✅ Válasz megérkezett!")
    print()
    
    # Clean up
    if result_text.startswith('```json'):
        result_text = result_text[7:]
    elif result_text.startswith('```'):
        result_text = result_text[3:]
    if result_text.endswith('```'):
        result_text = result_text[:-3]
    
    result_text = result_text.strip()
    
    # Parse
    translations = json.loads(result_text)
    
    print("📋 FORDÍTÁSOK:")
    print("-" * 50)
    for word, meanings in translations.items():
        print(f"  {word:15} → {', '.join(meanings)}")
    
    print()
    print("=" * 50)
    print("🎉 TESZT SIKERES!")
    print("Most futtasd: python translate_cefr.py")
    
except json.JSONDecodeError as e:
    print(f"❌ JSON parse hiba: {e}")
    print(f"Raw response:\n{result_text}")
    
except Exception as e:
    print(f"❌ Hiba: {e}")