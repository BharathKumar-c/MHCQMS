import React from 'react';
import { Typography, Paper, Box, Grid, Card, CardContent } from '@mui/material';
import { Queue, Person, Schedule } from '@mui/icons-material';

const Home = () => {
  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Welcome to MHCQMS
      </Typography>
      <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
        Master Health Checkup Queue Management System
      </Typography>
      
      <Box sx={{ mt: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Queue sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Queue Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Efficiently manage patient queues and appointments for health checkups.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Person sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Patient Care
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Streamlined patient registration and management system.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Schedule sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Scheduling
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Smart scheduling and appointment management for healthcare providers.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
