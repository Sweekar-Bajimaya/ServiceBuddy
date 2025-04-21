import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Autocomplete,
  AppBar,
  Toolbar,
  Drawer,

} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Menu as MenuIcon } from "@mui/icons-material";
// import DeleteIcon from "@mui/icons-material/Delete";
import { getProfile, updateProfile } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../common/Sidebar";
import { useToast } from "../common/ToastProvider";


const drawerWidth = 240;

const ProviderProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  //   const [error, setError] = useState("");
  const { showToast } = useToast();

  // Toggle the sidebar for mobile
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Available time state
  const [availableTime, setAvailableTime] = useState([]);
  const [newTimeSlot, setNewTimeSlot] = useState({
    day: "Monday",
    start_time: "09:00",
    end_time: "17:00",
  });

  // Services offered state
  const [servicesOffered, setServicesOffered] = useState([]);
  const [newService, setNewService] = useState("");

  // List of available services (you can replace this with your actual service options)
  const serviceOptions = [
    "Plumber",
    "Electrician",
    "Cleaner",
    "Mechanic",
    "IT Expert",
  ];

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      console.log("Provider profile data:", res.data);
      setProfile(res.data);
      setFormData({
        name: res.data.name || "",
        email: res.data.email || "",
        phone_num: res.data.phone_num || "",
        location: res.data.location || "",
        experience: res.data.experience || "",
        rate_per_hour: res.data.rate_per_hour || "",
      });

      // Initialize available time if it exists
      if (res.data.available_time && Array.isArray(res.data.available_time)) {
        setAvailableTime(res.data.available_time);
      }

      // Initialize services offered if they exist
      if (
        res.data.services_offered &&
        Array.isArray(res.data.services_offered)
      ) {
        setServicesOffered(res.data.services_offered);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      showToast("Failed to load profile data", "error");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleNewTimeSlotChange = (field, value) => {
    setNewTimeSlot({ ...newTimeSlot, [field]: value });
  };

  const addTimeSlot = () => {
    // Validate time slot
    if (!newTimeSlot.day || !newTimeSlot.start_time || !newTimeSlot.end_time) {
      showToast("Please fill all time slot fields", "error");
      return;
    }

    // Add new time slot
    const updatedTimeSlots = [...availableTime, { ...newTimeSlot }];
    setAvailableTime(updatedTimeSlots);

    // Reset new time slot form
    setNewTimeSlot({
      day: "Monday",
      start_time: "09:00",
      end_time: "17:00",
    });
  };

  const removeTimeSlot = (index) => {
    const updatedTimeSlots = [...availableTime];
    updatedTimeSlots.splice(index, 1);
    setAvailableTime(updatedTimeSlots);
  };

  const addService = () => {
    if (!newService || servicesOffered.includes(newService)) {
      showToast(
        "Please select a valid service that hasn't been added yet",
        " error"
      );
      return;
    }

    setServicesOffered([...servicesOffered, newService]);
    setNewService("");
  };

  const removeService = (index) => {
    const updatedServices = [...servicesOffered];
    updatedServices.splice(index, 1);
    setServicesOffered(updatedServices);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const form = new FormData();

      // Append basic fields
      form.append("name", formData.name || "");
      form.append("email", formData.email || "");
      form.append("phone_num", formData.phone_num || "");
      form.append("location", formData.location || "");
      form.append("experience", formData.experience || "");
      form.append("rate_per_hour", formData.rate_per_hour || "");

      // Append available time as JSON
      form.append("available_time", JSON.stringify(availableTime));

      // Append services offered as JSON
      console.log("Services being sent:", servicesOffered);
      form.append("services_offered", JSON.stringify(servicesOffered));

      // Append profile picture if changed
      if (image) {
        form.append("profile_picture", image);
      }

      // Debug the form data
      for (let [key, value] of form.entries()) {
        console.log(`${key}: ${value}`);
      }

      console.log("Submitting provider form data:", Object.fromEntries(form));

      // Send profile update request
      await updateProfile(form);

      // Fetch updated profile data
      const res = await getProfile();
      console.log("Updated provider profile data:", res.data);

      // Update local state
      setProfile(res.data);
      setFormData({
        name: res.data.name || "",
        email: res.data.email || "",
        phone_num: res.data.phone_num || "",
        location: res.data.location || "",
        experience: res.data.experience || "",
        rate_per_hour: res.data.rate_per_hour || "",
      });

      // Update available time
      if (res.data.available_time && Array.isArray(res.data.available_time)) {
        setAvailableTime(res.data.available_time);
      }

      // Update services offered
      if (
        res.data.services_offered &&
        Array.isArray(res.data.services_offered)
      ) {
        setServicesOffered(res.data.services_offered);
      }

      // Update the user in AuthContext with new profile data
      if (user) {
        const updatedUser = {
          ...user,
          profile_picture: res.data.profile_picture,
        };
        console.log("Updating provider in context:", updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }

      // Reset file state
      setImage(null);
      setPreviewUrl("");
      showToast("Profile updated successfully.", "success");
    } catch (err) {
      console.error("Profile update error:", err);
      showToast("Failed to update profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        {/* Top App Bar */}
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: "#1976d2",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Profile
            </Typography>
            <Box sx={{ ml: "auto", fontWeight: "bold" }}>
              {user ? `Mr. ${user.name}` : "Loading..."}
            </Box>
          </Toolbar>
        </AppBar>

        {/* Sidebar Drawer */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="sidebar"
        >
          {/* Mobile Drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            <Sidebar />
          </Drawer>

          {/* Desktop Drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            <Sidebar />
          </Drawer>
        </Box>

        <Box sx={{ p: 4, mt: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ p: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Profile Picture
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Avatar
                      alt={profile.name}
                      src={
                        previewUrl ||
                        (profile.profile_picture ? profile.profile_picture : "")
                      }
                      sx={{ width: 120, height: 120 }}
                    />
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card elevation={2} sx={{ p: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Name"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Email"
                        name="email"
                        value={formData.email || ""}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Phone"
                        name="phone_num"
                        value={formData.phone_num || ""}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Location"
                        name="location"
                        value={formData.location || ""}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card elevation={2} sx={{ p: 2, mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Service Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Experience (years)"
                        name="experience"
                        type="number"
                        value={formData.experience || ""}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Hourly Rate ($)"
                        name="rate_per_hour"
                        type="number"
                        value={formData.rate_per_hour || ""}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card elevation={2} sx={{ p: 2, mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Services Offered
                  </Typography>

                  {/* Current Services */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Current Services
                    </Typography>
                    {servicesOffered.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No services added yet.
                      </Typography>
                    ) : (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {servicesOffered.map((service, index) => (
                          <Chip
                            key={index}
                            label={service}
                            onDelete={() => removeService(index)}
                            sx={{ mb: 1 }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>

                  {/* Add New Service */}
                  <Typography variant="subtitle1" gutterBottom>
                    Add New Service
                  </Typography>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={9}>
                      <FormControl fullWidth margin="normal">
                        <Autocomplete
                          value={newService}
                          onChange={(event, newValue) => {
                            setNewService(newValue);
                          }}
                          options={serviceOptions}
                          renderInput={(params) => (
                            <TextField {...params} label="Select Service" />
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={addService}
                        sx={{ mt: 2 }}
                        fullWidth
                      >
                        Add Service
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card elevation={2} sx={{ p: 2, mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Availability
                  </Typography>

                  {/* Current Available Time */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Current Available Time
                    </Typography>
                    {availableTime.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No availability added yet.
                      </Typography>
                    ) : (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {availableTime.map((slot, index) => (
                          <Chip
                            key={index}
                            label={`${slot.day}: ${slot.start_time} - ${slot.end_time}`}
                            onDelete={() => removeTimeSlot(index)}
                            sx={{ mb: 1 }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>

                  {/* Add New Available Time */}
                  <Typography variant="subtitle1" gutterBottom>
                    Add New Available Time
                  </Typography>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Day</InputLabel>
                        <Select
                          value={newTimeSlot.day}
                          label="Day"
                          onChange={(e) =>
                            handleNewTimeSlotChange("day", e.target.value)
                          }
                        >
                          {days.map((day) => (
                            <MenuItem key={day} value={day}>
                              {day}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Start Time"
                        type="time"
                        value={newTimeSlot.start_time}
                        onChange={(e) =>
                          handleNewTimeSlotChange("start_time", e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="End Time"
                        type="time"
                        value={newTimeSlot.end_time}
                        onChange={(e) =>
                          handleNewTimeSlotChange("end_time", e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={addTimeSlot}
                        sx={{ mt: 2 }}
                        fullWidth
                      >
                        Add Slot
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Box sx={{ position: "relative", mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  fullWidth
                  size="large"
                >
                  {loading ? "Updating..." : "Update Profile"}
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
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default ProviderProfilePage;
