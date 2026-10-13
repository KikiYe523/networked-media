// importing the express library to use it as our server
// naming conventions usually name the variable the library name 
const express = require("express")

//inisitalize our application using express
const app = express();

// "middleware"
// this is setting that our app needs to know about our server
// serves our front-end html that exists in the public folder 
app.use(express.static("public"));
//allows us to access the body of a post request
app.use(express.urlencoded({extended:true}))

// ROUTES
//could be any text i want 
// GET/first-server, callback function
app.get("/first-server",(request, response)=>{
    //send info the the client athat makes a request to /first-server
    response.send('this is my first server')
})
// LAST
// port, callback function
// this weblink can also be whatever
// to start our server: node server.js
app.listen(8080, ()=>{
    console.log("http://68.183.118.25/first-server")
});