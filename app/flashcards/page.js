"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  LinearProgress,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import {
  VolumeUp,
  NavigateNext,
  Home,
  Refresh,
  Settings,
  CloudDownload,
} from "@mui/icons-material";
import Link from "next/link";
import {
  getRandomWord,
  getTotalWordsCount,
  getCurrentSource,
  getCurrentCEFRLevel,
  getCurrentFrequencyLevel,
  WORD_SOURCES,
} from "../../utils/api";

export default function Flashcards() {
  const [currentWord, setCurrentWord] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [wordsLearned, setWordsLearned] = useState(0);
  const [usedWords, setUsedWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wordSource, setWordSource] = useState(WORD_SOURCES.FREQUENCY);
  const [cefrLevel, setCefrLevel] = useState("ALL");
  const [frequencyLevel, setFrequencyLevel] = useState("10000");

  // Forrás és szint betöltése
  useEffect(() => {
    setWordSource(getCurrentSource());
    setCefrLevel(getCurrentCEFRLevel());
    setFrequencyLevel(getCurrentFrequencyLevel());
  }, []);

  // Random szó betöltése API-ból
  const loadRandomWord = async () => {
    setLoading(true);
    setError(null);
    setIsFlipped(false);

    try {
      let wordData;
      let attempts = 0;
      const maxAttempts = 50;

      // Próbálj új szót húzni (ami még nem volt)
      do {
        wordData = await getRandomWord();
        attempts++;
      } while (usedWords.includes(wordData.english) && attempts < maxAttempts);

      // Ha minden szót láttunk, kezdjük elölről
      if (usedWords.includes(wordData.english)) {
        setUsedWords([]);
      }

      setCurrentWord(wordData);
      setUsedWords([...usedWords, wordData.english]);
    } catch (err) {
      console.error("Szó betöltési hiba:", err);
      setError(err.message || "Hiba történt a szó betöltésekor. Próbáld újra!");
    } finally {
      setLoading(false);
    }
  };

  // Első szó betöltése
  useEffect(() => {
    loadRandomWord();
  }, []);

  // Kártya megfordítása
  const handleFlip = () => {
    if (!loading) {
      setIsFlipped(!isFlipped);
    }
  };

  // Következő szó
  const handleNext = () => {
    setWordsLearned(wordsLearned + 1);
    loadRandomWord();
  };

  // Hang lejátszása
  const playSound = () => {
    if (!currentWord) return;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(currentWord.english);
      utterance.lang = "en-US";
      utterance.rate = 0.8;

      window.speechSynthesis.speak(utterance);
    } else {
      alert("A böngésző nem támogatja a hanglejátszást");
    }
  };

  // Újrakezdés
  const handleRestart = () => {
    setUsedWords([]);
    setWordsLearned(0);
    loadRandomWord();
  };

  const totalWords = getTotalWordsCount();
  const progress = (wordsLearned / totalWords) * 100;

  // Forrás címke
  const getSourceLabel = () => {
    if (wordSource === WORD_SOURCES.FREQUENCY) {
      const levelLabel =
        {
          1000: "Top 1k",
          10000: "Top 10k",
          50000: "Top 50k",
          all: "Összes",
        }[frequencyLevel] || "Top 10k";
      return `📊 ${levelLabel}`;
    } else {
      return `🎓 CEFR${cefrLevel !== "ALL" ? ` (${cefrLevel})` : ""}`;
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: 4,
        }}
      >
        {/* Fejléc navigációval */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Link href="/" passHref>
            <IconButton color="primary">
              <Home />
            </IconButton>
          </Link>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h6" color="text.secondary">
              {wordsLearned} / {totalWords.toLocaleString()}
            </Typography>
            <Chip
              icon={<CloudDownload />}
              label="API"
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Link href="/settings" passHref>
              <IconButton color="primary">
                <Settings />
              </IconButton>
            </Link>
            <IconButton color="primary" onClick={handleRestart}>
              <Refresh />
            </IconButton>
          </Box>
        </Box>

        {/* Progress bar */}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mb: 2, height: 8, borderRadius: 4 }}
        />

        {/* Forrás info */}
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center", mb: 2 }}>
          <Chip label={getSourceLabel()} color="secondary" size="small" />
          {currentWord?.cached && (
            <Chip label="📦 Cache" size="small" variant="outlined" />
          )}
        </Box>

        {/* Hiba üzenet */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Flashcard */}
        <Paper
          elevation={6}
          onClick={handleFlip}
          sx={{
            minHeight: 400,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: loading ? "wait" : "pointer",
            p: 4,
            mb: 3,
            borderRadius: 4,
            transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)",
            transformStyle: "preserve-3d",
            "&:hover": {
              boxShadow: loading ? 6 : 12,
            },
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? (
            // Loading állapot
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h6" color="text.secondary">
                Szó betöltése...
              </Typography>
            </Box>
          ) : currentWord ? (
            <Box
              sx={{
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)",
                backfaceVisibility: "hidden",
                textAlign: "center",
                width: "100%",
              }}
            >
              {!isFlipped ? (
                // Előlap - Angol szó
                <>
                  <Typography
                    variant="h2"
                    component="div"
                    fontWeight="bold"
                    color="primary"
                    sx={{ mb: 2, wordBreak: "break-word" }}
                  >
                    {currentWord.english}
                  </Typography>

                  {/* Extra info chipek */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      justifyContent: "center",
                      mb: 3,
                    }}
                  >
                    {/* Frequency rank */}
                    {currentWord.rank && (
                      <Chip
                        label={`#${currentWord.rank}`}
                        color="success"
                        size="small"
                      />
                    )}

                    {/* CEFR szint és szófaj */}
                    {currentWord.cefr && (
                      <Chip
                        label={`${currentWord.cefr} • ${
                          currentWord.pos || "word"
                        }`}
                        color="secondary"
                        size="small"
                      />
                    )}
                  </Box>

                  <Typography variant="body1" color="text.secondary">
                    Kattints a megfordításhoz
                  </Typography>

                  <IconButton
                    color="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      playSound();
                    }}
                    sx={{ mt: 3 }}
                    size="large"
                  >
                    <VolumeUp fontSize="large" />
                  </IconButton>
                </>
              ) : (
                // Hátlap - Magyar jelentés(ek)
                <>
                  <Typography
                    variant="h5"
                    component="div"
                    color="text.secondary"
                    gutterBottom
                    sx={{ mb: 3 }}
                  >
                    {currentWord.english}
                  </Typography>

                  {currentWord.hungarian &&
                    currentWord.hungarian.map((meaning, index) => (
                      <Typography
                        key={index}
                        variant={
                          currentWord.hungarian.length === 1 ? "h3" : "h4"
                        }
                        component="div"
                        fontWeight="bold"
                        color="secondary"
                        sx={{ mb: 1, wordBreak: "break-word" }}
                      >
                        {meaning}
                      </Typography>
                    ))}

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mt: 3 }}
                  >
                    Kattints újra az angol szóhoz
                  </Typography>
                </>
              )}
            </Box>
          ) : (
            // Hiba állapot
            <Typography variant="h6" color="error">
              Nem sikerült betölteni a szót
            </Typography>
          )}
        </Paper>

        {/* Következő gomb */}
        <Button
          variant="contained"
          size="large"
          endIcon={<NavigateNext />}
          onClick={handleNext}
          disabled={loading}
          fullWidth
          sx={{
            py: 2,
            fontSize: "1.1rem",
            fontWeight: "bold",
            boxShadow: 3,
          }}
        >
          {loading ? "Betöltés..." : "Következő szó"}
        </Button>

        {/* Infó szövegek */}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            💡 Kattints a kártyára a magyar jelentés megtekintéséhez
          </Typography>

          <Typography variant="caption" color="text.secondary">
            🎯 Beállítások → Válaszd ki a nehézségi szintet
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
