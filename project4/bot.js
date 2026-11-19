require('dotenv').config()

const m = require('masto')

const masto = m.createRestAPIClient({
    url: 'https://networked-media.itp.io/',
    accessToken: process.env.TOKEN,
});

async function makeStatus(text) {
    await masto.v1.statuses.create({
        status: text,
        visibility: 'public',
    });
}

async function runBot() {
    // sleeps 3–8 a.m. New York time
    let hour = Number(new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        hourCycle: 'h23',
    }));

    if (hour >= 3 && hour < 8) return;

    let response = await fetch('http://68.183.126.104:6003/get-data');
    let json = await response.json();

    json = json.filter(animal => animal.name && animal.text);
    if (json.length === 0) return;

    let rand = Math.floor(Math.random() * json.length);
    let animal = json[rand];
    let name = animal.name.toLowerCase();

    let classmates = [
        "Caitlyn", "Elena", "Anna", "Jennifer", "Mike", "Tommy", "Lisa",
        "Yatong", "Lam", "Ali", "Wing", "May", "Weixuan", "Anita"
    ];

    let classmateRand = Math.floor(Math.random() * classmates.length);
    let classmate = classmates[classmateRand].toLowerCase();

    // keep the traits without the heading, moral or source
    let traits = animal.text.split('Moral:')[0].split('Read more:')[0];

    if (traits.includes('—')) {
        traits = traits.slice(traits.indexOf('—') + 1);
    }

    traits = traits.trim().split('. ').slice(0, 2).join('. ').toLowerCase();

    let activity = Math.floor(Math.random() * 4);
    let intro;
    let ending;

    if (activity === 0) {
        intro = classmate + ' is leading the reading discussion with ' + name;
        ending = 'they ask everyone to stand up and pick a spot in the room 🧍';
    } else if (activity === 1) {
        intro = classmate + ' is following the coding walkthrough with ' + name;
        ending = '“wait which file are we in” 💻';
    } else if (activity === 2) {
        intro = classmate + ' is coming up with project ideas with ' + name;
        ending = 'the proposal now needs a very long explanation 📝';
    } else {
        intro = classmate + ' is presenting a project with ' + name;
        ending = 'the class has several follow-up questions 👁️👁️';
    }

    if (traits.includes('sleep')) {
        intro = classmate + ' is presenting with ' + name;
        ending = classmate + ' is presenting alone (－_－) zzZ';
    } else if (
        traits.includes('flame') ||
        traits.includes('fire') ||
        traits.includes('burn')
    ) {
        intro = classmate + ' is doing a live demo with ' + name;
        ending = 'someone asks if this was intentional\n'
            + classmate + ' says yes 🧯';
    } else if (
        traits.includes('two heads') ||
        traits.includes('head at each end')
    ) {
        intro = classmate + ' is coming up with project ideas with ' + name;
        ending = 'they have submitted two completely different proposals 📝📝';
    } else if (traits.includes('dung')) {
        intro = classmate + ' is in a small group critique with ' + name;
        ending = '“let’s start with what’s working well” 😭';
    }

    let space = 500 - intro.length - ending.length - 4;

    if (traits.length > space) {
        traits = traits.slice(0, space - 3) + '...';
    }

    let post = intro + '\n\n' + traits + '\n\n' + ending;
    await makeStatus(post);
}

runBot();
setInterval(runBot, 12 * 60 * 1000);