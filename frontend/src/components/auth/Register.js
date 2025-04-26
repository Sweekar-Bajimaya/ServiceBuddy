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
  CircularProgress,
} from "@mui/material";
import { registerUser } from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../common/ToastProvider";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      await registerUser(form);
      showToast("Registered! Please verify your email.", "info");
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      console.error(
        "Registration error:",
        err.response ? err.response.data : err
      );
      showToast(err.response?.data?.error || "Registration failed.", "error");
    } finally {
      setLoading(false);
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
          <Grid item xs={12} md={6}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" align="center" gutterBottom>
                Register
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <TextField
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Phone Number"
                  name="phone_num"
                  value={form.phone_num}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <Box sx={{ position: "relative", mt: 2 }}>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? "Registering in..." : "REGISTER"}
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-12px",
                        marginLeft: "-12px",
                      }}
                    />
                  )}
                </Box>
              </Box>
              <Box mt={2} textAlign="center">
                <Link component={Link} to="/login" underline="hover">
                  Already have an account? Login
                </Link>
              </Box>
            </CardContent>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: { xs: "none", md: "block" } }}
          >
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
