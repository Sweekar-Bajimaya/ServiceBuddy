import React, { useState , useContext } from "react";
import { Box, Typography, Grid, TextField, Button, Paper } from "@mui/material";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";
import { useToast } from "./common/ToastProvider";
import { createContactQuery } from "../services/api";
import { AuthContext } from "../context/AuthContext";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const { user } = useContext(AuthContext); // Get the authenticated user
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        profile_picture: user?.profilePicture || "",  // Add this
      };
      await createContactQuery(dataToSend);
      showToast("Message sent successfully!", "success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      showToast("Failed to send message. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <Box sx={{ position: "relative", height: "50vh", overflow: "hidden" }}>
        <img
          src="https://img.freepik.com/free-photo/mechanic-working-laptop_1170-1583.jpg?uid=R98022816&ga=GA1.1.1477138639.1740887882&semt=ais_hybrid&w=740"
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
            Contact Us
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, sm: 4, md: 8 }, py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Get in Touch
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Feel free to reach out to us for any questions or inquiries. We're
              here to help!
            </Typography>

            <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      variant="outlined"
                      type="email"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      variant="outlined"
                      multiline
                      rows={4}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      size="large"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Contact Information
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Kathmandu, Nepal
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Email: admin@servicebuddy.com
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Phone: +977 9861494202
            </Typography>
            <Box mt={4}>
              <iframe
                title="Google Map"
                width="100%"
                height="300"
                frameBorder="0"
                style={{ border: 0 }}
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAnsK0I2lw7YP3qhUthMBtlsiJ31WVkPrY
&q=Kathmandu,Nepal"
                allowFullScreen
              ></iframe>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </>
  );
};

export default ContactPage;
