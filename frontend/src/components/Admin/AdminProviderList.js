// import React, { useState, useEffect, useContext } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Drawer,
//   Box,
//   IconButton,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Paper,
//   Button,
//   TextField,
// } from "@mui/material";
// import { Menu as MenuIcon } from "@mui/icons-material";
// import Sidebar from "../common/Sidebar";
// import { AuthContext } from "../../context/AuthContext";
// import { getAdminProviders, deleteProvider } from "../../services/api";

// const drawerWidth = 240;

// const AdminProviderList = () => {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const { user } = useContext(AuthContext);
//   const [providers, setProviders] = useState([]);
//   const [filteredProviders, setFilteredProviders] = useState([]);
//   const [search, setSearch] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchProviders = async () => {
//       try {
//         const data = await getAdminProviders();
//         setProviders(data);
//         setFilteredProviders(data);
//       } catch (error) {
//         setError("Error fetching providers. Please try again later.");
//       }
//     };
//     fetchProviders();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       await deleteProvider(id);
//       setProviders(providers.filter((provider) => provider._id !== id));
//       setFilteredProviders(filteredProviders.filter((provider) => provider._id !== id));
//     } catch (error) {
//       setError("Error deleting provider. Please try again later.");
//     }
//   };

//   const handleSearch = (event) => {
//     const value = event.target.value.toLowerCase();
//     setSearch(value);
//     setFilteredProviders(providers.filter((provider) => provider.name.toLowerCase().includes(value)));
//   };

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   return (
//     <Box sx={{ display: "flex" }}>
//       {/* AppBar */}
//       <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
//         <Toolbar>
//           <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" noWrap component="div">
//             Service Providers
//           </Typography>
//           <Box sx={{ ml: "auto", mr: 4, display: "flex", alignItems: "center", gap: 2 }}>
//             <Typography variant="h6">Mr.{user.name}</Typography>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* Sidebar */}
//       <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="sidebar">
//         <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }}
//           sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}>
//           <Sidebar />
//         </Drawer>
//         <Drawer variant="permanent" sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }} open>
//           <Sidebar />
//         </Drawer>
//       </Box>

//       {/* Main Content */}
//       <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
//         <Toolbar />
//         <TextField label="Search Provider" variant="outlined" size="small" margin="normal" value={search} onChange={handleSearch} sx={{ width: "300px" }} />
//         {error && <Typography color="error">{error}</Typography>}
//         <Paper sx={{ width: "100%", overflowX: "auto", mt: 2 }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Email</TableCell>
//                 <TableCell>Location</TableCell>
//                 <TableCell>Phone Number</TableCell>
//                 <TableCell>Services Offered</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredProviders.map((provider) => (
//                 <TableRow key={provider._id}>
//                   <TableCell>{provider.name}</TableCell>
//                   <TableCell>{provider.email}</TableCell>
//                   <TableCell>{provider.location}</TableCell>
//                   <TableCell>{provider.phone_num}</TableCell>
//                   <TableCell>{Array.isArray(provider.services_offered) ? provider.services_offered.join(", ") : provider.services_offered}</TableCell>
//                   <TableCell>
//                     <Button variant="contained" color="error" onClick={() => handleDelete(provider._id)}>
//                       Delete
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Paper>
//       </Box>
//     </Box>
//   );
// };

// export default AdminProviderList;

import React, { useState, useEffect, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  Box,
  IconButton,
  Grid,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  Container,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import Sidebar from "../common/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import { getAdminProviders, deleteProvider } from "../../services/api";

const drawerWidth = 240;

const AdminProviderList = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await getAdminProviders();
        setProviders(data);
        setFilteredProviders(data);
      } catch (error) {
        setError("Error fetching providers. Please try again later.");
      }
    };
    fetchProviders();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProvider(id);
      setProviders(providers.filter((provider) => provider._id !== id));
      setFilteredProviders(filteredProviders.filter((provider) => provider._id !== id));
      setSuccessMessage("Provider successfully deleted.");
    } catch (error) {
      setError("Error deleting provider. Please try again later.");
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearch(value);
    const filtered = providers.filter((provider) =>
      provider.name.toLowerCase().includes(value)
    );
    setFilteredProviders(filtered);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
          <Typography variant="h6" noWrap>
            Service Providers
          </Typography>
          <Box sx={{ ml: "auto", mr: 4 }}>
            <Typography variant="h6">Mr. {user.name}</Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { width: drawerWidth } }}
        >
          <Sidebar />
        </Drawer>
        <Drawer variant="permanent" sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { width: drawerWidth } }} open>
          <Sidebar />
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Service Providers
          </Typography>
          <TextField
            label="Search Provider"
            variant="outlined"
            fullWidth
            margin="normal"
            value={search}
            onChange={handleSearch}
            sx={{ width: "300px" }}
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage("")}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <Alert severity="success" onClose={() => setSuccessMessage("")}>{successMessage}</Alert>
          </Snackbar>
          <Paper sx={{ width: "100%", overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Services Offered</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProviders.map((provider) => (
                  <TableRow key={provider._id}>
                    <TableCell>{provider.name}</TableCell>
                    <TableCell>{provider.email}</TableCell>
                    <TableCell>{provider.location}</TableCell>
                    <TableCell>{provider.phone_num}</TableCell>
                    <TableCell>{Array.isArray(provider.services_offered) ? provider.services_offered.join(", ") : provider.services_offered}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="error" onClick={() => handleDelete(provider._id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminProviderList;