import React, { useState, useEffect, useContext } from 'react';
import {
  AppBar, Toolbar, Typography, Drawer, Box, IconButton,
  Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Alert, Snackbar, Container, CircularProgress
} from '@mui/material';
import { Menu as MenuIcon } from "@mui/icons-material";
import { getProviderRequests, updateServiceRequest } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from "../common/Sidebar";

const drawerWidth = 240;

const ProviderRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { user } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const fetchRequests = async () => {
    try {
      const res = await getProviderRequests();
      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load requests.');
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    try {
      await updateServiceRequest(requestId, { action });
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: action } : req
        )
      );
      setSuccessMessage(`Request ${action === 'accept' ? 'accepted' : 'declined'} successfully.`);
    } catch (err) {
      console.error(err);
      setError('Failed to update request.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Service Requests
          </Typography>
          <Box sx={{ ml: "auto", fontWeight: 'bold'}}>
            {user ? `Mr. ${user.name}` : 'Loading...'}
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="sidebar">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { width: drawerWidth } }}
        >
          <Sidebar />
        </Drawer>
        <Drawer variant="permanent" sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { width: drawerWidth } }} open>
          <Sidebar />
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 , width: { sm: `calc(100% - ${drawerWidth}px)` }}}>
        <Container maxWidth="xl">
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Snackbar
            open={!!successMessage}
            autoHideDuration={3000}
            onClose={() => setSuccessMessage("")}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert severity="success" onClose={() => setSuccessMessage("")}>
              {successMessage}
            </Alert>
          </Snackbar>

          {requests.length === 0 ? (
            <Typography>No service requests found.</Typography>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>User</strong></TableCell>
                    <TableCell><strong>Service Description</strong></TableCell>
                    <TableCell><strong>Appointment Date</strong></TableCell>
                    <TableCell><strong>Time</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req._id}>
                      <TableCell>{req.username || 'Unknown User'}</TableCell>
                      <TableCell>{req.description}</TableCell>
                      <TableCell>{req.appointment_date}</TableCell>
                      <TableCell>
                        {req.shift_start_time && req.shift_end_time
                          ? `${req.shift_start_time} - ${req.shift_end_time}`
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{req.status}</TableCell>
                      <TableCell>
                        {req.status === 'pending' ? (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              sx={{ mr: 1 }}
                              onClick={() => handleAction(req._id, 'accept')}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleAction(req._id, 'decline')}
                            >
                              Decline
                            </Button>
                          </>
                        ) : (
                          <Typography variant="body2" color="textSecondary">No actions</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default ProviderRequests;
