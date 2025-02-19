import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { createServiceRequest } from '../../services/api';

const ServiceRequestCreate = () => {
  const [form, setForm] = useState({ provider_id: '', description: '', date: '', time: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createServiceRequest(form);
      setMessage(`Request Created: ${res.data.request_id}`);
    } catch (err) {
      console.error('Error creating service request', err);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" gutterBottom>Request Service</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Provider ID"
          name="provider_id"
          value={form.provider_id}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Appointment Date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Appointment Time"
          name="time"
          value={form.time}
          onChange={handleChange}
        />

        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          Create Request
        </Button>
      </form>
      {message && <Typography variant="body1" sx={{ mt: 2 }}>{message}</Typography>}
    </Box>
  );
};

export default ServiceRequestCreate;