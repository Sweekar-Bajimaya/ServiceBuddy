import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Container, TextField, Typography, Card, CardContent } from "@mui/material";
import { verifyOtp } from "../../services/api";
import { useToast } from "../common/ToastProvider";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const email = location.state?.email;
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp({ email, otp });
      showToast("✅ Email verified successfully!", "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      showToast(err.response?.data?.error || "Verification failed", "error");
    }
  };

  if (!email) {
    return (
      <Container>
        <Typography variant="h6" color="error">Invalid access. No email provided.</Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Card sx={{ width: "100%", boxShadow: 3, borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Email Verification
          </Typography>
          <Typography variant="body2" align="center" sx={{ mb: 2 }}>
            Please enter the 6-digit OTP sent to <b>{email}</b>
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              label="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              inputProps={{ maxLength: 6 }}
              required
              fullWidth
              margin="normal"
            />
            <Button variant="contained" type="submit" sx={{ mt: 2 }}>
              Verify OTP
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default VerifyOTP;
