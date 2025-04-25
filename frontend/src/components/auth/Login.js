import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { Person, Build } from "@mui/icons-material"; // Icons for User & Provider
import { loginUser } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    user_type: "user",
  });
  const [error, setError] = useState("");

  const isAdmin = form.email === "admin@servicebuddy.com"; // ✅ Check if logging in as Admin

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (event, newUserType) => {
    if (newUserType !== null && !isAdmin) {
      setForm({ ...form, user_type: newUserType });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let loginData = {
      email: form.email,
      password: form.password,
    };

    // ✅ Only include user_type if not Admin
    if (!isAdmin) {
      loginData.user_type = form.user_type;
    }

    try {
      const res = await loginUser(loginData);
      console.log("🔐 Login response:", res.data);
      const normalizedUser = {
        ...res.data.user,
        id: res.data.user.user_id, // remap user_id → id
        profile_picture: res.data.user.profile_picture || null,
      };
      
      login(normalizedUser, res.data.access);

      if (isAdmin) {
        navigate("/admin-dashboard"); // Redirect to Admin Dashboard
      } else if (res.data.user.user_type === "provider") {
        navigate("/provider-dashboard");
      } else {
        navigate("/"); // Redirect to user home/dashboard
      }
    } catch (err) {
      setError("Invalid credentials or server error");
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
      <Card
        sx={{
          width: "100%",
          overflow: "hidden",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Grid container>
          {/* Left Side (Image) */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <Box sx={{ height: "100%", width: "100%" }}>
              <img
                src="https://img.freepik.com/free-vector/privacy-policy-concept-illustration_114360-7853.jpg"
                alt="Side illustration"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          </Grid>

          {/* Right Side (Form) */}
          <Grid item xs={12} md={6}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" align="center" gutterBottom>
                Login
              </Typography>

              {/* User Type Selection - Only show for non-admin users */}
              {!isAdmin && (
                <Box
                  display="flex"
                  justifyContent="center"
                  mb={2}
                  sx={{ gap: 2 }}
                >
                  <ToggleButtonGroup
                    value={form.user_type}
                    exclusive
                    onChange={handleUserTypeChange}
                    aria-label="user type selection"
                    sx={{ display: "flex", gap: 2 }}
                  >
                    <ToggleButton value="user" aria-label="User" sx={{ px: 3 }}>
                      <Person sx={{ mr: 1 }} /> User
                    </ToggleButton>
                    <ToggleButton
                      value="provider"
                      aria-label="Service Provider"
                      sx={{ px: 3 }}
                    >
                      <Build sx={{ mr: 1 }} /> Service Provider
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button variant="contained" type="submit" sx={{ mt: 2 }}>
                  LOGIN
                </Button>
              </Box>

              {/* Links */}
              <Box
                mt={2}
                display="flex"
                justifyContent="space-between"
                flexWrap="wrap"
              >
                <Link component={Link} to="/forgot-password" underline="hover">
                  Forgot password?
                </Link>
                {/* Only show the registration link if the user type is "user" */}
                {!isAdmin && form.user_type === "user" && (
                  <Link component={Link} to="/register" underline="hover">
                    Don't have an account? Register
                  </Link>
                )}
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default Login;
