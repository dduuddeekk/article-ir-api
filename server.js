const express = require('express');
require('dotenv').config();

const journalRoutes = require('./routes/journalsRoutes');

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(express.json());

app.use('/api', journalRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});