#!/usr/bin/env python3
"""
TESZT - DeepSeek API
"""

from openai import OpenAI
import json

# DeepSeek API kulcs
API_KEY = "sk-e96782f4f7ea4d098fe3f9b773ccdbf2"

# Setup
client = OpenAI(
    api_key=API_KEY,
    base_url="https://api.deepseek.com"
)

# Teszt szavak
test_words = ["work", "world", "example", "learning", "computer"]

print("🧪 TESZT FORDÍTÁS - DeepSeek - 5 szó")
print("=" * 50)
print()

prompt = f"""Te egy professzionális angol-magyar fordító vagy.

Fordítsd le ezeket az angol szavakat magyarra.
Minden szóhoz adj meg 2-4 magyar jelentést.

SZABÁLYOK:
1. CSAK ékezetes magyar karakterek (á, é, í, ó, ö, ő, ú, ü, ű)
2. Minden jelentés KISBETŰS
3. Rövid fordítások

Formátum (JSON):
{{
  "work": ["munka", "dolgozni", "működik"],
  "world": ["világ", "föld"]
}}

Szavak: {", ".join(test_words)}

CSAK a JSON-t add vissza!
"""

try:
    print("📤 API hívás...")
    
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )
    
    result_text = response.choices[0].message.content.strip()
    
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
    print("✅ DeepSeek működik! Most futtasd a teljes fordítást!")
    
except json.JSONDecodeError as e:
    print(f"❌ JSON parse hiba: {e}")
    print(f"Raw response:\n{result_text}")
    
except Exception as e:
    print(f"❌ Hiba: {e}")