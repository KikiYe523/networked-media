// this is a comment // syntax

alert('javascript!');
console.log('log this info into the console');

let colors = ["#0000FF", "#151B54"];

// wait for the webpage to load
// window.onload runs once after the page has loaded
// all of our page-modifying code should go inside window.onload
window.onload = () => {
  console.log('page has loaded');

  // get element by id
  // retrieves a SINGLE element using an id
  // each id should only be used once in an HTML page
  let mainElement = document.getElementById("main");

  // modifying a style using JS
  // inline styles override ordinary CSS rules, but not !important rules
  mainElement.style.color = "white";
  console.log(mainElement);

  // query selector
  // retrieves a single element using the CSS selector
  // querySelector only grabs the first element in HTML that matches
  let firstParagraph = document.querySelector('p');
  let blueParagraph = document.querySelector('.blue');
  document.querySelector('#main');

  firstParagraph.textContent = "i have updated the text with content";
  blueParagraph.style.backgroundColor = "navy";

  for (let i = 0; i < 60; i++) {
    // query selector for ID works the same as getElementById
    let containerDiv = document.querySelector("#blue-div");

    // creating an element on a webpage:
    // 1. declare what type of element we are creating
    let newSpan = document.createElement("span");

    // 2. modify that element/content
    newSpan.textContent = "new span";

    // generate a random color
    let c = Math.floor(Math.random() * colors.length);
    newSpan.style.backgroundColor = colors[c];

    // 3. add the created element to the page
    // to the bottom of the body: document.body.appendChild(newSpan)
    // in a specific container: select that element
    containerDiv.appendChild(newSpan);
  }

  // setInterval is built into JS
  // 2 params:
  // 1. callback
  // 2. amount of time in ms
  setInterval(() => {
    console.log("two seconds have passed");
    let allSpans = document.querySelectorAll(".all-spans")
    console.log(allSpans)
    //shorthand for(let s =)
    for(let s of allSpans){
        s.style.transform = 'rotate(${rotation}deg)'
        rotaton++
        console.log(s.style.transform)
    }
    console.log(allSpans)
  }, 2000);
};

function intervalFunction() {
}