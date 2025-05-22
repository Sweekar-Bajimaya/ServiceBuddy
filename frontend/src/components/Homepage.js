import React, { useContext } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BuildIcon from "@mui/icons-material/Build";
import PlumbingIcon from "@mui/icons-material/Plumbing";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";
import ComputerIcon from "@mui/icons-material/Computer";
import backgroundImage from "./Images/Background.png";
import Image2 from "./Images/Image2.png";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <>
      <Navbar transparent />

      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100vh",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: { xs: "center", sm: "left" },
          color: "white",
          px: { xs: 2, sm: 4 },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 1,
          },
        }}
      >
        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", sm: "flex-start" },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
                lineHeight: 1.2,
                mb: 2,
                textTransform: "uppercase",
              }}
            >
              Book Trusted Technicians for All Home Repairs and Services
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 400,
                fontSize: { xs: "1.1rem", sm: "1.4rem" },
                marginBottom: 3,
              }}
            >
              Connect with top-rated service providers for all your home service
              needs
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                fontSize: "1rem",
                padding: { xs: "10px 20px", sm: "12px 24px" },
                borderRadius: "25px",
                backgroundColor: "rgba(0, 51, 102, 0.8)",
                "&:hover": {
                  backgroundColor: "rgba(0, 51, 102, 1)",
                },
              }}
              onClick={() => navigate("/services")}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>

      {/* About Section */}
      <Box sx={{ py: { xs: 6, sm: 10 } }}>
        <Container maxWidth="lg">
          <Grid
            container
            spacing={4}
            direction={{ xs: "column-reverse", md: "row" }}
            alignItems="center"
          >
            <Grid item xs={12} md={6}>
              <img
                src= {Image2}
                alt="About ServiceBuddy"
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: 12,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ fontSize: { xs: "1.8rem", sm: "2rem" }, mb: 2 }}
              >
                About ServiceBuddy
              </Typography>
              <Typography variant="body1" mb={3}>
                We’re redefining how home services are booked and delivered.
                With ServiceBuddy, you can connect with certified local
                professionals for tasks like plumbing, electrical repairs, and
                home cleaning — all through a single platform.
              </Typography>
              <Typography variant="body1" mb={3}>
                Our mission is simple: make home service bookings reliable,
                transparent, and effortless.
              </Typography>
              <Button
                variant="outlined"
                size="large"
                sx={{ borderRadius: 5 }}
                onClick={() => navigate("/aboutus")}
              >
                Learn More
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: { xs: 6, sm: 10 }, bgcolor: "#f5f5f5" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            sx={{ fontSize: { xs: "1.8rem", sm: "2rem" }, mb: 6 }}
          >
            Our Services
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: (
                  <ElectricalServicesIcon
                    sx={{ fontSize: 40, color: "primary.main" }}
                  />
                ),
                title: "Electrical",
                desc: "From installations to repairs — hire certified electricians near you.",
              },
              {
                icon: (
                  <PlumbingIcon sx={{ fontSize: 40, color: "primary.main" }} />
                ),
                title: "Plumbing",
                desc: "Leaky faucet or pipe issue? Our experts have you covered.",
              },
              {
                icon: (
                  <CleaningServicesIcon
                    sx={{ fontSize: 40, color: "primary.main" }}
                  />
                ),
                title: "Cleaning",
                desc: "Get your home or office sparkling clean with professional help.",
              },
              {
                icon: (
                  <ComputerIcon sx={{ fontSize: 40, color: "primary.main" }} />
                ),
                title: "IT Experts",
                desc: "Need tech support? Find IT professionals through us.",
              },
            ].map((service, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card
                  sx={{
                    p: { xs: 2, sm: 3 },
                    textAlign: "center",
                    borderRadius: 4,
                    boxShadow: 3,
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  {service.icon}
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    mt={2}
                    gutterBottom
                  >
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {service.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 6, sm: 8 },
          px: 2,
          bgcolor: "primary.main",
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ fontSize: { xs: "1.4rem", sm: "2rem" }, mb: 2 }}
        >
          Ready to Book Your First Service?
        </Typography>
        <Typography variant="body1" mb={3}>
          Join thousands of happy customers today.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            bgcolor: "white",
            color: "primary.main",
            borderRadius: 5,
            px: { xs: 3, sm: 5 },
            py: { xs: 1, sm: 1.5 },
            fontSize: "1rem",
            "&:hover": {
              bgcolor: "#f0f0f0",
            },
          }}
        >
          Get Started
        </Button>
      </Box>

      <Footer />
    </>
  );
};

export default HomePage;
