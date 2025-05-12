import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Paper 
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import axios from 'axios';

function StockPage() {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState('NVDA');
  const [minutes, setMinutes] = useState(50);
  const [stockData, setStockData] = useState(null);

  // Fetch available stocks
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/stocks`);
        const stockList = Object.entries(response.data.stocks).map(([name, ticker]) => ({
          name,
          ticker
        }));
        setStocks(stockList);
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    };
    fetchStocks();
  }, []);

  // Fetch stock price data
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API_URL}/stocks/${selectedStock}?minutes=${minutes}`
        );
        
        // Calculate average price
        const averagePrice = response.data.reduce((sum, item) => sum + item.price, 0) / response.data.length;

        setStockData({
          prices: response.data.map(item => ({
            ...item,
            formattedTime: new Date(item.lastUpdatedAt).toLocaleTimeString()
          })),
          averagePrice
        });
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    if (selectedStock && minutes) {
      fetchStockData();
    }
  }, [selectedStock, minutes]);

  const minutesOptions = [10, 30, 50, 60, 120];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Stock Price Analysis
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Stock</InputLabel>
          <Select
            value={selectedStock}
            label="Stock"
            onChange={(e) => setSelectedStock(e.target.value)}
          >
            {stocks.map((stock) => (
              <MenuItem key={stock.ticker} value={stock.ticker}>
                {stock.ticker} - {stock.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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

      {stockData && (
        <Paper elevation={3} sx={{ p: 2, height: 500 }}>
          <Typography variant="h6" gutterBottom>
            {selectedStock} - Average Price: ${stockData.averagePrice.toFixed(2)}
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={stockData.prices}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedTime" />
              <YAxis 
                label={{ 
                  value: 'Price ($)', 
                  angle: -90, 
                  position: 'insideLeft' 
                }} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#333', color: '#fff' }}
                formatter={(value, name) => [
                  `$${parseFloat(value).toFixed(2)}`, 
                  name
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey={() => stockData.averagePrice} 
                name="Average Price" 
                stroke="#82ca9d" 
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      )}
    </Container>
  );
}

export default StockPage;