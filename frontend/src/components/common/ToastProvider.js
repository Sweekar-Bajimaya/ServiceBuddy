import React, { createContext, useState, useContext } from "react";
import { Snackbar, Alert } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

// 1. Create Toast Context
const ToastContext = createContext();

// 2. Custom Hook to use it
export const useToast = () => useContext(ToastContext);

// 3. Provider Component
const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info", // success | error | warning | info
  });

  // 4. Function to trigger toast
  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  // 5. Close handler
  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setToast({ ...toast, open: false });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};
export default ToastProvider;
