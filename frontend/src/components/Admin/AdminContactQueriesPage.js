import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  AppBar,
  Toolbar,
  Drawer,
  IconButton,
  Avatar,
  Divider,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import Sidebar from "../common/Sidebar";
import { getAdminContactQueries } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

const drawerWidth = 240;

const AdminContactQueriesPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const [contactQueries, setContactQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const fetchContactQueries = async () => {
      try {
        const response = await getAdminContactQueries();
        setContactQueries(response.data);
      } catch (error) {
        console.error("Error fetching contact queries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContactQueries();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} />
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
          backgroundColor: "#1976d2",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Customer Queries
          </Typography>
          <Box sx={{ ml: "auto", fontWeight: "bold" }}>
            Mr. {user?.name || "Admin"}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          <Sidebar />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
          open
        >
          <Sidebar />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Total Queries: {contactQueries.length}
        </Typography>

        {contactQueries.length === 0 ? (
          <Typography variant="body2">No queries received yet.</Typography>
        ) : (
          contactQueries.map((query, index) => (
            <Paper
              key={query._id || index}
              sx={{
                p: 3,
                mb: 2,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: 6, // MUI shadow level
                  cursor: "pointer",
                },
              }}
            >
              <Box display="flex" alignItems="flex-start">
                <Avatar
                  src={query.profile_picture || "/default-profile.png"}
                  alt={`${query.user_name}'s profile`}
                  sx={{
                    width: 60,
                    height: 60,
                    mr: 2,
                    border: "1px solid #eee",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-profile.png";
                  }}
                />
                <Box flex={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {query.user_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {query.user_email}
                  </Typography>

                  {query.subject && (
                    <Typography variant="body1" fontWeight="500" mt={2}>
                      Subject: {query.subject}
                    </Typography>
                  )}

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="body2">{query.message}</Typography>

                  {/* Created Date and Time */}
                  {query.created_at && (
                    <Typography
                      sx={{
                        mt: 1,
                        fontSize: "0.875rem",
                        color: "text.secondary",
                      }}
                    >
                      {new Date(query.created_at).toLocaleDateString()}{" "}
                      {new Date(query.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
};

export default AdminContactQueriesPage;
