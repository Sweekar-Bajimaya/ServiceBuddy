// import React, { useState } from "react";
// import {
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   TextField,
//   Typography,
//   Button,
//   Box,
// } from "@mui/material";
// import { registerUser } from "../../services/api";
// import { Link, useNavigate } from "react-router-dom";

// const Register = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     location: "",
//     phone_num: "",
//   });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await registerUser(form);
//       setSuccess("Registered Successfully!");
//       navigate("/login");
//     } catch (err) {
//       console.error("Registration error:", err.response ? err.response.data : err);
//       setError(err.response?.data?.error || "Registration failed.");
//     }
//   };

//   return (
//     <Container
//       maxWidth="md"
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <Card
//         sx={{
//           width: "100%",
//           overflow: "hidden",
//           boxShadow: 3,
//           borderRadius: 2,
//         }}
//       >
//         <Grid container>
//           {/* Left Side (Form) */}
//           <Grid item xs={12} md={6}>
//             <CardContent sx={{ p: 4 }}>
//               <Typography variant="h5" align="center" gutterBottom>
//                 Register
//               </Typography>
//               <Box
//                 component="form"
//                 onSubmit={handleSubmit}
//                 sx={{ display: "flex", flexDirection: "column" }}
//               >
//                 <TextField
//                   label="Name"
//                   name="name"
//                   value={form.name}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                 />
//                 <TextField
//                   label="Email"
//                   name="email"
//                   value={form.email}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                   required
//                 />
//                 <TextField
//                   label="Password"
//                   name = "password"
//                   type="password"
//                   variant="outlined"
//                   margin="normal"
//                   value = {form.password}
//                   onChange={handleChange}
//                   required
//                   fullWidth
//                 />
//                 <TextField
//                   label="Location"
//                   name="location"
//                   value={form.location}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                 />
//                 <TextField
//                   label="Phone Number"
//                   name="phone_num"
//                   value={form.phone_num}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                 />
//                 {error && <Typography color="error">{error}</Typography>}
//                 {success && <Typography color="primary">{success}</Typography>}
//                 <Button variant="contained" type="submit" sx={{ mt: 2 }}>
//                   Register
//                 </Button>
//               </Box>

//               <Box mt={2} textAlign="center">
//                 <Link component={Link} to="/login" underline="hover">
//                   Already have an account? Login
//                 </Link>
//               </Box>
//             </CardContent>
//           </Grid>

//           {/* Right Side (Image) */}
//           <Grid
//             item
//             xs={12}
//             md={6}
//             sx={{ display: { xs: "none", md: "block" } }}
//           >
//             <Box sx={{ height: "100%", width: "100%" }}>
//               <img
//                 src="https://img.freepik.com/free-vector/sign-up-concept-illustration_114360-7965.jpg?t=st=1739974539~exp=1739978139~hmac=61367c7550e2140c35edfac396e60c54b142cdebcf2735f130e6748d0e058beb&w=740"
//                 alt="Side illustration"
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "cover",
//                 }}
//               />
//             </Box>
//           </Grid>
//         </Grid>
//       </Card>
//     </Container>
//   );
// };

// export default Register;
import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { registerUser, verifyEmail } from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../common/ToastProvider";

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    phone_num: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      showToast("Registered Successfully! Please verify your email.", "success");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err.response ? err.response.data : err);
      showToast(err.response?.data?.error || "Registration failed.", "error");
    }
    try {
      await verifyEmail(form.email);
      showToast("Verification email sent!", "success");
    }
    catch (err) {
      console.error("Email verification error:", err.response ? err.response.data : err);
      showToast(err.response?.data?.error || "Email verification failed.", "error");
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card sx={{ width: "100%", overflow: "hidden", boxShadow: 3, borderRadius: 2 }}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" align="center" gutterBottom>
                Register
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column" }}>
                <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" />
                <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth margin="normal" required />
                <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth margin="normal" required />
                <TextField label="Location" name="location" value={form.location} onChange={handleChange} fullWidth margin="normal" />
                <TextField label="Phone Number" name="phone_num" value={form.phone_num} onChange={handleChange} fullWidth margin="normal" />
                <Button variant="contained" type="submit" sx={{ mt: 2 }}>Register</Button>
              </Box>
              <Box mt={2} textAlign="center">
                <Link component={Link} to="/login" underline="hover">
                  Already have an account? Login
                </Link>
              </Box>
            </CardContent>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
            <Box sx={{ height: "100%", width: "100%" }}>
              <img
                src="https://img.freepik.com/free-vector/sign-up-concept-illustration_114360-7965.jpg"
                alt="Side illustration"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default Register;