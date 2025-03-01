import React, { useContext } from "react";
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  ListAlt as ServiceRequestsIcon,
  Event as AppointmentIcon,
  History as HistoryIcon,
  Message as MessageIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
  Construction as ConstructionIcon,
} from "@mui/icons-material";

import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const {user, logout} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () =>{
    logout();
    navigate('/login');
  }


  return (
    <Box sx={{ textAlign: "left" }}>
      <Typography variant="h5" sx={{ my: 2, textAlign: "center" }}>
        ServiceBuddy
      </Typography>
      <List>
        <ListItem disablePadding>
          <ListItemButton component = {Link} to ="/provider-dashboard">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component= {Link} to="/provider-requests">
            <ListItemIcon>
              <ServiceRequestsIcon />
            </ListItemIcon>
            <ListItemText primary="Service Requests" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <AppointmentIcon />
            </ListItemIcon>
            <ListItemText primary="Appointment" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText primary="History" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <MessageIcon />
            </ListItemIcon>
            <ListItemText primary="Message" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <ProfileIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
