import React, { useState, useContext, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  Box,
  IconButton,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  ListItemSecondaryAction,
  Avatar,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import Sidebar from "../common/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import { getProviderDashboardSummary } from "../../services/api";

const drawerWidth = 240;

const ProviderDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const wsRef = useRef(null);

  const [summary, setSummary] = useState({
    total_requests: 0,
    jobs_completed: 0,
    jobs_in_progress: 0,
    jobs_not_completed: 0,
  });

  const [notifications, setNotifications] = useState([]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getProviderDashboardSummary();
        setSummary(res.data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const socket = new WebSocket(`ws://localhost:8000/ws/provider-notifications/${user.id}/`);
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📥 New Notification:", data);

      const notification = {
        ...data,
        read: false,
        id: Date.now() + Math.random(), // unique client-side ID
      };

      setNotifications((prev) => [notification, ...prev]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.warn("WebSocket disconnected");
    };

    return () => socket.close();
  }, [user?.providerId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "#1976d2",
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Dashboard
          </Typography>
          <Box sx={{ ml: "auto", fontWeight: "bold" }}>
            {user ? `Mr. ${user.name}` : "Loading..."}
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="sidebar">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}
        >
          <Sidebar />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}
          open
        >
          <Sidebar />
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />

        {/* Summary Cards */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Card sx={{ backgroundColor: "#e3f2fd" }}>
              <CardContent>
                <Typography variant="h6">Total Requests</Typography>
                <Typography variant="h4" color="primary">{summary.total_requests}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card sx={{ backgroundColor: "#e8f5e9" }}>
              <CardContent>
                <Typography variant="h6">Jobs Completed</Typography>
                <Typography variant="h4" color="success.main">{summary.jobs_completed}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card sx={{ backgroundColor: "#fff8e1" }}>
              <CardContent>
                <Typography variant="h6">Jobs In Progress</Typography>
                <Typography variant="h4" color="warning.main">{summary.jobs_in_progress}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card sx={{ backgroundColor: "#ffebee" }}>
              <CardContent>
                <Typography variant="h6">Not Completed</Typography>
                <Typography variant="h4" color="error.main">{summary.jobs_not_completed}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Notifications Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Notifications
          </Typography>
          <Card>
            <CardContent>
              <List sx={{ maxHeight: 400, overflowY: "auto" }}>
                {notifications.length === 0 ? (
                  <Typography>No notifications available.</Typography>
                ) : (
                  notifications.map((notif) => (
                    <ListItem
                      key={notif.id}
                      sx={{
                        backgroundColor: notif.read ? "#f5f5f5" : "#e3f2fd",
                        borderRadius: 1,
                        mb: 1,
                        alignItems: "flex-start",
                      }}
                    >
                      <Avatar sx={{ bgcolor: notif.read ? "grey.400" : "primary.main", mr: 2 }}>
                        {notif.type === "review" ? "⭐" : "🔔"}
                      </Avatar>
                      <ListItemText
                        primary={notif.message}
                        secondary={notif.read ? "Read" : "Unread"}
                      />
                      {!notif.read && (
                        <ListItemSecondaryAction>
                          <Button variant="outlined" size="small" onClick={() => handleMarkAsRead(notif.id)}>
                            Mark as Read
                          </Button>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default ProviderDashboard;
