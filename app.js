// When we type "npm start" + enter on terminal, we run 'app.js'.
// Import express to make sure we can start server.
const express = require("express");
// Now importing mySQL, which has been installed as a dependance.
const mysql = require("mysql");
// Relevant NodeJS package 'path':
const path = require('path');
// Setting up '.env' file to enclose sensitive information.
const dotenv = require('dotenv');
// Still within this preamble, we import cookie-parser:
const cookieParser = require('cookie-parser');
// We import 'cookie-parser' and call it 'cookieParser'.

// Tell .env where is the file containing relevant variables.
dotenv.config({
// ./ here means we are in same directory level as this file
path: './.env'
// .env file may have any name, as long as it ends with .env
// .env file folows exactly the layout given at this folder
})
// Make sure we start a server when invoking 'app'.
const app = express();
// Now starting/creating the database:
// Example:
// const database = mysql.createConnection({
// host: 'localhost', // When working online, here goes IP of server.
// user: 'root', // By default, brought by XAMPP.
// password: '', // By default, brought by XAMPP.
// database: 'nodeJS-login' // http://localhost/phpMyAdmin
//  })
// Now, retrieving database from a protected .env file:    
const db = mysql.createConnection({
host: process.env.DATABASE_HOST, 
user: process.env.DATABASE_USER, 
password: process.env.DATABASE_PASSWORD, 
database: process.env.DATABASE
})
// Any error in database parameter causes connection to fail.

// PublickDirectory is where I put FrontEnd files 
// such as .css, javascripts, ... 
const PublicDirectory = path.join(__dirname,'./public')
// __dirname (2 underscores) gives us access to currrent file directory
// We could use console.log(__dirname) .

// Now we make sure 'express', i.e., the server,
// is using PublicDirectory.
app.use(express.static(PublicDirectory))
// 'express.static' grabs all beforementioned
// frontend static files, like .css, and so on...

// Now, to grab the data submitted through
// the registration form:
app.use(express.urlencoded({ extended: false }))
// Above line parses URL encoded bodies
// as sent by HTML forms.
// This line makes sure we can grab the data
// submitted through any form.
app.use(express.json())
// Above line ensures the data coming in through
// the forms arrives as .json files.
// It parses JSON bodies as they were
// sent by API clients.
app.use(cookieParser());
// Above line initializes cookieParser so
// we can set it up into our browser.
// To teste whether the cookie works,
// go to browser -> dev tools -> application
// cookies. Click the correct link, make
// a login. The cookie should appear in
// the list. 

// Now we tell NodeJS through which engine we show the .html
app.set('view engine', 'hbs');
// 'hbs' is a dependency previously installed 'handlebars'
// 'views' is default folder name when using hbs

// Now, we need to connect said database:
db.connect( (error) => {
if(error) {
console.log(error)
}
else {
console.log("mySQL Connected...")
// After typing this "" string above appears at the terminal. 
}
})

// Now, we make sure everything is working fine.
// "/" means homepage, highest folder
// request 'req' = (grab string from the form)
// response 'res' = (send .html to frontend)
// sample code START
// app.get("/", (req,res) => {
//res.send("<hl>Oxfield Unicórnio BR</hl>")
// });
// sample code END
// the above is called a route, where you go to "/..."

// After performing the test above, we can render
// FrontEnd files from somewhere else.
// This is MAIN PAGE:
// app.get("/", (req, res) => {
// res.render("index")
// })
// If we want not to render anything in app.js,
// the command looks like:
// res.send("Oxfield próxima unicórnio BR")


// This is REGISTER PAGE:
// app.get("/register", (req, res) => {
// res.render("register")
// })

// Any fairly complex application is bound
// to contain many, many routes.
// Thus, it is convenient to keep all routes
// at a single file.

// DEFINITION OF ROUTES
app.use('/', require('./routes/pages.js'));
app.use('/auth', require('./routes/auth'));


// We need to tell 'express' which port to listen.
// port 5000, can be 3000 < n < 9000
app.listen(5000, () => {
console.log("Server started on Port 5000")
});
// If port is already being used, just change
// 5000 to some other number 'n'.

// In Windows, if you get code 'EADDRINUSE', open cmd:
// C:\Windows\System32>taskkill /F /IM node.exe

// Whenever we change any file, if not using nodemon,
// server must be stopped/rebooted so changes can be seen.
// If using nodemon, just change a .js file, save it,
// no need to do a bunch of stuff on the server.

// LIST OF DEPENDENCIES

// npm i dotenv
// npm i express
// npm i hbs
// npm i mysql
// npm i nodemon
// npm i bcryptjs
// npm i cookie-parser
// npm i jsonwebtoken






