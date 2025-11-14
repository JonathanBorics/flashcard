"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Alert,
} from "@mui/material";
import { ArrowBack, Delete } from "@mui/icons-material";
import Link from "next/link";
import {
  getCurrentCEFRLevel,
  setCurrentCEFRLevel,
  getCEFRWordCount,
  CEFR_LEVELS,
} from "../../utils/api";
import {
  clearKnownWords,
  clearUnknownWords,
  resetSessionStats,
  clearGameState,
} from "../../utils/progressTracker";
import { useToast } from "../../components/Toast";

export default function Settings() {
  const { showToast } = useToast();
  const [cefrLevel, setCEFRLevelState] = useState(CEFR_LEVELS.ALL);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const level = getCurrentCEFRLevel();
    setCEFRLevelState(level);
    updateWordCount(level);
  }, []);

  const updateWordCount = async (level) => {
    const count = getCEFRWordCount(level);
    setWordCount(count);
  };

  const handleCEFRLevelChange = (event, newLevel) => {
    if (newLevel !== null) {
      setCEFRLevelState(newLevel);
      setCurrentCEFRLevel(newLevel);
      updateWordCount(newLevel);
      showToast(`📚 CEFR szint: ${newLevel}`, "success");
    }
  };

  const handleResetProgress = () => {
    if (
      confirm(
        "Biztosan törölni szeretnéd az ÖSSZES haladásodat?\n\n" +
          "Ez törli:\n" +
          "- Tudott szavak\n" +
          "- Nem tudott szavak\n" +
          "- Session statisztikák\n" +
          "- Mentett játékállás"
      )
    ) {
      clearKnownWords();
      clearUnknownWords();
      resetSessionStats();
      clearGameState();
      showToast("🗑️ Minden adat törölve!", "success");
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
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 4,
          }}
        >
          <Link href="/" passHref>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              className="btn-primary"
              sx={{
                borderRadius: 2,
              }}
            >
              Vissza
            </Button>
          </Link>

          <Typography variant="h4" fontWeight="bold">
            ⚙️ Beállítások
          </Typography>
        </Box>

        {/* CEFR Level */}
        <Paper
          elevation={3}
          className="stat-card slide-up"
          sx={{ p: 3, mb: 3, borderRadius: 3 }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            📚 CEFR Szint
          </Typography>

          <Typography variant="body2" color="text.secondary" paragraph>
            Válaszd ki milyen nehézségű szavakat szeretnél gyakorolni
          </Typography>

          <ToggleButtonGroup
            value={cefrLevel}
            exclusive
            onChange={handleCEFRLevelChange}
            fullWidth
            sx={{
              mb: 2,
              "& .MuiToggleButton-root": {
                py: 1.5,
                fontWeight: "bold",
                borderRadius: 2,
                "&.Mui-selected": {
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5568d3 0%, #6a4193 100%)",
                  },
                },
              },
            }}
          >
            <ToggleButton value={CEFR_LEVELS.ALL}>Mind</ToggleButton>
            <ToggleButton value={CEFR_LEVELS.A1}>A1</ToggleButton>
            <ToggleButton value={CEFR_LEVELS.A2}>A2</ToggleButton>
            <ToggleButton value={CEFR_LEVELS.B1}>B1</ToggleButton>
            <ToggleButton value={CEFR_LEVELS.B2}>B2</ToggleButton>
          </ToggleButtonGroup>

          <Alert severity="info" sx={{ borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>{wordCount.toLocaleString()}</strong> szó elérhető ezen a
              szinten
            </Typography>
          </Alert>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary">
            <strong>CEFR Szintek magyarázata:</strong>
            <br />
            <strong>A1-A2:</strong> Kezdő (basic words)
            <br />
            <strong>B1-B2:</strong> Középhaladó (everyday conversation)
          </Typography>
        </Paper>

        {/* Danger Zone */}
        <Paper
          elevation={3}
          className="stat-card slide-up"
          sx={{
            p: 3,
            borderRadius: 3,
            background:
              "linear-gradient(135deg, rgba(245, 101, 101, 0.1) 0%, rgba(229, 62, 62, 0.05) 100%)",
            border: "2px solid #f56565",
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom color="error">
            ⚠️ Veszélyzóna
          </Typography>

          <Typography variant="body2" color="text.secondary" paragraph>
            Ezek a műveletek visszaállítják az ÖSSZES haladásodat!
          </Typography>

          <Button
            variant="contained"
            color="error"
            fullWidth
            startIcon={<Delete />}
            onClick={handleResetProgress}
            sx={{
              py: 1.5,
              fontWeight: "bold",
              borderRadius: 2,
            }}
          >
            Minden adat törlése
          </Button>
        </Paper>

        {/* Info */}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            💡 A beállítások azonnal érvénybe lépnek
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
