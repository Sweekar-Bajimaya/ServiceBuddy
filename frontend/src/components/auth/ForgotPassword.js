import React, { useState } from "react";
import { Box, TextField, Button, Typography, MenuItem } from "@mui/material";
import { forgotPassword } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../common/ToastProvider";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("user");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email, user_type: userType });
      showToast(res.data.message, "info");

      // Redirect to reset-password page after short delay
      setTimeout(() => {
        navigate("/reset-password", {
          state: { email, user_type: userType },
        });
      }, 2000); // 2-second delay for UX
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to send OTP.", "error");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Forgot Password
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          select
          label="User Type"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="provider">Provider</MenuItem>
        </TextField>
        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
          Send OTP
        </Button>
      </form>
      <Button onClick={() => navigate("/login")} sx={{ mt: 2 }}>
        Back to Login
      </Button>
    </Box>
  );
};

export default ForgotPassword;
