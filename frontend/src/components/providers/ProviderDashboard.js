import React, { useState, useContext, useEffect } from "react";
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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  CircularProgress,
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

  // Toggle the sidebar for mobile
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Example data for the table
  const ticketsData = [
    { reference: "2025001", date: "January 1, 2025", lastUpdated: "January 3, 2025", subject: "Leaking Pipe in Kitchen", status: "Resolved", priority: "High" },
    { reference: "2025002", date: "January 5, 2025", lastUpdated: "January 6, 2025", subject: "Electrical Short Circuit", status: "Pending", priority: "Medium" },
    { reference: "2025003", date: "January 10, 2025", lastUpdated: "January 12, 2025", subject: "Laptop Repair", status: "In Progress", priority: "Low" },
  ];

  const [summary, setSummary] = useState({
    total_requests: 0,
    jobs_completed: 0,
    jobs_in_progress: 0,
    jobs_not_completed: 0,
  });

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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: '#1976d2'
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Dashboard
          </Typography>
          <Box sx={{ ml: 'auto', fontWeight: 'bold' }}>
            {user ? `Mr. ${user.name}` : 'Loading...'}
          </Box>
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
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar /> {/* Add space for the AppBar */}

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

        {/* Ticket Table */}
        <Box sx={{ mt: 4 }}>
          <Card>
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reference #</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Last Updated</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ticketsData.map((ticket) => (
                    <TableRow key={ticket.reference}>
                      <TableCell>{ticket.reference}</TableCell>
                      <TableCell>{ticket.date}</TableCell>
                      <TableCell>{ticket.lastUpdated}</TableCell>
                      <TableCell>{ticket.subject}</TableCell>
                      <TableCell>{ticket.status}</TableCell>
                      <TableCell>{ticket.priority}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default ProviderDashboard;
