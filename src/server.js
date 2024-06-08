const http = require('http');
const app = require('./app');
const { dbConfig } = require('./config');

const PORT = process.env.PORT || 5000;

// dbConfig(); // Connect to MongoDB

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
