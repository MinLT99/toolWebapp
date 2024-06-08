const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { json, urlencoded } = express;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Load routes
const userRoutes = require('./api/routes/userRoutes');
const crawlRoutes = require('./api/routes/crawlRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/crawl',crawlRoutes);

module.exports = app;

