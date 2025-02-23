import React, { useState } from 'react';
import { 
  Box, Grid, Card, CardContent, CardMedia, Typography, Button, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField 
} from '@mui/material';
import { getProviders, createServiceRequest } from '../services/api'; // Ensure createServiceRequest is defined in your API file
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";

const ServicesPage = () => {
  // List of available services
  const services = [
    { 
      name: 'Plumber', 
      image: "https://img.freepik.com/free-photo/technician-checking-heating-system-boiler-room_169016-53608.jpg" 
    },
    { 
      name: 'Electrician', 
      image: "https://img.freepik.com/free-photo/male-electrician-works-switchboard-with-electrical-connecting-cable_169016-15204.jpg" 
    },
    { 
      name: 'IT Expert', 
      image: "https://img.freepik.com/free-photo/businesman-working-computer_1098-21050.jpg" 
    },
    { 
      name: 'Cleaner', 
      image: "https://img.freepik.com/free-photo/young-housewife-cleaning-with-rug-detergent-isolated_231208-10959.jpg" 
    },
    // Add more services as needed
  ];

  // State for selected service and fetched providers
  const [selectedService, setSelectedService] = useState(null);
  const [providers, setProviders] = useState([]);
  const [error, setError] = useState('');

  const handleSelectService = async (serviceName) => {
    setSelectedService(serviceName);
    setProviders([]);  // Reset providers before fetching
    setError('');
    
    try {
      // Call the backend to get providers who offer this service
      const res = await getProviders({ service_type: serviceName });
      setProviders(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load providers. Please try again.');
    }
  };

  // State and functions for the "Request Provider" dialog
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [requestForm, setRequestForm] = useState({
    description: '',
    appointmentDate: '',
    appointmentTime: '',
    phone: ''
  });
  const [requestError, setRequestError] = useState('');
  const [requestSuccess, setRequestSuccess] = useState('');

  const handleOpenRequestDialog = (provider) => {
    setSelectedProvider(provider);
    setOpenRequestDialog(true);
    // Reset form state
    setRequestForm({
      description: '',
      appointmentDate: '',
      appointmentTime: '',
      phone: ''
    });
    setRequestError('');
    setRequestSuccess('');
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
    // Basic validation: all fields are required
    const { description, appointmentDate, appointmentTime, phone } = requestForm;
    if (!description || !appointmentDate || !appointmentTime || !phone) {
      setRequestError("All fields are required.");
      return;
    }

    // Prepare payload for creating a service request
    const payload = {
      provider_id: selectedProvider._id,
      description: description,
      date: appointmentDate,
      time: appointmentTime,
      phone: phone,
      // Additional user details (e.g., user's name) could be added here if available from AuthContext
    };

    try {
      const res = await createServiceRequest(payload);
      setRequestSuccess(`Request sent. ID: ${res.data.request_id}`);
      // Optionally, close the dialog after a short delay
      setTimeout(() => {
        handleCloseRequestDialog();
      }, 2000);
    } catch (err) {
      console.error(err);
      setRequestError("Failed to send request. Please try again.");
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <Box sx={{ position: "relative", height: "50vh", overflow: "hidden" }}>
        <img
          src="https://img.freepik.com/free-photo/people-collage-design_23-2148888271.jpg"
          alt="ServiceBuddy Welcome"
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(50%)" }}
        />
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "white", textAlign: "center" }}>
          <Typography variant="h3" fontWeight="bold">
            Book Trusted Technicians for All Home Repairs and Services
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ textAlign: "center", p: 5 }}>
        <Typography variant="h4" gutterBottom>Services</Typography>

        {/* Services List */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {services.map((service) => (
            <Grid item xs={12} sm={6} md={3} key={service.name}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={service.image}
                  alt={service.name}
                />
                <CardContent>
                  <Typography variant="h6">{service.name}</Typography>
                  <Button variant="contained" sx={{ mt: 1 }} onClick={() => handleSelectService(service.name)}>
                    View Providers
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Display Selected Service Providers */}
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
                        Services: {provider.services_offered?.join(', ')}
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
        <DialogTitle>
          Request Service from {selectedProvider?.name}
        </DialogTitle>
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
            margin="dense"
            label="Appointment Time"
            name="appointmentTime"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={requestForm.appointmentTime}
            onChange={handleRequestFormChange}
          />
          <TextField
            margin="dense"
            label="Contact Number"
            name="phone"
            fullWidth
            value={requestForm.phone}
            onChange={handleRequestFormChange}
          />
          {requestError && <Typography color="error" variant="body2">{requestError}</Typography>}
          {requestSuccess && <Typography color="primary" variant="body2">{requestSuccess}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRequestDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitRequest}>Send Request</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ServicesPage;