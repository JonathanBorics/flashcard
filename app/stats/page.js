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
  Grid,
} from "@mui/material";
import {
  Home,
  Refresh,
  PlayArrow,
  EmojiEvents,
  TrendingUp,
  LocalFireDepartment,
  CheckCircle,
  Cancel,
  Visibility,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getSessionStats,
  resetSessionStats,
  calculateProgress,
  getUnknownWords,
  clearUnknownWords,
  getStreak,
  hasGameInProgress,
} from "../../utils/progressTracker";
import { getTotalWordsCount, getCurrentCEFRLevel } from "../../utils/api";
import { useToast } from "../../components/Toast";

export default function Stats() {
  const router = useRouter();
  const { showToast } = useToast();

  const [stats, setStats] = useState({ correct: 0, incorrect: 0, total: 0 });
  const [progress, setProgress] = useState(null);
  const [streak, setStreak] = useState(0);
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      const sessionStats = getSessionStats();
      setStats(sessionStats);

      const totalWords = await getTotalWordsCount();
      const level = getCurrentCEFRLevel();

      const progressData = calculateProgress(
        totalWords,
        "cefr_dictionary",
        level
      );
      setProgress(progressData);

      const currentStreak = getStreak();
      setStreak(currentStreak);

      const gameInProgress = hasGameInProgress();
      setCanContinue(gameInProgress);
    };

    loadStats();
  }, []);

  const handleNewGame = () => {
    resetSessionStats();
    showToast("🎮 Új játék indul!", "info");
    router.push("/flashcards");
  };

  const handleContinue = () => {
    showToast("▶️ Játék folytatva!", "info");
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
      showToast("🗑️ Nem tudott szavak törölve!", "success");
    }
  };

  const accuracy =
    stats.total > 0 ? ((stats.correct / stats.total) * 100).toFixed(1) : 0;

  const getPerformanceLevel = () => {
    if (accuracy >= 90)
      return { text: "Kiváló!", color: "success", icon: "🏆", emoji: "🎉" };
    if (accuracy >= 75)
      return { text: "Nagyon jó!", color: "success", icon: "⭐", emoji: "👏" };
    if (accuracy >= 60)
      return { text: "Jó munka!", color: "primary", icon: "👍", emoji: "💪" };
    if (accuracy >= 40)
      return {
        text: "Gyakorolj még!",
        color: "warning",
        icon: "💪",
        emoji: "📚",
      };
    return { text: "Kezdő", color: "error", icon: "📚", emoji: "🌱" };
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
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Link href="/" passHref>
            <IconButton
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5568d3 0%, #6a4193 100%)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <Home />
            </IconButton>
          </Link>

          <Typography variant="h4" fontWeight="bold">
            📊 Statisztika
          </Typography>

          <Box sx={{ width: 48 }} />
        </Box>

        {/* Session Results */}
        <Paper
          elevation={8}
          className="stat-card fade-in"
          sx={{
            p: 4,
            mb: 3,
            textAlign: "center",
            background:
              "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
            borderRadius: 4,
          }}
        >
          <Box sx={{ fontSize: "80px", mb: 2 }} className="bounce">
            {performance.emoji}
          </Box>

          <Typography variant="h3" fontWeight="bold" gutterBottom>
            {performance.icon} {performance.text}
          </Typography>

          <Typography variant="h4" color="text.secondary" paragraph>
            {accuracy}% pontosság
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <Chip
              icon={<CheckCircle />}
              label={`Tudott: ${stats.correct}`}
              className="badge-success"
              size="large"
              sx={{ fontSize: "1rem", fontWeight: "bold", px: 2, py: 3 }}
            />
            <Chip
              icon={<Cancel />}
              label={`Nem tudott: ${stats.incorrect}`}
              className="badge-error"
              size="large"
              sx={{ fontSize: "1rem", fontWeight: "bold", px: 2, py: 3 }}
            />
          </Box>

          <Typography variant="h6" color="text.secondary">
            Összesen: {stats.total} szó ebben a sessionben
          </Typography>
        </Paper>

        {/* Streak */}
        {streak > 0 && (
          <Paper
            elevation={3}
            className="stat-card slide-up"
            sx={{
              p: 3,
              mb: 3,
              background:
                "linear-gradient(135deg, rgba(246, 173, 85, 0.1) 0%, rgba(237, 137, 54, 0.05) 100%)",
              border: "2px solid #f6ad55",
              borderRadius: 4,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <LocalFireDepartment
                className="streak-fire"
                sx={{ fontSize: 60, color: "#f6ad55" }}
              />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {streak} napos sorozat! 🔥
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Minden nap tanulsz! Így tovább!
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Összes haladás */}
        {progress && (
          <Paper
            elevation={3}
            className="stat-card slide-up"
            sx={{ p: 3, mb: 3, borderRadius: 4 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <TrendingUp sx={{ color: "primary.main" }} />
              <Typography variant="h6" fontWeight="bold">
                Összes haladás
              </Typography>
            </Box>

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
              <Box className="progress-bar">
                <Box
                  className="progress-bar-fill"
                  sx={{
                    width: `${progress.percentage}%`,
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.5 }}
              >
                {progress.percentage}% befejezve
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: "center" }}>
                  <CheckCircle
                    sx={{ color: "success.main", fontSize: 32, mb: 0.5 }}
                  />
                  <Typography variant="h5" fontWeight="bold">
                    {progress.knownCount}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tudott
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Cancel sx={{ color: "error.main", fontSize: 32, mb: 0.5 }} />
                  <Typography variant="h5" fontWeight="bold">
                    {progress.unknownCount}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Nem tudott
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Visibility
                    sx={{ color: "primary.main", fontSize: 32, mb: 0.5 }}
                  />
                  <Typography variant="h5" fontWeight="bold">
                    {progress.reviewedCount}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Átnézett
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Nem tudott szavak gyakorlása */}
        {progress && progress.unknownCount > 0 && (
          <Paper
            elevation={3}
            className="stat-card slide-up"
            sx={{
              p: 3,
              mb: 3,
              background:
                "linear-gradient(135deg, rgba(245, 101, 101, 0.1) 0%, rgba(229, 62, 62, 0.05) 100%)",
              border: "2px solid #f56565",
              borderRadius: 4,
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              ❌ Nem tudott szavak
            </Typography>
            <Typography variant="body2" paragraph>
              {progress.unknownCount} szót nem tudtál. Gyakorold őket!
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={handlePracticeUnknown}
                fullWidth
                className="btn-error"
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                Gyakorlás
              </Button>

              <Button
                variant="outlined"
                onClick={handleClearUnknown}
                sx={{ borderRadius: 2 }}
              >
                Törlés
              </Button>
            </Box>
          </Paper>
        )}

        {/* Gombok */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {canContinue && (
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrow />}
              onClick={handleContinue}
              fullWidth
              className="btn-primary glow"
              sx={{
                py: 2,
                fontSize: "1.1rem",
                fontWeight: "bold",
                borderRadius: 3,
                textTransform: "none",
              }}
            >
              ▶️ Folytatás
            </Button>
          )}

          <Button
            variant="contained"
            size="large"
            startIcon={<Refresh />}
            onClick={handleNewGame}
            fullWidth
            className="btn-primary"
            sx={{
              py: 2,
              fontSize: "1.1rem",
              fontWeight: "bold",
              borderRadius: 3,
              textTransform: "none",
            }}
          >
            🎮 Új játék
          </Button>

          <Link href="/" passHref style={{ textDecoration: "none" }}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Home />}
              fullWidth
              sx={{
                py: 2,
                fontSize: "1.1rem",
                fontWeight: "bold",
                borderRadius: 3,
                textTransform: "none",
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                },
              }}
            >
              🏠 Kezdőlap
            </Button>
          </Link>
        </Box>

        {/* Info */}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            💡 A tudott/nem tudott szavak mentve vannak
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
