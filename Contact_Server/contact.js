const express = require('express');
const cors = require('cors');
const contactRouter = require('./routes/contact');
const app = express();

app.use(cors());
app.use(cors({ origin: process.env.VITE_FRONTEND_URL || "*" }));
app.use(express.json());4

// Contact management endpoints
app.use('/api/contact', contactRouter);

app.listen(2000, () => console.log('Server running on port 2000'));
