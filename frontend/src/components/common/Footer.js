import React from 'react';
import { Box, Container, Typography, Grid, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        backgroundColor: '#B9B28A', 
        py: 3, 
        mt: 'auto' // Ensures footer is placed at the bottom if using flex layout
      }}
    >
      <Container>
        <Grid container spacing={2} alignItems="center">
          {/* Left Section */}
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              © {new Date().getFullYear()} ServiceBuddy
            </Typography>
          </Grid>
          
          {/* Right Section: Footer Links */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link 
                href="/aboutus" 
                variant="body2" 
                sx={{ color: 'inherit', mx: 1, textDecoration: 'none' }}
              >
                About Us
              </Link>
              <Link 
                href="/services" 
                variant="body2" 
                sx={{ color: 'inherit', mx: 1, textDecoration: 'none' }}
              >
                Services
              </Link>
              <Link 
                href="/contact" 
                variant="body2" 
                sx={{ color: 'inherit', mx: 1, textDecoration: 'none' }}
              >
                Contact
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;