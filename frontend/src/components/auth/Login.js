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
} from "@mui/material";
import { loginUser } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      // res.data = { access, refresh, user }
      login(res.data.user, res.data.access);
      navigate("/"); // redirect to provider listing or any route
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
                src="https://img.freepik.com/free-vector/privacy-policy-concept-illustration_114360-7853.jpg?t=st=1739973600~exp=1739977200~hmac=25f0d6bf7f6249492d4beeb26f743d194107fa3e5bc1d0c7f49354f0695b97dc&w=740"
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

              <Box
                mt={2}
                display="flex"
                justifyContent="space-between"
                flexWrap="wrap"
              >
                <Link component={Link} to="/reset-password" underline="hover">
                  Forgot password?
                </Link>
                <Link component={Link} to="/register" underline="hover">
                  Don't have an account? Register
                </Link>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};
export default Login;
