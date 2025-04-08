import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Button,
  Menu,
  MenuItem,
  Typography,
  Box,
  Stack,
  Badge,
} from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = ({ transparent = true }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);

  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your request was accepted.", type: "success", read: false },
    { id: 2, message: "Your request was declined.", type: "error", read: false },
  ]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/login");
  };

  const handleMyBookings = () => {
    handleMenuClose();
    navigate("/my-bookings");
  };

  const handleNotifOpen = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppBar
      position="absolute"
      sx={{
        backgroundColor: transparent ? "transparent" : "primary.main",
        boxShadow: transparent ? "none" : 2,
        transition: "background-color 0.3s",
      }}
    >
      <Toolbar
        sx={{
          width: "100%",
          maxWidth: "1200px", // You can adjust this max width as per your design
          margin: "0 auto", // Centers the navbar content
          paddingLeft: { xs: 2, sm: 4 },
          paddingRight: { xs: 2, sm: 4 },
        }}
      >
        <IconButton edge="start" color="inherit">
          <ConstructionIcon />
        </IconButton>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
        >
          ServiceBuddy
        </Typography>
        <Stack direction="row" spacing={3}>
          <Button color="inherit" component={Link} to="/aboutus">
            About Us
          </Button>
          <Button color="inherit" component={Link} to="/services">
            Services
          </Button>
          <Button color="inherit" component={Link} to="/contact">
            Contact
          </Button>
          {user ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* User Avatar and Menu */}
              <IconButton onClick={handleMenuOpen} size="large" sx={{ p: 0 }}>
                <Avatar alt={user.name} src={user.avatar || ""} />
              </IconButton>
              <Typography
                variant="body1"
                sx={{ color: "inherit", cursor: "pointer" }}
                onClick={handleMenuOpen}
              >
                {user.name}
              </Typography>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{ elevation: 3, sx: { mt: 1 } }}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleMyBookings}>My Bookings</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
                            {/* Notification Icon */}
                            <IconButton color="inherit" onClick={handleNotifOpen}>
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* Notification Dropdown */}
              <Menu
                anchorEl={notifAnchorEl}
                open={Boolean(notifAnchorEl)}
                onClose={handleNotifClose}
                PaperProps={{ elevation: 3, sx: { mt: 1, width: 270 } }}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                {notifications.length === 0 ? (
                  <MenuItem disabled>No notifications</MenuItem>
                ) : (
                  notifications.map((notif) => (
                    <MenuItem
                      key={notif.id}
                      onClick={() => handleMarkAsRead(notif.id)}
                      sx={{
                        fontWeight: notif.read ? "normal" : "bold",
                        backgroundColor:
                          notif.type === "success"
                            ? "rgba(76, 175, 80, 0.1)" // light green bg
                            : notif.type === "error"
                            ? "rgba(244, 67, 54, 0.1)" // light red bg
                            : "inherit",
                        color:
                          notif.type === "success"
                            ? "success.main"
                            : notif.type === "error"
                            ? "error.main"
                            : "text.primary",
                        my: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {notif.message}
                    </MenuItem>
                  ))
                )}
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
