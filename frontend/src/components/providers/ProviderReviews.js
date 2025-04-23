import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Rating,
  Paper,
  Divider,
  CircularProgress,
  AppBar,
  Toolbar,
  Drawer,
  IconButton,
  Avatar,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { getReviewList } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../common/Sidebar";

const drawerWidth = 240;

const ProviderReviews = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext); // Authenticated provider

  // Toggle the sidebar for mobile
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getReviewList(user.provider_id); // You can even omit passing user_id
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReviews();
    }
  }, [user]);

  // Calculate average rating
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
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
            Customer Reviews
          </Typography>
          <Box sx={{ ml: "auto", fontWeight: "bold" }}>
            {user ? `Mr. ${user.name}` : "Loading..."}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          <Sidebar />
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          <Sidebar />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Reviews ({reviews.length})
          </Typography>
          {reviews.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", ml: 3 }}>
              <Typography variant="body1" sx={{ mr: 1 }}>
                Average Rating:
              </Typography>
              <Rating value={calculateAverageRating()} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({calculateAverageRating().toFixed(1)})
              </Typography>
            </Box>
          )}
        </Box>

        {reviews.length === 0 ? (
          <Typography variant="body2">No reviews yet.</Typography>
        ) : (
          reviews.map((review, index) => (
            <Paper key={review._id || index} sx={{ p: 3, mb: 2 }}>
              <Box display="flex" alignItems="flex-start">
                {/* User Profile Picture */}
                <Avatar
                  src={review.profile_picture || "/default-profile.png"}
                  alt={`${review.user_name}'s profile`}
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    mr: 2,
                    border: '1px solid #eee' 
                  }}
                  onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = "/default-profile.png"; 
                  }}
                />
                
                {/* Review Content */}
                <Box flex={1}>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <Typography variant="subtitle1" fontWeight="bold" mr={2}>
                      {review.user_name}
                    </Typography>
                    <Rating value={review.rating} readOnly />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" mb={1.5}>
                    {new Date(review.created_at).toLocaleDateString()} at {new Date(review.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Typography>
                  
                  <Typography variant="body1">
                    {review.review}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
};

export default ProviderReviews;