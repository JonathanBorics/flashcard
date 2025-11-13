"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  VolumeUp,
  NavigateNext,
  Home,
  ArrowBack,
  CheckCircle,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getUnknownWords,
  addKnownWord,
  removeUnknownWord,
} from "../../../utils/progressTracker";
import { useSwipe } from "../../../utils/useSwipe";

export default function Practice() {
  const router = useRouter();
  const [unknownWords, setUnknownWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState(null);

  // Betöltés
  useEffect(() => {
    const words = getUnknownWords();
    if (words.length === 0) {
      router.push("/stats");
      return;
    }
    setUnknownWords(words);
    loadWord(words[0]);
  }, []);

  // Szó betöltése fordítással
  const loadWord = async (word) => {
    setLoading(true);
    setIsFlipped(false);
    setSwipeDirection(null);

    try {
      const response = await fetch(
        `/api/translate?word=${encodeURIComponent(word)}`
      );
      const data = await response.json();

      setCurrentWord({
        english: word,
        hungarian: data.translation,
        synonyms: data.synonyms || [],
      });
    } catch (error) {
      console.error("Hiba a szó betöltésekor:", error);
    } finally {
      setLoading(false);
    }
  };

  // Jobbra húzás = Tudom
  const handleSwipeRight = () => {
    if (loading || !currentWord) return;
    setSwipeDirection("right");
    setTimeout(() => {
      addKnownWord(currentWord.english);
      removeUnknownWord(currentWord.english);
      handleNext();
    }, 300);
  };

  // Balra húzás = Nem tudom (marad a listában)
  const handleSwipeLeft = () => {
    if (loading || !currentWord) return;
    setSwipeDirection("left");
    setTimeout(() => {
      handleNext();
    }, 300);
  };

  // Következő szó
  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= unknownWords.length) {
      router.push("/stats");
      return;
    }
    setCurrentIndex(nextIndex);
    loadWord(unknownWords[nextIndex]);
  };

  // Swipe hook
  const swipeHandlers = useSwipe(handleSwipeLeft, handleSwipeRight);

  // Kártya megfordítása
  const handleFlip = () => {
    if (!loading) {
      setIsFlipped(!isFlipped);
    }
  };

  // Hang
  const playSound = () => {
    if (!currentWord) return;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentWord.english);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const progress =
    unknownWords.length > 0 ? (currentIndex / unknownWords.length) * 100 : 0;

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
        {/* Fejléc */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <IconButton color="primary" onClick={() => router.push("/stats")}>
            <ArrowBack />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h6" color="text.secondary">
              {currentIndex + 1} / {unknownWords.length}
            </Typography>
            <Chip label="❌ Gyakorlás" color="error" size="small" />
          </Box>

          <Link href="/" passHref>
            <IconButton color="primary">
              <Home />
            </IconButton>
          </Link>
        </Box>

        {/* Progress */}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mb: 2, height: 8, borderRadius: 4 }}
        />

        {/* Instrukciók */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>➡️ Jobbra</strong> = Most már tudom!
            <br />
            <strong>⬅️ Balra</strong> = Még gyakorolnom kell
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
                // Előlap
                <>
                  <Typography
                    variant="h2"
                    component="div"
                    fontWeight="bold"
                    color="primary"
                    sx={{ mb: 2 }}
                  >
                    {currentWord.english}
                  </Typography>

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
                // Hátlap
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
                        sx={{ mb: 1 }}
                      >
                        {meaning}
                      </Typography>
                    ))}

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mt: 3 }}
                  >
                    Húzd jobbra ha tudod, balra ha még gyakorolnod kell
                  </Typography>
                </>
              )}
            </Box>
          ) : null}
        </Paper>

        {/* Manuális gombok */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={handleSwipeLeft}
            disabled={loading}
            sx={{ py: 2 }}
          >
            ⬅️ Nem tudom
          </Button>

          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleSwipeRight}
            disabled={loading}
            sx={{ py: 2 }}
          >
            Tudom! ➡️
          </Button>
        </Box>

        {/* Info */}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            💡 A szavakat jobbra/balra is húzhatod mobilon
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
