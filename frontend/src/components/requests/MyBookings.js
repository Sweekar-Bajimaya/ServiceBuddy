// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Paper,
//   TableContainer,
//   CircularProgress,
// } from "@mui/material";
// import { getMyBookings } from "../../services/api";
// import Navbar from "../common/Navbar";
// import ReviewForm from "../common/ReviewForm";

// const MyBookings = () => {
//   const [loading, setLoading] = useState(true);
//   const [bookings, setBookings] = useState([]);

//   const fetchBookings = async () => {
//     try {
//       const res = await getMyBookings();
//       const sorted = res.data.sort(
//         (a, b) => new Date(b.created_at) - new Date(a.created_at)
//       );
//       setBookings(sorted);
//     } catch (err) {
//       console.error("Failed to fetch bookings:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <>
//       <Navbar transparent={false} />
//       <Box sx={{ p: 4, mt: 8 }}>
//         <Typography variant="h5" gutterBottom>
//           My Bookings
//         </Typography>

//         <TableContainer component={Paper} sx={{ mt: 3 }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Request ID</TableCell>
//                 <TableCell>Provider Name</TableCell>
//                 <TableCell>Service</TableCell>
//                 <TableCell>Appointment Date</TableCell>
//                 <TableCell>Time Shift</TableCell>
//                 <TableCell>Payment Method</TableCell>
//                 <TableCell>Status</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {bookings.map((booking) => (
//                 <TableRow key={booking.request_id}>
//                   <TableCell>{booking.request_id}</TableCell>
//                   <TableCell>{booking.provider_name || "Unknown"}</TableCell>
//                   <TableCell>{booking.requested_service}</TableCell>
//                   <TableCell>{booking.appointment_date}</TableCell>
//                   <TableCell>{booking.time_shift || "N/A"}</TableCell>
//                   <TableCell>{booking.payment_method}</TableCell>
//                   <TableCell>{booking.status}</TableCell>
//                 </TableRow>
//               ))}
//               {bookings.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center">
//                     No bookings found.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     </>
//   );
// };

// export default MyBookings;

// Review Form Component
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { getMyBookings } from "../../services/api";
import Navbar from "../common/Navbar";
import ReviewForm from "../common/ReviewForm";

const MyBookings = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await getMyBookings();
      const sorted = res.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setBookings(sorted);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenDialog = (booking) => {
    setSelectedBooking(booking);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedBooking(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar transparent={false} />
      <Box sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          My Bookings
        </Typography>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Request ID</TableCell>
                <TableCell>Provider Name</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Appointment Date</TableCell>
                <TableCell>Time Shift</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Review</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.request_id}>
                  <TableCell>{booking.request_id}</TableCell>
                  <TableCell>{booking.provider_name || "Unknown"}</TableCell>
                  <TableCell>{booking.requested_service}</TableCell>
                  <TableCell>{booking.appointment_date}</TableCell>
                  <TableCell>{booking.time_shift || "N/A"}</TableCell>
                  <TableCell>{booking.payment_method}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                  <TableCell>
                    {booking.status === "Completed" ? (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenDialog(booking)}
                      >
                        Give Review
                      </Button>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No bookings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Review Dialog */}
      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Give a Review</DialogTitle>
        <DialogContent dividers>
          {selectedBooking && (
            <ReviewForm
              booking={selectedBooking}
              userId={selectedBooking.user_id}
              onReviewSubmitted={() => {
                handleCloseDialog();
                fetchBookings();
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MyBookings;
