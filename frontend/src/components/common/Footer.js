import React from 'react';
import { Box, Container, Typography, Grid, Link, Stack } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        backgroundColor: '#707171', 
        py: 3, 
        mt: 'auto',
        color: '#fff',
      }}
    >
      <Container>
        <Grid container spacing={2} alignItems="center">
          {/* Left Section */}
          <Grid item xs={12} sm={6} textAlign={{ xs: 'center', sm: 'left' }}>
            <Typography variant="body2">
              © {new Date().getFullYear()} ServiceBuddy
            </Typography>
          </Grid>
          
          {/* Right Section: Footer Links */}
          <Grid item xs={12} sm={6}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={1.5} 
              justifyContent={{ xs: 'center', sm: 'flex-end' }} 
              alignItems="center"
            >
              <Link 
                href="/aboutus" 
                variant="body2" 
                sx={{ color: 'inherit', textDecoration: 'none' }}
              >
                About Us
              </Link>
              <Link 
                href="/services" 
                variant="body2" 
                sx={{ color: 'inherit', textDecoration: 'none' }}
              >
                Services
              </Link>
              <Link 
                href="/contact" 
                variant="body2" 
                sx={{ color: 'inherit', textDecoration: 'none' }}
              >
                Contact
              </Link>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;