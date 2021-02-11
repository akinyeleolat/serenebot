require('dotenv').config();
require('./config/database');
const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const cors = require('./utils/cors');
const circuitBreaker = require('./utils/circuitBreaker');
const rateLimiter = require('./middlewares/rateLimiter');

const app = express();
const events = require('./bots/events');
const interactions = require('./bots/interactions');
const slashCommand = require('./bots/slashCommand');

const { environment } = require('./config/app');
const records = require('./routes/v1');

app.use(cors);

if (environment === 'production') {
  app.use(compression());
  app.use(helmet());
}

// Handle cases where invalid JSON data is passed
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    res.json({
      status: 'error',
      message: `invalid JSON '${err.body}' passed`,
    });
  } else {
    next();
  }
});

// circuit breaker for Requests that take longer than 25 secs
app.use(circuitBreaker);

app.get('/', (req, res) => {
  res.json({ version: '1.0' });
});

const version = '/v1';

app.use(version, rateLimiter, records);

app.use(rateLimiter);

events.listenForEvents(app);
interactions.listenForInteractions(app);
slashCommand.listenForCommands(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('*', (req, res) => {
  res.status(404).json({ status: 'error', message: `Unimplemented ${req.method} ${req.path} route access` });
});

module.exports = app;
