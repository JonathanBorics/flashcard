"use client";

import { useState, useEffect } from "react";
import { Container, Box, Typography, Button, Paper, Chip } from "@mui/material";
import { School, PlayArrow, FitnessCenter } from "@mui/icons-material";
import Link from "next/link";
import { getUnknownWords } from "../utils/progressTracker";

export default function Home() {
  const [unknownCount, setUnknownCount] = useState(0);

  useEffect(() => {
    // Betöltjük a nem tudott szavak számát
    const words = getUnknownWords();
    setUnknownCount(words.length);
  }, []);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: "center",
            width: "100%",
            borderRadius: 3,
          }}
        >
          <School sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />

          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Angol Tanuló
          </Typography>

          <Typography variant="h6" color="text.secondary" paragraph>
            Flashcard Játék
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ mb: 4 }}
          >
            Tanulj angolul szórakozva! Random szavak, magyar jelentések, és
            hangos kiejtés segítségével.
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Kezdés gomb */}
            <Link
              href="/flashcards"
              passHref
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrow />}
                fullWidth
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  boxShadow: 3,
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Kezdés
              </Button>
            </Link>

            {/* Gyakorlás gomb - csak ha vannak nem tudott szavak */}
            {unknownCount > 0 && (
              <Link
                href="/flashcards/practice"
                passHref
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  startIcon={<FitnessCenter />}
                  fullWidth
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    boxShadow: 3,
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                    position: "relative",
                  }}
                >
                  Gyakorlás
                  <Chip
                    label={unknownCount}
                    size="small"
                    color="warning"
                    sx={{
                      position: "absolute",
                      right: 16,
                      fontWeight: "bold",
                    }}
                  />
                </Button>
              </Link>
            )}
          </Box>
        </Paper>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            💡 Tipp: Telepítsd az appot a kezdőképernyőre!
          </Typography>

          <Link href="/settings" passHref style={{ textDecoration: "none" }}>
            <Button size="small" variant="text">
              ⚙️ Beállítások (Fájl választás)
            </Button>
          </Link>

          {unknownCount > 0 && (
            <Typography
              variant="caption"
              color="error.main"
              sx={{ mt: 1, fontWeight: "bold" }}
            >
              ❌ {unknownCount} szót még nem tudsz - gyakorold őket!
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}
