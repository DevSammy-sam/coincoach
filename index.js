/**
 * CoinCoach - Financial Management Application
 * Main entry point for the Express.js application
 */

// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express');
const app = express();
const path = require('path');

// Import EJS templating engine with layout support
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

// Import session and flash message middleware
const session = require('express-session');
const flash = require('connect-flash');

// Import Passport.js for authentication
const passport = require('passport');
const LocalStrategy = require('passport-local');

// Import User model and custom error class
const User = require('./models/user');
const ExpressError = require('./utils/ExpressError');

// Import configuration and middleware
const { sessionConfig } = require('./config/session');
const { sanitizeInputs, xssProtection } = require('./middleware');

// Import bill scheduling and email services
const { initializeBillScheduler } = require('./utils/billScheduler');
const { sendDailyBillAlerts } = require('./services/billEmailService');

/* ------------------------------------------------ */
/* VIEW ENGINE                                      */
/* ------------------------------------------------ */

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* ------------------------------------------------ */
/* STATIC + BODY PARSERS                             */
/* ------------------------------------------------ */

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'Images')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

/* ------------------------------------------------ */
/* SESSION (MUST BE BEFORE PASSPORT)                 */
/* ------------------------------------------------ */

app.use(session(sessionConfig));
app.use(flash());

/* ------------------------------------------------ */
/* PASSPORT                                         */
/* ------------------------------------------------ */

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy(
        { usernameField: 'email', passwordField: 'password' },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user) return done(null, false);

                const result = await user.authenticate(password);
                return result.user ? done(null, result.user) : done(null, false);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* ------------------------------------------------ */
/* SECURITY                                         */
/* ------------------------------------------------ */

app.use(xssProtection);
app.use(sanitizeInputs);

/* ------------------------------------------------ */
/* GLOBAL LOCALS (FLASH SAFETY)                      */
/* ------------------------------------------------ */

app.use((req, res, next) => {
    res.locals.currentUser = req.user;

    res.locals.success = req.flash('success') || [];
    res.locals.error = req.flash('error') || [];
    res.locals.warning = req.flash('warning') || [];
    res.locals.info = req.flash('info') || [];

    next();
});

/* ------------------------------------------------ */
/* DATABASE                                         */
/* ------------------------------------------------ */

require('./config/db')();

/* ------------------------------------------------ */
/* ROUTES                                           */
/* ------------------------------------------------ */

app.use('/', require('./routes/auth'));
app.use('/transactions', require('./routes/transaction'));
app.use('/user', require('./routes/user'));
app.use('/insights', require('./routes/insights'));
app.use('/export', require('./routes/export'));
app.use('/goals', require('./routes/goals'));
app.use('/conversion', require('./routes/conversion'));
app.use('/chat', require('./routes/chatSession'));
app.use('/chat/sessions', require('./routes/chatMessage'));
app.use('/api/ai', require('./routes/chatAI'));
app.use('/reciept', require('./routes/reciept'));
app.use('/', require('./routes/bill'));

/* ------------------------------------------------ */
/* SCHEDULERS                                       */
/* ------------------------------------------------ */

initializeBillScheduler();

setInterval(() => {
    const now = new Date();
    if (now.getHours() === 9 && now.getMinutes() === 0) {
        sendDailyBillAlerts();
    }
}, 60000);

/* ------------------------------------------------ */
/* 404 + ERRORS                                     */
/* ------------------------------------------------ */

app.use((req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});


app.use((err, req, res, next) => {
    const status = err.statusCode || 500;



    if (status === 404) return res.status(404).render('error/404');

    console.error(err);
    res.status(status).render('error/500');
});

/* ------------------------------------------------ */
/* SERVER                                           */
/* ------------------------------------------------ */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`CoinCoach running on port ${PORT}`);
});
