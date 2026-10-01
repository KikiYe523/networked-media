//window.onload is shorthand for this
window.addEventListener("load", ()=>{
    //document.body is the selector to retrieve the body html element
    // function mousePressed(){
    //  print(mouseX,mouseY);
    //  }

    //e is a parameter in the anonymous arrow function
    // it is automatically populated by js and contains all of the information about the event
    document.body.addEventListener("click", (e)=>{
        console.log('document.body was clicked')
        // console.log(e.clientX +" " + e.clientY);
        console.log(`${e.clientX} , ${e.clientY}`);
    })

    //using ids are good for js!
    //any time we have an interaction, using an id is best practice
    let textDiv = document.getElementById("text")
    // textDiv.addEventListener("keydown", (e)=>{
    document.addEventListener("keydown", (e) => {
        console.log("key pressed!")
        console.log(e.key)
        textDiv.textContent += e.key
//is it right that there are es on my square?
        if(e.key == " "){
            textDiv.textContent += "🐱"
        }
    })

})