
// 1. new! import the cookie-parser library
const express = require('express');
const multer = require('multer');
const nedb = require('@seald-io/nedb');
const nunjucks = require('nunjucks')

// Q: what do these variables do? write the answer above each declaration.
// A: initialzes app to be an express server
const app = express();
// A: initializes upload to use multer library and set the destination of all of the uploaded files to public/uploads/
const upload = multer({
	dest: 'public/uploads',
});
// A: initializing database variable to use nedb library and setting up the file to store the database
const database = new nedb({
	filename: 'database.db',
	autoload: true,
});

// Q: what do each of these items set up? write above each item configuration.
// A: configures the views folder as where our .njk files live
nunjucks.configure('views', {
	autoescape: true,
	express: app,
    noCache: true // NEW! we don't have to restart the server for .njk updates :)
});
// A: sets the public folder for our front-end code (html, css, front-end js interactions)
app.use(express.static('public'));
// A: allows us to access the body of a request (request.body, req.body)
app.use(express.urlencoded({ extended: true })); 
// A: allow the app to render njk files
app.set('view engine', 'njk');
// NEW!!!!!!! adding middleware to parse cookies 
// enable us to access the cookie property of a request
// allows ti access request.cookies


app.get('/', (req, res)=>{
    res.render('home.njk')

	// local variable to track number of visits
	let totalVisits = 1

	if(req.cookies.visits){
		let convertToNumber = parseInt(req.cookies.visits)
		totalVisits = convertToNumber + 1
	}

	//create cookie using response parameter
	// sends the cookie back to the client
	// 3 parameters:
	// 1. the name of the cookie, in str format
	// 2. the value of the cookie
	// 3. object of the cookie attributes that are passed into the header 
	res.cookie("visits", totalVisits,{expires: new Date( Date.now() + 100 * 365 * 24 * 60 * 60 * 1000)})
	//
	res.render('home.njk', {serverData: totalVisits})
})

app.listen(6005, ()=>{
    console.log(`http://localhost:6005`)
})