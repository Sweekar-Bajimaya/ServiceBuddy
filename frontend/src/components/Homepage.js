import React, { useContext } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Container,
  Card,
  Grid,
  CardContent,
} from "@mui/material";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";
import { AuthContext } from "../context/AuthContext"; // Adjust the import path if needed
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Logging the username to the console
  console.log("Logged in user:", user ? user.name : "Guest");

  const handleAvatarClick = (event) => {
    console.log("Avatar clicked");
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    console.log("Menu closed");
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    logout(); // Call logout from AuthContext
    handleMenuClose();
    navigate("/login"); // Optionally navigate to login after logout
  };

  return (
    <>
      {/* Transparent Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <Box sx={{ position: "relative", height: "90vh", overflow: "hidden" }}>
        <img
          src="https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg"
          alt="ServiceBuddy Welcome"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(50%)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography variant="h3" fontWeight="bold">
            Book Trusted Technicians for All Home Repairs and Services
          </Typography>
          <Typography variant="h5" mt={2}>
            Book top-rated services near you with just a click
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ mt: 3, bgcolor: "primary", color: "white", borderRadius: 2 }}
          >
            Get Started
          </Button>
        </Box>
      </Box>

      {/*About Us Section */}
      <Container sx={{ mt: 8, textAlign: "center", bgcolor: "#f5f5f5", py: 4 }}>
        <Typography variant="h4" fontWeight="bold" id="about" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1" mt={3}>
          ServiceBuddy is a platform that connects customers with trusted
          professionals for all home services. We are dedicated to providing a
          reliable and easy-to-use platform for booking services such as
          plumbing, electrical, cleaning, and more. Our goal is to make it
          simple for customers to find skilled professionals and get their tasks
          done efficiently.
        </Typography>
      </Container>

      {/* How It Works Section */}
      <Container sx={{ mt: 8, textAlign: "center", bgcolor: "#f5f5f5", py: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          How It Works
        </Typography>
        <Grid container spacing={4} justifyContent="center" mt={4}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Step 1
                </Typography>
                <Typography variant="body1">
                  Describe your task and set your schedule.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Step 2
                </Typography>
                <Typography variant="body1">
                  Select from a list of skilled professionals.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Step 3
                </Typography>
                <Typography variant="body1">
                  Relax while the task is completed efficiently.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default HomePage;
