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
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  VolumeUp,
  Home,
  ArrowBack,
  CheckCircle,
  Cancel,
  Settings,
  Stop,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getRandomWord } from "../../utils/api";
import {
  addKnownWord,
  addUnknownWord,
  updateSessionStats,
  saveGameState,
  getGameState,
  clearGameState,
  updateStreak,
} from "../../utils/progressTracker";
import { useSwipe } from "../../utils/useSwipe";
import { useToast } from "../../components/Toast";

export default function Flashcards() {
  const router = useRouter();
  const { showToast } = useToast();

  const [currentWord, setCurrentWord] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [endGameDialog, setEndGameDialog] = useState(false);

  // Load game state vagy új szó
  useEffect(() => {
    const loadInitialState = async () => {
      const savedState = getGameState();

      if (savedState && savedState.currentWord) {
        // Folytatás
        setCurrentWord(savedState.currentWord);
        setWordCount(savedState.wordCount || 0);
        setLoading(false);
        showToast("📍 Játék folytatva!", "info");
      } else {
        // Új játék
        await loadNewWord();
        const currentStreak = updateStreak();
        setStreak(currentStreak);

        if (currentStreak > 1) {
          showToast(`🔥 ${currentStreak} napos sorozat!`, "success");
        }
      }
    };

    loadInitialState();
  }, []);

  // Új szó betöltése
  const loadNewWord = async () => {
    setLoading(true);
    setIsFlipped(false);
    setSwipeDirection(null);

    try {
      const wordData = await getRandomWord();
      setCurrentWord(wordData);
      setWordCount((prev) => prev + 1);

      // Game state mentése
      saveGameState({
        currentWord: wordData,
        wordCount: wordCount + 1,
      });
    } catch (error) {
      console.error("Hiba a szó betöltésekor:", error);
      showToast("❌ Hiba történt!", "error");
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
      updateSessionStats(true);
      showToast("✅ Tudod!", "success", 2000);
      loadNewWord();
    }, 500);
  };

  // Balra húzás = Nem tudom
  const handleSwipeLeft = () => {
    if (loading || !currentWord) return;

    setSwipeDirection("left");

    setTimeout(() => {
      addUnknownWord(currentWord.english);
      updateSessionStats(false);
      showToast("❌ Gyakorold még!", "error", 2000);
      loadNewWord();
    }, 500);
  };

  // Kártya megfordítása
  const handleFlip = () => {
    if (!loading && !swipeDirection) {
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

  // Swipe hook
  const swipeHandlers = useSwipe(handleSwipeLeft, handleSwipeRight);

  // Kilépés - state mentés
  const handleExit = () => {
    if (currentWord) {
      saveGameState({
        currentWord,
        wordCount,
      });
      showToast("💾 Játék mentve!", "info");
    }
    router.push("/");
  };

  // Játék vége - dialog megnyitása
  const handleEndGame = () => {
    setEndGameDialog(true);
  };

  // Mentés és kilépés
  const handleSaveAndExit = () => {
    saveGameState({
      currentWord,
      wordCount,
    });
    showToast("💾 Játék elmentve! Később folytathatod.", "success");
    setEndGameDialog(false);
    router.push("/stats");
  };

  // Törlés és kilépés
  const handleDeleteAndExit = () => {
    clearGameState();
    showToast(
      "🗑️ Játék törölve! Következő indításkor új játék kezdődik.",
      "info"
    );
    setEndGameDialog(false);
    router.push("/stats");
  };

  // Get swipe class
  const getCardClass = () => {
    let classes = "flashcard";
    if (swipeDirection === "right") classes += " swipe-right";
    if (swipeDirection === "left") classes += " swipe-left";
    if (isFlipped) classes += " flipping";
    return classes;
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
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <IconButton
            onClick={handleExit}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(135deg, #5568d3 0%, #6a4193 100%)",
                transform: "scale(1.1)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <Home />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {streak > 0 && (
              <Chip
                icon={<span className="streak-fire">🔥</span>}
                label={`${streak} nap`}
                className="badge-primary glow"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  background:
                    "linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)",
                  color: "white",
                }}
              />
            )}

            <Chip
              label={`#${wordCount}`}
              className="badge-primary"
              sx={{
                fontWeight: "bold",
                fontSize: "1rem",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              onClick={handleEndGame}
              sx={{
                background: "linear-gradient(135deg, #f56565 0%, #e53e3e 100%)",
                color: "white",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #e53e3e 0%, #c53030 100%)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.3s ease",
              }}
              title="Játék vége"
            >
              <Stop />
            </IconButton>

            <Link href="/settings" passHref>
              <IconButton
                sx={{
                  background:
                    "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)",
                  color: "white",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #3182ce 0%, #2c5282 100%)",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <Settings />
              </IconButton>
            </Link>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box className="progress-bar" sx={{ mb: 3 }}>
          <Box
            className="progress-bar-fill"
            sx={{
              width: currentWord ? "100%" : "0%",
            }}
          />
        </Box>

        {/* Instructions */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            background:
              "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)",
            border: "2px solid",
            borderColor: "primary.main",
            borderRadius: 3,
          }}
        >
          <Typography variant="body2" align="center" fontWeight="600">
            <span style={{ color: "#48bb78" }}>➡️ Jobbra</span> = Tudom! •{" "}
            <span style={{ color: "#f56565" }}>⬅️ Balra</span> = Nem tudom
          </Typography>
        </Paper>

        {/* Flashcard */}
        <Paper
          elevation={8}
          onClick={handleFlip}
          {...swipeHandlers}
          className={getCardClass()}
          sx={{
            minHeight: 450,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: loading ? "wait" : "pointer",
            p: 4,
            mb: 3,
            borderRadius: 4,
            background: isFlipped
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              : "linear-gradient(135deg, #f7fafc 0%, #e2e8f0 100%)",
            position: "relative",
            userSelect: "none",
            border: "3px solid",
            borderColor: isFlipped ? "transparent" : "#cbd5e0",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: loading ? 8 : "0 16px 48px rgba(102, 126, 234, 0.3)",
              borderColor: isFlipped ? "transparent" : "#667eea",
            },
          }}
        >
          {loading ? (
            <Box sx={{ textAlign: "center" }} className="fade-in">
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h6" color="text.secondary">
                Új szó betöltése...
              </Typography>
            </Box>
          ) : currentWord ? (
            <Box
              sx={{
                textAlign: "center",
                width: "100%",
              }}
            >
              {!isFlipped ? (
                // Előlap - English
                <Box className="fade-in">
                  <Chip
                    label={`${currentWord.cefr} • ${currentWord.pos}`}
                    size="small"
                    sx={{
                      mb: 3,
                      fontWeight: "bold",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      fontSize: "0.9rem",
                      px: 2,
                      py: 2.5,
                    }}
                  />

                  <Typography
                    variant="h1"
                    component="div"
                    fontWeight="bold"
                    sx={{
                      mb: 3,
                      fontSize: { xs: "3rem", sm: "4rem" },
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textShadow: "0 2px 10px rgba(102, 126, 234, 0.1)",
                    }}
                  >
                    {currentWord.english}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      color: "#718096",
                      fontWeight: 500,
                    }}
                  >
                    👆 Kattints a megfordításhoz
                  </Typography>

                  <IconButton
                    color="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      playSound();
                    }}
                    className="bounce"
                    sx={{
                      background:
                        "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                      color: "white",
                      width: 64,
                      height: 64,
                      boxShadow: "0 4px 16px rgba(72, 187, 120, 0.4)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #38a169 0%, #2f855a 100%)",
                        transform: "scale(1.1)",
                        boxShadow: "0 6px 20px rgba(72, 187, 120, 0.6)",
                      },
                      transition: "all 0.3s ease",
                    }}
                    size="large"
                  >
                    <VolumeUp fontSize="large" />
                  </IconButton>
                </Box>
              ) : (
                // Hátlap - Hungarian (Több jelentés szép megjelenítés)
                <Box className="fade-in">
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      color: "rgba(255, 255, 255, 0.7)",
                      fontWeight: 500,
                    }}
                  >
                    {currentWord.english}
                  </Typography>

                  {currentWord.hungarian &&
                  currentWord.hungarian.length === 1 ? (
                    // Egy jelentés - nagy
                    <Typography
                      variant="h2"
                      component="div"
                      fontWeight="bold"
                      sx={{
                        color: "white",
                        textShadow: "0 2px 20px rgba(0, 0, 0, 0.2)",
                        mb: 2,
                      }}
                    >
                      {currentWord.hungarian[0]}
                    </Typography>
                  ) : (
                    // Több jelentés - lista
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        alignItems: "center",
                      }}
                    >
                      {currentWord.hungarian?.map((meaning, index) => (
                        <Box
                          key={index}
                          sx={{
                            background: "rgba(255, 255, 255, 0.15)",
                            backdropFilter: "blur(10px)",
                            borderRadius: 3,
                            px: 4,
                            py: 2,
                            minWidth: "280px",
                            border: "2px solid rgba(255, 255, 255, 0.2)",
                            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
                              background: "rgba(255, 255, 255, 0.2)",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                background: "rgba(255, 255, 255, 0.3)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                color: "white",
                                fontSize: "0.9rem",
                              }}
                            >
                              {index + 1}
                            </Box>
                            <Typography
                              variant="h5"
                              component="div"
                              fontWeight="600"
                              sx={{
                                color: "white",
                                flex: 1,
                                textAlign: "left",
                              }}
                            >
                              {meaning}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}

                  <Typography
                    variant="body1"
                    sx={{
                      mt: 4,
                      color: "rgba(255, 255, 255, 0.8)",
                      fontWeight: 500,
                    }}
                  >
                    👈👉 Húzd jobbra/balra
                  </Typography>
                </Box>
              )}
            </Box>
          ) : null}
        </Paper>

        {/* Manual Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSwipeLeft}
            disabled={loading}
            startIcon={<Cancel />}
            className="btn-error"
            sx={{
              py: 2,
              fontSize: "1.1rem",
              fontWeight: "bold",
              borderRadius: 3,
              textTransform: "none",
            }}
          >
            Nem tudom
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSwipeRight}
            disabled={loading}
            endIcon={<CheckCircle />}
            className="btn-success"
            sx={{
              py: 2,
              fontSize: "1.1rem",
              fontWeight: "bold",
              borderRadius: 3,
              textTransform: "none",
            }}
          >
            Tudom!
          </Button>
        </Box>

        {/* Info */}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            💡 Mobilon jobbra/balra is húzhatod a kártyát
          </Typography>
        </Box>

        {/* End Game Dialog */}
        <Dialog
          open={endGameDialog}
          onClose={() => setEndGameDialog(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 1,
            },
          }}
        >
          <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              🛑 Játék vége
            </Typography>
          </DialogTitle>

          <DialogContent>
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="body1" paragraph>
                Mit szeretnél tenni a jelenlegi játékkal?
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  mt: 2,
                  p: 2,
                  background: "rgba(102, 126, 234, 0.05)",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2">
                  <strong>Szavak eddig:</strong> {wordCount}
                </Typography>
                <Typography variant="body2">
                  <strong>Session statisztika:</strong> Mentve marad ✅
                </Typography>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ flexDirection: "column", gap: 1, p: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSaveAndExit}
              className="btn-success"
              sx={{
                py: 1.5,
                fontWeight: "bold",
                borderRadius: 2,
              }}
            >
              💾 Mentés és statisztika
            </Button>

            <Button
              variant="contained"
              fullWidth
              onClick={handleDeleteAndExit}
              color="error"
              sx={{
                py: 1.5,
                fontWeight: "bold",
                borderRadius: 2,
              }}
            >
              🗑️ Törlés és statisztika
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => setEndGameDialog(false)}
              sx={{
                py: 1.5,
                fontWeight: "bold",
                borderRadius: 2,
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                },
              }}
            >
              ↩️ Vissza a játékhoz
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
