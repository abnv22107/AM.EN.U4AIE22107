const express = require('express');
const router = express.Router();
const { fetchStockPriceHistory } = require('../services/stockService');
const { calculateAverage, calculateCorrelation } = require('../utils/mathUtils');

router.get('/stocks/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const { minutes, aggregation } = req.query;

    const data = await fetchStockPriceHistory(ticker, minutes);
    const average = calculateAverage(data);

    res.json({
      averageStockPrice: average,
      priceHistory: data
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error fetching stock data");
  }
});

router.get('/stockcorrelation', async (req, res) => {
  try {
    const { minutes, ticker: tickers } = req.query;
    if (!Array.isArray(tickers) || tickers.length !== 2)
      return res.status(400).send("Only two tickers allowed");

    const [ticker1, ticker2] = tickers;
    const [data1, data2] = await Promise.all([
      fetchStockPriceHistory(ticker1, minutes),
      fetchStockPriceHistory(ticker2, minutes)
    ]);

    const correlation = calculateCorrelation(data1, data2);
    const avg1 = calculateAverage(data1);
    const avg2 = calculateAverage(data2);

    res.json({
      correlation,
      stocks: {
        [ticker1]: { averagePrice: avg1, priceHistory: data1 },
        [ticker2]: { averagePrice: avg2, priceHistory: data2 }
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error computing correlation");
  }
});

module.exports = router;
