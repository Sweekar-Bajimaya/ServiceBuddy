// src/components/auth/ResetPassword.js
import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { resetPassword } from '../../services/api'; // Create this function in your API service
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Extract token from URL query parameter
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const res = await resetPassword({ token, new_password: newPassword });
      setMessage(res.data.message);
      setError('');
      // Optionally navigate to login after a short delay
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password.");
      setMessage('');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" gutterBottom>Reset Password</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          label="Confirm New Password"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <Typography color="error">{error}</Typography>}
        {message && <Typography color="primary">{message}</Typography>}
        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
          Reset Password
        </Button>
      </form>
    </Box>
  );
};

export default ResetPassword;
