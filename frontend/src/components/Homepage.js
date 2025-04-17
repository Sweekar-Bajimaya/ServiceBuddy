// import React, { useContext } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   Avatar,
//   Menu,
//   MenuItem,
//   Container,
//   Card,
//   Grid,
//   CardContent,
// } from "@mui/material";
// import Navbar from "./common/Navbar";
// import Footer from "./common/Footer";
// import { AuthContext } from "../context/AuthContext"; // Adjust the import path if needed
// import { useNavigate } from "react-router-dom";

// const HomePage = () => {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [anchorEl, setAnchorEl] = React.useState(null);

//   // Logging the username to the console
//   console.log("Logged in user:", user ? user.name : "Guest");

//   const handleAvatarClick = (event) => {
//     console.log("Avatar clicked");
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     console.log("Menu closed");
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     console.log("Logging out...");
//     logout(); // Call logout from AuthContext
//     handleMenuClose();
//     navigate("/login"); // Optionally navigate to login after logout
//   };

//   return (
//     <>
//       {/* Transparent Navigation Bar */}
//       <Navbar />

//       {/* Hero Section */}
//       <Box sx={{ position: "relative", height: "90vh", overflow: "hidden" }}>
//         <img
//           src="https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg"
//           alt="ServiceBuddy Welcome"
//           style={{
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//             filter: "brightness(50%)",
//           }}
//         />
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             color: "white",
//             textAlign: "center",
//           }}
//         >
//           <Typography variant="h3" fontWeight="bold">
//             Book Trusted Technicians for All Home Repairs and Services
//           </Typography>
//           <Typography variant="h5" mt={2}>
//             Book top-rated services near you with just a click
//           </Typography>
//           <Button
//             variant="contained"
//             size="large"
//             sx={{ mt: 3, bgcolor: "primary", color: "white", borderRadius: 2 }}
//           >
//             Get Started
//           </Button>
//         </Box>
//       </Box>

//       {/*About Us Section */}
//       <Container sx={{ mt: 8, textAlign: "center", bgcolor: "#f5f5f5", py: 4 }}>
//         <Typography variant="h4" fontWeight="bold" id="about" gutterBottom>
//           About Us
//         </Typography>
//         <Typography variant="body1" mt={3}>
//           ServiceBuddy is a platform that connects customers with trusted
//           professionals for all home services. We are dedicated to providing a
//           reliable and easy-to-use platform for booking services such as
//           plumbing, electrical, cleaning, and more. Our goal is to make it
//           simple for customers to find skilled professionals and get their tasks
//           done efficiently.
//         </Typography>
//       </Container>

//       {/* How It Works Section */}
//       <Container sx={{ mt: 8, textAlign: "center", bgcolor: "#f5f5f5", py: 4 }}>
//         <Typography variant="h4" fontWeight="bold">
//           How It Works
//         </Typography>
//         <Grid container spacing={4} justifyContent="center" mt={4}>
//           <Grid item xs={12} sm={4}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" fontWeight="bold">
//                   Step 1
//                 </Typography>
//                 <Typography variant="body1">
//                   Describe your task and set your schedule.
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" fontWeight="bold">
//                   Step 2
//                 </Typography>
//                 <Typography variant="body1">
//                   Select from a list of skilled professionals.
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" fontWeight="bold">
//                   Step 3
//                 </Typography>
//                 <Typography variant="body1">
//                   Relax while the task is completed efficiently.
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </Container>
//       <Footer />
//     </>
//   );
// };

// export default HomePage;
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
import ComputerIcon from '@mui/icons-material/Computer';

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
          backgroundImage: "url('https://img.freepik.com/free-photo/worker-is-cutting-wires-with-lineman-s-pliers_169016-15689.jpg?t=st=1744273986~exp=1744277586~hmac=4bf1804ae320c7f543aa5a1feccfaf358087b177736ab6a133e3dd6078e7053a&w=1380')", // Update with your preferred image
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "left",
          color: "white",
          padding: 4,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)", // This reduces the brightness of the image
            zIndex: 1,
          },
        }}
      >
        <Container sx={{ position: "relative", zIndex: 2 }}>
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
            Book Trusted Technicians for All Home Repairs and Services
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 400,
              fontSize: { xs: "1.2rem", sm: "1.5rem" },
              marginBottom: 3,
            }}
          >
            Connect with top-rated service providers for all your home service needs
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              fontSize: "1rem",
              padding: "12px 24px",
              borderRadius: "25px",
              backgroundColor: "rgba(0, 51, 102, 0.8)",
              '&:hover': {
                backgroundColor: "rgba(0, 51, 102, 1)",
              }
            }}
          >
            Get Started
          </Button>
        </Container>
      </Box>


      {/* About Section */}
      <Box sx={{ py: 10 }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <img
                src="https://img.freepik.com/free-photo/asian-male-plumber-uniform-talking-senior-female-homeowner-kitchen_1098-17782.jpg?t=st=1744117003~exp=1744120603~hmac=fed0e047933f8d7de0744f1012e7faf30c210809c714667513aa80e8dbb2641d&w=1380"
                alt="About ServiceBuddy"
                style={{ width: "100%", borderRadius: 12, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                About ServiceBuddy
              </Typography>
              <Typography variant="body1" mb={3}>
                We’re redefining how home services are booked and delivered. With ServiceBuddy, you can connect with certified local professionals for tasks like plumbing, electrical repairs, and home cleaning — all through a single platform.
              </Typography>
              <Typography variant="body1" mb={3}>
                Our mission is simple: make home service bookings reliable, transparent, and effortless.
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
      <Box sx={{ py: 10, bgcolor: "#f5f5f5" }}>
        <Container>
          <Typography variant="h4" fontWeight="bold" textAlign="center" mb={6}>
            Our Services
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: <ElectricalServicesIcon sx={{ fontSize: 40, color: "primary.main" }} />,
                title: "Electrical",
                desc: "From installations to repairs — hire certified electricians near you.",
              },
              {
                icon: <PlumbingIcon sx={{ fontSize: 40, color: "primary.main" }} />,
                title: "Plumbing",
                desc: "Leaky faucet or pipe issue? Our experts have you covered.",
              },
              {
                icon: <CleaningServicesIcon sx={{ fontSize: 40, color: "primary.main" }} />,
                title: "Cleaning",
                desc: "Get your home or office sparkling clean with professional help.",
              },
              {
                icon: <ComputerIcon sx={{ fontSize: 40, color: "primary.main" }} />,
                title: "IT Experts",
                desc: "Need tech support? Find IT professionals through us.",
              },
            ].map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    p: 3,
                    textAlign: "center",
                    borderRadius: 4,
                    boxShadow: 3,
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
                  }}
                >
                  {service.icon}
                  <Typography variant="h6" fontWeight="bold" mt={2} gutterBottom>
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
          py: 6,
          bgcolor: "primary.main",
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Ready to Book Your First Service?
        </Typography>
        <Typography variant="body1" mb={3}>
          Join thousands of happy customers today.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ bgcolor: "white", color: "primary.main", borderRadius: 5 }}
          onClick={() => navigate("/services")}
        >
          Get Started
        </Button>
      </Box>

      <Footer />
    </>
  );
};

export default HomePage;

