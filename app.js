const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');

// Connect to the database
require('./config/db');

// Gets routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const messagesRouter = require('./routes/messages');
const conversationsRouter = require('./routes/conversation');
const authenticateRouter = require('./routes/authenticate');
const app = express();

app.set('trust proxy', 1);

const limiter = RateLimit.rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
});

const corsOptions = {
  origin: 'https://bluinside-my-chat.netlify.app',
};

app.use(limiter);
app.use(compression());
app.use(helmet());
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/authenticate', authenticateRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);
app.use('/conversations', conversationsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err);

  // Provide errors only in development
  const errorDetails =
    req.app.get('env') === 'development'
      ? {
          message: err.message,
          error: err,
        }
      : {};

  res.status(err.status || 500);
  // Return JSON
  res.json({
    message: err.message,
    ...errorDetails,
  });
});

module.exports = app;
