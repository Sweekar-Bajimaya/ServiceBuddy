// import React, { useState } from "react";
// import {
//   TextField,
//   Button,
//   Typography,
//   FormGroup,
//   FormControlLabel,
//   Checkbox,
//   Box,
//   AppBar, 
//   Drawer,
//   Toolbar,
//   IconButton,
// } from "@mui/material";
// import Sidebar from "../common/Sidebar";
// import { Menu as MenuIcon } from "@mui/icons-material";
// import { addServiceProvider } from "../../services/api";

// const drawerWidth = 240;

// const AddProvider = () => {
//   // Initialize form state with an empty array for services_offered
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     location: "",
//     phone_num: "",
//     services_offered: [],
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [mobileOpen, setMobileOpen] = useState(false);

//   // Toggle the sidebar for mobile
//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   // Define the possible service options
//   const serviceOptions = ["Plumber", "Mechanic", "IT Expert", "Electrician", "Cleaner"];

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Handle checkboxes for services_offered
//   const handleCheckboxChange = (e) => {
//     const { value, checked } = e.target;
//     if (checked) {
//       // Add service to the array
//       setForm((prevForm) => ({
//         ...prevForm,
//         services_offered: [...prevForm.services_offered, value],
//       }));
//     } else {
//       // Remove service from the array
//       setForm((prevForm) => ({
//         ...prevForm,
//         services_offered: prevForm.services_offered.filter(
//           (service) => service !== value
//         ),
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     // Ensure at least one service is selected
//     if (form.services_offered.length === 0) {
//       setError("Please select at least one service.");
//       return;
//     }

//     try {
//       await addServiceProvider(form);
//       setSuccess("Service Provider Added Successfully!");
//       // Reset form
//       setForm({
//         name: "",
//         email: "",
//         password: "",
//         location: "",
//         phone_num: "",
//         services_offered: [],
//       });
//     } catch (err) {
//       setError("Failed to add provider. Please try again.");
//     }
//   };

//   return (
//     <Box sx={{ display: "flex" }}>

//         {/*App Bar */}
//         <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
//             <Toolbar>
//                 <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
//                     <MenuIcon />
//                 </IconButton>
//                 <Typography variant="h6" noWrap component="div">
//                     Add Provider
//                 </Typography>
//             </Toolbar>
//         </AppBar>

//         {/* Sidebar Drawer */}
//         <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="sidebar">

//             {/* Mobile Drawer */}
//             <Drawer
//             variant="temporary"
//             open={mobileOpen}
//             onClose={handleDrawerToggle}
//             ModalProps={{ keepMounted: true }}
//             sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}
//             >
//                 <Sidebar />
//             </Drawer>

//             {/* Desktop Drawer */}
//             <Drawer variant="permanent" sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }} open>
//             <Sidebar />
//             </Drawer>
//         </Box>

//         {/* Main Content */}
//         <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
//             <Toolbar /> {/* Add space for the AppBar */}
//             <Typography variant="paragraph" gutterBottom>
//                 Fill out All the details to Add provider
//             </Typography>

//             {error && <Typography color="error">{error}</Typography>}
//             {success && <Typography color="primary">{success}</Typography>}

//             <form onSubmit={handleSubmit}>
//                 <TextField
//                 fullWidth
//                 margin="normal"
//                 label="Name"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//                 />
//                 <TextField
//                 fullWidth
//                 margin="normal"
//                 label="Email"
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 required
//                 />
//                 <TextField
//                 fullWidth
//                 margin="normal"
//                 label="Password"
//                 type="password"
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 required
//                 />
//                 <TextField
//                 fullWidth
//                 margin="normal"
//                 label="Location"
//                 name="location"
//                 value={form.location}
//                 onChange={handleChange}
//                 required
//                 />
//                 <TextField
//                 fullWidth
//                 margin="normal"
//                 label="Phone Number"
//                 name="phone_num"
//                 value={form.phone_num}
//                 onChange={handleChange}
//                 required
//                 />

//                 {/* Checkboxes for services offered */}
//                 <Typography variant="subtitle1" sx={{ mt: 2 }}>
//                 Services Offered
//                 </Typography>
//                 <FormGroup>
//                 {serviceOptions.map((service) => (
//                     <FormControlLabel
//                     key={service}
//                     control={
//                         <Checkbox
//                         checked={form.services_offered.includes(service)}
//                         onChange={handleCheckboxChange}
//                         value={service}
//                         />
//                     }
//                     label={service}
//                     />
//                 ))}
//                 </FormGroup>

//                 <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
//                 Add Provider
//                 </Button>
//             </form>
//         </Box>
//     </Box>
//   );
// };

// export default AddProvider;


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
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import Sidebar from "../common/Sidebar";
import { Menu as MenuIcon } from "@mui/icons-material";
import { addServiceProvider } from "../../services/api";

const drawerWidth = 240;

const AddProvider = () => {
  // Initialize form state with an empty array for services_offered
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    phone_num: "",
    services_offered: [],
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Toggle the sidebar for mobile
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Define the possible service options
  const serviceOptions = ["Plumber", "Mechanic", "IT Expert", "Electrician", "Cleaner"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle checkboxes for services_offered
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      // Add service to the array
      setForm((prevForm) => ({
        ...prevForm,
        services_offered: [...prevForm.services_offered, value],
      }));
    } else {
      // Remove service from the array
      setForm((prevForm) => ({
        ...prevForm,
        services_offered: prevForm.services_offered.filter(
          (service) => service !== value
        ),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Ensure at least one service is selected
    if (form.services_offered.length === 0) {
      setError("Please select at least one service.");
      return;
    }

    try {
      await addServiceProvider(form);
      setSuccessMessage("Service Provider Added Successfully!");
      // Reset form
      setForm({
        name: "",
        email: "",
        password: "",
        location: "",
        phone_num: "",
        services_offered: [],
      });
    } catch (err) {
      setError("Failed to add provider. Please try again.");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>

      {/* App Bar */}
      <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Add Provider
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="sidebar">
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}
        >
          <Sidebar />
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer variant="permanent" sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }} open>
          <Sidebar />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar /> {/* Add space for the AppBar */}
        <Typography variant="paragraph" gutterBottom>
          Fill out all the details to add a provider.
        </Typography>

        {/* Success and Error Alerts */}
        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
        <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage("")}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Alert severity="success" onClose={() => setSuccessMessage("")}>{successMessage}</Alert>
        </Snackbar>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
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
          <TextField
            fullWidth
            margin="normal"
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone Number"
            name="phone_num"
            value={form.phone_num}
            onChange={handleChange}
            required
          />

          {/* Checkboxes for services offered */}
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

          <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
            Add Provider
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default AddProvider;
