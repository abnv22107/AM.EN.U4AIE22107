import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import GridOnIcon from '@mui/icons-material/GridOn';

function Navbar() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <ShowChartIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Stock Price Aggregation
          </Typography>
        </Box>
        <Button 
          color="inherit" 
          component={Link} 
          to="/" 
          startIcon={<ShowChartIcon />}
        >
          Stock Prices
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/correlation" 
          startIcon={<GridOnIcon />}
        >
          Correlation Heatmap
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;