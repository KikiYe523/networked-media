// this is all of the libraries we are importing
// npm install express nunjucks 
const nunjucks = require("nunjucks");
const express = require("express");

//app is express server that uses express library variable
const app = express();

// app.use is middleware
// these are setting for our server that happen between when the server runs and when it received a request 
// these are SETTINGS
// all css and front-end js will go in public folder
app.use(express.static("public"));
// express.urlencoded allows us to process POST requests
// if we have app.post, we NEED this line 
// allows us to access the body of a post request
app.use(express.urlencoded({extended:true}));

/************
 * add our nunjucks settings under our middleware
 * this links our express application to the templating tool
 ************/
// more settings to set up our njk files 
nunjucks.configure("views", {
    autoescape: true,
    express: app,
})
app.set("view engine", "njk");
// this is new
// stores data on our server using an array variable 
let allData = []

// have to have app get to 
app.get("/", (request, response)=>{
  // regular home page rendering
    response.render("home.njk")
});

//could be any text i want 
// GET/first-server, callback function
app.get("/first-server", (request, response)=>{
    //for every new njk file, we need a new app.get
    response.render("form.njk")
});

app.get("/view-all", (request, response)=>{
    //for every new njk file, we need a new app.get
    response.render("view-all.njk",{messagesArrayFromServer: allData})
});

//for every <form> we need an app.post
app.post("/send-message", (request, response)=>{
// this action will handle
// 1. storing the data from the form on the server(in the data array)
// 2 . redirect to where we want the datas to be displayed
    console.log(request.body)
    allData.push(request.body)
    //3.redirect to where we want the data to be displayed
    response.redirect("/view-all")
});

// app.listen
app.listen(8080, ()=>{
    // to run the server:
    // 1. make sure you are in the correct folder
    // if you type pwd it should print out the path to class_14_demo
    // if it does not show class_14_demo, you need to navigate to the folder using cd
    // 2. in terminal use the starting command: node --watch server.js
    // another way to do this is to add a script in package.json
    console.log("http://localhost:8080")
});