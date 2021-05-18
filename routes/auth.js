// Start by importing relevant packages.
// First, we import express.
const express = require('express');

// '..' sends us one folder above.
const authController = require('../controllers/auth');
// The 'R' needs to be capital.
const router = express.Router();

// Setting up comunication 'request/response'.
// Apparently, every page must be listed here.
// This is the router for the registration page:
router.post('/register', authController.register) 
// '.post' comes from POST HTTP method of sending
// us the data sent by the user.

// This is the router for the login page:
router.post('/login', authController.login );
// The above line loads the authController that
// was imported at the beggining of this file.
// The we grab the login function that is
// inside of authController.

// This is the route to the logout page:
router.get('/logout', authController.logout );
// When we load a page, we always use the 'get'
// method. 
// 'authController' has been imported above.


// Next part is critical.
// We make sure we can export the 'Router'
// created above. 
// Including the list of pages above.
module.exports = router;

