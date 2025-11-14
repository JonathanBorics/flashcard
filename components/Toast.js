"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert, Slide } from "@mui/material";

// Context létrehozása
const ToastContext = createContext(null);

// Slide transition
function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

// Toast Provider komponens
export function ToastProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");

  const showToast = useCallback((msg, sev = "info", duration = 3000) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);

    // Auto-close
    setTimeout(() => {
      setOpen(false);
    }, duration);
  }, []);

  const hideToast = () => {
    setOpen(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={open}
        onClose={hideToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={SlideTransition}
        sx={{
          top: { xs: "16px", sm: "24px" },
        }}
      >
        <Alert
          onClose={hideToast}
          severity={severity}
          variant="filled"
          sx={{
            minWidth: { xs: "280px", sm: "340px" },
            fontSize: "1rem",
            fontWeight: 600,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
            "& .MuiAlert-icon": {
              fontSize: "24px",
            },
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

// Hook a toast használatához
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

// Shorthand függvények
export const toast = {
  success: (msg) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("showToast", {
          detail: { message: msg, severity: "success" },
        })
      );
    }
  },
  error: (msg) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("showToast", {
          detail: { message: msg, severity: "error" },
        })
      );
    }
  },
  info: (msg) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("showToast", {
          detail: { message: msg, severity: "info" },
        })
      );
    }
  },
  warning: (msg) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("showToast", {
          detail: { message: msg, severity: "warning" },
        })
      );
    }
  },
};
