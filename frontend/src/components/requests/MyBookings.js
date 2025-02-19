// src/components/requests/MyBookings.js
import React, { useEffect, useState } from 'react';
import { getMyBookings } from '../../services/api';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await getMyBookings();
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>My Bookings</Typography>
      <Grid container spacing={2}>
        {bookings.map((booking) => (
          <Grid item xs={12} sm={6} md={4} key={booking.request_id}>
            <Card>
              <CardContent>
                <Typography variant="h6">Request ID: {booking.request_id}</Typography>
                <Typography>Provider ID: {booking.provider_id}</Typography>
                <Typography>Provider Name: {booking.provider_name}</Typography>
                <Typography>Service: {booking.requested_service}</Typography>
                <Typography>Appointment Date: {booking.appointment_date}</Typography>
                <Typography>Status: {booking.status}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MyBookings;
