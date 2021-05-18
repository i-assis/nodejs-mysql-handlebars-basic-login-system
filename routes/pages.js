// This file starts the 'routes' folder.
// The routes folder is essential to 
// organize all connections required by
// our application.

// First, we import all relevant packages
// and files.

// First, we import express.
const express = require('express');

// First, we import authController.
const authController = require('../controllers/auth.js');
// '..' = one level up

// The 'R' needs to be capital.
const router = express.Router();

// Setting up comunication 'request/response'.
// Apparently, every page must be listed here.
// This routes to the 'Home' page:
router.get('/',
authController.isLoggedIn,
(req,res) => { 
res.render('index',
{ user: req.user }
);

});
// This routes to the 'Login' page:
router.get('/login', (req,res) => {
res.render('login');
});
// This routes to the 'Register' page:
router.get('/register', (req,res) => {
res.render('register');
});
//This route goes to the 'Profile' page:
router.get('/profile', 
// For the 'profile' page to be visible
// only to its respective user, we must
// ensure the connection has a token that
// corresponds to a specific user.
// This is ensured by a "middleware".
// 'authController' is a middleware.
authController.isLoggedIn
// We need to run this function BEFORE
// we render the profile.
,
(req,res) => {
// console.log(req.message);
// Above line only necessary if we were
// to display a message variable from
// 'isLoggedIn' function.

// Now, the variable request.user
// should be available here.
if (req.user) {
res.render('profile',
{
user: req.user,
}
// Here we are customizing the
// rendering with the individual
// user data.
)
}
else {
res.redirect('/login');
}
// When above condition is true,
// it means that we checked the user
// and everything is fine.
// Thus we are authorized to grab
// user info from the database.

res.render('profile');
});

// The 'get' method is used when we want
// to load a page into a browser.




// Next part is critical.
// We make sure we can export the 'Router'
// created above. 
// Including the list of pages above.
module.exports = router;

