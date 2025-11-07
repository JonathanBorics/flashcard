"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  IconButton,
  Divider,
  Alert,
  Chip,
} from "@mui/material";
import { ArrowBack, Delete } from "@mui/icons-material";
import Link from "next/link";
import {
  getCurrentSource,
  setCurrentSource,
  getCurrentCEFRLevel,
  setCurrentCEFRLevel,
  getCurrentFrequencyLevel,
  setCurrentFrequencyLevel,
  clearCache,
  getFrequencyWordCount,
  getCEFRWordCount,
  WORD_SOURCES,
  CEFR_LEVELS,
  FREQUENCY_LEVELS,
} from "../../utils/api";

export default function Settings() {
  const [wordSource, setWordSourceState] = useState(WORD_SOURCES.FREQUENCY);
  const [cefrLevel, setCefrLevelState] = useState(CEFR_LEVELS.ALL);
  const [frequencyLevel, setFrequencyLevelState] = useState(
    FREQUENCY_LEVELS.TOP_10K
  );
  const [saved, setSaved] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  // Betöltés
  useEffect(() => {
    setWordSourceState(getCurrentSource());
    setCefrLevelState(getCurrentCEFRLevel());
    setFrequencyLevelState(getCurrentFrequencyLevel());
  }, []);

  // Mentés
  const handleSave = () => {
    setCurrentSource(wordSource);
    setCurrentCEFRLevel(cefrLevel);
    setCurrentFrequencyLevel(frequencyLevel);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Cache törlése
  const handleClearCache = () => {
    const count = clearCache();
    setCacheCleared(count);
    setTimeout(() => setCacheCleared(false), 3000);
  };

  // Szószámok
  const frequencyCount = getFrequencyWordCount(frequencyLevel);
  const cefrCount = getCEFRWordCount(cefrLevel);

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        {/* Fejléc */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Link href="/flashcards" passHref>
            <IconButton color="primary">
              <ArrowBack />
            </IconButton>
          </Link>
          <Typography variant="h4" fontWeight="bold" sx={{ ml: 2 }}>
            ⚙️ Beállítások
          </Typography>
        </Box>

        {/* Sikeres mentés */}
        {saved && (
          <Alert severity="success" sx={{ mb: 3 }}>
            ✅ Beállítások mentve! Következő szónál életbe lép.
          </Alert>
        )}

        {/* Cache törölve */}
        {cacheCleared !== false && (
          <Alert severity="info" sx={{ mb: 3 }}>
            🗑️ {cacheCleared} cache bejegyzés törölve!
          </Alert>
        )}

        {/* Szóforrás választás */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ mb: 2, fontWeight: "bold" }}>
              📚 Szóforrás választás
            </FormLabel>

            <RadioGroup
              value={wordSource}
              onChange={(e) => setWordSourceState(e.target.value)}
            >
              {/* Frequency opció */}
              <Paper
                elevation={wordSource === WORD_SOURCES.FREQUENCY ? 3 : 0}
                sx={{
                  p: 2,
                  mb: 2,
                  border:
                    wordSource === WORD_SOURCES.FREQUENCY
                      ? "2px solid"
                      : "1px solid",
                  borderColor:
                    wordSource === WORD_SOURCES.FREQUENCY
                      ? "primary.main"
                      : "divider",
                  cursor: "pointer",
                }}
                onClick={() => setWordSourceState(WORD_SOURCES.FREQUENCY)}
              >
                <FormControlLabel
                  value={WORD_SOURCES.FREQUENCY}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        📊 Frequency List (CSV)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ~172k angol szó gyakoriság szerint rendezve
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label="Gyakori szavak"
                          size="small"
                          color="success"
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label="Legtöbb szó"
                          size="small"
                          color="primary"
                        />
                      </Box>
                    </Box>
                  }
                  sx={{ width: "100%", m: 0 }}
                />
              </Paper>

              {/* CEFR opció */}
              <Paper
                elevation={wordSource === WORD_SOURCES.CEFR ? 3 : 0}
                sx={{
                  p: 2,
                  border:
                    wordSource === WORD_SOURCES.CEFR
                      ? "2px solid"
                      : "1px solid",
                  borderColor:
                    wordSource === WORD_SOURCES.CEFR
                      ? "primary.main"
                      : "divider",
                  cursor: "pointer",
                }}
                onClick={() => setWordSourceState(WORD_SOURCES.CEFR)}
              >
                <FormControlLabel
                  value={WORD_SOURCES.CEFR}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        🎓 CEFR (CSV)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ~8k szó CEFR szintekkel (A1-C2)
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label="Nehézségi szintek"
                          size="small"
                          color="secondary"
                          sx={{ mr: 1 }}
                        />
                        <Chip label="Strukturált" size="small" color="info" />
                      </Box>
                    </Box>
                  }
                  sx={{ width: "100%", m: 0 }}
                />
              </Paper>
            </RadioGroup>
          </FormControl>
        </Paper>

        {/* Frequency szint választás (csak ha Frequency aktív) */}
        {wordSource === WORD_SOURCES.FREQUENCY && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: "bold" }}>
                🎯 Gyakoriság szerinti szint
              </FormLabel>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Minél kisebb a szám, annál gyakoribbak (könnyebbek) a szavak.
              </Typography>

              <RadioGroup
                value={frequencyLevel}
                onChange={(e) => setFrequencyLevelState(e.target.value)}
              >
                <FormControlLabel
                  value={FREQUENCY_LEVELS.TOP_1K}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography fontWeight="bold">
                        🌟 Top 1,000 - Alapszavak
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Leggyakoribb szavak (the, a, to, in, for...)
                      </Typography>
                    </Box>
                  }
                />

                <FormControlLabel
                  value={FREQUENCY_LEVELS.TOP_10K}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography fontWeight="bold">
                        ⭐ Top 10,000 - Mindennapi szavak
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Napi kommunikációhoz szükséges szavak (ajánlott!)
                      </Typography>
                    </Box>
                  }
                />

                <FormControlLabel
                  value={FREQUENCY_LEVELS.TOP_50K}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography fontWeight="bold">
                        💫 Top 50,000 - Haladó szókincs
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Könyvek, újságok olvasásához
                      </Typography>
                    </Box>
                  }
                />

                <FormControlLabel
                  value={FREQUENCY_LEVELS.ALL}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography fontWeight="bold">
                        🚀 Összes (~172k) - Teljes lista
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ritka és speciális szavak is (nehéz!)
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Paper>
        )}

        {/* CEFR szint választás (csak ha CEFR aktív) */}
        {wordSource === WORD_SOURCES.CEFR && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: "bold" }}>
                🎯 CEFR Nehézségi szint
              </FormLabel>

              <RadioGroup
                value={cefrLevel}
                onChange={(e) => setCefrLevelState(e.target.value)}
              >
                <FormControlLabel
                  value={CEFR_LEVELS.ALL}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography fontWeight="bold">Összes szint</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ~{cefrCount} szó (A1-C2 vegyesen)
                      </Typography>
                    </Box>
                  }
                />

                <Divider sx={{ my: 1 }} />

                <FormControlLabel
                  value={CEFR_LEVELS.A1}
                  control={<Radio />}
                  label="A1 - Kezdő (alapszavak)"
                />

                <FormControlLabel
                  value={CEFR_LEVELS.A2}
                  control={<Radio />}
                  label="A2 - Elemi (alapvető kommunikáció)"
                />

                <FormControlLabel
                  value={CEFR_LEVELS.B1}
                  control={<Radio />}
                  label="B1 - Középhaladó (önálló nyelvhasználat)"
                />

                <FormControlLabel
                  value={CEFR_LEVELS.B2}
                  control={<Radio />}
                  label="B2 - Haladó (önálló nyelvhasználat)"
                />

                <FormControlLabel
                  value={CEFR_LEVELS.C1}
                  control={<Radio />}
                  label="C1 - Felsőfok (rugalmas és hatékony)"
                />

                <FormControlLabel
                  value={CEFR_LEVELS.C2}
                  control={<Radio />}
                  label="C2 - Anyanyelvi szint"
                />
              </RadioGroup>
            </FormControl>
          </Paper>
        )}

        {/* Mentés gomb */}
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleSave}
          sx={{ mb: 2, py: 1.5, fontSize: "1.1rem", fontWeight: "bold" }}
        >
          💾 Beállítások mentése
        </Button>

        {/* Cache törlés */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            🗑️ Cache kezelés
          </Typography>

          <Typography variant="body2" color="text.secondary" paragraph>
            A cache-elt fordítások 7 napig tárolódnak. Ha törölöd, újra le kell
            tölteni őket az API-ból (lassabb lesz).
          </Typography>

          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleClearCache}
            fullWidth
          >
            Cache törlése
          </Button>
        </Paper>

        {/* Info */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>💡 Ajánlás:</strong> Kezdőknek Top 10k vagy CEFR A1-A2,
            haladóknak Top 50k vagy CEFR B2-C1.
          </Typography>
        </Alert>
      </Box>
    </Container>
  );
}
