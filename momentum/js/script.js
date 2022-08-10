const time = document.querySelector('.time');
const date = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const n = document.querySelector('.name');

function showTime(){
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = `${currentTime}`;
    showDate();
    showGreeting();
    setInterval(showTime, 1000);
}

function showDate(){
    const d = new Date();
    const options = {weekday: 'long', month: 'long', day: 'numeric'};
    const currentDate = d.toLocaleDateString('en-EN', options);
    date.textContent = `${currentDate}`
}

showTime();

function getTimeOfDay(){
    const date = new Date();
    const hours = date.getHours();

    if(hours >= 6 && hours <= 11){
        return 'morning';
    }
    if(hours >= 12 && hours <= 17){
        return 'afternoon';
    }
    if(hours >= 18 && hours <= 23){
        return 'evening';
    }
    if(hours >= 0 && hours <= 6){
        return 'night';
    }
}

function showGreeting(){
    greeting.textContent = `Good ${getTimeOfDay()},`;
}


// __________________________________SLIDE________________________________________________

let randomNum = getRandomNum();
const slidePrev = document.querySelector('.slide-prev');
const slideNext = document.querySelector('.slide-next');

function getRandomNum(){
    return 1 + Math.floor(Math.random() * 20);
}


async function setBg(){
    let link = '';
    // await getLinkToImageFlickr().then(str => link = str);
    link = getLinkToImageGH();
    const img = new Image();
    img.src = link;

    img.onload = () => {
        document.body.style.backgroundImage = `url(${link})`;
    }
}

setBg();

function getSlideNext(){
    if(randomNum == 20){
        randomNum = 1;
    }else{
        randomNum++;
    }
}

function getSlidePrev(){
    if(randomNum == 1){
        randomNum = 20;
    }else{
        randomNum--;
    }
}

slidePrev.addEventListener('click', function(){
    getSlidePrev();
    setBg();
})

slideNext.addEventListener('click', function(){
    getSlideNext();
    setBg();
})

// ___________________________________PHOTO-SOURCE_________________________________________

function getLinkToImageGH(){
    const timeOfDay = getTimeOfDay();
    const bgNum = String(randomNum).length == 2 ? `${randomNum}` : `0${randomNum}`;
    return `https://raw.githubusercontent.com/ValeriaYan/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
}

async function getLinkToImageUnsplash(){
    const timeOfDay = getTimeOfDay();
    const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${timeOfDay}&client_id=9KmeuUBFkvdIrg4bKEhVPxU9NCrOvSdCOiJhDGnY72g`;

    const res = await fetch(url);
    const data = await res.json();
    return data.urls.regular;
}

async function getLinkToImageFlickr(){
    const timeOfDay = getTimeOfDay();
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=9fc685eec8b55355bb9f700e914e1ee1&tags=${timeOfDay}&extras=url_l&format=json&nojsoncallback=1`;

    const res = await fetch(url);
    const data = await res.json();
    return data.photos.photo[randomNum].url_l;
}


// ________________________________________PLAYER____________________________________________

import playList from './playList.js';
const playBtn = document.querySelector('.play');
const next = document.querySelector('.play-next');
const prev = document.querySelector('.play-prev');
const list = document.querySelector('.play-list');
const audio = new Audio();
let isPlay = false;
let playNum = 0;

function createPlayList(){
    for(let song of playList){
        let newElem = document.createElement('li');
        newElem.classList.add('play-item');
        newElem.textContent = song.title;
        list.append(newElem);
    }
}

createPlayList();
const items = document.querySelectorAll('.play-item');


function playAudio(){
    audio.src = playList[playNum].src;
    audio.currentTime = 0;
    if(!isPlay){
        audio.play();
        isPlay = true;
    }else{
        audio.pause();
        isPlay = false;
    }
    
    toggleBtn();
    markPlayingSong();
}

function markPlayingSong(){
    items[playNum].classList.add('item-active');
    for(let i = 0; i < items.length; i++){
        if(i !== playNum){
            items[i].classList.remove('item-active');
        }
    }
}

function toggleBtn(){
    if(!isPlay){
        playBtn.classList.remove('pause');
    }else{
        playBtn.classList.add('pause');
    }
}

playBtn.addEventListener('click', playAudio);

function playNext(){
    if(playNum == (playList.length - 1)){
        playNum = -1;
    }
    playNum++;
    isPlay = false;
    playAudio();
}

function playPrev(){
    if(playNum == 0){
        playNum = playList.length;
    }
    playNum--;
    isPlay = false;
    playAudio();
}

next.addEventListener('click', playNext);
prev.addEventListener('click', playPrev);


// ____________________________________________________WEATHER________________________________________________

const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const city = document.querySelector('.city');
city.value = localStorage.getItem('city');
const weatherError = document.querySelector('.weather-error');

city.addEventListener('change', getWeather);

async function getWeather(){
    city.value = city.value.trim();

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=3165e81390d2540d9a839afd0b04ac9f&units=metric`;
    
    const res = await fetch(url);
    const data = await res.json();

    weatherIcon.className = 'weather-icon owf';
    if('message' in data || city.value == ''){
        weatherError.textContent = `Error! City not found`;
        temperature.textContent = ``;
        weatherDescription.textContent = ``;
        wind.textContent = ``;
        humidity.textContent = ``;
    }else{
        weatherError.textContent = ``;
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.floor(data.main.temp)}°C`;
        weatherDescription.textContent = `${data.weather[0].description}`;
        wind.textContent = `Wind speed: ${Math.floor(data.wind.speed)} m/s`;
        humidity.textContent = `Humidity: ${data.main.humidity}%`;
    }
}

getWeather();

// ___________________________________________________QUOTES____________________________________________________

const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');

function randomNumQuote(){
    return Math.floor(Math.random() * 100);
}

async function getQuote(){
    const res = await fetch(`../assets/quotes.json`);
    const data = await res.json();
    const num = randomNumQuote();

    quote.textContent = `"${data[num].text}"`;
    author.textContent = data[num].author;
}
getQuote();

changeQuote.addEventListener('click', getQuote);

// ____________________________________________________LOCAL_STORAGE____________________________________________

function setLocalStorage(){
    localStorage.setItem('name', n.value);
    localStorage.setItem('city', city.value);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage(){
    if('name' in localStorage){
        n.value = localStorage.getItem('name');    
    }
}

window.addEventListener('load', getLocalStorage);