import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  AppBar,
  Drawer,
  Toolbar,
  IconButton
} from "@mui/material";
import Sidebar from "../common/Sidebar";
import { Menu as MenuIcon } from "@mui/icons-material";
import { addServiceProvider } from "../../services/api";
import { useToast } from "../common/ToastProvider";

const drawerWidth = 240;

const AddProvider = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    phone_num: "",
    services_offered: [],
  });

  const [timeShifts, setTimeShifts] = useState([
    { start_time: "", end_time: "" }
  ]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const { showToast } = useToast();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const serviceOptions = ["Plumber", "Mechanic", "IT Expert", "Electrician", "Cleaner"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setForm((prevForm) => ({
        ...prevForm,
        services_offered: [...prevForm.services_offered, value],
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        services_offered: prevForm.services_offered.filter(
          (service) => service !== value
        ),
      }));
    }
  };

  const handleTimeShiftChange = (index, field, value) => {
    const updatedShifts = [...timeShifts];
    updatedShifts[index][field] = value;
    setTimeShifts(updatedShifts);
  };

  const handleAddTimeShift = () => {
    setTimeShifts([...timeShifts, { start_time: "", end_time: "" }]);
  };

  const handleRemoveTimeShift = (index) => {
    const updatedShifts = [...timeShifts];
    updatedShifts.splice(index, 1);
    setTimeShifts(updatedShifts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.services_offered.length === 0) {
      showToast("Please select at least one service.", "error");
      return;
    }

    try {
      await addServiceProvider({
        ...form,
        available_time: timeShifts
      });
      showToast("Service Provider Added Successfully!", "success");

      setForm({
        name: "",
        email: "",
        password: "",
        location: "",
        phone_num: "",
        services_offered: [],
      });
      setTimeShifts([{ start_time: "", end_time: "" }]);
    } catch (err) {
      // If the error response contains "Email already exists"
      if (err.response && err.response.data.error === "Email already exists.") {
        showToast("This email is already associated with another account.", "error");
      } else {
        showToast("Failed to add provider. Please try again.", "error");
      }
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
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
          <Typography variant="h6" noWrap component="div">
            Add Provider
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          <Sidebar />
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          <Sidebar />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Typography variant="body1" gutterBottom>
          Fill out all the details to add a provider.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField fullWidth margin="normal" label="Name" name="name" value={form.name} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Password" type="password" name="password" value={form.password} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Location" name="location" value={form.location} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Phone Number" name="phone_num" value={form.phone_num} onChange={handleChange} required />

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Services Offered
          </Typography>
          <FormGroup>
            {serviceOptions.map((service) => (
              <FormControlLabel
                key={service}
                control={
                  <Checkbox
                    checked={form.services_offered.includes(service)}
                    onChange={handleCheckboxChange}
                    value={service}
                  />
                }
                label={service}
              />
            ))}
          </FormGroup>

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Available Time Shifts
          </Typography>
          {timeShifts.map((shift, index) => (
            <Box key={index} sx={{ display: "flex", gap: 2, alignItems: "center", mt: 1 }}>
              <TextField
                label="Start Time"
                type="time"
                value={shift.start_time}
                onChange={(e) => handleTimeShiftChange(index, "start_time", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />
              <TextField
                label="End Time"
                type="time"
                value={shift.end_time}
                onChange={(e) => handleTimeShiftChange(index, "end_time", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />
              {timeShifts.length > 1 && (
                <Button onClick={() => handleRemoveTimeShift(index)} color="error">
                  Remove
                </Button>
              )}
            </Box>
          ))}
          <Button onClick={handleAddTimeShift} sx={{ mt: 1 }}>
            Add Another Shift
          </Button>

          <Button variant="contained" type="submit" fullWidth sx={{ mt: 3 }}>
            Add Provider
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default AddProvider;
