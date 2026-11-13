// this hs will fo inside of the makesStatus funciton in your bot
// your partner will make a request to http://your-ip-address:6001/get-data

async function getData() {
    // the only difference is the yrl
    let url = "http://localhost:6001/get-data";
    let response = await fetch(url)
    let json = await response.json()
    // what do you want to do with your partner's data?
    // it will use the json variable for any manipulation
    console.log(json)
}
//

console.log(response.json())
}

getData()
