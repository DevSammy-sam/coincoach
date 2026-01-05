const User = require('../models/user');
const { registerSchema, sendResetCodeSchema, confirmCodeSchema, resetPasswordSchema } = require('../utils/schemas');
const ExpressError = require('../utils/ExpressError');

module.exports.home = (req, res)=>{
    res.render('home');
}

module.exports.registerForm = (req, res) => {
    res.render('auth/register');
};

module.exports.register = async (req, res, next) => {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      throw new ExpressError(error.details.map(d => d.message).join(', '), 400);
    }
    const { email, password, displayName, preferredCurrency, fullName } = value;

    const user = new User({ email, displayName, preferredCurrency, fullName });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, err => {
        if(err) return next(err);
        req.flash('success', 'Welcome to EduVision AI');
        res.redirect('/user/complete-profile');
    });
};

/**
 * Render the user login form
 */
module.exports.loginForm = (req, res) => {
    res.render('auth/login');
};

/**
 * Handle user login
 * Redirects to the intended page or home after successful login
 */
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back to CoinCoach!');
    const returnUrl = res.locals.returnTo || '/';
    res.redirect(returnUrl);
};

/**
 * Handle user logout
 * Logs out the user and redirects to home page
 */
module.exports.logout = async(req, res)=>{
    req.logout(err=>{
        if(err) return next(err);
        req.flash('success', "Successfully Signed Out");
        res.redirect('/')
    })
};

function generateCode(length = 7) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

module.exports.enterEmail = (req, res) => {
    res.render('auth/enterEmail');
};

module.exports.sendResetCode = async (req, res) => {
    const { error, value } = sendResetCodeSchema.validate(req.body);
    if (error) {
      req.flash('error', error.details.map(d => d.message).join(', '));
      return res.redirect('/enter-email');
    }
    const { email } = value;
    const {sendPasswordResetEmail} = require('../services/emailService'); 

    const user = await User.findOne({ email});

    if(!user){
        req.flash('error', 'No account found with that email address.');    
        return res.redirect('/enter-email');
    }   
    const resetCode = generateCode(8);
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.resetCode= resetCode
    user.resetCodeExpires= expires
    await user.save();

    await sendPasswordResetEmail(user.email, user.displayName , resetCode)
        .then(() => {
            req.flash('success', `Reset code sent to ${user.email}`);
            res.redirect('/confirm-code');
        })
        .catch(err => {
            console.error('Error sending password reset email:', err);
            req.flash('error', 'There was an error sending the password reset email. Please try again later.');
            res.redirect('/enter-email');
        });
};

module.exports.confirmCodeForm = (req, res) => {
    res.render('auth/confirmCode');
};

module.exports.confirmCode = async (req, res, next) => {
    const { error, value } = confirmCodeSchema.validate(req.body);
    if (error) {
      req.flash('error', error.details.map(d => d.message).join(', '));
      return res.redirect('/confirm-code');
    }
    const { code } = value;
    const user = await User.findOne({ resetCode: code, resetCodeExpires: { $gt: Date.now() } });

    if(!user){
        req.flash('error', 'Invalid or expired reset code. Please try again.');
        return res.redirect('/confirm-code');
    }

    // Proceed to allow user to reset password
    req.flash('success', 'Reset code confirmed. You may now reset your password.');
    res.redirect(`/reset-password`);
};

module.exports.resetPasswordForm = (req, res) => {
    res.render('auth/resetPassword');
};

module.exports.resetPassword = async(req, res)=>{
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error) {
      req.flash('error', error.details.map(d => d.message).join(', '));
      return res.redirect('/reset-password');
    }
    const { newPassword } = value;
    const user = await User.findOne({ resetCodeExpires: { $gt: Date.now() } });

    
    await user.setPassword(newPassword);
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();
    req.flash('success', 'Password reset successfully. You may now log in.');
    res.redirect('/login');
}