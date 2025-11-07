# 📊 Angol Tanuló Flashcard App - Frequency Edition v3.0

## 🎯 Új Funkciók v3.0

✨ **2 SZÓFORRÁS:**
1. **📊 Frequency List (CSV)** - 172,000 gyakori angol szó ⭐ **ÚJ!**
2. **🎓 CEFR (CSV)** - 7,989 szó CEFR szintekkel (A1-C2)

✨ **GYAKORISÁG SZINTEK:**
- 🌟 **Top 1,000** - Alapszavak (the, a, to, in...)
- ⭐ **Top 10,000** - Mindennapi szavak **(AJÁNLOTT)**
- 💫 **Top 50,000** - Haladó szókincs
- 🚀 **Összes (172k)** - Teljes lista

✨ **MAGYAR FORDÍTÁS** - Mindkét forráshoz Glosbe API-val!

✨ **CEFR SZINTEK** - A1 (kezdő) → C2 (anyanyelvi)

---

## 📦 Telepítés

### 1. Next.js Projekt létrehozása

```bash
npx create-next-app@latest flashcard-app
cd flashcard-app
```

**Válaszd ezeket:**
- TypeScript? → **No**
- ESLint? → **Yes**
- Tailwind? → **No**
- App Router? → **Yes**

### 2. Függőségek telepítése

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material next-pwa
```

### 3. Fájlok másolása

Csomagold ki a ZIP-et és másold át **MINDEN** fájlt:

```
flashcard-app/
├── app/
│   ├── flashcards/
│   │   └── page.js         ⭐ Frequency support
│   ├── settings/
│   │   └── page.js         ⭐ Frequency levels
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── components/
│   └── ThemeRegistry.js
├── utils/
│   └── api.js              ⭐ Frequency parser
├── data/                   ⭐ IDE TEDD A FÁJLOKAT!
│   ├── valid_words_sorted_by_frequency.csv  ← TE!
│   └── word_list_cefr.csv                   ← TE!
├── public/
│   └── manifest.json
└── next.config.js
```

---

## 📁 FONTOS: Adatfájlok elhelyezése

### 1️⃣ Frequency CSV fájl (172k szó) ⭐ **ÚJ!**

**Eredeti név:** `valid_words_sorted_by_frequency.csv`

**Hol találod:**
- Te már letöltötted (4.9 MB fájl)
- Lásd a képen: 172,784 sor

**Ide másold:** `flashcard-app/data/valid_words_sorted_by_frequency.csv`

**Formátum:**
```csv
sorszám,szó,gyakoriság,,
1,the,23135851162,,
2,of,13151942776,,
3,and,12997637966,,
```

---

### 2️⃣ CEFR CSV fájl (7989 szó)

**GitHub:** https://github.com/facebookresearch/TEACHER

**Direkt link:**
```
https://raw.githubusercontent.com/facebookresearch/TEACHER/main/datasets/word_list_cefr.csv
```

**Ide másold:** `flashcard-app/data/word_list_cefr.csv`

**Formátum:**
```csv
headword;pos;CEFR
hello;noun;A1
ability;noun;A2
```

---

## 🚀 Indítás

```bash
npm run dev
```

Nyisd meg: **http://localhost:3000**

---

## 🎮 Használat

### Főoldal
1. **"Kezdés"** gomb → Flashcard oldal
2. **"Beállítások"** link → Fájl és szint választás

### Beállítások (/settings)
1. **Válaszd a szóforrást:**
   - 📊 **Frequency List** (172k, gyakori szavak) ⭐ **AJÁNLOTT**
   - 🎓 **CEFR** (8k, strukturált szintek)

2. **Ha Frequency → Válaszd a szintet:**
   - 🌟 **Top 1k** - Alapszavak (I, you, the, is...)
   - ⭐ **Top 10k** - Mindennapi szavak **(LEGJOBB KEZDŐKNEK)**
   - 💫 **Top 50k** - Haladó
   - 🚀 **Összes** - 172k szó (nehéz!)

3. **Ha CEFR → Válaszd a szintet:**
   - A1, A2, B1, B2, C1, C2

4. **Mentsd** a beállításokat

### Flashcard oldal (/flashcards)
1. **Kártya** → kattints → magyar fordítás 🇭🇺
2. **🔊 Hang gomb** → angol kiejtés
3. **#Rank chip** → hányadik leggyakoribb (pl. #15 = 15. leggyakoribb)
4. **Következő szó** → új random szó

---

## 🎯 Funkciók Részletesen

### 📊 Frequency Mode (CSV) - **AJÁNLOTT** ⭐

**Miért jobb:**
- ✅ **Gyakoriság szerint rendezve** (leggyakoribbak elől)
- ✅ **172,000 szó** (legtöbb)
- ✅ **Normál angol szavak** (the, and, to... nem "anarchic", "zygodactyl")
- ✅ **4 szint választható** (Top 1k → Összes)
- ✅ **Rank megjelenítés** (#15 = 15. leggyakoribb)

**Példa:**
```
#3: and
Magyar: és

#1547: beautiful
Magyar: szép, gyönyörű
```

**Szintek:**
- **Top 1,000** → Alapszintű kommunikáció (I, you, is, the...)
- **Top 10,000** → Mindennapi beszélgetés ✅ **KEZDD EZZEL!**
- **Top 50,000** → Könyvek, újságok olvasása
- **Összes (172k)** → Teljes szókincs (ritka szavak is)

---

### 🎓 CEFR Mode (CSV)

**Mikor használd:**
- ✅ Strukturált tanulás (A1 → C2)
- ✅ Vizsgára készülsz (Cambridge, IELTS...)
- ✅ Konkrét szintet akarsz elérni

**CEFR szintek:**
- **A1** - Kezdő (hello, thank you...)
- **A2** - Elemi (family, work...)
- **B1** - Középhaladó
- **B2** - Haladó
- **C1** - Felsőfok
- **C2** - Anyanyelvi

---

## 🔄 API Működés

### Adatfolyam:
```
1. Beállítások betöltése (Frequency/CEFR + szint)
   ↓
2. Random szó választása a fájlból (gyakoriság/szint szerint)
   ↓
3. Cache ellenőrzés (LocalStorage)
   ↓
4a. Cache találat → Instant megjelenítés ⚡ (<100ms)
4b. Nincs cache → Glosbe API fordítás (1-3 sec)
   ↓
5. Magyar fordítás + Cache mentés
   ↓
6. Megjelenítés + Rank/CEFR info
```

### Cache:
- **Tárolás:** LocalStorage (7 nap)
- **Gyorsítás:** 2. betöltéstől instant
- **Törlés:** Beállítások → "Cache törlése"

---

## 📊 Frequency vs CEFR Összehasonlítás

| Szempont | Frequency (172k) ⭐ | CEFR (8k) |
|----------|---------------------|-----------|
| **Szavak száma** | 172,000 | 7,989 |
| **Szervezés** | Gyakoriság szerint | Nehézségi szint szerint |
| **Szavak típusa** | Gyakori, normál szavak | Strukturált lista |
| **Szintek** | Top 1k/10k/50k/Összes | A1/A2/B1/B2/C1/C2 |
| **Rank info** | ✅ Igen (#15) | ❌ Nem |
| **Szófaj** | ❌ Nem | ✅ Igen (noun, verb...) |
| **Ajánlott** | ✅ **Legtöbb esetben** | Vizsgára, struktúrára |

**Melyiket válaszd?**
- **Kezdő?** → Frequency Top 1k vagy CEFR A1
- **Mindennapi angol?** → Frequency Top 10k ⭐ **LEGJOBB**
- **Vizsga?** → CEFR (A1-C2)
- **Haladó?** → Frequency Top 50k
- **Mindenből tanulnál?** → Frequency Összes

---

## 🐛 Hibaelhárítás

### "Nem található fájl" hiba
```
Ellenőrizd:
✅ data/valid_words_sorted_by_frequency.csv létezik
✅ data/word_list_cefr.csv létezik
✅ Fájlnevek PONTOSAK (kis/nagybetű!)
✅ Fájlok nem üresek (frequency: 4.9 MB)
```

### "No words available"
```
1. Fájl formátum helyes? (CSV)
2. Válassz másik szintet (pl. Top 10k)
3. Restart: npm run dev
```

### API lassú
```
NORMÁLIS:
Első betöltés: 1-3 sec (API)
Második: <100ms (cache) ⚡
```

### Fura szavak (pl. "anarchic")
```
✅ MEGOLDVA!
Frequency lista → normál szavak (the, and, is...)
Régi Dictionary lista töröltük (fura szavak voltak)
```

---

## 📱 PWA Telepítés

### Deploy Vercel-re
```bash
git init
git add .
git commit -m "Flashcard app v3 - Frequency"
git push origin main

# Vercel.com → Import Project
```

### Mobil telepítés
1. Chrome/Safari → Deployed URL
2. Menü → "Hozzáadás a kezdőképernyőhöz"
3. App ikon megjelenik!

---

## 🎨 Testreszabás

### Frequency szintek módosítása
```javascript
// utils/api.js
export const FREQUENCY_LEVELS = {
  TOP_1K: '1000',
  TOP_5K: '5000',     // Új szint!
  TOP_10K: '10000',
  // ...
};
```

### Színek megváltoztatása
```javascript
// components/ThemeRegistry.js
primary: { main: '#YOUR_COLOR' }
```

---

## ✅ Telepítési Checklist

- [ ] Next.js projekt létrehozva
- [ ] Függőségek telepítve (`npm install`)
- [ ] Fájlok átmásolva (app, components, utils...)
- [ ] **data/valid_words_sorted_by_frequency.csv** létezik ⭐ (4.9 MB)
- [ ] **data/word_list_cefr.csv** létezik (223 KB)
- [ ] `npm run dev` működik
- [ ] http://localhost:3000 betölt
- [ ] Beállítások oldal működik
- [ ] Frequency mód működik ⭐
- [ ] Rank megjelenik (#15)
- [ ] Magyar fordítás működik
- [ ] Top 10k szavak normálisak (the, and, is...)

---

## 🎯 Gyors Start

1. ✅ Tedd be a **valid_words_sorted_by_frequency.csv** fájlt
2. ✅ Tedd be a **word_list_cefr.csv** fájlt
3. ✅ `npm install && npm run dev`
4. ✅ Beállítások → **Frequency List** + **Top 10k** ⭐
5. ✅ Kezdés → Tanulj!

---

## 📈 Teljesítmény

### Frequency Mode:
- **Fájl méret:** ~4.9 MB
- **Betöltés:** 1-2 sec (első)
- **Szavak:** 172,784
- **Cache után:** <100ms ⚡

### CEFR Mode:
- **Fájl méret:** ~223 KB
- **Betöltés:** <500ms (első)
- **Szavak:** 7,989
- **Cache után:** <50ms ⚡

---

## 🌟 v1 → v2 → v3 Összehasonlítás

| Feature | v1.0 | v2.0 | v3.0 ⭐ |
|---------|------|------|---------|
| Szavak | 230 fix | 102k Dictionary | 172k Frequency |
| Szóforrás | Fix lista | 2 fájl | 2 fájl |
| Szavak típusa | - | Fura (anarchic...) | **Normál (the, and...)** ✅ |
| Gyakoriság rank | ❌ | ❌ | ✅ (#15) |
| Szint választás | ❌ | ❌ | ✅ (Top 1k-172k) |
| Magyar fordítás | ✅ | ✅ | ✅ |
| CEFR szintek | ❌ | ✅ | ✅ |

**v3.0 = Legjobb! Normál szavak + Gyakoriság + 172k szó! 🚀**

---

**Készítette:** Borics + Claude  
**Verzió:** 3.0 (Frequency Edition)  
**Licenc:** Szabad felhasználás

---

## 🎉 Összefoglaló

✨ **ÚJ:** Frequency List (172k gyakori szó)  
✨ **ÚJ:** Gyakoriság szintek (Top 1k-172k)  
✨ **ÚJ:** Rank megjelenítés (#15)  
✅ **Normál angol szavak** (the, and, is... nem "anarchic")  
✅ **Magyar fordítás** (Glosbe API)  
✅ **CEFR szintek** megtartva (A1-C2)  

**Kezdd a Top 10k-val! ⭐**
