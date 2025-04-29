// import React, { useContext, useState, useRef  } from "react";
// import {
//   AppBar,
//   Toolbar,
//   IconButton,
//   Avatar,
//   Button,
//   Menu,
//   MenuItem,
//   Typography,
//   Box,
//   Stack,
//   Badge,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   useMediaQuery,
// } from "@mui/material";
// import ConstructionIcon from "@mui/icons-material/Construction";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import MenuIcon from "@mui/icons-material/Menu";
// import { useTheme } from "@mui/material/styles";
// import { useNavigate, Link } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";
// import Logo from "../Images/Logo.png"; // Adjust the path as necessary

// const Navbar = ({ transparent = true }) => {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));

//   const [anchorEl, setAnchorEl] = useState(null);
//   const [notifAnchorEl, setNotifAnchorEl] = useState(null);
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   const [notifications, setNotifications] = useState([
//     { id: 1, message: "Your request was accepted.", type: "success", read: false },
//     { id: 2, message: "Your request was declined.", type: "error", read: false },
//   ]);

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     logout();
//     handleMenuClose();
//     navigate("/login");
//   };

//   const handleMyBookings = () => {
//     handleMenuClose();
//     navigate("/my-bookings");
//   };

//   const handleProfile = () => {
//     handleMenuClose();
//     navigate("/profile");
//   };

//   const handleNotifOpen = (event) => {
//     setNotifAnchorEl(event.currentTarget);
//   };

//   const handleNotifClose = () => {
//     setNotifAnchorEl(null);
//   };

//   const handleMarkAsRead = (id) => {
//     setNotifications((prev) =>
//       prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
//     );
//   };

//   const unreadCount = notifications.filter((n) => !n.read).length;

//   const drawerItems = (
//     <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
//       <List>
//         <ListItem button component={Link} to="/aboutus">
//           <ListItemText primary="About Us" />
//         </ListItem>
//         <ListItem button component={Link} to="/services">
//           <ListItemText primary="Services" />
//         </ListItem>
//         <ListItem button component={Link} to="/contact">
//           <ListItemText primary="Contact" />
//         </ListItem>
//         {!user ? (
//           <ListItem button onClick={() => navigate("/login")}>
//             <ListItemText primary="Login" />
//           </ListItem>
//         ) : (
//           <>
//             <Divider />
//             <ListItem button onClick={handleMyBookings}>
//               <ListItemText primary="My Bookings" />
//             </ListItem>
//             <ListItem button onClick={handleLogout}>
//               <ListItemText primary="Logout" />
//             </ListItem>
//           </>
//         )}
//       </List>
//     </Box>
//   );

//   return (
//     <AppBar
//       position="absolute"
//       sx={{
//         backgroundColor: transparent ? "transparent" : "primary.main",
//         boxShadow: transparent ? "none" : 2,
//         transition: "background-color 0.3s",
//       }}
//     >
//       <Toolbar
//         sx={{
//           width: "100%",
//           maxWidth: "1200px",
//           margin: "0 auto",
//           paddingLeft: { xs: 2, sm: 4 },
//           paddingRight: { xs: 2, sm: 4 },
//         }}
//       >
//         <IconButton edge="start" color="inherit" sx={{ mr: 1 }}>
//           <img
//             src={Logo} // or use require if from src: require("../assets/logo.png")
//             alt="ServiceBuddy Logo"
//             style={{ width: 48, height: 48 }}
//           />
//         </IconButton>
//         <Typography
//           variant="h6"
//           component={Link}
//           to="/"
//           sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
//         >
//           ServiceBuddy
//         </Typography>

//         {isMobile ? (
//           <>
//             {user && (
//               <>
//                 <IconButton color="inherit" onClick={handleNotifOpen}>
//                   <Badge badgeContent={unreadCount} color="error">
//                     <NotificationsIcon />
//                   </Badge>
//                 </IconButton>
//                 <Menu
//                   anchorEl={notifAnchorEl}
//                   open={Boolean(notifAnchorEl)}
//                   onClose={handleNotifClose}
//                   PaperProps={{ elevation: 3, sx: { mt: 1, width: 270 } }}
//                   anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//                   transformOrigin={{ vertical: "top", horizontal: "right" }}
//                 >
//                   {notifications.length === 0 ? (
//                     <MenuItem disabled>No notifications</MenuItem>
//                   ) : (
//                     notifications.map((notif) => (
//                       <MenuItem
//                         key={notif.id}
//                         onClick={() => handleMarkAsRead(notif.id)}
//                         sx={{
//                           fontWeight: notif.read ? "normal" : "bold",
//                           backgroundColor:
//                             notif.type === "success"
//                               ? "rgba(76, 175, 80, 0.1)"
//                               : notif.type === "error"
//                               ? "rgba(244, 67, 54, 0.1)"
//                               : "inherit",
//                           color:
//                             notif.type === "success"
//                               ? "success.main"
//                               : notif.type === "error"
//                               ? "error.main"
//                               : "text.primary",
//                           my: 0.5,
//                           borderRadius: 1,
//                         }}
//                       >
//                         {notif.message}
//                       </MenuItem>
//                     ))
//                   )}
//                 </Menu>
//               </>
//             )}
//             <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
//               <MenuIcon />
//             </IconButton>
//             <Drawer
//               anchor="right"
//               open={drawerOpen}
//               onClose={() => setDrawerOpen(false)}
//               sx={{
//                 "& .MuiDrawer-paper": {
//                   animation: "slideIn 0.3s ease-out",
//                 },
//               }}
//             >
//               {drawerItems}
//             </Drawer>
//           </>
//         ) : (
//           <Stack direction="row" spacing={3} alignItems="center">
//             <Button color="inherit" component={Link} to="/aboutus">
//               About Us
//             </Button>
//             <Button color="inherit" component={Link} to="/services">
//               Services
//             </Button>
//             <Button color="inherit" component={Link} to="/contact">
//               Contact
//             </Button>
//             {user ? (
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <IconButton onClick={handleMenuOpen} size="large" sx={{ p: 0 }}>
//                 <Avatar
//                   alt={user?.name}
//                   src={user?.profile_picture || "/default-avatar.png"}
//                   onError={(e) => {
//                     console.log("Failed to load image:", e.target.src);
//                     e.target.src = "/default-avatar.png";
//                   }}
//                 />
//                 </IconButton>
//                 <Typography
//                   variant="body1"
//                   sx={{ color: "inherit", cursor: "pointer" }}
//                   onClick={handleMenuOpen}
//                 >
//                   {user.name}
//                 </Typography>
//                 <Menu
//                   anchorEl={anchorEl}
//                   open={Boolean(anchorEl)}
//                   onClose={handleMenuClose}
//                   PaperProps={{ elevation: 3, sx: { mt: 1 } }}
//                   anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//                   transformOrigin={{ vertical: "top", horizontal: "right" }}
//                 >
//                   <MenuItem onClick={handleProfile}>My Profile</MenuItem>
//                   <MenuItem onClick={handleMyBookings}>My Bookings</MenuItem>
//                   <MenuItem onClick={handleLogout}>Logout</MenuItem>
//                 </Menu>

//                 {/* Notification Icon and Dropdown */}
//                 <IconButton color="inherit" onClick={handleNotifOpen}>
//                   <Badge badgeContent={unreadCount} color="error">
//                     <NotificationsIcon />
//                   </Badge>
//                 </IconButton>
//                 <Menu
//                   anchorEl={notifAnchorEl}
//                   open={Boolean(notifAnchorEl)}
//                   onClose={handleNotifClose}
//                   PaperProps={{ elevation: 3, sx: { mt: 1, width: 270 } }}
//                   anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//                   transformOrigin={{ vertical: "top", horizontal: "right" }}
//                 >
//                   {notifications.length === 0 ? (
//                     <MenuItem disabled>No notifications</MenuItem>
//                   ) : (
//                     notifications.map((notif) => (
//                       <MenuItem
//                         key={notif.id}
//                         onClick={() => handleMarkAsRead(notif.id)}
//                         sx={{
//                           fontWeight: notif.read ? "normal" : "bold",
//                           backgroundColor:
//                             notif.type === "success"
//                               ? "rgba(76, 175, 80, 0.1)"
//                               : notif.type === "error"
//                               ? "rgba(244, 67, 54, 0.1)"
//                               : "inherit",
//                           color:
//                             notif.type === "success"
//                               ? "success.main"
//                               : notif.type === "error"
//                               ? "error.main"
//                               : "text.primary",
//                           my: 0.5,
//                           borderRadius: 1,
//                         }}
//                       >
//                         {notif.message}
//                       </MenuItem>
//                     ))
//                   )}
//                 </Menu>
//               </Box>
//             ) : (
//               <Button color="inherit" onClick={() => navigate("/login")}>
//                 Login
//               </Button>
//             )}
//           </Stack>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;

// import React, { useContext, useState, useEffect, useRef } from "react";
// import {
//   AppBar,
//   Toolbar,
//   IconButton,
//   Avatar,
//   Button,
//   Menu,
//   MenuItem,
//   Typography,
//   Box,
//   Stack,
//   Badge,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   useMediaQuery,
// } from "@mui/material";
// import ConstructionIcon from "@mui/icons-material/Construction";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import MenuIcon from "@mui/icons-material/Menu";
// import { useTheme } from "@mui/material/styles";
// import { useNavigate, Link } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";
// import Logo from "../Images/Logo.png";

// const Navbar = ({ transparent = true }) => {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));

//   const [anchorEl, setAnchorEl] = useState(null);
//   const [notifAnchorEl, setNotifAnchorEl] = useState(null);
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   const [notifications, setNotifications] = useState([]);

//   const wsRef = useRef(null);

//   useEffect(() => {
//     if (!user?.id) return;
  
//     const socket = new WebSocket(`ws://localhost:8000/ws/notifications/${user.id}/`);
  
//     socket.onopen = () => {
//       console.log("✅ WebSocket connected");
//     };
  
//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log("📥 New Notification:", data);
      
//       // Append to notification list
//       setNotifications((prev) => [data, ...prev]);
//     };
  
//     socket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };
  
//     socket.onclose = () => {
//       console.warn("WebSocket disconnected");
//     };
  
//     return () => {
//       socket.close();
//     };
//   }, [user?.id]);

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     logout();
//     handleMenuClose();
//     navigate("/login");
//   };

//   const handleMyBookings = () => {
//     handleMenuClose();
//     navigate("/my-bookings");
//   };

//   const handleProfile = () => {
//     handleMenuClose();
//     navigate("/profile");
//   };

//   const handleNotifOpen = (event) => {
//     setNotifAnchorEl(event.currentTarget);
//   };

//   const handleNotifClose = () => {
//     setNotifAnchorEl(null);
//   };

//   const handleMarkAllAsRead = () => {
//     setNotifications((prev) =>
//       prev.map((notif) => ({ ...notif, read: true }))
//     );
//   };
 

//   const unreadCount = notifications.filter((n) => !n.read).length;

//   const drawerItems = (
//     <Box
//       sx={{ width: 250 }}
//       role="presentation"
//       onClick={() => setDrawerOpen(false)}
//     >
//       <List>
//         <ListItem button component={Link} to="/aboutus">
//           <ListItemText primary="About Us" />
//         </ListItem>
//         <ListItem button component={Link} to="/services">
//           <ListItemText primary="Services" />
//         </ListItem>
//         <ListItem button component={Link} to="/contact">
//           <ListItemText primary="Contact" />
//         </ListItem>
//         {!user ? (
//           <ListItem button onClick={() => navigate("/login")}>
//             <ListItemText primary="Login" />
//           </ListItem>
//         ) : (
//           <>
//             <Divider />
//             <ListItem button onClick={handleMyBookings}>
//               <ListItemText primary="My Bookings" />
//             </ListItem>
//             <ListItem button onClick={handleLogout}>
//               <ListItemText primary="Logout" />
//             </ListItem>
//           </>
//         )}
//       </List>
//     </Box>
//   );

//   return (
//     <AppBar
//       position="absolute"
//       sx={{
//         backgroundColor: transparent ? "transparent" : "primary.main",
//         boxShadow: transparent ? "none" : 2,
//         transition: "background-color 0.3s",
//       }}
//     >
//       <Toolbar
//         sx={{
//           width: "100%",
//           maxWidth: "1200px",
//           margin: "0 auto",
//           paddingLeft: { xs: 2, sm: 4 },
//           paddingRight: { xs: 2, sm: 4 },
//         }}
//       >
//         <IconButton edge="start" color="inherit" sx={{ mr: 1 }}>
//           <img
//             src={Logo}
//             alt="ServiceBuddy Logo"
//             style={{ width: 48, height: 48 }}
//           />
//         </IconButton>
//         <Typography
//           variant="h6"
//           component={Link}
//           to="/"
//           sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
//         >
//           ServiceBuddy
//         </Typography>

//         {isMobile ? (
//           <>
//             {user && (
//               <>
//                 <IconButton color="inherit" onClick={handleNotifOpen}>
//                   <Badge badgeContent={unreadCount} color="error">
//                     <NotificationsIcon />
//                   </Badge>
//                 </IconButton>
//                 <Menu
//                   anchorEl={notifAnchorEl}
//                   open={Boolean(notifAnchorEl)}
//                   onClose={handleNotifClose}
//                   PaperProps={{ elevation: 3, sx: { mt: 1, width: 270 } }}
//                   anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//                   transformOrigin={{ vertical: "top", horizontal: "right" }}
//                 >
//                   {notifications.length === 0 ? (
//                     <MenuItem disabled>No notifications</MenuItem>
//                   ) : (
//                     notifications.map((notif) => (
//                       <MenuItem
//                         key={notif.id}
//                         onClick={() => handleMarkAsRead(notif.id)}
//                         sx={{
//                           fontWeight: notif.read ? "normal" : "bold",
//                           backgroundColor:
//                             notif.type === "success"
//                               ? "rgba(76, 175, 80, 0.1)"
//                               : notif.type === "error"
//                               ? "rgba(244, 67, 54, 0.1)"
//                               : "inherit",
//                           color:
//                             notif.type === "success"
//                               ? "success.main"
//                               : notif.type === "error"
//                               ? "error.main"
//                               : "text.primary",
//                           my: 0.5,
//                           borderRadius: 1,
//                         }}
//                       >
//                         {notif.message}
//                       </MenuItem>
//                     ))
//                   )}
//                 </Menu>
//               </>
//             )}
//             <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
//               <MenuIcon />
//             </IconButton>
//             <Drawer
//               anchor="right"
//               open={drawerOpen}
//               onClose={() => setDrawerOpen(false)}
//               sx={{
//                 "& .MuiDrawer-paper": {
//                   animation: "slideIn 0.3s ease-out",
//                 },
//               }}
//             >
//               {drawerItems}
//             </Drawer>
//           </>
//         ) : (
//           <Stack direction="row" spacing={3} alignItems="center">
//             <Button color="inherit" component={Link} to="/aboutus">
//               About Us
//             </Button>
//             <Button color="inherit" component={Link} to="/services">
//               Services
//             </Button>
//             <Button color="inherit" component={Link} to="/contact">
//               Contact
//             </Button>
//             {user ? (
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <IconButton onClick={handleMenuOpen} size="large" sx={{ p: 0 }}>
//                   <Avatar
//                     alt={user?.name}
//                     src={user?.profile_picture || "/default-avatar.png"}
//                     onError={(e) => {
//                       e.target.src = "/default-avatar.png";
//                     }}
//                   />
//                 </IconButton>
//                 <Typography
//                   variant="body1"
//                   sx={{ color: "inherit", cursor: "pointer" }}
//                   onClick={handleMenuOpen}
//                 >
//                   {user.name}
//                 </Typography>
//                 <Menu
//                   anchorEl={anchorEl}
//                   open={Boolean(anchorEl)}
//                   onClose={handleMenuClose}
//                   PaperProps={{ elevation: 3, sx: { mt: 1 } }}
//                   anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//                   transformOrigin={{ vertical: "top", horizontal: "right" }}
//                 >
//                   <MenuItem onClick={handleProfile}>My Profile</MenuItem>
//                   <MenuItem onClick={handleMyBookings}>My Bookings</MenuItem>
//                   <MenuItem onClick={handleLogout}>Logout</MenuItem>
//                 </Menu>

//                 {/* Notifications */}
//                 <IconButton color="inherit" onClick={handleNotifOpen}>
//                   <Badge badgeContent={unreadCount} color="error">
//                     <NotificationsIcon />
//                   </Badge>
//                 </IconButton>
//                 <Menu
//                   anchorEl={notifAnchorEl}
//                   open={Boolean(notifAnchorEl)}
//                   onClose={handleNotifClose}
//                   PaperProps={{ elevation: 3, sx: { mt: 1, width: 350 } }}
//                   anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//                   transformOrigin={{ vertical: "top", horizontal: "right" }}
//                 >
//                   {notifications.length === 0 ? (
//                     <MenuItem disabled>No new notifications</MenuItem>
//                   ) : (
//                     notifications.map((notif, index) => (
//                       <MenuItem key={index}>
//                         <ListItemText
//                           primary={notif.message}
//                           secondary={new Date(
//                             notif.created_at
//                           ).toLocaleString()}
//                         />
//                       </MenuItem>
//                     ))
//                   )}
//                 </Menu>
//               </Box>
//             ) : (
//               <Button color="inherit" onClick={() => navigate("/login")}>
//                 Login
//               </Button>
//             )}
//           </Stack>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;


import React, { useContext, useState, useEffect, useRef } from "react";
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
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
  ListItemIcon,
} from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useTheme } from "@mui/material/styles";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Logo from "../Images/Logo.png";

const Navbar = ({ transparent = true }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const wsRef = useRef(null);

  useEffect(() => {
    if (!user?.id) return;

    const socket = new WebSocket(`ws://localhost:8000/ws/notifications/${user.id}/`);
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📥 New Notification:", data);

      // Append and set unread
      setNotifications((prev) => [
        { ...data, read: false, id: Date.now() }, // assign unique ID for client-side
        ...prev,
      ]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.warn("WebSocket disconnected");
    };

    return () => socket.close();
  }, [user?.id]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/login");
  };

  const handleMyBookings = () => {
    handleMenuClose();
    navigate("/my-bookings");
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const handleNotifOpen = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };
  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const getIconByType = (type) => {
    switch (type) {
      case "success":
        return <CheckCircleIcon color="success" fontSize="small" />;
      case "error":
        return <ErrorIcon color="error" fontSize="small" />;
      case "info":
      default:
        return <InfoIcon color="info" fontSize="small" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const drawerItems = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => setDrawerOpen(false)}
    >
      <List>
        <ListItem button component={Link} to="/aboutus">
          <ListItemText primary="About Us" />
        </ListItem>
        <ListItem button component={Link} to="/services">
          <ListItemText primary="Services" />
        </ListItem>
        <ListItem button component={Link} to="/contact">
          <ListItemText primary="Contact" />
        </ListItem>
        {!user ? (
          <ListItem button onClick={() => navigate("/login")}>
            <ListItemText primary="Login" />
          </ListItem>
        ) : (
          <>
            <Divider />
            <ListItem button onClick={handleMyBookings}>
              <ListItemText primary="My Bookings" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

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
          maxWidth: "1200px",
          margin: "0 auto",
          paddingLeft: { xs: 2, sm: 4 },
          paddingRight: { xs: 2, sm: 4 },
        }}
      >
        <IconButton edge="start" color="inherit" sx={{ mr: 1 }}>
          <img
            src={Logo}
            alt="ServiceBuddy Logo"
            style={{ width: 48, height: 48 }}
          />
        </IconButton>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
        >
          ServiceBuddy
        </Typography>

        {isMobile ? (
          <>
            {user && (
              <>
                <IconButton color="inherit" onClick={handleNotifOpen}>
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Menu
                  anchorEl={notifAnchorEl}
                  open={Boolean(notifAnchorEl)}
                  onClose={handleNotifClose}
                  PaperProps={{ elevation: 3, sx: { mt: 1, width: 270 } }}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem
                    onClick={handleMarkAllAsRead}
                    disabled={notifications.length === 0}
                  >
                    <ListItemIcon>
                      <DoneAllIcon fontSize="small" />
                    </ListItemIcon>
                    Mark all as read
                  </MenuItem>
                  <MenuItem
                    onClick={handleClearNotifications}
                    disabled={notifications.length === 0}
                  >
                    <ListItemIcon>
                      <ClearAllIcon fontSize="small" />
                    </ListItemIcon>
                    Clear all
                  </MenuItem>
                  <Divider />
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
                              ? "rgba(76, 175, 80, 0.1)"
                              : notif.type === "error"
                              ? "rgba(244, 67, 54, 0.1)"
                              : "inherit",
                          my: 0.5,
                          borderRadius: 1,
                        }}
                      >
                        <ListItemIcon>{getIconByType(notif.type)}</ListItemIcon>
                        <ListItemText
                          primary={notif.message}
                          secondary={new Date(notif.created_at).toLocaleString()}
                        />
                      </MenuItem>
                    ))
                  )}
                </Menu>
              </>
            )}
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              sx={{
                "& .MuiDrawer-paper": {
                  animation: "slideIn 0.3s ease-out",
                },
              }}
            >
              {drawerItems}
            </Drawer>
          </>
        ) : (
          <Stack direction="row" spacing={3} alignItems="center">
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
                <IconButton onClick={handleMenuOpen} size="large" sx={{ p: 0 }}>
                  <Avatar
                    alt={user?.name}
                    src={user?.profile_picture || "/default-avatar.png"}
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                  />
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
                  <MenuItem onClick={handleProfile}>My Profile</MenuItem>
                  <MenuItem onClick={handleMyBookings}>My Bookings</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>

                {/* Notifications */}
                <IconButton color="inherit" onClick={handleNotifOpen}>
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Menu
                  anchorEl={notifAnchorEl}
                  open={Boolean(notifAnchorEl)}
                  onClose={handleNotifClose}
                  PaperProps={{ elevation: 3, sx: { mt: 1, width: 350 } }}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem onClick={handleMarkAllAsRead} disabled={notifications.length === 0}>
                    <ListItemIcon>
                      <DoneAllIcon fontSize="small" />
                    </ListItemIcon>
                    Mark all as read
                  </MenuItem>
                  <MenuItem onClick={handleClearNotifications} disabled={notifications.length === 0}>
                    <ListItemIcon>
                      <ClearAllIcon fontSize="small" />
                    </ListItemIcon>
                    Clear all
                  </MenuItem>
                  <Divider />
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
                              ? "rgba(76, 175, 80, 0.1)"
                              : notif.type === "error"
                              ? "rgba(244, 67, 54, 0.1)"
                              : "inherit",
                          my: 0.5,
                          borderRadius: 1,
                        }}
                      >
                        <ListItemIcon>{getIconByType(notif.type)}</ListItemIcon>
                        <ListItemText
                          primary={notif.message}
                          secondary={new Date(notif.created_at).toLocaleString()}
                        />
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
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
