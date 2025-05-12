import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Paper,
  Grid,
  Tooltip as MUITooltip
} from '@mui/material';
import axios from 'axios';

function CorrelationHeatmap() {
  const [stocks, setStocks] = useState([]);
  const [minutes, setMinutes] = useState(50);
  const [correlationMatrix, setCorrelationMatrix] = useState([]);

  // Fetch available stocks
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/stocks`);
        const stockList = Object.entries(response.data.stocks).map(([name, ticker]) => ticker);
        setStocks(stockList);
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    };
    fetchStocks();
  }, []);

  // Fetch correlation data
  useEffect(() => {
    const fetchCorrelations = async () => {
      try {
        const correlations = [];
        for (let i = 0; i < stocks.length; i++) {
          const rowCorrelations = [];
          for (let j = 0; j < stocks.length; j++) {
            if (i === j) {
              rowCorrelations.push({ correlation: 1, details: null });
              continue;
            }
            
            try {
              const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_API_URL}/stockcorrelation?minutes=${minutes}&ticker=${stocks[i]}&ticker=${stocks[j]}`
              );
              rowCorrelations.push({
                correlation: response.data.correlation,
                details: response.data
              });
            } catch (error) {
              console.error(`Error fetching correlation between ${stocks[i]} and ${stocks[j]}:`, error);
              rowCorrelations.push({ correlation: 0, details: null });
            }
          }
          correlations.push(rowCorrelations);
        }
        setCorrelationMatrix(correlations);
      } catch (error) {
        console.error('Error fetching correlations:', error);
      }
    };

    if (stocks.length > 0) {
      fetchCorrelations();
    }
  }, [stocks, minutes]);

  // Color mapping for correlation values
  const getCorrelationColor = (correlation) => {
    if (correlation === 1) return 'rgba(0, 255, 0, 0.5)'; // Perfect positive correlation
    if (correlation > 0.5) return 'rgba(0, 255, 0, 0.3)'; // Strong positive correlation
    if (correlation > 0) return 'rgba(0, 255, 0, 0.1)'; // Weak positive correlation
    if (correlation === 0) return 'rgba(128, 128, 128, 0.1)'; // No correlation
    if (correlation > -0.5) return 'rgba(255, 0, 0, 0.1)'; // Weak negative correlation
    if (correlation > -1) return 'rgba(255, 0, 0, 0.3)'; // Strong negative correlation
    return 'rgba(255, 0, 0, 0.5)'; // Perfect negative correlation
  };

  const minutesOptions = [10, 30, 50, 60, 120];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Stock Correlation Heatmap
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Time Frame (minutes)</InputLabel>
          <Select
            value={minutes}
            label="Time Frame (minutes)"
            onChange={(e) => setMinutes(e.target.value)}
          >
            {minutesOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option} minutes
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper elevation={3} sx={{ p: 2, overflowX: 'auto' }}>
        <Grid container spacing={1}>
          {/* Header Row */}
          <Grid item xs={1}></Grid>
          {stocks.map((stock) => (
            <Grid key={stock} item xs={1} sx={{ textAlign: 'center' }}>
              <Typography variant="body2">{stock}</Typography>
            </Grid>
          ))}

          {/* Correlation Matrix */}
          {correlationMatrix.map((row, rowIndex) => (
            <Grid key={stocks[rowIndex]} container item xs={12}>
              <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', pr: 1 }}>
                <Typography variant="body2">{stocks[rowIndex]}</Typography>
              </Grid>
              {row.map((cell, colIndex) => (
                <Grid 
                  key={`${stocks[rowIndex]}-${stocks[colIndex]}`}
                  item 
                  xs={1} 
                  sx={{ 
                    backgroundColor: getCorrelationColor(cell.correlation),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 1,
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <MUITooltip
                    title={
                      cell.details ? (
                        <Box>
                          <Typography variant="body2">
                            Correlation: {cell.correlation.toFixed(4)}
                          </Typography>
                          <Typography variant="body2">
                            {stocks[rowIndex]} Avg Price: ${cell.details.stocks[stocks[rowIndex]].averagePrice.toFixed(2)}
                          </Typography>
                          <Typography variant="body2">
                            {stocks[colIndex]} Avg Price: ${cell.details.stocks[stocks[colIndex]].averagePrice.toFixed(2)}
                          </Typography>
                        </Box>
                      ) : (
                        'No correlation data available'
                      )
                    }
                    arrow
                    placement="top"
                  >
                    <Typography variant="body2" sx={{ cursor: 'help' }}>
                      {cell.correlation.toFixed(2)}
                    </Typography>
                  </MUITooltip>
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>

        {/* Color Legend */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 2 }}>Correlation Strength:</Typography>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ 
              width: 20, 
              height: 20, 
              backgroundColor: 'rgba(255, 0, 0, 0.5)', 
              mr: 1 
            }} />
            <Typography variant="body2" sx={{ mr: 2 }}>Strong Negative</Typography>
            <Box sx={{ 
              width: 20, 
              height: 20, 
              backgroundColor: 'rgba(128, 128, 128, 0.1)', 
              mr: 1 
            }} />
            <Typography variant="body2" sx={{ mr: 2 }}>No Correlation</Typography>
            <Box sx={{ 
              width: 20, 
              height: 20, 
              backgroundColor: 'rgba(0, 255, 0, 0.5)', 
              mr: 1 
            }} />
            <Typography variant="body2">Strong Positive</Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default CorrelationHeatmap;