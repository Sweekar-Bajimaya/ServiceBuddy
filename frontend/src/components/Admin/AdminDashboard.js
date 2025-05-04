// import React, { useState, useContext, useEffect } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Drawer,
//   Box,
//   IconButton,
//   Grid,
//   Card,
//   CardContent,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TextField,
//   Button,
//   CircularProgress,
// } from "@mui/material";
// import { Menu as MenuIcon } from "@mui/icons-material";
// import Sidebar from "../common/Sidebar";
// import { AuthContext } from "../../context/AuthContext";
// import { getAdminDashboardData } from "../../services/api";

// const drawerWidth = 240;

// const AdminDashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const { user } = useContext(AuthContext);
//   const [summary, setSummary] = useState({
//     total_providers: 0,
//     total_users: 0,
//     total_service_requests: 0,
//     total_bills: 0,
//   });

//   // Toggle the sidebar for mobile
//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   // Example data for the table
//   const ticketsData = [
//     { reference: "2025001", date: "January 1, 2025", lastUpdated: "January 3, 2025", subject: "Leaking Pipe in Kitchen", status: "Resolved", priority: "High" },
//     { reference: "2025002", date: "January 5, 2025", lastUpdated: "January 6, 2025", subject: "Electrical Short Circuit", status: "Pending", priority: "Medium" },
//     { reference: "2025003", date: "January 10, 2025", lastUpdated: "January 12, 2025", subject: "Laptop Repair", status: "In Progress", priority: "Low" },
//   ];

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const res = await getAdminDashboardData();
//         console.log(res.data);
//         setSummary(res.data);  // <- You missed this
//         setLoading(false);     // <- Also set loading to false
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//         setLoading(false);     // <- Important to avoid infinite spinner
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ display: "flex" }}>
//       {/* Topbar / AppBar */}
//       <AppBar
//         position="fixed"
//         sx={{
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//           ml: { sm: `${drawerWidth}px` },
//         }}
//       >
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             edge="start"
//             onClick={handleDrawerToggle}
//             sx={{ mr: 2, display: { sm: "none" } }}
//           >
//             <MenuIcon />
//           </IconButton>

//           {/* Left side: Admin Dashboard title */}
//           <Typography variant="h6" noWrap component="div">
//             Admin Dashboard
//           </Typography>

//           {/* Right side: user name, but not flush-right */}
//           <Box
//             sx={{
//               ml: "auto",           // push this Box to the right
//               mr: 4,                // add space from the right edge
//               display: "flex",
//               alignItems: "center",
//               gap: 2,               // spacing between items in the box
//             }}
//           >
//             {user?.name && (
//               <Typography variant="h6" sx={{ color: "inherit" }}>
//                 Mr.{user.name}
//               </Typography>
//             )}
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* Sidebar Drawer */}
//       <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="sidebar">
//         {/* Mobile Drawer */}
//         <Drawer
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{ keepMounted: true }}
//           sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}
//         >
//           <Sidebar />
//         </Drawer>

//         {/* Desktop Drawer */}
//         <Drawer variant="permanent" sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }} open>
//           <Sidebar />
//         </Drawer>
//       </Box>

//       {/* Main Content */}
//       <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
//         <Toolbar /> {/* Add space for the AppBar */}

//         {/* Summary Cards */}
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={3}>
//             <Card sx={{ backgroundColor: "#e3f2fd" }}>
//               <CardContent>
//                 <Typography variant="h6">Providers</Typography>
//                 <Typography variant="h4" color="primary">{summary.total_providers}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <Card sx={{ backgroundColor: "#e8f5e9" }}>
//               <CardContent>
//                 <Typography variant="h6">Users</Typography>
//                 <Typography variant="h4" color="success.main">{summary.total_users}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <Card sx={{ backgroundColor: "#fff8e1" }}>
//               <CardContent>
//                 <Typography variant="h6">Service Requests</Typography>
//                 <Typography variant="h4" color="warning.main">{summary.total_service_requests}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <Card sx={{ backgroundColor: "#ffebee" }}>
//               <CardContent>
//                 <Typography variant="h6">Bill</Typography>
//                 <Typography variant="h4" color="error.main">{summary.total_bills}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>

//         {/* Ticket Table */}
//         <Box sx={{ mt: 4 }}>
//           <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//             <TextField size="small" placeholder="Search here..." sx={{ width: 300 }} />
//             {/* <Button variant="contained">+ Submit a Ticket</Button> */}
//           </Box>

//           <Card>
//             <CardContent>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Reference #</TableCell>
//                     <TableCell>Date</TableCell>
//                     <TableCell>Last Updated</TableCell>
//                     <TableCell>Subject</TableCell>
//                     <TableCell>Status</TableCell>
//                     <TableCell>Priority</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {ticketsData.map((ticket) => (
//                     <TableRow key={ticket.reference}>
//                       <TableCell>{ticket.reference}</TableCell>
//                       <TableCell>{ticket.date}</TableCell>
//                       <TableCell>{ticket.lastUpdated}</TableCell>
//                       <TableCell>{ticket.subject}</TableCell>
//                       <TableCell>{ticket.status}</TableCell>
//                       <TableCell>{ticket.priority}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default AdminDashboard;
// import React, { useEffect, useState, useContext } from "react";
// import {
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   CircularProgress,
//   Box,
//   AppBar,
//   Toolbar,
//   IconButton,
//   Drawer,
//   Container,
//   Paper,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material";
// import {
//   Menu as MenuIcon,
//   TrendingUp,
//   People,
//   Person,
//   Receipt,
//   ListAlt,
// } from "@mui/icons-material";
// import Sidebar from "../common/Sidebar"; // Adjust this import based on your file structure
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   CartesianGrid,
//   LabelList,
// } from "recharts";
// import { getAdminDashboardData, getAdminChartData } from "../../services/api";
// import { AuthContext } from "../../context/AuthContext";

// const drawerWidth = 240;
// const COLORS = [
//   "#0088FE",
//   "#00C49F",
//   "#FFBB28",
//   "#FF8042",
//   "#AA336A",
//   "#7C4DFF",
// ];

// const AdminDashboard = () => {
//   const [summary, setSummary] = useState({
//     total_users: 0,
//     total_providers: 0,
//     total_service_requests: 0,
//     total_bills: 0,
//   });
//   const [chartData, setChartData] = useState({
//     requests_per_day: [],
//     status_over_time: [],
//     payment_distribution: {},
//     location_distribution: {},
//   });
//   const [loading, setLoading] = useState(true);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
//   const { user } = useContext(AuthContext); // Assuming you have a context for user authentication

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         const [dashboardRes, chartRes] = await Promise.all([
//           getAdminDashboardData(),
//           getAdminChartData(),
//         ]);

//         setSummary(dashboardRes.data);
//         setChartData(chartRes.data);
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   // Transform payment distribution for pie chart
//   const paymentData = Object.entries(chartData.payment_distribution || {}).map(
//     ([name, value]) => ({
//       name: name || "Unknown",
//       value,
//     })
//   );

//   // Transform location distribution for bar chart
//   const locationData = Object.entries(
//     chartData.location_distribution || {}
//   ).map(([location, count]) => ({
//     location: location.charAt(0).toUpperCase() + location.slice(1),
//     count: count || 0,
//   }));

//   const SummaryCard = ({ title, value, icon, color }) => (
//     <Card sx={{ height: "100%", boxShadow: 3, borderRadius: 2 }}>
//       <CardContent>
//         <Box display="flex" alignItems="center" mb={1}>
//           <Box
//             display="flex"
//             bgcolor={`${color}.light`}
//             p={1}
//             borderRadius={1}
//             mr={2}
//           >
//             {icon}
//           </Box>
//           <Typography variant="h6" color="textSecondary">
//             {title}
//           </Typography>
//         </Box>
//         <Typography variant="h4" component="div" fontWeight="bold">
//           {value}
//         </Typography>
//       </CardContent>
//     </Card>
//   );

//   if (loading) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         minHeight="100vh"
//       >
//         <CircularProgress size={60} />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ display: "flex" }}>
//       {/* AppBar */}
//       <AppBar
//         position="fixed"
//         sx={{
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//           ml: { sm: `${drawerWidth}px` },
//           bgcolor: "white",
//           color: "text.primary",
//           boxShadow: 1,
//         }}
//       >
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             edge="start"
//             onClick={handleDrawerToggle}
//             sx={{ mr: 2, display: { sm: "none" } }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" noWrap fontWeight="bold">
//             Admin Dashboard
//           </Typography>
//           <Box sx={{ ml: "auto", mr: 4 }}>
//             <Typography variant="h6">Mr. {user.name}</Typography>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* Sidebar */}
//       <Box
//         component="nav"
//         sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
//       >
//         <Drawer
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{ keepMounted: true }}
//           sx={{
//             display: { xs: "block", sm: "none" },
//             "& .MuiDrawer-paper": { width: drawerWidth },
//           }}
//         >
//           <Sidebar />
//         </Drawer>
//         <Drawer
//           variant="permanent"
//           sx={{
//             display: { xs: "none", sm: "block" },
//             "& .MuiDrawer-paper": { width: drawerWidth },
//           }}
//           open
//         >
//           <Sidebar />
//         </Drawer>
//       </Box>

//       {/* Main Content */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//           bgcolor: "#f5f5f5",
//           minHeight: "100vh",
//         }}
//       >
//         <Toolbar />
//         <Container maxWidth="xl">
//           {/* Summary Cards */}
//           <Grid container spacing={3} mb={4}>
//             <Grid item xs={12} sm={6} md={3}>
//               <SummaryCard
//                 title="Total Users"
//                 value={summary.total_users}
//                 icon={<People sx={{ color: "primary.main" }} />}
//                 color="primary"
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <SummaryCard
//                 title="Total Providers"
//                 value={summary.total_providers}
//                 icon={<Person sx={{ color: "success.main" }} />}
//                 color="success"
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <SummaryCard
//                 title="Service Requests"
//                 value={summary.total_service_requests}
//                 icon={<ListAlt sx={{ color: "warning.main" }} />}
//                 color="warning"
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <SummaryCard
//                 title="Total Bills"
//                 value={summary.total_bills}
//                 icon={<Receipt sx={{ color: "info.main" }} />}
//                 color="info"
//               />
//             </Grid>
//           </Grid>

//           {/* Charts */}
//           <Grid container spacing={3}>
//             {/* Requests Per Day Chart */}
//             <Grid item xs={12} md={8}>
//               <Paper
//                 sx={{ p: 3, borderRadius: 2, boxShadow: 2, height: "100%" }}
//               >
//                 <Typography variant="h6" mb={3} fontWeight="medium">
//                   Service Requests Per Day (Last 7 Days)
//                 </Typography>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={chartData.requests_per_day}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis
//                       dataKey="date"
//                       label={{
//                         value: "Date",
//                         position: "insideBottom",
//                         offset: -5,
//                       }}
//                     />
//                     <YAxis
//                       label={{
//                         value: "Request Count",
//                         angle: -90,
//                         position: "insideLeft",
//                       }}
//                     />

//                     <Tooltip />
//                     <Legend />
//                     <Bar
//                       dataKey="count"
//                       fill="#1976d2"
//                       name="Service Requests"
//                     />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </Paper>
//             </Grid>

//             {/* Payment Method Distribution */}
//             <Grid item xs={12} md={4}>
//               <Paper
//                 sx={{ p: 3, borderRadius: 2, boxShadow: 2, height: "100%" }}
//               >
//                 <Typography variant="h6" mb={2} fontWeight="medium">
//                   Payment Method Distribution
//                 </Typography>
//                 <Box display="flex" justifyContent="center">
//                   <ResponsiveContainer width="100%" height={280}>
//                     <PieChart>
//                       <Pie
//                         data={paymentData}
//                         dataKey="value"
//                         nameKey="name"
//                         cx="50%"
//                         cy="50%"
//                         outerRadius={90}
//                         label={({ name, percent }) =>
//                           `${name}: ${(percent * 100).toFixed(0)}%`
//                         }
//                       >
//                         {paymentData.map((entry, index) => (
//                           <Cell
//                             key={`cell-${index}`}
//                             fill={COLORS[index % COLORS.length]}
//                           />
//                         ))}
//                       </Pie>
//                       <Tooltip
//                         formatter={(value) => [`${value} requests`, "Count"]}
//                       />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </Box>
//               </Paper>
//             </Grid>

//             {/* Status Over Time */}
//             <Grid item xs={12} md={8}>
//               <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
//                 <Typography variant="h6" mb={3} fontWeight="medium">
//                   Request Status Over Time
//                 </Typography>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <LineChart data={chartData.status_over_time}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis
//                       dataKey="date"
//                       label={{
//                         value: "Date",
//                         position: "insideBottom",
//                         offset: -5,
//                       }}
//                     />
//                     <YAxis
//                       label={{
//                         value: "Request Count",
//                         angle: -90,
//                         position: "insideLeft",
//                       }}
//                     />
//                     <Tooltip />
//                     <Legend />
//                     <Line
//                       type="monotone"
//                       dataKey="Completed"
//                       stroke="#00C49F"
//                       strokeWidth={2}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="Pending"
//                       stroke="#FFBB28"
//                       strokeWidth={2}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </Paper>
//             </Grid>

//             {/* Requests by Location */}
//             <Grid item xs={12} md={4}>
//               <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
//                 <Typography variant="h6" mb={3} fontWeight="medium">
//                   Requests by Location
//                 </Typography>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart
//                     data={locationData}
//                     layout={isSmallScreen ? "vertical" : "horizontal"}
//                     margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     {isSmallScreen ? (
//                       <>
//                         <XAxis
//                           type="number"
//                           label={{
//                             value: "Requests",
//                             position: "bottom",
//                             offset: 0,
//                           }}
//                         />
//                         <YAxis
//                           dataKey="location"
//                           type="category"
//                           width={100}
//                           label={{
//                             value: "Location",
//                             angle: -90,
//                             position: "insideLeft",
//                           }}
//                         />
//                       </>
//                     ) : (
//                       <>
//                         <XAxis
//                           dataKey="location"
//                           label={{
//                             value: "Location",
//                             position: "bottom",
//                             offset: 0,
//                           }}
//                         />
//                         <YAxis
//                           label={{
//                             value: "Requests",
//                             angle: -90,
//                             position: "insideLeft",
//                           }}
//                         />
//                       </>
//                     )}
//                     <Tooltip formatter={(value) => [`${value}`, "Requests"]} />
//                     <Bar dataKey="count" fill="#9c27b0" name="Request Count">
//                       <LabelList dataKey="count" position="top" />
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               </Paper>
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>
//     </Box>
//   );
// };

// export default AdminDashboard;

import React, { useEffect, useState, useContext } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  TrendingUp,
  People,
  Person,
  Receipt,
  ListAlt,
} from "@mui/icons-material";
import Sidebar from "../common/Sidebar"; // Adjust this import based on your file structure
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import { getAdminDashboardData, getAdminChartData } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

const drawerWidth = 240;
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AA336A",
  "#7C4DFF",
];

const AdminDashboard = () => {
  const [summary, setSummary] = useState({
    total_users: 0,
    total_providers: 0,
    total_service_requests: 0,
    total_bills: 0,
  });
  const [chartData, setChartData] = useState({
    requests_per_day: [],
    status_over_time: [],
    payment_distribution: {},
    location_distribution: [],
  });
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useContext(AuthContext); // Assuming you have a context for user authentication

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [dashboardRes, chartRes] = await Promise.all([
          getAdminDashboardData(),
          getAdminChartData(),
        ]);

        setSummary(dashboardRes.data);
        setChartData(chartRes.data);
        console.log("Chart data:", chartRes.data); // For debugging
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Transform payment distribution for pie chart
  const paymentData = Object.entries(chartData.payment_distribution || {}).map(
    ([name, value]) => ({
      name: name || "Unknown",
      value,
    })
  );

  const SummaryCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: "100%", boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <Box
            display="flex"
            bgcolor={`${color}.light`}
            p={1}
            borderRadius={1}
            mr={2}
          >
            {icon}
          </Box>
          <Typography variant="h6" color="textSecondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "white",
          color: "text.primary",
          boxShadow: 1,
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
          <Typography variant="h6" noWrap fontWeight="bold">
            Admin Dashboard
          </Typography>
          <Box sx={{ ml: "auto", mr: 4 }}>
            <Typography variant="h6">Mr. {user?.name || "Admin"}</Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          <Sidebar />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
          open
        >
          <Sidebar />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">
          {/* Summary Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Total Users"
                value={summary.total_users}
                icon={<People sx={{ color: "primary.main" }} />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Total Providers"
                value={summary.total_providers}
                icon={<Person sx={{ color: "success.main" }} />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Service Requests"
                value={summary.total_service_requests}
                icon={<ListAlt sx={{ color: "warning.main" }} />}
                color="warning"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Total Bills"
                value={summary.total_bills}
                icon={<Receipt sx={{ color: "info.main" }} />}
                color="info"
              />
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3}>
            {/* Requests Per Day Chart */}
            <Grid item xs={12} md={8}>
              <Paper
                sx={{ p: 3, borderRadius: 2, boxShadow: 2, height: "100%" }}
              >
                <Typography variant="h6" mb={3} fontWeight="medium">
                  Service Requests Per Day (Last 7 Days)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.requests_per_day}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      label={{
                        value: "Date",
                        position: "insideBottom",
                        offset: -5,
                      }}
                    />
                    <YAxis
                      label={{
                        value: "Request Count",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />

                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="count"
                      fill="#1976d2"
                      name="Service Requests"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Payment Method Distribution */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{ p: 3, borderRadius: 2, boxShadow: 2, height: "100%" }}
              >
                <Typography variant="h6" mb={2} fontWeight="medium">
                  Payment Method Distribution
                </Typography>
                <Box display="flex" justifyContent="center">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={paymentData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {paymentData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} requests`, "Count"]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Status Over Time */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="h6" mb={3} fontWeight="medium">
                  Request Status Over Time
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData.status_over_time}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      label={{
                        value: "Date",
                        position: "insideBottom",
                        offset: -5,
                      }}
                    />
                    <YAxis
                      label={{
                        value: "Request Count",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Completed"
                      stroke="#00C49F"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="Pending"
                      stroke="#FFBB28"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Requests by Location */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="h6" mb={3} fontWeight="medium">
                  Requests by Location
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  {isSmallScreen ? (
                    <BarChart 
                      data={chartData.location_distribution} 
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="location" 
                        type="category" 
                        width={80}
                      />
                      <Tooltip formatter={(value) => [`${value} requests`, "Count"]} />
                      <Legend />
                      <Bar dataKey="count" fill="#9c27b0" name="Requests">
                        <LabelList dataKey="count" position="right" />
                      </Bar>
                    </BarChart>
                  ) : (
                    <BarChart 
                      data={chartData.location_distribution}
                      margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="location" 
                        angle={-45} 
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} requests`, "Count"]} />
                      <Legend />
                      <Bar dataKey="count" fill="#9c27b0" name="Requests">
                        <LabelList dataKey="count" position="top" />
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;