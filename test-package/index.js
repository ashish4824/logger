const express = require('express');
const winston = require('winston');

// Create formatters
const { combine, timestamp, json, printf, colorize } = winston.format;

// Create a custom format for console output
const consoleFormat = printf(({ timestamp, level, message, ...data }) => {
  return `[${timestamp}] ${level}: ${message} ${Object.keys(data).length ? JSON.stringify(data, null, 2) : ''}`;
});

// Create the logger with only console transport
const logger = winston.createLogger({
  transports: [
    // Console transport with custom format
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
        consoleFormat
      )
    })
  ]
});

// Initialize Express
const app = express();
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('API Request', {
      method: req.method,
      path: req.path,
      duration,
      statusCode: res.statusCode,
      userAgent: req.get('user-agent'),
      requestId: req.get('x-request-id') || 'N/A'
    });
  });
  next();
});

// Test Routes

// GET endpoint
app.get('/api/test', (req, res) => {
  logger.info('Processing GET request', { endpoint: '/api/test' });
  res.json({ message: 'GET request successful' });
});

// POST endpoint with error simulation
app.post('/api/test', (req, res) => {
  try {
    logger.info('Processing POST request', { 
      endpoint: '/api/test',
      body: req.body
    });
    
    // Simulate an error for testing
    if (!req.body.data) {
      throw new Error('Missing required data field');
    }
    
    res.json({ 
      message: 'POST request successful',
      data: req.body.data
    });
  } catch (error) {
    logger.error('Error in POST request', {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      context: {
        endpoint: '/api/test',
        body: req.body
      }
    });
    res.status(400).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name
    },
    context: {
      path: req.path,
      method: req.method
    }
  });
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server started`, { port: PORT });
});
