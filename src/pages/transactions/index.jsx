import React from 'react';
import { Typography, Box, Card, CardContent } from '@mui/material';
import MainCard from 'components/MainCard';

const TransactionsPage = () => {
  return (
    <MainCard title="Transactions">
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Transaction History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all financial transactions.
        </Typography>
      </Box>
    </MainCard>
  );
};

export default TransactionsPage; 