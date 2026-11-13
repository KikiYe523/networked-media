// this builds off of class-18-demo
// we are adding the fetch request in our interval function

require('dotenv').config()

const m = require('masto')

const masto = m.createRestAPIClient({
    url: 'https://networked-media.itp.io/',
    accessToken: process.env.TOKEN,
});

async function makeStatus(text) {
    const status = await masto.v1.statuses.create({
        status: text,
        // TODO: change visability to public when project ready to run
        visibility: 'private',
    });
}

setInterval(async () => {
    // TODO: ADD API REQUEST
    // change localhost to your partner's droplet IP (their server must be running)
    // if needed, change the port (6003) to match your partner's app.listen in *their* server.js
    let url = 'http://localhost:6003/get-data';

    let response = await fetch(url)
    let json = await response.json()
    // what do you want to do with your partner's data?
    //     it will use the json variable for any manipulation
    // console.log(json)
    // TODO: SELECT ITEM FROM JSON AND MANIPULATE IT FOR YOUR BOT
    //    the json is an array, so you will need to select a specific item from it 
    //    and whatever property you would like to access. 
    //    likely, you will need to test your partner's data and see how they format it
    let post = json[0].text
    
    // make our status
    makeStatus(post);

    // TODO: CHANGE 5000ms TO YOUR SPECIFIC INTERVAL
}, 5000);
