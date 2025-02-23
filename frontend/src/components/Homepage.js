// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Typography, AppBar, Toolbar, IconButton, Stack, Button, Box, Avatar, Menu, MenuItem, Container, Grid, Card, CardContent } from "@mui/material";
// import ConstructionIcon from "@mui/icons-material/Construction";

// const HomePage = () => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [anchorEl, setAnchorEl] = useState(null);
//     const [username, setUsername] = useState("");
  
//     useEffect(() => {
//       console.log("Checking authentication status...");
//       const authStatus = sessionStorage.getItem("isAuthenticated") === "true";
//       const storedUsername = sessionStorage.getItem("username");
//       setIsAuthenticated(authStatus);
//       setUsername(storedUsername || "");
//       console.log("Authentication status:", authStatus, "Username:", storedUsername);
//     }, []);
  
//     const handleAvatarClick = (event) => {
//       console.log("Avatar clicked");
//       setAnchorEl(event.currentTarget);
//     };
  
//     const handleMenuClose = () => {
//       console.log("Menu closed");
//       setAnchorEl(null);
//     };
  
//     const handleLogout = () => {
//       console.log("Logging out...");
//       sessionStorage.removeItem("isAuthenticated");
//       sessionStorage.removeItem("username");
//       setIsAuthenticated(false);
//       handleMenuClose();
//     };
//     return (
//         <>
//           {/* Transparent Navigation Bar */}
//           <AppBar position="absolute" sx={{ backgroundColor: "transparent", boxShadow: "none", px: 16 }}>
//             <Toolbar>
//               <IconButton edge="start" color="inherit">
//                 <ConstructionIcon />
//               </IconButton>
//               <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
//                 ServiceBuddy
//               </Typography>
    
//               <Stack direction="row" spacing={3}>
//                 <Button color="inherit" component={Link} to="/about">About Us</Button>
//                 <Button color="inherit" component={Link} to="/services">Services</Button>
//                 <Button color="inherit" component={Link} to="/contact">Contact</Button>
//                 {isAuthenticated ? (
//                 <>
//                   <Avatar onClick={handleAvatarClick} sx={{ cursor: "pointer" }}>{username[0]?.toUpperCase()}</Avatar>
//                   <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
//                     <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
//                     <MenuItem onClick={() => { handleMenuClose(); window.location.href = "/mybookings"; }}>My Bookings</MenuItem>
//                     <MenuItem onClick={handleLogout}>Logout</MenuItem>
//                   </Menu>
//                 </>
//               ) : (
//                 <Button color="inherit" component={Link} to="/login">Login</Button>
//               )}
//               </Stack>
//             </Toolbar>
//           </AppBar>
    
//           {/* Hero Section */}
//           <Box sx={{ position: "relative", height: "90vh", overflow: "hidden" }}>
//             <img
//               src="https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg"
//               alt="ServiceBuddy Welcome"
//               style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(50%)" }}
//             />
//             <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "white", textAlign: "center" }}>
//               <Typography variant="h3" fontWeight="bold">Book Trusted Technicians for All Home Repairs and Services</Typography>
//               <Typography variant="h5" mt={2}>Book top-rated services near you with just a click</Typography>
//               <Button variant="contained" size="large" sx={{ mt: 3, bgcolor: "primary", color: "white", borderRadius: 2 }}>
//                 Get Started
//               </Button>
//             </Box>
//           </Box>
    
//           {/*About Us Section */}
//           <Container sx={{ mt: 8, textAlign: "center", bgcolor:"#f5f5f5", py:4 }}>
//             <Typography variant="h4" fontWeight="bold" id="about" gutterBottom>About Us</Typography>
//             <Typography variant="body1" mt={3}>
//               ServiceBuddy is a platform that connects customers with trusted professionals for all home services. 
//               We are dedicated to providing a reliable and easy-to-use platform for booking services such as plumbing, electrical, 
//               cleaning, and more. Our goal is to make it simple for customers to find skilled professionals and get their tasks done efficiently.
//             </Typography>
//           </Container>
    
//           {/* Services Section */}
//           {/* <Container sx={{ mt: 8, textAlign: "center" }}>
    
//           </Container> */}
//           {/* <Services /> */}
    
//           {/* How It Works Section */}
//           <Container sx={{ mt: 8, textAlign: "center",bgcolor:"#f5f5f5", py:4  }}>
//             <Typography variant="h4" fontWeight="bold">How It Works</Typography>
//             <Grid container spacing={4} justifyContent="center" mt={4}>
//               <Grid item xs={12} sm={4}>
//                 <Card>
//                   <CardContent>
//                     <Typography variant="h6" fontWeight="bold">Step 1</Typography>
//                     <Typography variant="body1">Describe your task and set your schedule.</Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <Card>
//                   <CardContent>
//                     <Typography variant="h6" fontWeight="bold">Step 2</Typography>
//                     <Typography variant="body1">Select from a list of skilled professionals.</Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <Card>
//                   <CardContent>
//                     <Typography variant="h6" fontWeight="bold">Step 3</Typography>
//                     <Typography variant="body1">Relax while the task is completed efficiently.</Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             </Grid>
//           </Container>
//         </>
//       );
// };

// export default HomePage;


// version 2.0
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Typography, AppBar, Toolbar, IconButton, Stack, Button, Box, Avatar, Menu, MenuItem, Container, Grid, Card, CardContent } from "@mui/material";

// import Services from "./Services";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    console.log("Checking authentication status...");
    const authStatus = sessionStorage.getItem("isAuthenticated") === "true";
    const storedUsername = sessionStorage.getItem("username");
    setIsAuthenticated(authStatus);
    setUsername(storedUsername || "");
    console.log("Authentication status:", authStatus, "Username:", storedUsername);
  }, []);

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
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("username");
    setIsAuthenticated(false);
    handleMenuClose();
  };

  return (
    <>
      {/* Transparent Navigation Bar */}
      <Navbar/>

      {/* Hero Section */}
      <Box sx={{ position: "relative", height: "90vh", overflow: "hidden" }}>
        <img
          src="https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg"
          alt="ServiceBuddy Welcome"
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(50%)" }}
        />
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "white", textAlign: "center" }}>
          <Typography variant="h3" fontWeight="bold">Book Trusted Technicians for All Home Repairs and Services</Typography>
          <Typography variant="h5" mt={2}>Book top-rated services near you with just a click</Typography>
          <Button variant="contained" size="large" sx={{ mt: 3, bgcolor: "primary", color: "white", borderRadius: 2 }}>
            Get Started
          </Button>
        </Box>
      </Box>

      {/*About Us Section */}
      <Container sx={{ mt: 8, textAlign: "center", bgcolor:"#f5f5f5", py:4 }}>
        <Typography variant="h4" fontWeight="bold" id="about" gutterBottom>About Us</Typography>
        <Typography variant="body1" mt={3}>
          ServiceBuddy is a platform that connects customers with trusted professionals for all home services. 
          We are dedicated to providing a reliable and easy-to-use platform for booking services such as plumbing, electrical, 
          cleaning, and more. Our goal is to make it simple for customers to find skilled professionals and get their tasks done efficiently.
        </Typography>
      </Container>

      {/* Services Section */}
      {/* <Container sx={{ mt: 8, textAlign: "center" }}>

      </Container> */}
      {/* <Services /> */}

      {/* How It Works Section */}
      <Container sx={{ mt: 8, textAlign: "center",bgcolor:"#f5f5f5", py:4  }}>
        <Typography variant="h4" fontWeight="bold">How It Works</Typography>
        <Grid container spacing={4} justifyContent="center" mt={4}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">Step 1</Typography>
                <Typography variant="body1">Describe your task and set your schedule.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">Step 2</Typography>
                <Typography variant="body1">Select from a list of skilled professionals.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">Step 3</Typography>
                <Typography variant="body1">Relax while the task is completed efficiently.</Typography>
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
