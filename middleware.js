const passport = require('passport');
const ExpressError = require('./utils/ExpressError');
const validator = require('validator');

module.exports.loginAuthenticate = passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
    successFlash: false 
});

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login')
    }
    next()
};

module.exports.storeReturnTo = (req, res, next)=>{
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo
    }
    next();
};

module.exports.redirectIfLoggedIn = (req, res, next)=>{
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
};

module.exports.redirectIfCompletedProfile = (req, res, next)=>{
    if (req.user && req.user.displayName && req.user.location && req.user.bio) {
        return res.redirect('/');
    }
    next();
};

module.exports.sanitizeInputs = (req, res, next) => {
    const sanitize = (obj) => {
        if (typeof obj === 'string') {
            return validator.escape(obj.trim());
        }

        if (Array.isArray(obj)) {
            return obj.map(sanitize);
        }

        if (obj && typeof obj === 'object') {
            const sanitized = {};
            for (const key in obj) {
                sanitized[key] = sanitize(obj[key]);
            }
            return sanitized;
        }

        return obj;
    };

    if (req.body) req.body = sanitize(req.body);
    if (req.query) req.query = sanitize(req.query);
    if (req.params) req.params = sanitize(req.params);

    next();
};


// Validate email format
module.exports.validateEmail = (req, res, next) => {
    if (req.body.email && !validator.isEmail(req.body.email)) {
        throw new ExpressError('Invalid email format', 400);
    }
    next();
};

// Prevent XSS attacks
module.exports.xssProtection = (req, res, next) => {
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    next();
};