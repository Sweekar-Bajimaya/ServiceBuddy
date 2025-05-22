// //Better Profile Card
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   CardMedia,
//   Typography,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Tabs,
//   Tab,
//   Rating,
//   CircularProgress,
//   Divider,
//   Alert,
//   Avatar,
// } from "@mui/material";
// import {
//   getProviders,
//   createServiceRequest,
//   getProviderReviews,
//   getBookedShifts,
// } from "../services/api";
// import Navbar from "./common/Navbar";
// import Footer from "./common/Footer";
// import { useToast } from "./common/ToastProvider";
// import { useNavigate } from "react-router-dom";

// // Create a TabPanel component for the tab content
// function TabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
//     </div>
//   );
// }

// const ServicesPage = () => {
//   // Existing state variables...
//   const services = [
//     {
//       name: "Plumber",
//       image:
//         "https://img.freepik.com/free-photo/technician-checking-heating-system-boiler-room_169016-53608.jpg",
//     },
//     {
//       name: "Electrician",
//       image:
//         "https://img.freepik.com/free-photo/male-electrician-works-switchboard-with-electrical-connecting-cable_169016-15204.jpg",
//     },
//     {
//       name: "IT Expert",
//       image:
//         "https://img.freepik.com/free-photo/businesman-working-computer_1098-21050.jpg",
//     },
//     {
//       name: "Cleaner",
//       image:
//         "https://img.freepik.com/free-photo/young-housewife-cleaning-with-rug-detergent-isolated_231208-10959.jpg",
//     },
//     {
//       name: "Mechanic",
//       image:
//         "https://img.freepik.com/free-photo/muscular-car-service-worker-repairing-vehicle_146671-19605.jpg?t=st=1743257466~exp=1743261066~hmac=08ee31bbaadd0fb86221511ae81acfc3d37e7cee6454f597b63901bbc7073d82&w=1380",
//     },
//   ];

//   const [selectedService, setSelectedService] = useState(null);
//   const [providers, setProviders] = useState([]);
//   const [error, setError] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const { showToast } = useToast();
//   const navigate = useNavigate();
//   const [openRequestDialog, setOpenRequestDialog] = useState(false);
//   const [selectedProvider, setSelectedProvider] = useState(null);
//   const [requestForm, setRequestForm] = useState({
//     description: "",
//     appointmentDate: "",
//     shift: "",
//     location: "",
//     payment_method: "Cash",
//   });
//   const [bookedShifts, setBookedShifts] = useState([]);

//   // New state variables for tabs and reviews
//   const [tabValue, setTabValue] = useState(0);
//   const [providerReviews, setProviderReviews] = useState([]);
//   const [loadingReviews, setLoadingReviews] = useState(false);

//   // Check if user is logged in
//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     setIsLoggedIn(!!token);
//   }, []);

//   useEffect(() => {
//     const fetchBooked = async () => {
//       if (selectedProvider && requestForm.appointmentDate) {
//         try {
//           const res = await getBookedShifts(
//             selectedProvider._id,
//             requestForm.appointmentDate
//           );
//           setBookedShifts(res.data.booked_shifts || []);
//         } catch (err) {
//           console.error("Error fetching booked shifts:", err);
//         }
//       }
//     };

//     fetchBooked();
//   }, [requestForm.appointmentDate, selectedProvider]);

//   // Handle tab change
//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);

//     // Fetch reviews when switching to the reviews tab
//     if (newValue === 1 && selectedProvider && providerReviews.length === 0) {
//       fetchProviderReviews(selectedProvider._id);
//     }
//   };

//   // Function to fetch provider reviews
//   const fetchProviderReviews = async (provider_id) => {
//     setLoadingReviews(true);
//     try {
//       const response = await getProviderReviews(provider_id);
//       setProviderReviews(response.data);
//     } catch (error) {
//       console.error("Failed to fetch reviews:", error);
//       showToast("Failed to load reviews", "error");
//     } finally {
//       setLoadingReviews(false);
//     }
//   };

//   // Modified function to handle login prompt
//   const handleSelectService = async (serviceName) => {
//     setSelectedService(serviceName);
//     setProviders([]);
//     setError("");

//     // Check if user is logged in
//     if (!isLoggedIn) {
//       setError("login_required");
//       return;
//     }

//     try {
//       const res = await getProviders({ service_type: serviceName });
//       setProviders(res.data);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load providers. Please try again.");
//     }
//   };

//   const handleNavigateToLogin = () => {
//     navigate("/login", {
//       state: { from: "/services", selectedService: selectedService },
//     });
//   };

//   const handleOpenRequestDialog = (provider) => {
//     if (!isLoggedIn) {
//       showToast("Please log in to request a service", "warning");
//       navigate("/login", { state: { from: "/services" } });
//       return;
//     }

//     setSelectedProvider(provider);
//     setOpenRequestDialog(true);
//     setTabValue(0); // Reset to first tab when opening
//     setProviderReviews([]); // Clear previous reviews
//     setRequestForm({
//       description: "",
//       appointmentDate: "",
//       shift: "",
//       location: "",
//       payment_method: "Cash",
//     });
//   };

//   const handleCloseRequestDialog = () => {
//     setOpenRequestDialog(false);
//     setSelectedProvider(null);
//   };

//   const handleRequestFormChange = (e) => {
//     setRequestForm({
//       ...requestForm,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmitRequest = async () => {
//     const { description, appointmentDate, shift, location, payment_method } =
//       requestForm;

//     if (
//       !description ||
//       !appointmentDate ||
//       !shift ||
//       !location ||
//       !payment_method
//     ) {
//       showToast("Please fill out all required fields.", "error");
//       return;
//     }

//     if (!shift.includes(" - ")) {
//       showToast("Invalid shift format.", "error");
//       return;
//     }

//     if (bookedShifts.includes(shift)) {
//       showToast(
//         "This shift is already booked. Please choose another.",
//         "error"
//       );
//       return;
//     }

//     const [shift_start_time, shift_end_time] = shift.split(" - ");

//     const payload = {
//       provider_id: selectedProvider._id,
//       description,
//       appointment_date: appointmentDate,
//       shift_start_time,
//       shift_end_time,
//       location,
//       payment_method,
//     };

//     try {
//       const res = await createServiceRequest(payload);
//       showToast(`Request sent. ID: ${res.data.request_id}`, "success");
//       setTimeout(() => {
//         handleCloseRequestDialog();
//       }, 2000);
//     } catch (err) {
//       console.error(err);

//       if (err.response?.status === 409) {
//         showToast(
//           "This shift is already booked. Please select another.",
//           "error"
//         );
//       } else {
//         showToast("Failed to send request. Please try again.", "error");
//       }
//     }
//   };

//   // Calculate average rating
//   const calculateAverageRating = (reviews) => {
//     if (reviews.length === 0) return 0;
//     const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
//     return totalRating / reviews.length;
//   };

//   // Login prompt component
//   const LoginPrompt = () => (
//     <Box
//       sx={{
//         textAlign: "center",
//         my: 4,
//         p: 3,
//         bgcolor: "#f5f5f5",
//         borderRadius: 2,
//       }}
//     >
//       <Typography variant="h6" gutterBottom>
//         Please log in to view service providers
//       </Typography>
//       <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
//         You need to be logged in to access the list of service providers
//       </Typography>
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleNavigateToLogin}
//       >
//         Log In
//       </Button>
//     </Box>
//   );

//   return (
//     <>
//       {/* Your existing JSX components */}
//       <Navbar />
//       {/* Hero section and services grid */}
//       <Box sx={{ position: "relative", height: "50vh", overflow: "hidden" }}>
//         <img
//           src="https://img.freepik.com/free-photo/people-collage-design_23-2148888271.jpg"
//           alt="Services"
//           style={{
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//             filter: "brightness(50%)",
//           }}
//         />
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             color: "white",
//             textAlign: "center",
//           }}
//         >
//           <Typography
//             variant="h2"
//             sx={{
//               fontWeight: 700,
//               fontSize: { xs: "2.5rem", sm: "4rem" },
//               lineHeight: 1.2,
//               mb: 2,
//               textTransform: "uppercase",
//             }}
//           >
//             Services
//           </Typography>
//         </Box>
//       </Box>

//       <Box sx={{ textAlign: "center", p: 4, px: { xs: 2, sm: 4, md: 6 } }}>
//         <Grid container spacing={2} sx={{ mb: 4 }}>
//           {services.map((service) => (
//             <Grid item xs={12} sm={6} md={3} key={service.name}>
//               <Card>
//                 <CardMedia
//                   component="img"
//                   height="140"
//                   image={service.image}
//                   alt={service.name}
//                 />
//                 <CardContent>
//                   <Typography variant="h6">{service.name}</Typography>
//                   <Button
//                     variant="contained"
//                     sx={{ mt: 1 }}
//                     onClick={() => handleSelectService(service.name)}
//                   >
//                     View Providers
//                   </Button>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>

//         {selectedService && (
//           <Box sx={{ mt: 4 }}>
//             <Typography variant="h5" gutterBottom>
//               Providers offering: {selectedService}
//             </Typography>

//             {error === "login_required" ? (
//               <LoginPrompt />
//             ) : (
//               <>
//                 {error && error !== "login_required" && (
//                   <Typography color="error" gutterBottom>
//                     {error}
//                   </Typography>
//                 )}
//                 <Grid container spacing={3}>
//                   {providers.map((provider) => (
//                     <Grid item xs={12} sm={6} md={4} key={provider._id}>
//                       {/* New Provider Card Design */}
//                       <Card
//                         sx={{
//                           borderRadius: 3,
//                           boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//                           // backgroundColor: '#FEF9F3',
//                           overflow: "visible",
//                           position: "relative",
//                           p: 2,
//                         }}
//                       >
//                         <Box
//                           sx={{
//                             display: "flex",
//                             flexDirection: { xs: "column", sm: "row" },
//                             alignItems: { xs: "center", sm: "flex-start" },
//                           }}
//                         >
//                           {/* Avatar */}
//                           <Avatar
//                             sx={{
//                               width: 100,
//                               height: 100,
//                               mb: { xs: 2, sm: 0 },
//                               mr: { xs: 0, sm: 3 },
//                             }}
//                             alt={provider.name}
//                             src={provider.profile_picture}
//                           >
//                             {provider.name?.charAt(0).toUpperCase() || "P"}
//                           </Avatar>

//                           {/* Provider Info */}
//                           <Box sx={{ flex: 1, textAlign: "left", mt: 1 }}>
//                             <Typography
//                               variant="h5"
//                               component="div"
//                               sx={{ fontWeight: "bold", mb: 0.5 }}
//                             >
//                               {provider.name}
//                             </Typography>

//                             <Typography
//                               variant="body2"
//                               color="text.secondary"
//                               sx={{ mb: 1 }}
//                             >
//                               {provider.email || "provider@servicebuddy.com"}
//                             </Typography>

//                             <Rating
//                               value={
//                                 providerReviews && providerReviews.length > 0
//                                   ? calculateAverageRating(providerReviews)
//                                   : 0
//                               }
//                               precision={0.5}
//                               readOnly
//                             />

//                             <Typography
//                               variant="body1"
//                               sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 mb: 0.5,
//                               }}
//                             >
//                               <strong>Location:</strong>{" "}
//                               {provider.location || "Not Added Yet"}
//                             </Typography>

//                             <Typography
//                               variant="body1"
//                               sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 mb: 0.5,
//                               }}
//                             >
//                               <strong>Contact No: </strong>{" "}
//                               {provider.phone_num || "Not Added Yet"}
//                             </Typography>

//                             <Typography
//                               variant="body1"
//                               sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 mb: 0.5,
//                               }}
//                             >
//                               <strong>Rate Per Hour:</strong> रु
//                               {provider.rate_per_hour || "30"}
//                             </Typography>

//                             <Typography
//                               variant="body1"
//                               sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 mb: 1,
//                               }}
//                             >
//                               <strong>Experience:</strong>{" "}
//                               {provider.experience
//                                 ? `${provider.experience} Years`
//                                 : "No added yet"}
//                             </Typography>

//                             <Typography variant="body1" sx={{ mb: 0.5 }}>
//                               <strong>Availability:</strong>
//                             </Typography>

//                             <Typography variant="body2" sx={{ mb: 2 }}>
//                               {provider.available_time &&
//                               provider.available_time.length > 0
//                                 ? provider.available_time.map(
//                                     (shift, index) => (
//                                       <div key={index}>
//                                         {shift.day || "Mon-Fri"}:{" "}
//                                         {shift.start_time || "9:00am"} -{" "}
//                                         {shift.end_time || "3:00pm"}
//                                       </div>
//                                     )
//                                   )
//                                 : "Mon - Fri: 9:00am - 3:00pm"}
//                             </Typography>

//                             <Button
//                               variant="contained"
//                               onClick={() => handleOpenRequestDialog(provider)}
//                             >
//                               Book Now
//                             </Button>
//                           </Box>
//                         </Box>
//                       </Card>
//                     </Grid>
//                   ))}
//                   {!providers.length && !error && (
//                     <Typography sx={{ mt: 2 }}>
//                       No providers found for {selectedService}.
//                     </Typography>
//                   )}
//                 </Grid>
//               </>
//             )}
//           </Box>
//         )}
//       </Box>

//       <Footer />

//       {/* Request Provider Dialog with Tabs */}
//       <Dialog
//         open={openRequestDialog}
//         onClose={handleCloseRequestDialog}
//         fullWidth
//         maxWidth="md"
//       >
//         <DialogTitle>
//           {selectedProvider?.name}
//           <Tabs
//             value={tabValue}
//             onChange={handleTabChange}
//             sx={{ borderBottom: 1, borderColor: "divider" }}
//           >
//             <Tab label="Request Service" />
//             <Tab label="Reviews" />
//           </Tabs>
//         </DialogTitle>

//         <DialogContent>
//           {/* Request Service Tab */}
//           <TabPanel value={tabValue} index={0}>
//             <Box display="flex" flexDirection="column" gap={1}>
//               <TextField
//                 margin="dense"
//                 label="Problem Description"
//                 name="description"
//                 fullWidth
//                 multiline
//                 rows={3}
//                 value={requestForm.description}
//                 onChange={handleRequestFormChange}
//               />
//               <TextField
//                 margin="dense"
//                 label="Appointment Date"
//                 name="appointmentDate"
//                 type="date"
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//                 value={requestForm.appointmentDate}
//                 onChange={handleRequestFormChange}
//               />
//               <TextField
//                 margin="dense"
//                 select
//                 label="Payment After Completion of Service"
//                 name="payment_method"
//                 fullWidth
//                 value={requestForm.payment_method}
//                 onChange={handleRequestFormChange}
//                 SelectProps={{ native: true }}
//               >
//                 <option value="Cash">Cash</option>
//                 <option value="Online">Online</option>
//               </TextField>
//               <TextField
//                 margin="dense"
//                 label="Service Location"
//                 name="location"
//                 fullWidth
//                 value={requestForm.location}
//                 onChange={handleRequestFormChange}
//               />

//               <Box>
//                 <Typography variant="subtitle1" gutterBottom>
//                   Select a Shift
//                 </Typography>
//                 <Box display="flex" flexWrap="wrap" gap={1}>
//                   {selectedProvider?.available_time?.map((shift, index) => {
//                     const label = `${shift.start_time} - ${shift.end_time}`;
//                     const isBooked = bookedShifts.includes(label);
//                     const isSelected = requestForm.shift === label;

//                     return (
//                       <Button
//                         key={index}
//                         variant={isSelected ? "contained" : "outlined"}
//                         onClick={() =>
//                           !isBooked &&
//                           setRequestForm((prev) => ({ ...prev, shift: label }))
//                         }
//                         disabled={isBooked}
//                         sx={{
//                           border: "2px solid",
//                           borderColor: isBooked ? "red" : "green",
//                           color: isBooked ? "red" : "green",
//                           backgroundColor: isSelected
//                             ? isBooked
//                               ? "rgba(255, 0, 0, 0.1)"
//                               : "rgba(0, 128, 0, 0.1)"
//                             : "transparent",
//                           minWidth: 150,
//                           textTransform: "none",
//                           cursor: isBooked ? "not-allowed" : "pointer",
//                           "&:hover": {
//                             backgroundColor: isBooked
//                               ? "rgba(255, 0, 0, 0.05)"
//                               : "rgba(0, 128, 0, 0.1)",
//                             borderColor: isBooked ? "red" : "darkgreen",
//                           },
//                         }}
//                       >
//                         {label} {isBooked ? "(Booked)" : ""}
//                       </Button>
//                     );
//                   })}
//                 </Box>
//               </Box>
//             </Box>
//           </TabPanel>

//           {/* Reviews Tab */}
//           <TabPanel value={tabValue} index={1}>
//             {loadingReviews ? (
//               <Box display="flex" justifyContent="center" p={3}>
//                 <CircularProgress />
//               </Box>
//             ) : (
//               <Box>
//                 <Box display="flex" alignItems="center" mb={2}>
//                   <Typography variant="h6" mr={2}>
//                     Average Rating:
//                   </Typography>
//                   <Rating
//                     value={calculateAverageRating(providerReviews)}
//                     precision={0.5}
//                     readOnly
//                   />
//                   <Typography variant="body1" ml={1}>
//                     ({providerReviews.length}{" "}
//                     {providerReviews.length === 1 ? "review" : "reviews"})
//                   </Typography>
//                 </Box>

//                 {providerReviews.length > 0 ? (
//                   providerReviews.map((review, index) => (
//                     <Box key={review._id || index} mb={2}>
//                       <Box display="flex" alignItems="flex-start">
//                         {/* Profile Picture */}
//                         <Box mr={2}>
//                           <Avatar
//                             src={review.profile_picture || undefined}
//                             alt={review.user_name}
//                             sx={{ width: 50, height: 50 }}
//                           >
//                             {review.user_name?.charAt(0).toUpperCase() || "U"}
//                           </Avatar>
//                         </Box>

//                         {/* Review Content */}
//                         <Box flex={1}>
//                           <Box display="flex" alignItems="center">
//                             <Typography
//                               variant="subtitle1"
//                               fontWeight="bold"
//                               mr={1}
//                             >
//                               {review.user_name}
//                             </Typography>
//                             <Rating
//                               value={review.rating}
//                               readOnly
//                               size="small"
//                             />
//                           </Box>
//                           <Typography variant="body2" color="text.secondary">
//                             {new Date(review.created_at).toLocaleDateString()}
//                           </Typography>
//                           <Typography variant="body1" mt={1}>
//                             {review.review}
//                           </Typography>
//                         </Box>
//                       </Box>
//                       {index < providerReviews.length - 1 && (
//                         <Divider sx={{ mt: 2 }} />
//                       )}
//                     </Box>
//                   ))
//                 ) : (
//                   <Typography variant="body1">
//                     No reviews available for this provider.
//                   </Typography>
//                 )}
//               </Box>
//             )}
//           </TabPanel>
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={handleCloseRequestDialog}>Cancel</Button>
//           {tabValue === 0 && (
//             <Button variant="contained" onClick={handleSubmitRequest}>
//               Send Request
//             </Button>
//           )}
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default ServicesPage;

import React, { useState, useEffect } from "react";
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
  Tabs,
  Tab,
  Rating,
  CircularProgress,
  Divider,
  Alert,
  Avatar,
} from "@mui/material";
import {
  getProviders,
  createServiceRequest,
  getProviderReviews,
  getBookedShifts,
} from "../services/api";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";
import { useToast } from "./common/ToastProvider";
import { useNavigate } from "react-router-dom";

// Create a TabPanel component for the tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const ServicesPage = () => {
  // Existing state variables...
  const services = [
    {
      name: "Plumber",
      image:
        "https://img.freepik.com/free-photo/technician-checking-heating-system-boiler-room_169016-53608.jpg",
    },
    {
      name: "Electrician",
      image:
        "https://img.freepik.com/free-photo/male-electrician-works-switchboard-with-electrical-connecting-cable_169016-15204.jpg",
    },
    {
      name: "IT Expert",
      image:
        "https://img.freepik.com/free-photo/businesman-working-computer_1098-21050.jpg",
    },
    {
      name: "Cleaner",
      image:
        "https://img.freepik.com/free-photo/young-housewife-cleaning-with-rug-detergent-isolated_231208-10959.jpg",
    },
    {
      name: "Mechanic",
      image:
        "https://img.freepik.com/free-photo/muscular-car-service-worker-repairing-vehicle_146671-19605.jpg?t=st=1743257466~exp=1743261066~hmac=08ee31bbaadd0fb86221511ae81acfc3d37e7cee6454f597b63901bbc7073d82&w=1380",
    },
  ];

  const [selectedService, setSelectedService] = useState(null);
  const [providers, setProviders] = useState([]);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [requestForm, setRequestForm] = useState({
    description: "",
    appointmentDate: "",
    shift: "",
    location: "",
    payment_method: "Cash",
  });
  const [bookedShifts, setBookedShifts] = useState([]);

  // Add new state for loading booked shifts
  const [loadingBookedShifts, setLoadingBookedShifts] = useState(false);
  // Add state for booking error messages
  const [bookingError, setBookingError] = useState("");

  // New state variables for tabs and reviews
  const [tabValue, setTabValue] = useState(0);
  const [providerReviews, setProviderReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  // Enhanced useEffect to fetch booked shifts with loading state and error handling
  useEffect(() => {
    const fetchBooked = async () => {
      if (selectedProvider && requestForm.appointmentDate) {
        setLoadingBookedShifts(true);
        setBookingError("");
        try {
          const res = await getBookedShifts(
            selectedProvider._id,
            requestForm.appointmentDate
          );
          setBookedShifts(res.data.booked_shifts || []);
        } catch (err) {
          console.error("Error fetching booked shifts:", err);
          setBookingError(
            "Failed to fetch availability information. Please try again."
          );
        } finally {
          setLoadingBookedShifts(false);
        }
      }
    };

    fetchBooked();
  }, [requestForm.appointmentDate, selectedProvider]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    // Fetch reviews when switching to the reviews tab
    if (newValue === 1 && selectedProvider && providerReviews.length === 0) {
      fetchProviderReviews(selectedProvider._id);
    }
  };

  // Function to fetch provider reviews
  const fetchProviderReviews = async (provider_id) => {
    setLoadingReviews(true);
    try {
      const response = await getProviderReviews(provider_id);
      setProviderReviews(response.data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      showToast("Failed to load reviews", "error");
    } finally {
      setLoadingReviews(false);
    }
  };

  // Modified function to handle login prompt
  const handleSelectService = async (serviceName) => {
    setSelectedService(serviceName);
    setProviders([]);
    setError("");

    // Check if user is logged in
    if (!isLoggedIn) {
      setError("login_required");
      return;
    }

    try {
      const res = await getProviders({ service_type: serviceName });
      setProviders(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load providers. Please try again.");
    }
  };

  const handleNavigateToLogin = () => {
    navigate("/login", {
      state: { from: "/services", selectedService: selectedService },
    });
  };

  const handleOpenRequestDialog = (provider) => {
    if (!isLoggedIn) {
      showToast("Please log in to request a service", "warning");
      navigate("/login", { state: { from: "/services" } });
      return;
    }

    setSelectedProvider(provider);
    setOpenRequestDialog(true);
    setTabValue(0); // Reset to first tab when opening
    setProviderReviews([]); // Clear previous reviews
    setBookedShifts([]); // Clear previously booked shifts
    setBookingError(""); // Clear any booking errors
    setRequestForm({
      description: "",
      appointmentDate: "",
      shift: "",
      location: "",
      payment_method: "Cash",
    });
  };

  useEffect(() => {
    if (openRequestDialog && selectedProvider && requestForm.appointmentDate) {
      fetchBookedShifts();
    }
  }, [openRequestDialog, selectedProvider, requestForm.appointmentDate]);

  const fetchBookedShifts = async () => {
    setLoadingBookedShifts(true);
    try {
      const res = await getBookedShifts(
        selectedProvider._id,
        requestForm.appointmentDate
      );
      setBookedShifts(res.data.booked_shifts || []);
    } catch (err) {
      console.error("Error fetching booked shifts:", err);
      showToast("Failed to fetch booked shifts.", "error");
    } finally {
      setLoadingBookedShifts(false);
    }
  };

  const handleCloseRequestDialog = () => {
    setOpenRequestDialog(false);
    setSelectedProvider(null);
  };

  const handleRequestFormChange = (e) => {
    // Reset the shift selection if date changes to prevent selection of shifts
    // before checking availability
    if (
      e.target.name === "appointmentDate" &&
      e.target.value !== requestForm.appointmentDate
    ) {
      setRequestForm({
        ...requestForm,
        [e.target.name]: e.target.value,
        shift: "",
      });
    } else {
      setRequestForm({
        ...requestForm,
        [e.target.name]: e.target.value,
      });
    }

    // Clear booking error when form values change
    if (bookingError) {
      setBookingError("");
    }
  };

  const handleSubmitRequest = async () => {
    setBookingError("");
    const { description, appointmentDate, shift, location, payment_method } =
      requestForm;

    if (
      !description ||
      !appointmentDate ||
      !shift ||
      !location ||
      !payment_method
    ) {
      showToast("Please fill out all required fields.", "error");
      return;
    }

    if (!shift.includes(" - ")) {
      showToast("Invalid shift format.", "error");
      return;
    }

    if (bookedShifts.includes(shift)) {
      setBookingError(
        "This shift is already booked by another user. Please select a different time."
      );
      showToast(
        "This shift is already booked. Please choose another.",
        "error"
      );
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

      if (err.response?.status === 409) {
        const errorMessage =
          err.response?.data?.error ||
          "This shift is already booked by another user. Please select a different time.";
        setBookingError(errorMessage);
        showToast(errorMessage, "error");

        // Refresh the booked shifts to update UI
        try {
          const res = await getBookedShifts(
            selectedProvider._id,
            appointmentDate
          );
          setBookedShifts(res.data.booked_shifts || []);
        } catch (fetchErr) {
          console.error("Error refreshing booked shifts:", fetchErr);
        }
      } else {
        showToast("Failed to send request. Please try again.", "error");
      }
    }
  };

  // Calculate average rating
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  // Login prompt component
  const LoginPrompt = () => (
    <Box
      sx={{
        textAlign: "center",
        my: 4,
        p: 3,
        bgcolor: "#f5f5f5",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Please log in to view service providers
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        You need to be logged in to access the list of service providers
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleNavigateToLogin}
      >
        Log In
      </Button>
    </Box>
  );

  // Get tooltip message based on shift status
  const getShiftStatusMessage = (label) => {
    if (bookedShifts.includes(label)) {
      return "This shift is already booked by another user";
    }
    return "";
  };

  return (
    <>
      {/* Your existing JSX components */}
      <Navbar />
      {/* Hero section and services grid */}
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
                <CardMedia
                  component="img"
                  height="140"
                  image={service.image}
                  alt={service.name}
                />
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

            {error === "login_required" ? (
              <LoginPrompt />
            ) : (
              <>
                {error && error !== "login_required" && (
                  <Typography color="error" gutterBottom>
                    {error}
                  </Typography>
                )}
                <Grid container spacing={3}>
                  {providers.map((provider) => (
                    <Grid item xs={12} sm={6} md={4} key={provider._id}>
                      {/* New Provider Card Design */}
                      <Card
                        sx={{
                          borderRadius: 3,
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          // backgroundColor: '#FEF9F3',
                          overflow: "visible",
                          position: "relative",
                          p: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "center", sm: "flex-start" },
                          }}
                        >
                          {/* Avatar */}
                          <Avatar
                            sx={{
                              width: 100,
                              height: 100,
                              mb: { xs: 2, sm: 0 },
                              mr: { xs: 0, sm: 3 },
                            }}
                            alt={provider.name}
                            src={provider.profile_picture}
                          >
                            {provider.name?.charAt(0).toUpperCase() || "P"}
                          </Avatar>

                          {/* Provider Info */}
                          <Box sx={{ flex: 1, textAlign: "left", mt: 1 }}>
                            <Typography
                              variant="h5"
                              component="div"
                              sx={{ fontWeight: "bold", mb: 0.5 }}
                            >
                              {provider.name}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              {provider.email || "provider@servicebuddy.com"}
                            </Typography>

                            <Rating
                              value={
                                providerReviews && providerReviews.length > 0
                                  ? calculateAverageRating(providerReviews)
                                  : 0
                              }
                              precision={0.5}
                              readOnly
                            />

                            <Typography
                              variant="body1"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 0.5,
                              }}
                            >
                              <strong>Location:</strong>{" "}
                              {provider.location || "Not Added Yet"}
                            </Typography>

                            <Typography
                              variant="body1"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 0.5,
                              }}
                            >
                              <strong>Contact No: </strong>{" "}
                              {provider.phone_num || "Not Added Yet"}
                            </Typography>

                            <Typography
                              variant="body1"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 0.5,
                              }}
                            >
                              <strong>Rate Per Hour:</strong> रु
                              {provider.rate_per_hour || "30"}
                            </Typography>

                            <Typography
                              variant="body1"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                              }}
                            >
                              <strong>Experience:</strong>{" "}
                              {provider.experience
                                ? `${provider.experience} Years`
                                : "No added yet"}
                            </Typography>

                            <Typography variant="body1" sx={{ mb: 0.5 }}>
                              <strong>Availability:</strong>
                            </Typography>

                            <Typography variant="body2" sx={{ mb: 2 }}>
                              {provider.available_time &&
                              provider.available_time.length > 0
                                ? provider.available_time.map(
                                    (shift, index) => (
                                      <div key={index}>
                                        {shift.day || "Mon-Fri"}:{" "}
                                        {shift.start_time || "9:00am"} -{" "}
                                        {shift.end_time || "3:00pm"}
                                      </div>
                                    )
                                  )
                                : "Mon - Fri: 9:00am - 3:00pm"}
                            </Typography>

                            <Button
                              variant="contained"
                              onClick={() => handleOpenRequestDialog(provider)}
                            >
                              Book Now
                            </Button>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                  {!providers.length && !error && (
                    <Typography sx={{ mt: 2 }}>
                      No providers found for {selectedService}.
                    </Typography>
                  )}
                </Grid>
              </>
            )}
          </Box>
        )}
      </Box>

      <Footer />

      {/* Request Provider Dialog with Tabs */}
      <Dialog
        open={openRequestDialog}
        onClose={handleCloseRequestDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {selectedProvider?.name}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Request Service" />
            <Tab label="Reviews" />
          </Tabs>
        </DialogTitle>

        <DialogContent>
          {/* Request Service Tab */}
          <TabPanel value={tabValue} index={0}>
            {bookingError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {bookingError}
              </Alert>
            )}

            <Box display="flex" flexDirection="column" gap={1}>
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
                select
                label="Payment After Completion of Service"
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

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Select a Shift
                </Typography>

                {requestForm.appointmentDate ? (
                  loadingBookedShifts ? (
                    <Box display="flex" justifyContent="center" my={2}>
                      <CircularProgress size={24} />
                      <Typography variant="body2" ml={2}>
                        Checking availability...
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {selectedProvider?.available_time?.map(
                          (shift, index) => {
                            const label = `${shift.start_time} - ${shift.end_time}`;
                            const isBooked = bookedShifts.includes(label);
                            const isSelected = requestForm.shift === label;

                            return (
                              <Button
                                key={index}
                                variant={isSelected ? "contained" : "outlined"}
                                onClick={() =>
                                  !isBooked &&
                                  setRequestForm((prev) => ({
                                    ...prev,
                                    shift: label,
                                  }))
                                }
                                disabled={isBooked}
                                title={getShiftStatusMessage(label)}
                                sx={{
                                  border: "2px solid",
                                  borderColor: isBooked ? "red" : "green",
                                  color: isBooked ? "red" : "green",
                                  backgroundColor: isSelected
                                    ? isBooked
                                      ? "rgba(255, 0, 0, 0.1)"
                                      : "rgba(0, 128, 0, 0.1)"
                                    : "transparent",
                                  minWidth: 150,
                                  textTransform: "none",
                                  cursor: isBooked ? "not-allowed" : "pointer",
                                  "&:hover": {
                                    backgroundColor: isBooked
                                      ? "rgba(255, 0, 0, 0.05)"
                                      : "rgba(0, 128, 0, 0.1)",
                                    borderColor: isBooked ? "red" : "darkgreen",
                                  },
                                }}
                              >
                                {label} {isBooked ? "(Booked)" : ""}
                              </Button>
                            );
                          }
                        )}
                      </Box>

                      {bookedShifts.length > 0 && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                          Some shifts are already booked by other users for this
                          date. Please select an available time slot.
                        </Alert>
                      )}
                    </>
                  )
                ) : (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    Please select an appointment date to see available time
                    slots.
                  </Alert>
                )}
              </Box>
            </Box>
          </TabPanel>

          {/* Reviews Tab */}
          <TabPanel value={tabValue} index={1}>
            {loadingReviews ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="h6" mr={2}>
                    Average Rating:
                  </Typography>
                  <Rating
                    value={calculateAverageRating(providerReviews)}
                    precision={0.5}
                    readOnly
                  />
                  <Typography variant="body1" ml={1}>
                    ({providerReviews.length}{" "}
                    {providerReviews.length === 1 ? "review" : "reviews"})
                  </Typography>
                </Box>

                {providerReviews.length > 0 ? (
                  providerReviews.map((review, index) => (
                    <Box key={review._id || index} mb={2}>
                      <Box display="flex" alignItems="flex-start">
                        {/* Profile Picture */}
                        <Box mr={2}>
                          <Avatar
                            src={review.profile_picture || undefined}
                            alt={review.user_name}
                            sx={{ width: 50, height: 50 }}
                          >
                            {review.user_name?.charAt(0).toUpperCase() || "U"}
                          </Avatar>
                        </Box>

                        {/* Review Content */}
                        <Box flex={1}>
                          <Box display="flex" alignItems="center">
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              mr={1}
                            >
                              {review.user_name}
                            </Typography>
                            <Rating
                              value={review.rating}
                              readOnly
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(review.created_at).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body1" mt={1}>
                            {review.review}
                          </Typography>
                        </Box>
                      </Box>
                      {index < providerReviews.length - 1 && (
                        <Divider sx={{ mt: 2 }} />
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body1">
                    No reviews available for this provider.
                  </Typography>
                )}
              </Box>
            )}
          </TabPanel>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseRequestDialog}>Cancel</Button>
          {tabValue === 0 && (
            <Button
              variant="contained"
              onClick={handleSubmitRequest}
              disabled={
                loadingBookedShifts ||
                !requestForm.description ||
                !requestForm.appointmentDate ||
                !requestForm.shift ||
                !requestForm.location ||
                bookedShifts.includes(requestForm.shift)
              }
            >
              Send Request
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ServicesPage;
