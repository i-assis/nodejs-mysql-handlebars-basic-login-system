// Start by importing relevant packages.
// We start by requiring the database:
const mysql = require("mysql");
// First, we import jsonwebtoken.
const jwt = require('jsonwebtoken');
// First, we import bcryptjs.
const bcrypt = require('bcryptjs');
// First, we import 'promisify':
const { promisify, isDeepStrictEqual } = require('util');
// 'util' is a common library from nodeJS.

// We start by setting up a connection
// to the database:
const db = mysql.createConnection({
host: process.env.DATABASE_HOST, 
user: process.env.DATABASE_USER, 
password: process.env.DATABASE_PASSWORD, 
database: process.env.DATABASE
});

// The same way we create an exports.register
// function for the registration page, we
// create a similar object for the login page:
exports.login = async (req, res ) => {
// The async is there because we need an 'await' somewhere.
// 'await' = the server needs to wait for some
// procedure to finish BEFORE running more lines
// of code.
try {
const { email, password } = req.body;
// Above line very similar to the one 
// in 'register' function.
if( !email || !password ) // If it is true there is no e-mail.
return res.status(400).render('login', {
message: 'Por favor, forneça e-mail e senha.'
});
// If at the field 'e-Mail' you put some 'asdasd'
// the browser will prompt a warning for you to
// put something like 'asdsad@email.com'.
// That's from bootstrap, we didn't set this up.

// Still inside this block, we run a
// mySQL database query:
db.query('SELECT * FROM users WHERE email = ?', 
[email], async (error, results) => {
// * means all columns within the database.
// Postioning parameters ensure safety against
// SQL injections.
// Value of '?' is the array inside '[]'.
// This holds true only within this block.
console.log(results); // Just so we can watch stuff in the terminal.
// At the terminal you can visualize array 'results'.
if( 
!( results.length > 0) 
|| 
!( await bcrypt.compare(password, results[0].password) ) 
) 
// If we can't find any user with that e-mail in database.
// bcrypt.compare relates the password 
// given at login with the hash currently at the database.
// 'password' comes from what the user typed in.
// 'results[0].password' grabs the 1st user password as
// it is retrieved from the database. This reinforces
// the fact that a given e-mail must be at the database
// only once.
res.status(401).render('login', {
message: 'Algum ou ambos os campos preenchidos estão incorretos.'
} );
// 'status(401)' means 'forbidden'
// Say either user or pass is wrong.
// You want to be vague.

// Now, for the 'else' conditional:
else {
const id = results[0].id;
const token = jwt.sign({ id }, process.env.JWT_SECRET, 
{expiresIn: process.env.JWT_EXPIRES_IN}
);
// jwttokens help us put tokens in our cookies
// 'id' is the object we inject into jwt
// In JavaScript, when object label and object
// value are the same string, we can shorten
// stuff up { id: id } = { id }.

// When we try to create a unique token
// for a user using these jwt tokens,
// we construct a password. 'JWT_SECRET'
// is from our environment file. It is the
// password needed to create the token.

// Once the token has been created, we can
// start our cookie.

console.log("The token is: " + token);
// This is here to exhibit how the token looks like.

// Once the token is created, it must be set
// into the cookies.
const cookieOptions = {
expires: new Date( Date.now() + 
process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000 )
// The multiplications convert the numbers to miliseconds.
,
httpOnly: true
// Make sure we setup our cookies iff
// we are at an 'httpOnly' environment.
// This prevents hacking, in case someone
// is trying to mess with access cookies.
}; // This closes 'cookieOptions'.

res.cookie('oxcookie', token, cookieOptions );
// 'oxcookie' is the name of our cookie.
// The value of 'oxcookie' is 'token'.
// TODO: Understand how exatcly the cookie appears at the browser.

// After the user has been logged in, we put a 
// cookie in the browser.
res.status(200).redirect("/");
// '200' says this went ok ok.

// Now we need to actually start our cookie.
// Remember 'cookie-parser' depedency must be
// installed.


};

} ); // This ends current database query.

} catch (error) {
console.log(error);
}
// We'll try to run some code/queries.
// If everything runs, all ok; if
// any error happens, we'll catch it.
}; // This closes 'exports.login'.


// We start by grabbing data from the
// register.hbs file.
exports.register = (req,res) => {
console.log(req.body);
// The requested 'body' is basically what
// is coming the data that was input into the
// form.

// Now we grab data submitted through the
// registration form.
// See, we are exporting from register.hbs,
// grabbing stuff from within 'body'.
// Code Sample START
// const name = req.body.name;
// const email = req.body.email;
// const password = request.body.password;
// const passwordConfirm = request.body.passwordConfirm;
// Code Sample END
// Left side names are arbitrary.
// Right side names must be same as 
// they are in the form.

// The exact same thing to the paragraph above
// could be written in "de-structured javascript" as:
const { name, email, password, passwordConfirm} = req.body;

// Now, we start querying from the
// database. First, the database must
// be imported by using the function:
db.query('SELECT email FROM users WHERE email = ?', 
[email], async (error, results) =>{
// 'email' must be written exactly as it is in mySQL column
if(error){
console.log(error);
} // Here closes current 'if'.
if(results.length > 0) {
return res.render('register', {
message: 'e-Mail já está sendo utilizado por outro usuário !'
// This message will only work if there are users
// registered into the database.
// After any 'return', the program goes into full stop.
});
} // Here closes current 'if'.

// Now handling another exception:
else if( password !== passwordConfirm ) {
return res.render('register', {
message: 'Senha informada não é consistente.'
});
};
// In between [] is the data we currently
// are grabbing.
// Registration UNIQUENESS must be guaranteed.

// Now we encrypt the submitted password.
// We are still inside db.query .
let hashedPassword = await bcrypt.hash(password, 8);
// 8 rounds of encryption should be fine. 
console.log(hashedPassword);
// res.send("Testando se sua senha foi criptograda !")
// When above line is active, you'll see a
// the hashed password at the console.

// Now we start to actually write into
// the mySQL database:
db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword }, (error, results) => {
if(error) {
console.log(error);
}
else {
// This allows us to see it happen from the terminal:
console.log(results);
return res.render('register', {
message: 'Sua conta de usuário foi registrada com sucesso !'
}); // Closing the return.
}   // Closing the else decision structure.
}); // Closing this last db.query.
// NAME OF COLUMN IN DATABASE MUST MATCH (1st input)
// THE NAMES WITHIN req.body (2nd input)

}); //This ends the largest db.query.

// Sending a string back to the user:
// res.send("Dados submetidos com sucesso !");
// Above line was a fisrt test.
// Messages will be sent by res.render
// at the above decision structure.

};

// No need to request anything else.

// Now we create the function the tells
// '/routes/pages.js' whether the user has
// been authenticated or not.
exports.isLoggedIn = async (req, res, next) =>
{
// 'async' is here in case we need any
// 'await' .
// Example:
// req.message = "Inside Middleware";
// If we refreshed the profile page with
// an apropriate calling at '/routes/pages.js',
// this 'message' variable would be displayed
// at the terminal.
// The above is just a variable 'message'
// with the text 'Inside middleware'
// We display message and go to the next action
// in routes, which is to render the
// page 'profile'.


// We authorize access based on whether or
// not the request got the cookies.
console.log(req.cookies);
// Now, that a cookie has been retrieved,
// we make an 'if' statement:
if( req.cookies.oxcookie) {
// "if the oxcookie is there"
try {
// Now, we verify the token.
const decoded = await promisify(jwt.verify)(
req.cookies.oxcookie,
process.env.JWT_SECRET
// This second parameter is the password used
// to create the token.
);
console.log(decoded);
// 'promisify' needs to be imported at the top.
// 'jwt.verify' is a function from 'jwt' that
// checks the token we get from the network.

// After the decoded, we check whether the
// alleged user exists in the database or not.
db.query('SELECT * FROM users WHERE id = ?',
[decoded.id],
(error, result) => {
console.log(result);
// Above log lets us see if we are getting
// anything from the database.

// Now, for some safety statements:
if(!result) {
return next();
}

req.user = result[0];
return next();
// The code stops here, and the program
// proceeds with the next action.

} );
// Inside the () are mySQL statements.
// * = all thee columns.
// users = one of our mySQL tables.
// ? = positional parameters, security reasons.
} catch (error) {
console.log(error);
// Just to check if there is some error or not.

next();
// If there is some error, we  also proceed to
// the next action of the program.
} // This closes 'catch'.

} // This closes the 'if' condition
  // on the cookies.
   
// Now we open an else statement and 
// redirect to the next action.
else {
next();
}
// If you don't put in this 'next', the
// function will just stop.
// Also, this last 'next' is activated when
// someone tries to login without an
// authorized token.

}

// Now we deal with the logout.
exports.logout = async (req, res) => {
res.cookie('oxcookie', 'logout',
// If you have another cookie named 'oxcookie',
// this is just going to override the previous
// one.
{expires: new Date( Date.now() + 1000 ),
// This new cookie expires in 1000 miliseconds.
httpOnly: true
// User can Logout only through the browser.
}
)
res.status(200).redirect('/');
};


