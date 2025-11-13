"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  LinearProgress,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Home,
  Refresh,
  PlayArrow,
  EmojiEvents,
  TrendingUp,
  Close,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getSessionStats,
  resetSessionStats,
  calculateProgress,
  getUnknownWords,
  clearUnknownWords,
} from "../../utils/progressTracker";
import {
  getTotalWordsCount,
  getCurrentSource,
  getCurrentCEFRLevel,
  getCurrentFrequencyLevel,
  WORD_SOURCES,
} from "../../utils/api";

export default function Stats() {
  const router = useRouter();
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, total: 0 });
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const sessionStats = getSessionStats();
    setStats(sessionStats);

    const totalWords = getTotalWordsCount();
    const source = getCurrentSource();
    const cefrLevel = getCurrentCEFRLevel();
    const frequencyLevel = getCurrentFrequencyLevel();

    const level =
      source === WORD_SOURCES.FREQUENCY ? frequencyLevel : cefrLevel;

    const progressData = calculateProgress(totalWords, source, level);
    setProgress(progressData);
  }, []);

  const handleNewGame = () => {
    resetSessionStats();
    router.push("/flashcards");
  };

  const handlePracticeUnknown = () => {
    router.push("/flashcards/practice");
  };

  const handleClearUnknown = () => {
    if (confirm("Biztosan törölni szeretnéd a nem tudott szavakat?")) {
      clearUnknownWords();
      setProgress({
        ...progress,
        unknownCount: 0,
      });
    }
  };

  const accuracy =
    stats.total > 0 ? ((stats.correct / stats.total) * 100).toFixed(1) : 0;

  const getPerformanceLevel = () => {
    if (accuracy >= 90)
      return { text: "Kiváló!", color: "success", icon: "🏆" };
    if (accuracy >= 75)
      return { text: "Nagyon jó!", color: "success", icon: "⭐" };
    if (accuracy >= 60)
      return { text: "Jó munka!", color: "primary", icon: "👍" };
    if (accuracy >= 40)
      return { text: "Gyakorolj még!", color: "warning", icon: "💪" };
    return { text: "Kezdő", color: "error", icon: "📚" };
  };

  const performance = getPerformanceLevel();

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
            mb: 3,
          }}
        >
          <Link href="/" passHref>
            <IconButton color="primary">
              <Home />
            </IconButton>
          </Link>

          <Typography variant="h5" fontWeight="bold">
            📊 Statisztika
          </Typography>

          <IconButton onClick={() => router.push("/flashcards")}>
            <Close />
          </IconButton>
        </Box>

        {/* Session eredmények */}
        <Paper elevation={6} sx={{ p: 4, mb: 3, textAlign: "center" }}>
          <EmojiEvents
            sx={{ fontSize: 80, color: performance.color + ".main", mb: 2 }}
          />

          <Typography variant="h3" fontWeight="bold" gutterBottom>
            {performance.icon} {performance.text}
          </Typography>

          <Typography variant="h5" color="text.secondary" paragraph>
            {accuracy}% pontosság
          </Typography>

          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 3 }}
          >
            <Chip
              label={`✅ Tudott: ${stats.correct}`}
              color="success"
              size="large"
            />
            <Chip
              label={`❌ Nem tudott: ${stats.incorrect}`}
              color="error"
              size="large"
            />
          </Box>

          <Typography variant="body1" color="text.secondary">
            Összesen: {stats.total} szó ebben a munkamenetben
          </Typography>
        </Paper>

        {/* Összes haladás */}
        {progress && (
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              <TrendingUp sx={{ mr: 1, verticalAlign: "middle" }} />
              Összes haladás
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Tudott szavak
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {progress.knownCount} / {progress.totalWords}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={parseFloat(progress.percentage)}
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.5 }}
              >
                {progress.percentage}% befejezve
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Chip
                label={`✅ Tudott: ${progress.knownCount}`}
                color="success"
              />
              <Chip
                label={`❌ Nem tudott: ${progress.unknownCount}`}
                color="error"
              />
              <Chip
                label={`📝 Átnézett: ${progress.reviewedCount}`}
                color="primary"
              />
            </Box>
          </Paper>
        )}

        {/* Nem tudott szavak gyakorlása */}
        {progress && progress.unknownCount > 0 && (
          <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: "error.light" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              ❌ Nem tudott szavak
            </Typography>
            <Typography variant="body2" paragraph>
              {progress.unknownCount} szót nem tudtál. Gyakorold őket!
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<PlayArrow />}
                onClick={handlePracticeUnknown}
                fullWidth
              >
                Gyakorlás
              </Button>

              <Button
                variant="outlined"
                color="inherit"
                onClick={handleClearUnknown}
              >
                Törlés
              </Button>
            </Box>
          </Paper>
        )}

        {/* Gombok */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Refresh />}
            onClick={handleNewGame}
            fullWidth
            sx={{ py: 1.5 }}
          >
            Új játék
          </Button>

          <Link href="/" passHref style={{ textDecoration: "none" }}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Home />}
              fullWidth
              sx={{ py: 1.5 }}
            >
              Kezdőlap
            </Button>
          </Link>
        </Box>

        {/* Info */}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            💡 A tudott/nem tudott szavak mentve vannak a böngészőben
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
