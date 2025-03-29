import React, { useState, useEffect } from "react";
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import { getAdminProviders } from "../../services/api";  // Import the function from api.js

const AdminProviderList = () => {
  const [providers, setProviders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await getAdminProviders();
        console.log("Providers Data Received:", data); // Debugging step
        setProviders(data);
      } catch (error) {
        setError("Error fetching providers. Please try again later.");
        console.error("Error fetching providers:", error);
      }
    };
  
    fetchProviders();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Service Providers
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Paper sx={{ width: "100%", overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Services Offered</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {providers.map((provider) => (
              <TableRow key={provider._id}>
                <TableCell>{provider.name}</TableCell>
                <TableCell>{provider.email}</TableCell>
                <TableCell>{provider.location}</TableCell>
                <TableCell>{provider.phone_num}</TableCell>
                <TableCell>
                  {Array.isArray(provider.services_offered)
                    ? provider.services_offered.join(", ")
                    : provider.services_offered}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default AdminProviderList;