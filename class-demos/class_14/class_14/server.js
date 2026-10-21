// importing the express library to use it as our server
// naming conventions usually name the variable the library name 
/************
 * import our templating library
 ************/
const nunjucks = require("nunjucks");
const express = require("express");

//inisitalize our application using express
const app = express();

// "middleware"
// this is setting that our app needs to know about our server
// serves our front-end html that exists in the public folder 
// all css and front-end js will go in the frontend folder
app.use(express.static("frontend"));
//allows us to access the body of a post request
app.use(express.urlencoded({extended:true}))

/************
 * add our nunjucks settings under our middleware
 * this links our express application to the templating tool
 ************/
nunjucks.configure("views", {
    autoescape: true,
    express: app,
})
app.set("view engine", "njk");

// ROUTES - all of the URL pages we want accessibel
// syntax for GET: app.get(ROUTE, anonymous function)
// similar to document.addEventListening("eventName", (e)=>{})

///////// POST FIRE ALARM NOTES
app.get("/", (request, response)=>{
    // console.log in server js only shows up in the terminla because it is a different console thatn the one in the browser
    //request,body retrievces the data 
    // request.body is used for submitted form data; this GET request usually has no body
    console.log(request.body)
    //respond will contain all of the information we send back from the server to the client
    console.log("received a request at / route")
    //  we ALWAYS need to ahve a response, otherwise the page will continuously load. 

    // response.render accepts 2 parameters:
    // 1: the name of the njk file
    // 2: a javascript object. the properties you pass into this object are the variables that you use in the .njk files
    // serverData is the name of the variable we used in baseLayout.njk
    response.render("baseLayout.njk", {
        serverData: "this is text from my server!!!"
    })
})

//could be any text i want 
// GET/first-server, callback function
app.get("/first-server", (request, response)=>{
    //send info the the client athat makes a request to /first-server
    response.send('this is my first server')
})

//POST looks exactly the same and will handle the form data
app.post("/form-upload", (request, response)=>{
    console.log(request.body)
    console.log(request.body.message)
    response.send("received your form!")
})

// LAST
// port, callback function
// this weblink can also be whatever
// to start our server: node server.js
app.listen(8080, ()=>{
    // to run the server:
    // 1. make sure you are in the correct folder
    // if you type pwd it should print out the path to class_14_demo
    // if it does not show class_14_demo, you need to navigate to the folder using cd
    // 2. in terminal use the starting command: node --watch server.js
    // another way to do this is to add a script in package.json
    console.log("http://localhost:8080")
});