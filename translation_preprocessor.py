import pandas as pd
import requests
import json
import time
from tqdm import tqdm

# === KONFIGURÁCIÓ ===
# Most már csak a CEFR fájlt használjuk
INPUT_CEFR_FILE = "public/data/word_list_cefr.csv"
# A kimeneti fájl neve is tükrözze ezt
OUTPUT_DICTIONARY_FILE = "public/data/cefr_dictionary.json"

# === FORDÍTÓ FÜGGVÉNY (Változatlan) ===
def get_hungarian_meanings(word):
    meanings = set()
    try:
        response = requests.post(
            "https://deep-translator-api.azurewebsites.net/google/",
            json={"source": "en", "target": "hu", "text": word},
            timeout=5
        )
        if response.status_code == 200:
            translation = response.json().get("translation")
            if translation:
                meanings.add(translation.lower())
    except requests.RequestException:
        pass

    try:
        response = requests.post(
            "https://deep-translator-api.azurewebsites.net/pons/",
            json={"source": "en", "target": "hu", "text": word},
            timeout=5
        )
        if response.status_code == 200:
            translations = response.json().get("translation")
            if isinstance(translations, list):
                for t in translations:
                    meanings.add(t.lower())
    except requests.RequestException:
        pass
        
    return list(meanings)

# === FŐ FELDOLGOZÓ LOGIKA (Leegyszerűsítve) ===
def main():
    all_words = set()

    print("1. Lépés: Angol szavak összegyűjtése a CEFR CSV fájlból...")
    try:
        df_cefr = pd.read_csv(INPUT_CEFR_FILE, sep=';', header=0)
        all_words.update(df_cefr.iloc[:, 0].str.lower())
    except Exception as e:
        print(f"Hiba: A '{INPUT_CEFR_FILE}' fájl feldolgozása sikertelen: {e}")
        return # Hiba esetén álljon le a program

    unique_words = sorted([word for word in all_words if isinstance(word, str)])
    total_words = len(unique_words)
    print(f"Összesen {total_words} egyedi angol szó összegyűjtve.")
    
    try:
        with open(OUTPUT_DICTIONARY_FILE, 'r', encoding='utf-8') as f:
            full_dictionary = json.load(f)
        print(f"Már létező szótár betöltve. {len(full_dictionary)} szó már le van fordítva.")
    except (FileNotFoundError, json.JSONDecodeError):
        full_dictionary = {}

    print("\n2. Lépés: Fordítások lekérése...")
    
    words_to_translate = [word for word in unique_words if word not in full_dictionary]
    
    with tqdm(total=len(words_to_translate), desc="Szavak fordítása") as pbar:
        for word in words_to_translate:
            translations = get_hungarian_meanings(word)
            if translations:
                full_dictionary[word] = translations
            
            pbar.set_postfix_str(f"Aktuális szó: {word}")
            pbar.update(1)

            if pbar.n > 0 and pbar.n % 100 == 0:
                with open(OUTPUT_DICTIONARY_FILE, 'w', encoding='utf-8') as f:
                    json.dump(full_dictionary, f, ensure_ascii=False, indent=2)
            
            time.sleep(1)

    print("\n3. Lépés: A végső szótár mentése...")
    with open(OUTPUT_DICTIONARY_FILE, 'w', encoding='utf-8') as f:
        json.dump(full_dictionary, f, ensure_ascii=False, indent=2)

    print(f"\nKész! A szótár elmentve a '{OUTPUT_DICTIONARY_FILE}' fájlba. Összesen {len(full_dictionary)} szó van a szótárban.")

if __name__ == "__main__":
    main()