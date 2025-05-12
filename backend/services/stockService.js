const axios = require('axios');
const { getAccessToken } = require('./authService');

async function fetchStockPriceHistory(ticker, minutes) {
  const token = await getAccessToken();

  const url = `http://20.244.56.144/evaluation-service/stocks/${ticker}?minutes=${minutes}`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data;
}

module.exports = { fetchStockPriceHistory };
