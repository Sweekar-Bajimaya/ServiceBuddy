import React, { useState } from "react";
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
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import Sidebar from "../common/Sidebar";

const drawerWidth = 240;

const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

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

  return (
    <Box sx={{ display: "flex" }}>
      {/* Topbar / AppBar */}
      <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
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
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar /> {/* Add space for the AppBar */}

        {/* Summary Cards */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total Requests</Typography>
                <Typography variant="h4" color="primary">530</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Jobs Completed</Typography>
                <Typography variant="h4" color="primary">230</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Jobs in Progress</Typography>
                <Typography variant="h4" color="primary">20</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Ticket Table */}
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <TextField size="small" placeholder="Search here..." sx={{ width: 300 }} />
            {/* <Button variant="contained">+ Submit a Ticket</Button> */}
          </Box>

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

export default AdminDashboard;
