import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, IconButton, Avatar, Button, Menu, MenuItem, Typography, Box, Stack } from '@mui/material';
import ConstructionIcon from "@mui/icons-material/Construction";
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  // Handle opening the avatar menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  // Navigate to My Bookings page
  const handleMyBookings = () => {
    handleMenuClose();
    navigate('/my-bookings');
  };

  return (
    <AppBar position="absolute" sx={{ backgroundColor: 'transparent', boxShadow: 'none', px: 16 }}>
      <Toolbar>
        <IconButton edge="start" color="inherit">
          <ConstructionIcon />
        </IconButton>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          ServiceBuddy
        </Typography>
        <Stack direction="row" spacing={3}>
        <Button color="inherit" component={Link} to="/about">About Us</Button>
        <Button color="inherit" component={Link} to="/services">Services</Button>
        <Button color="inherit" component={Link} to="/contact">Contact</Button>
        {user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={handleMenuOpen} size="large" sx={{ p: 0 }}>
              <Avatar alt={user.name} src={user.avatar || ''} />
            </IconButton>
            <Typography variant="body1" sx={{ color: "inherit", cursor: "pointer" }} onClick={handleMenuOpen}>
              {user.name}
            </Typography>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: { mt: 1 },
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleMyBookings}>My Bookings</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </Stack>
 
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;