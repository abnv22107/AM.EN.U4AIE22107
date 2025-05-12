function calculateAverage(prices) {
  const total = prices.reduce((sum, item) => sum + item.price, 0);
  return total / prices.length;
}

function calculateCorrelation(xList, yList) {
  const n = Math.min(xList.length, yList.length);
  const x = xList.slice(0, n).map(item => item.price);
  const y = yList.slice(0, n).map(item => item.price);

  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  const numerator = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
  const denominatorX = Math.sqrt(x.reduce((sum, xi) => sum + (xi - meanX) ** 2, 0));
  const denominatorY = Math.sqrt(y.reduce((sum, yi) => sum + (yi - meanY) ** 2, 0));

  return numerator / (denominatorX * denominatorY);
}

module.exports = { calculateAverage, calculateCorrelation };
