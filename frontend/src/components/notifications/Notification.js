// src/components/notifications/Notifications.js
import React, { useEffect, useState } from 'react';
import { getNotifications } from '../../services/api';
import { Box, Typography, List, ListItem } from '@mui/material';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Notifications</Typography>
      <List>
        {notifications.map((notif) => (
          <ListItem key={notif._id}>
            {notif.message} - {notif.created_at}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Notifications;
