const express = require('express');
const stockRoutes = require('./routes/stockRoutes');

const app = express();
app.use(express.json());

app.use('/', stockRoutes);

app.listen(3001, () => {
  console.log("Backend running at http://localhost:3001");
});
