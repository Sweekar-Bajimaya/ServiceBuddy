import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Avatar,
  Divider,
} from "@mui/material";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";

// ✅ Move this OUTSIDE the AboutUs component
const MissionValuesToggle = () => {
  const [activeTab, setActiveTab] = useState("mission");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Mission & Values
            </Typography>
            {/* Toggle Buttons */}
            <Box sx={{ textAlign: "left", mb: 3 }}>
              <Button
                variant={activeTab === "mission" ? "contained" : "outlined"}
                sx={{ mx: 1, borderRadius: 8 }}
                onClick={() => handleTabChange("mission")}
              >
                Mission
              </Button>
              <Button
                variant={activeTab === "values" ? "contained" : "outlined"}
                sx={{ mx: 1, borderRadius: 8 }}
                onClick={() => handleTabChange("values")}
              >
                Values
              </Button>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              {activeTab === "mission" ? "Our Mission" : "Our Values"}
            </Typography>
            {activeTab === "mission" ? (
                <ul style={{ paddingLeft: "20px", marginTop: 0, fontSize: "18px" }}>
                  <li>Provide a simple and reliable platform for home service bookings</li>
                  <li>Connect users with top-tier professionals</li>
                  <li>Ensure quality and timely service every time</li>
                  <li>Foster long-lasting relationships with our clients</li>
                </ul>
              ) : (
                <ul style={{ paddingLeft: "20px", marginTop: 0, fontSize: "18px" }}>
                  <li>Trust and transparency with customers</li>
                  <li>Professionalism in every interaction</li>
                  <li>Commitment to safety and satisfaction</li>
                  <li>Constant innovation and improvement</li>
                </ul>
              )}

          </Grid>
          <Grid item xs={12} md={6}>
            <img
              src= "https://img.freepik.com/free-photo/mechanic-holding-wrench_1170-1136.jpg?ga=GA1.1.1477138639.1740887882&semt=ais_hybrid&w=740"
              alt= "About ServiceBuddy"
              style={{ width: "100%", height: "50%",borderRadius: 12 }}
            />
          </Grid>
      </Grid>


      
    </Box>
  );
};

// ✅ AboutUs Component
const AboutUs = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <Box sx={{ position: "relative", height: "50vh", overflow: "hidden" }}>
        <img
          src="https://img.freepik.com/free-photo/male-plumber-working-fix-problems-client-s-house_23-2150990735.jpg"
          alt="About Us"
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
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2.5rem", sm: "4rem" },
              lineHeight: 1.2,
              mb: 2,
              textTransform: "uppercase",
            }}
          >
            About Us
          </Typography>
        </Box>
      </Box>

      <Container sx={{ py: 6 }}>
        
        {/* About Description with Image */}
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              About Us
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: "18px",
                lineHeight: "1.7",
              }}
            >
              ServiceBuddy is your go-to platform for hiring trusted experts in
              various home services such as plumbing, electrical work, cleaning,
              and more. We connect you with highly skilled professionals who are
              ready to deliver exceptional services directly at your doorstep.
              Our goal is to simplify your life by providing easy access to home
              improvement professionals when you need them most.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <img
              src="https://img.freepik.com/free-photo/man-electrical-technician-working-switchboard-with-fuses_169016-24062.jpg?ga=GA1.1.1477138639.1740887882&semt=ais_hybrid&w=740"
              alt="About ServiceBuddy"
              style={{ width: "100%", borderRadius: 12 }}
            />
          </Grid>
        </Grid>

        {/* Mission & Values Section */}
        <Divider sx={{ my: 6 }} />
        <MissionValuesToggle />
      </Container>  
      <Footer />
    </>
  );
};

export default AboutUs;
