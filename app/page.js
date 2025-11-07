"use client";

import { Container, Box, Typography, Button, Paper } from "@mui/material";
import { School, PlayArrow } from "@mui/icons-material";
import Link from "next/link";

export default function Home() {
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

          <Link href="/flashcards" passHref style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrow />}
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
        </Box>
      </Box>
    </Container>
  );
}
