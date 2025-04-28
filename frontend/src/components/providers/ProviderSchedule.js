// import React, { useState, useEffect, useContext } from 'react';
// import {
//   Box, Typography, AppBar, Toolbar, IconButton, Drawer,
//   Container, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Paper, Select, MenuItem, Chip,
//   FormControl, InputLabel, TextField, CircularProgress
// } from '@mui/material';
// import { Menu as MenuIcon } from '@mui/icons-material';
// import { getProviderSchedule, updateBookingStatus } from '../../services/api';
// import { AuthContext } from '../../context/AuthContext';
// import Sidebar from '../common/Sidebar';
// import { useToast } from '../common/ToastProvider';

// const drawerWidth = 240;

// const statusColors = {
//   'accept': 'default',
//   'In Progress': 'warning',
//   'Completed': 'success',
//   'Not Completed': 'error'
// };
  

// const ProviderSchedule = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState('');
//   const [dateFilter, setDateFilter] = useState('');
//   const { user } = useContext(AuthContext);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const { showToast } = useToast();

//   const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const response = await getProviderSchedule();
//         setBookings(response.data || []);
//       } catch (error) {
//         console.error("Error fetching bookings:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, []);

//   const handleStatusChange = async (bookingId, newStatus) => {
//     try {
//       await updateBookingStatus(bookingId, newStatus);
//       setBookings(bookings.map(booking =>
//         booking._id === bookingId ? { ...booking, status: newStatus } : booking
//       ));
//       showToast(`Status updated to ${newStatus}`, 'success');
//     } catch (error) {
//       console.error("Error updating status:", error);
//       showToast("Failed to update status", 'error');
//     }
//   };

//   const filteredBookings = bookings.filter(booking => {
//     const matchStatus = statusFilter ? booking.status === statusFilter : true;
//     const matchDate = dateFilter ? new Date(booking.appointment_date).toISOString().slice(0, 10) === dateFilter : true;
//     return matchStatus && matchDate;
//   });

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ display: 'flex' }}>
//       {/* Top App Bar */}
//       <AppBar
//         position="fixed"
//         sx={{
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//           ml: { sm: `${drawerWidth}px` },
//           backgroundColor: '#1976d2'
//         }}
//       >
//         <Toolbar>
//           <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" noWrap>
//             Schedule
//           </Typography>
//           <Box sx={{ ml: 'auto', fontWeight: 'bold' }}>
//             {user ? `Mr. ${user.name}` : 'Loading...'}
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* Sidebar */}
//       <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="sidebar">
//         <Drawer
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{ keepMounted: true }}
//           sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
//         >
//           <Sidebar />
//         </Drawer>
//         <Drawer
//           variant="permanent"
//           sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
//           open
//         >
//           <Sidebar />
//         </Drawer>
//       </Box>

//       {/* Main Content */}
//       <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
//         <Container maxWidth="xl">
          
//           {/* Filters */}
//           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
//             <FormControl size="small" sx={{ minWidth: 150 }}>
//               <InputLabel>Status</InputLabel>
//               <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
//                 <MenuItem value="">All</MenuItem>
//                 {Object.keys(statusColors).map((status) => (
//                   <MenuItem key={status} value={status}>{status}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <TextField
//               size="small"
//               type="date"
//               label="Filter by Date"
//               InputLabelProps={{ shrink: true }}
//               value={dateFilter}
//               onChange={(e) => setDateFilter(e.target.value)}
//             />
//           </Box>

//           {/* Table */}
//           {filteredBookings.length === 0 ? (
//             <Typography>No Requests were accpeted to appear here.</Typography>
//           ) : (
//             <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell><strong>Customer</strong></TableCell>
//                     <TableCell><strong>Service</strong></TableCell>
//                     <TableCell><strong>Date</strong></TableCell>
//                     <TableCell><strong>Time Slot</strong></TableCell>
//                     <TableCell><strong>Location</strong></TableCell>
//                     <TableCell><strong>Status</strong></TableCell>
//                     <TableCell><strong>Change Status</strong></TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {filteredBookings.map((booking) => (
//                     <TableRow key={booking._id}>
//                       <TableCell>{booking.user_name || 'Unknown'}</TableCell>
//                       <TableCell>{booking.description}</TableCell>
//                       <TableCell>{new Date(booking.appointment_date).toLocaleDateString()}</TableCell>
//                       <TableCell>
//                         {booking.shift_start_time && booking.shift_end_time
//                           ? `${booking.shift_start_time} - ${booking.shift_end_time}`
//                           : '-'}
//                       </TableCell>
//                       <TableCell>{booking.location}</TableCell>
//                       <TableCell>
//                         <Chip
//                           label={booking.status || 'Not Started'}
//                           color={statusColors[booking.status] || 'default'}
//                           size="small"
//                           variant="filled"
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Select
//                           value={booking.status || ""}
//                           onChange={(e) => handleStatusChange(booking._id, e.target.value)}
//                           displayEmpty
//                           size="small"
//                           sx={{ minWidth: 120 }}
//                         >
//                           {Object.keys(statusColors).map((status) => (
//                             <MenuItem key={status} value={status}>{status}</MenuItem>
//                           ))}
//                         </Select>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}
//         </Container>
//       </Box>
//     </Box>
//   );
// };

// export default ProviderSchedule;

// with bill generation
import React, { useState, useEffect, useContext } from 'react';
import {
  Box, Typography, AppBar, Toolbar, IconButton, Drawer,
  Container, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Select, MenuItem, Chip,
  FormControl, InputLabel, TextField, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { getProviderSchedule, updateBookingStatus } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../common/Sidebar';
import { useToast } from '../common/ToastProvider';

const drawerWidth = 240;

const statusColors = {
  'accept': 'default',
  'In Progress': 'warning',
  'Completed': 'success',
  'Not Completed': 'error'
};

const ProviderSchedule = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const { user } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { showToast } = useToast();

  // Dialog States
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedNewStatus, setSelectedNewStatus] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getProviderSchedule();
        setBookings(response.data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleStatusChange = (bookingId, newStatus) => {
    if (newStatus === 'Completed') {
      setSelectedBookingId(bookingId);
      setSelectedNewStatus(newStatus);
      setConfirmDialogOpen(true);
    } else {
      updateBookingStatusHandler(bookingId, newStatus);
    }
  };

  const updateBookingStatusHandler = async (bookingId, newStatus) => {
    try {
      setConfirmLoading(true);
      // Call API to update status
      await updateBookingStatus(bookingId, newStatus);
      
      // Update local state
      setBookings(bookings.map(booking =>
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      ));
      
      showToast(`Status updated to ${newStatus}`, 'success');
      
      if (newStatus === 'Completed') {
        // If status is Completed, inform user that bill has been generated
        showToast('Service completed! Bill has been generated and sent via email.', 'success');
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showToast("Failed to update status", 'error');
    } finally {
      setConfirmLoading(false);
      setConfirmDialogOpen(false);
    }
  };

  const handleConfirm = () => {
    updateBookingStatusHandler(selectedBookingId, selectedNewStatus);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchStatus = statusFilter ? booking.status === statusFilter : true;
    const matchDate = dateFilter ? new Date(booking.appointment_date).toISOString().slice(0, 10) === dateFilter : true;
    return matchStatus && matchDate;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Top App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: '#1976d2'
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Schedule
          </Typography>
          <Box sx={{ ml: 'auto', fontWeight: 'bold' }}>
            {user ? `Mr. ${user.name}` : 'Loading...'}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="sidebar">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
        >
          <Sidebar />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
          open
        >
          <Sidebar />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Container maxWidth="xl">
          
          {/* Filters */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                <MenuItem value="">All</MenuItem>
                {Object.keys(statusColors).map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              size="small"
              type="date"
              label="Filter by Date"
              InputLabelProps={{ shrink: true }}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </Box>

          {/* Table */}
          {filteredBookings.length === 0 ? (
            <Typography>No Requests were accepted to appear here.</Typography>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Customer</strong></TableCell>
                    <TableCell><strong>Service</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Time Slot</strong></TableCell>
                    <TableCell><strong>Location</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Change Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>{booking.user_name || 'Unknown'}</TableCell>
                      <TableCell>{booking.description}</TableCell>
                      <TableCell>{new Date(booking.appointment_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {booking.shift_start_time && booking.shift_end_time
                          ? `${booking.shift_start_time} - ${booking.shift_end_time}`
                          : '-'}
                      </TableCell>
                      <TableCell>{booking.location}</TableCell>
                      <TableCell>
                        <Chip
                          label={booking.status || 'Not Started'}
                          color={statusColors[booking.status] || 'default'}
                          size="small"
                          variant="filled"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={booking.status || ""}
                          onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                          displayEmpty
                          size="small"
                          sx={{ minWidth: 120 }}
                        >
                          {Object.keys(statusColors).map((status) => (
                            <MenuItem key={status} value={status}>{status}</MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Container>
      </Box>

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => !confirmLoading && setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Completion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to mark this booking as "Completed"? This will automatically generate a bill and send it via email to both you and the customer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} disabled={confirmLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="primary"
            disabled={confirmLoading}
          >
            {confirmLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProviderSchedule;