import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { getProviders, createServiceRequest } from "../services/api";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";
import { useToast } from "./common/ToastProvider";

const ServicesPage = () => {
  const services = [
    {
      name: "Plumber",
      image: "https://img.freepik.com/free-photo/technician-checking-heating-system-boiler-room_169016-53608.jpg",
    },
    {
      name: "Electrician",
      image: "https://img.freepik.com/free-photo/male-electrician-works-switchboard-with-electrical-connecting-cable_169016-15204.jpg",
    },
    {
      name: "IT Expert",
      image: "https://img.freepik.com/free-photo/businesman-working-computer_1098-21050.jpg",
    },
    {
      name: "Cleaner",
      image: "https://img.freepik.com/free-photo/young-housewife-cleaning-with-rug-detergent-isolated_231208-10959.jpg",
    },
    {
      name: "Mechanic",
      image: "https://img.freepik.com/free-photo/muscular-car-service-worker-repairing-vehicle_146671-19605.jpg?t=st=1743257466~exp=1743261066~hmac=08ee31bbaadd0fb86221511ae81acfc3d37e7cee6454f597b63901bbc7073d82&w=1380",
    },
  ];

  const [selectedService, setSelectedService] = useState(null);
  const [providers, setProviders] = useState([]);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const handleSelectService = async (serviceName) => {
    setSelectedService(serviceName);
    setProviders([]);
    setError("");
    try {
      const res = await getProviders({ service_type: serviceName });
      setProviders(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load providers. Please try again.");
    }
  };

  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [requestForm, setRequestForm] = useState({
    description: "",
    appointmentDate: "",
    shift: "",
    location: "",
    payment_method: "Cash",
  });

  const handleOpenRequestDialog = (provider) => {
    setSelectedProvider(provider);
    setOpenRequestDialog(true);
    setRequestForm({
      description: "",
      appointmentDate: "",
      shift: "",
      location: "",
      payment_method: "Cash",
    });
  };

  const handleCloseRequestDialog = () => {
    setOpenRequestDialog(false);
    setSelectedProvider(null);
  };

  const handleRequestFormChange = (e) => {
    setRequestForm({
      ...requestForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitRequest = async () => {
    const {
      description,
      appointmentDate,
      shift,
      location,
      payment_method,
    } = requestForm;

    if (!description || !appointmentDate || !shift || !location || !payment_method) {
      showToast("Please fill out all required fields.", "error");
      return;
    }

    if (!shift.includes(" - ")) {
      showToast("Invalid shift format.", "error");
      return;
    }

    const [shift_start_time, shift_end_time] = shift.split(" - ");

    const payload = {
      provider_id: selectedProvider._id,
      description,
      appointment_date: appointmentDate,
      shift_start_time,
      shift_end_time,
      location,
      payment_method,
    };

    try {
      const res = await createServiceRequest(payload);
      showToast(`Request sent. ID: ${res.data.request_id}`, "success");
      setTimeout(() => {
        handleCloseRequestDialog();
      }, 2000);
    } catch (err) {
      console.error(err);
      showToast("Failed to send request. Please try again.", "error");
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ position: "relative", height: "50vh", overflow: "hidden" }}>
        <img
          src="https://img.freepik.com/free-photo/people-collage-design_23-2148888271.jpg"
          alt="Services"
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
            Services
          </Typography>
        </Box>
      </Box>

      <Box sx={{ textAlign: "center", p: 4, px: { xs: 2, sm: 4, md: 6 } }}>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {services.map((service) => (
            <Grid item xs={12} sm={6} md={3} key={service.name}>
              <Card>
                <CardMedia component="img" height="140" image={service.image} alt={service.name} />
                <CardContent>
                  <Typography variant="h6">{service.name}</Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 1 }}
                    onClick={() => handleSelectService(service.name)}
                  >
                    View Providers
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {selectedService && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Providers offering: {selectedService}
            </Typography>
            {error && (
              <Typography color="error" gutterBottom>
                {error}
              </Typography>
            )}
            <Grid container spacing={2}>
              {providers.map((provider) => (
                <Grid item xs={12} sm={6} md={4} key={provider._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{provider.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Location: {provider.location}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Services: {provider.services_offered?.join(", ")}
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{ mt: 1 }}
                        onClick={() => handleOpenRequestDialog(provider)}
                      >
                        Request Provider
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {!providers.length && !error && (
                <Typography sx={{ mt: 2 }}>
                  No providers found for {selectedService}.
                </Typography>
              )}
            </Grid>
          </Box>
        )}
      </Box>

      <Footer />

      {/* Request Provider Dialog */}
      <Dialog open={openRequestDialog} onClose={handleCloseRequestDialog}>
        <DialogTitle>Request Service from {selectedProvider?.name}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Problem Description"
            name="description"
            fullWidth
            multiline
            rows={3}
            value={requestForm.description}
            onChange={handleRequestFormChange}
          />
          <TextField
            margin="dense"
            label="Appointment Date"
            name="appointmentDate"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={requestForm.appointmentDate}
            onChange={handleRequestFormChange}
          />
          <TextField
            select
            label="Payment Method"
            name="payment_method"
            fullWidth
            value={requestForm.payment_method}
            onChange={handleRequestFormChange}
            SelectProps={{ native: true }}
          >
            <option value="Cash">Cash</option>
            <option value="Online">Online</option>
          </TextField>
          <TextField
            margin="dense"
            label="Service Location"
            name="location"
            fullWidth
            value={requestForm.location}
            onChange={handleRequestFormChange}
          />

          <Box marginTop={2}>
            <Typography variant="subtitle1" gutterBottom>
              Select a Shift
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {selectedProvider?.available_time?.map((shift, index) => {
                const label = `${shift.start_time} - ${shift.end_time}`;
                return (
                  <Button
                    key={index}
                    variant={requestForm.shift === label ? "contained" : "outlined"}
                    onClick={() => setRequestForm((prev) => ({ ...prev, shift: label }))}
                    sx={{
                      borderColor: "green",
                      color: "green",
                      minWidth: 120,
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "darkgreen",
                        backgroundColor: "#e8f5e9",
                      },
                    }}
                  >
                    {label}
                  </Button>
                );
              })}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRequestDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitRequest}>
            Send Request
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ServicesPage;
