import React, { useState, useEffect, useContext } from 'react';
import { 
  AppBar, Toolbar, Typography, Drawer, Box, IconButton, 
  Grid, Card, CardContent, Button 
} from '@mui/material';
import { Menu as MenuIcon } from "@mui/icons-material";
import { getProviderRequests, updateServiceRequest } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from "../common/Sidebar";

const drawerWidth = 240;

const ProviderRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext); // Ensure provider info is stored here

  const [mobileOpen, setMobileOpen] = useState(false);

  // Toggle the sidebar for mobile
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Fetch service requests
  const fetchRequests = async () => {
    try {
      const res = await getProviderRequests();
      setRequests(res.data || []); // Ensure it's an array
    } catch (err) {
      console.error(err);
      setError('Failed to load requests.');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    try {
      console.log(`Updating request ${requestId} with action:`, action);
      // Send payload with key "action" instead of "status"
      const response = await updateServiceRequest(requestId, { action: action });
      console.log("Update response:", response.data);
      // Optimistically update UI
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: action } : req
        )
      );
    } catch (err) {
      console.error("Error updating request:", err.response ? err.response.data : err);
      setError(err.response?.data?.error || "Failed to update request.");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Topbar / AppBar */}
      <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Service Requests
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="sidebar">
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}
        >
          <Sidebar />
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer variant="permanent" sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }} open>
          <Sidebar />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>

        {error && <Typography color="error">{error}</Typography>}

        {requests.length === 0 ? (
          <Typography>No service requests found.</Typography>
        ) : (
          <Grid container spacing={2}>
            {requests.map((req) => (
              <Grid item xs={12} key={req._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Request ID: {req._id}</Typography>
                    <Typography variant="body1">
                      User: {req.username || 'Unknown User'}
                    </Typography>
                    <Typography variant="body1">
                      Problem: {req.description}
                    </Typography>
                    <Typography variant="body1">
                      Appointment: {req.appointment_date} {req.appointment_time}
                    </Typography>
                    <Typography variant="body1">
                      Status: {req.status}
                    </Typography>
                    {req.status === 'pending' && (
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          color="success"
                          sx={{ mr: 2 }}
                          onClick={() => handleAction(req._id, 'accept')}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleAction(req._id, 'decline')}
                        >
                          Decline
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default ProviderRequests;
