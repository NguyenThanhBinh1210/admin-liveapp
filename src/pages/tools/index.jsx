import React from 'react';
import { Typography, Box, Card, CardContent } from '@mui/material';
import MainCard from 'components/MainCard';

const ToolsPage = () => {
  return (
    <MainCard title="Tools">
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Admin Tools
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Access various administrative tools and utilities.
        </Typography>
      </Box>
    </MainCard>
  );
};

export default ToolsPage; 