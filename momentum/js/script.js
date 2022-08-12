let state = {
    language: 'en',
    photoSource: 'GitHub',
    blocks: {
        'time': true,
        'quote': true,
        'date': true,
        'greeting': true,
        'weather': true,
        'player': true,
        // 'todo': true,
    }
}


const time = document.querySelector('.time');
const date = document.querySelector('.date');
const greeting = document.querySelector('.greeting-text');
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

let randomNum = getRandomNum(20);
const slidePrev = document.querySelector('.slide-prev');
const slideNext = document.querySelector('.slide-next');
const tags = document.querySelector('.line-tags');
tags.value = localStorage.getItem('tags');
let tagsValue = tags.value;

function getRandomNum(max){
    return 1 + Math.floor(Math.random() * max);
}

function disableTags(){
    tags.disabled = true;
    tags.previousElementSibling.style.color = `rgb(82, 82, 82)`;
    tags.value = '';
}

function enableTags(){
    tags.disabled = false;
    tags.previousElementSibling.style.color = `#fff`;
}

tags.addEventListener('change', function(){
    tagsValue = tags.value;
    setBg(state.photoSource);
});


async function setBg(nameSource){
    let link = '';
    if(nameSource == 'GitHub'){
        link = getLinkToImageGH();
        disableTags();
    }
    if(nameSource == 'Flickr API'){
        await getLinkToImageFlickr().then(str => link = str);
        enableTags();
    }
    if(nameSource == 'Unsplash API'){
        await getLinkToImageUnsplash().then(str => link = str);
        enableTags();
    }
    const img = new Image();
    img.src = link;

    img.onload = () => {
        document.body.style.backgroundImage = `url(${link})`;
    }
}


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
    setBg(state.photoSource);
})

slideNext.addEventListener('click', function(){
    getSlideNext();
    setBg(state.photoSource);
})

// ___________________________________PHOTO-SOURCE_________________________________________

function getLinkToImageGH(){
    const timeOfDay = getTimeOfDay();
    const bgNum = String(randomNum).length == 2 ? `${randomNum}` : `0${randomNum}`;
    return `https://raw.githubusercontent.com/ValeriaYan/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
}

async function getLinkToImageUnsplash(){
    let query = getTimeOfDay();
    if(tagsValue !== ''){
        query = tagsValue;
    }
    const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${query}&client_id=9KmeuUBFkvdIrg4bKEhVPxU9NCrOvSdCOiJhDGnY72g`;

    const res = await fetch(url);
    const data = await res.json();
    return data.urls.regular;
}

async function getLinkToImageFlickr(){
    let query = getTimeOfDay();
    if(tagsValue !== ''){
        query = tagsValue;
    }
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=9fc685eec8b55355bb9f700e914e1ee1&tags=${query}&extras=url_l&format=json&nojsoncallback=1`;

    const res = await fetch(url);
    const data = await res.json();
    return data.photos.photo[getRandomNum(data.photos.photo.length)].url_l;
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
if(localStorage.getItem('city')){
    city.value = localStorage.getItem('city');
}else{
    city.value = 'Minsk';
}
const weatherError = document.querySelector('.weather-error');

city.addEventListener('change', getWeather);

async function getWeather(){
    city.value = city.value.trim();

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${state.language}&appid=3165e81390d2540d9a839afd0b04ac9f&units=metric`;
    
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
        if(state.language == 'en'){
            wind.textContent = `Wind speed: ${Math.floor(data.wind.speed)} m/s`;
            humidity.textContent = `Humidity: ${data.main.humidity}%`;
        }else if(state.language == 'ru'){
            wind.textContent = `Скорость ветра: ${Math.floor(data.wind.speed)} m/s`;
            humidity.textContent = `Влажность воздуха: ${data.main.humidity}%`;
        }
    }
}

getWeather();

// ___________________________________________________QUOTES____________________________________________________

const quote = document.querySelector('.quote-text');
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

// ____________________________________________________SETTING_______________________________________________

const settingBtn = document.querySelector('.setting');
const setting = document.querySelector('.setting-content');
const listLanguage = document.querySelector('.list-language');
const listSource = document.querySelector('.list-source');
const itemLanguage = document.querySelectorAll('.list-language > .line-item');
const itemSource = document.querySelectorAll('.list-source > .line-item');

settingBtn.addEventListener('click', function(){
    settingBtn.classList.toggle('_active');
})

document.addEventListener('click', function(event){
    const isSetting = event.target == setting || setting.contains(event.target) || settingBtn.contains(event.target) || event.target == settingBtn;
    if(!isSetting){
        settingBtn.classList.remove('_active');
    }
})

function setActiveLanguage(elem, itemsLanguage){
    for(let item of itemsLanguage){
        item.classList.remove('_active')
    }
    elem.classList.add('_active');
    state.language = elem.dataset.name;
    changeLanguage();
    itemsLanguage[0].textContent = elem.textContent;
}

listLanguage.addEventListener('click', function(event){
    if(event.target.tagName == 'LI' && !event.target.classList.contains('default')){
        setActiveLanguage(event.target, itemLanguage);
    }
})


function setActiveSource(elem, itemsSource){
    for(let item of itemsSource){
        item.classList.remove('_active')
    }
    elem.classList.add('_active');
    state.photoSource = `${elem.textContent}`;
    setBg(state.photoSource);
    itemsSource[0].textContent = elem.textContent;
}

listSource.addEventListener('click', function(event){
    if(event.target.tagName == 'LI' && !event.target.classList.contains('default')){
        setActiveSource(event.target, itemSource);
    }
})

function showHideBlocks(){
        for(let nameBlock in state.blocks){
            let block = document.querySelector(`.${nameBlock}`);
            block.style.transition = 'all ease 0.5s';
            if(state.blocks[nameBlock] == false){
                block.style.visibility = 'hidden';
                block.style.opacity = '0';
            }
            if(state.blocks[nameBlock] == true){
                block.style.visibility = 'visible';
                block.style.opacity = '1';
            }
        }
}

function setUncheckedInputs(){
    let inputs = Array.from(document.querySelectorAll('.line-input'));
    for(let item in state.blocks){
        if(state.blocks[item] == false){
            let unchecked = inputs.find(elem => {
                if(elem.name == item){return elem;}
            })
            unchecked.checked = false;
        }
    }
}

showHideBlocks();

setting.addEventListener('click', function(event){
    if(event.target.classList.contains('line-input')){
        if(event.target.checked){
            state.blocks[event.target.name] = true;
        }
        if(!event.target.checked){
            state.blocks[event.target.name] = false;
        }
        showHideBlocks();
    }
})

function changeLanguage(){
    getWeather();
}

function setSettings(){
    if(localStorage.getItem(state)){
        state = JSON.parse(localStorage.getItem(state));
    }
    
    let listItemSource = document.querySelectorAll('.list-source .line-item');
    let elemPhotoSource;
    for(let i = 1; i < listItemSource.length; i++){
        if(listItemSource[i].textContent == state.photoSource){
            elemPhotoSource = listItemSource[i];
        }
    }
    setActiveSource(elemPhotoSource, listItemSource);

    let listItemLanguage = document.querySelectorAll('.list-language .line-item');
    let elemLanguage;
    for(let i = 1; i < listItemLanguage.length; i++){
        if(listItemLanguage[i].dataset.name == state.language){
            elemLanguage = listItemLanguage[i];
        }
    }
    setActiveLanguage(elemLanguage, listItemLanguage);

    setUncheckedInputs();
    showHideBlocks();
}

setSettings();

// ____________________________________________________LOCAL_STORAGE____________________________________________

function setLocalStorage(){
    localStorage.setItem('name', n.value);
    localStorage.setItem('city', city.value);
    localStorage.setItem(state, JSON.stringify(state));
    localStorage.setItem('tags', tagsValue);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage(){
    if('name' in localStorage){
        n.value = localStorage.getItem('name');    
    }
}

window.addEventListener('load', getLocalStorage);