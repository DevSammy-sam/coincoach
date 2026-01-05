const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth');

const catchAsync = require('../utils/catchAsync');

const { loginAuthenticate, redirectIfLoggedIn, storeReturnTo, validateUser } = require('../middleware');

const rateLimit = require('express-rate-limit');

// Rate limiter for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: 'Too many login attempts. Please try again in 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for registration
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts
    message: 'Too many registration attempts. Please try again later.',
});

// Rate limiter for password reset
const resetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: 'Too many password reset requests. Please try again later.',
});


router.get('/', controller.home);

router.get('/register', redirectIfLoggedIn, controller.registerForm);

router.post('/register', registerLimiter, redirectIfLoggedIn, catchAsync(controller.register));

router.get('/login', redirectIfLoggedIn, controller.loginForm);

router.get('/enter-email',redirectIfLoggedIn,  controller.enterEmail);

router.post('/send-reset-code', resetLimiter, catchAsync(controller.sendResetCode));

router.get('/confirm-code',redirectIfLoggedIn, controller.confirmCodeForm);

router.post('/confirm-code', catchAsync(controller.confirmCode));

router.get('/reset-password',redirectIfLoggedIn, controller.resetPasswordForm);

router.post('/login', loginLimiter, storeReturnTo, loginAuthenticate, controller.login);

router.post('/reset-password', catchAsync(controller.resetPassword));

router.get('/logout', controller.logout);

module.exports = router;