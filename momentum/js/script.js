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

function setLocalStorage(){
    localStorage.setItem('name', n.value);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage(){
    if('name' in localStorage){
        n.value = localStorage.getItem('name');    
    }
}

window.addEventListener('load', getLocalStorage);

// __________________________________SLIDE________________________________________________

let randomNum = getRandomNum();
const slidePrev = document.querySelector('.slide-prev');
const slideNext = document.querySelector('.slide-next');

function getRandomNum(){
    return 1 + Math.floor(Math.random() * 20);
}

function setBg(){
    const timeOfDay = getTimeOfDay();
    const bgNum = String(randomNum).length == 2 ? `${randomNum}` : `0${randomNum}`;
    const link = `https://raw.githubusercontent.com/ValeriaYan/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;

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
    console.log(randomNum);
})

slideNext.addEventListener('click', function(){
    getSlideNext();
    setBg();
    console.log(randomNum);
})


// ________________________________________PLAYER____________________________________________
import playList from './playList.js';
const playBtn = document.querySelector('.play');
const next = document.querySelector('.play-next');
const prev = document.querySelector('.play-prev');
const audio = new Audio();
let isPlay = false;
let playNum = 0;

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
    console.log(isPlay);
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
    if(playNum == 3){
        playNum = -1;
    }
    playNum++;
    isPlay = false;
    playAudio();
}

function playPrev(){
    if(playNum == 0){
        playNum = 4;
    }
    playNum--;
    isPlay = false;
    playAudio();
}

next.addEventListener('click', playNext);
prev.addEventListener('click', playPrev);

