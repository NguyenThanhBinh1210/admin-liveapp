import React from 'react';
import { Typography, Box, Card, CardContent } from '@mui/material';
import MainCard from 'components/MainCard';

const ModerationPage = () => {
  return (
    <MainCard title="Moderation">
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Content Moderation
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage content moderation settings and reports.
        </Typography>
      </Box>
    </MainCard>
  );
};

export default ModerationPage; 