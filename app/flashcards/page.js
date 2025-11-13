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
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  VolumeUp,
  NavigateNext,
  Home,
  Refresh,
  Settings,
  CloudDownload,
  Stop,
  BarChart,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getRandomWord,
  getTotalWordsCount,
  getCurrentSource,
  getCurrentCEFRLevel,
  getCurrentFrequencyLevel,
  WORD_SOURCES,
} from "../../utils/api";
import {
  addKnownWord,
  addUnknownWord,
  updateSessionStats,
  resetSessionStats,
} from "../../utils/progressTracker";
import { useSwipe } from "../../utils/useSwipe";

export default function Flashcards() {
  const router = useRouter();
  const [currentWord, setCurrentWord] = useState({
    english: "",
    hungarian: [],
    synonyms: [],
  });
  const [isFlipped, setIsFlipped] = useState(false);
  const [wordsLearned, setWordsLearned] = useState(0);
  const [usedWords, setUsedWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wordSource, setWordSource] = useState(WORD_SOURCES.FREQUENCY);
  const [cefrLevel, setCefrLevel] = useState("ALL");
  const [frequencyLevel, setFrequencyLevel] = useState("10000");
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);

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
    setSwipeDirection(null);

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
    resetSessionStats();
    loadRandomWord();
  }, []);

  // Jobbra húzás = Tudom a szót
  const handleSwipeRight = () => {
    if (loading || !currentWord) return;
    setSwipeDirection("right");
    setTimeout(() => {
      addKnownWord(currentWord.english);
      updateSessionStats(true);
      handleNext();
    }, 300);
  };

  // Balra húzás = Nem tudom a szót
  const handleSwipeLeft = () => {
    if (loading || !currentWord) return;
    setSwipeDirection("left");
    setTimeout(() => {
      addUnknownWord(currentWord.english);
      updateSessionStats(false);
      handleNext();
    }, 300);
  };

  // Swipe hook
  const swipeHandlers = useSwipe(handleSwipeLeft, handleSwipeRight);

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
    resetSessionStats();
    loadRandomWord();
  };

  // Játék befejezése
  const handleFinishGame = () => {
    setFinishDialogOpen(true);
  };

  const confirmFinish = () => {
    router.push("/stats");
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

        {/* Instrukciók */}
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>➡️ Jobbra</strong> = Tudom a szót
            <br />
            <strong>⬅️ Balra</strong> = Nem tudom a szót
          </Typography>
        </Alert>

        {/* Flashcard */}
        <Paper
          elevation={6}
          onClick={handleFlip}
          {...swipeHandlers}
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
            transition: "all 0.3s ease",
            transform:
              swipeDirection === "right"
                ? "translateX(300px) rotate(20deg)"
                : swipeDirection === "left"
                ? "translateX(-300px) rotate(-20deg)"
                : isFlipped
                ? "rotateY(180deg)"
                : "rotateY(0)",
            transformStyle: "preserve-3d",
            opacity: swipeDirection ? 0 : 1,
            "&:hover": {
              boxShadow: loading ? 6 : 12,
            },
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
                    sx={{ mb: 2 }}
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

                  {currentWord.synonyms && currentWord.synonyms.length > 0 && (
                    <Box sx={{ mt: 3, width: "100%" }}>
                      <Divider sx={{ mb: 2 }}>
                        <Chip label="Hasonló jelentések" size="small" />
                      </Divider>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: "italic" }}
                      >
                        {currentWord.synonyms.join(", ")}
                      </Typography>
                    </Box>
                  )}
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mt: 3 }}
                  >
                    Húzd jobbra ha tudod, balra ha nem
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

        {/* Manuális gombok */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<NavigateNext sx={{ transform: "rotate(180deg)" }} />}
            onClick={handleSwipeLeft}
            disabled={loading}
            fullWidth
            sx={{ py: 1.5 }}
          >
            Nem tudom
          </Button>

          <Button
            variant="contained"
            color="success"
            endIcon={<NavigateNext />}
            onClick={handleSwipeRight}
            disabled={loading}
            fullWidth
            sx={{ py: 1.5 }}
          >
            Tudom!
          </Button>
        </Box>

        {/* Játék befejezése és Statisztika gombok */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<Stop />}
            onClick={handleFinishGame}
            disabled={loading || wordsLearned === 0}
            fullWidth
            sx={{ py: 1.5 }}
          >
            Befejezés
          </Button>

          <Link
            href="/stats"
            passHref
            style={{ textDecoration: "none", width: "100%" }}
          >
            <Button
              variant="outlined"
              color="primary"
              startIcon={<BarChart />}
              fullWidth
              sx={{ py: 1.5 }}
            >
              Statisztika
            </Button>
          </Link>
        </Box>

        {/* Infó szövegek */}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            💡 Húzd a kártyát vagy nyomd meg a gombokat
          </Typography>

          <Typography variant="caption" color="text.secondary">
            🎯 Beállítások → Válaszd ki a nehézségi szintet
          </Typography>
        </Box>

        {/* Befejezés megerősítő dialog */}
        <Dialog
          open={finishDialogOpen}
          onClose={() => setFinishDialogOpen(false)}
        >
          <DialogTitle>Játék befejezése?</DialogTitle>
          <DialogContent>
            <Typography>
              Eddig {wordsLearned} szót néztél meg. Szeretnéd befejezni a
              játékot és megnézni a statisztikákat?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFinishDialogOpen(false)}>
              Folytatás
            </Button>
            <Button onClick={confirmFinish} variant="contained" color="primary">
              Statisztika
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
