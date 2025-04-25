import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { resetPassword } from "../../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../common/ToastProvider";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("user"); // default fallback
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  useEffect(() => {
    if (location.state) {
      const { email: passedEmail, user_type } = location.state;
      if (passedEmail) setEmail(passedEmail);
      if (user_type) setUserType(user_type);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPassword({
        email,
        otp,
        new_password: newPassword,
        user_type: userType, // include user_type in request
      });
      showToast(res.data.message, "success");

      setTimeout(() => navigate("/login"), 2000); // redirect to login after success
    } catch (err) {
      showToast(
        err.response?.data?.error || "Failed to reset password.",
        "error"
      );
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Reset Password
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
          label="OTP"
          fullWidth
          margin="normal"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
          Reset Password
        </Button>
      </form>
      <Button onClick={() => navigate("/login")} sx={{ mt: 2 }}>
        Back to Login
      </Button>
    </Box>
  );
};

export default ResetPassword;
