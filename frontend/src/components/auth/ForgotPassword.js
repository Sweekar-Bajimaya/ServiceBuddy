// src/components/auth/ForgotPassword.js
import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { forgotPassword } from '../../services/api'; // Create this function in your API service
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email });
      setMessage(res.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send reset email.");
      setMessage('');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" gutterBottom>Forgot Password</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <Typography color="error">{error}</Typography>}
        {message && <Typography color="primary">{message}</Typography>}
        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
          Send Reset Link
        </Button>
      </form>
      <Button onClick={() => navigate('/login')} sx={{ mt: 2 }}>Back to Login</Button>
    </Box>
  );
};

export default ForgotPassword;
