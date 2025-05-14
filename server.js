const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});