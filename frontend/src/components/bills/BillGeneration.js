// src/components/bills/BillGeneration.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { generateBill } from '../../services/api';

const BillGeneration = () => {
  const [form, setForm] = useState({
    request_id: '',
    charges: '',
    supplements: '',
    total: '',
    payment_method: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert supplements to an array if needed
      const supplementsArray = form.supplements.split(',').map((s) => s.trim());
      const res = await generateBill({ 
        request_id: form.request_id,
        charges: parseFloat(form.charges),
        supplements: supplementsArray,
        total: parseFloat(form.total),
        payment_method: form.payment_method
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error('Error generating bill:', err);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" gutterBottom>Generate Bill</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Request ID"
          name="request_id"
          value={form.request_id}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Charges"
          name="charges"
          value={form.charges}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Supplements (comma-separated)"
          name="supplements"
          value={form.supplements}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Total"
          name="total"
          value={form.total}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Payment Method"
          name="payment_method"
          value={form.payment_method}
          onChange={handleChange}
        />

        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          Generate Bill
        </Button>
      </form>
      {message && <Typography variant="body1" sx={{ mt: 2 }}>{message}</Typography>}
    </Box>
  );
};

export default BillGeneration;
