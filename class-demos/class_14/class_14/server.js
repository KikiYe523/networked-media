// importing the express library to use it as our server
// naming conventions usually name the variable the library name 
const nunjucks = require ("nunjucks");
const express = require("express");

//inisitalize our application using express
const app = express();

// "middleware"
// this is setting that our app needs to know about our server
// serves our front-end html that exists in the public folder 
app.use(express.static("frontend"));
//allows us to access the body of a post request
app.use(express.urlencoded({extended:true}))
nunjucks.configure("views" , {
    autoescape: true,
    express: app,
})
app.set("view engine", "njk");
app.get 
// ROUTES - all of the URL pages we want accessibel
// syntax for GET: app.get(ROUTE, anonymous function)
// similar to document.addEventListening("eventName", (e)=>{})
app.get("/", (request, response)=>{
    // console.log in server js only shows up in the terminla because it is a different console thatn the one in the browser
    //request,body retrievces the data 
    console.log(request.body)
     //respond will contain all of the information we send back from the server to the client
    console.log("received a request at / route")
    //  we ALWAYS need to ahve a response, otherwise the page will continuously load. 
    response.send("this is an <em>some</em> data!!!!!")
})

//could be any text i want 
// GET/first-server, callback function
app.get("/first-server",(request, response)=>{
    //send info the the client athat makes a request to /first-server
    response.send('this is my first server')
})

//POST looks exactly the same and will handle the form data
// LAST
// port, callback function
// this weblink can also be whatever
// to start our server: node server.js
app.post("/form-upload", (request, response)=>{
    console.log(request.body)
    console.log(request.body.message)
    response.send("received your form!")
})
app.listen(8080, ()=>{
    console.log("http://127.00.1:8080/first-server")
});

