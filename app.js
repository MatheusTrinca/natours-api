const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewsRouter = require('./routes/viewsRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const compression = require('compression');
const cors = require('cors');
const bookingController = require('./controllers/bookingController');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) Global Middlewares
app.use(cors());
app.options('*', cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet({ contentSecurityPolicy: false }));

// Developement logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hora,
  message: 'Rate limit exceded for this IP. Try again in 1 hour',
});

app.use('/api', limiter);

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application.json' }),
  bookingController.webhookCheckout
);

// Body parser, read data from request body - Limit 10kb
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Sanitize against NOSQL injection
app.use(mongoSanitize());

// Sanitize agains XSS
app.use(xss());

// Prevent Param Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Test middleware
// app.use((req, res, next) => {
//   req.requestedTime = new Date().toISOString();
//   //console.log(req.headers);
//   next();
// });

app.use(compression());

// 3) Routes

app.use('/', viewsRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
