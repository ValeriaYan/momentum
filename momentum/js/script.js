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
        'todo': true,
    }
}

const dictionaryEn = {
    'Good morning,': 'Доброе утро,',
    'Good afternoon,': 'Добрый день,',
    'Good evening,': 'Добрый вечер,',
    'Good night,': 'Доброй ночи,',
    '[Enter name]': '[Введите имя]',

    'Settings': 'Настройки',
    'Language': 'Язык',
    'Russian': 'Русский',
    'English': 'Английский',
    'Photo source': 'Источник фото',
    'Tags': 'Теги',
    'Time': 'Время',
    'Date': 'Дата',
    'Greeting': 'Приветствие',
    'Quote': 'Цитата',
    'Weather': 'Погода',
    'Audio': 'Плеер',
}

const dictionaryRu =  {
    'Доброе утро,': 'Good morning,',
    'Добрый день,': 'Good afternoon,',
    'Добрый вечер,': 'Good evening,',
    'Доброй ночи,': 'Good night,',
    '[Введите имя]': '[Enter name]',

    'Настройки': 'Settings',
    'Язык': 'Language',
    'Русский': 'Russian',
    'Английский': 'English',
    'Источник фото': 'Photo source',
    'Теги': 'Tags',
    'Время': 'Time',
    'Дата': 'Date',
    'Приветствие': 'Greeting',
    'Цитата': 'Quote',
    'Погода': 'Weather',
    'Плеер': 'Audio',
}


const time = document.querySelector('.time');
const date = document.querySelector('.date');
const greeting = document.querySelector('.greeting-text');
const n = document.querySelector('.name');
n.value = localStorage.getItem('name');

function showTime(){
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = `${currentTime}`;
    showDate();
    showGreeting();
}

function showDate(){
    const d = new Date();
    const options = {weekday: 'long', month: 'long', day: 'numeric'};
    const currentDate = d.toLocaleDateString(`${state.language}`, options);
    date.textContent = `${currentDate}`
}

setInterval(showTime, 1000);


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
    let text = `Good ${getTimeOfDay()},`
    if(state.language == 'en'){
        greeting.textContent = text;
    }
    if(state.language == 'ru'){
        if(dictionaryEn[text] !== undefined){
            greeting.textContent = dictionaryEn[text];
        }
    }
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
        try{
            await getLinkToImageUnsplash().then(str => link = str);
        }catch(err){
            await getLinkToImageFlickr().then(str => link = str);
            showError(err);
            const listSource = Array.from(document.querySelectorAll('.list-source > .line-item'));
            let elemFlickr = listSource.find(elem => elem.textContent == 'Flickr API');
            setActiveSource(elemFlickr);
        }
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
    if(res.ok == false){
        throw 'Photo limit exceeded (50)'
    }
    const data = await res.json();
    return data.urls.regular;
}

async function getLinkToImageFlickr(){
    let query = getTimeOfDay();
    if(tagsValue !== ''){
        query = tagsValue;
    }
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=9fc685eec8b55355bb9f700e914e1ee1&tags=${query}&extras=url_l&format=json&nojsoncallback=1&safe_search=1`;

    const res = await fetch(url);
    const data = await res.json();
    return data.photos.photo[getRandomNum(data.photos.photo.length)].url_l;
}


// ________________________________________PLAYER____________________________________________

import playList from '../js/playList.js';
const playBtn = document.querySelector('.play');
const next = document.querySelector('.play-next');
const prev = document.querySelector('.play-prev');
const list = document.querySelector('.play-list');
const timeline = document.querySelector('.timeline');
const progress = document.querySelector('.progress');
const duration = document.querySelector('.player-time-duration');
const current = document.querySelector('.player-time-current');
let songName = document.querySelector('.song-name');
songName.textContent = playList[0].title;
const audio = new Audio();

let isPlay = false;
let playNum = 0;
audio.src = playList[playNum].src;


function setNameSong(){
    songName.textContent = playList[playNum].title;
}

function setCurrentTime(timecode){
    const widthTimeline = getComputedStyle(timeline).width;
    const timeSong = (timecode / parseInt(widthTimeline)) * audio.duration;
    audio.currentTime = timeSong;
    if(!isPlay){
        audio.play();
        isPlay = true;
    }
    toggleBtn();
    fillProgressBar()
}

function fillProgressBar(){
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${progressPercent}%`;
    if(progressPercent == 100){
        playNext();
    }
}

function setCurrentTimeAudio(){
    const currentTime = Math.floor(audio.currentTime);
    let min = String(Math.floor(currentTime / 60));
    let sec = String(currentTime % 60);
    if(sec.length == 1){
        sec = `0${sec}`
    }
    current.textContent = `${min}:${sec}`;
}


audio.addEventListener('timeupdate', fillProgressBar);
audio.addEventListener('timeupdate', setCurrentTimeAudio);

timeline.addEventListener('click', function(event){
    setCurrentTime(event.offsetX);
})

function createPlayList(){
    for(let song of playList){
        let newElem = document.createElement('li');
        newElem.classList.add('play-item-wrapper');
        list.append(newElem);

        let item = document.createElement('div');
        item.classList.add('play-item');
        item.textContent = song.title;
        newElem.append(item);

        let icon = document.createElement('div');
        icon.classList.add('play-item-icon');
        newElem.append(icon);

    }
}

createPlayList();
const items = document.querySelectorAll('.play-item');
const itemsIcon = document.querySelectorAll('.play-item-icon');


function playAudio(){
    duration.textContent = playList[playNum].duration;
    setNameSong();
    if(!isPlay){
        audio.play();
        isPlay = true;
    }else{
        audio.pause();
        isPlay = false;
    }
    
    markPlayingSong();
    toggleBtn();
}

function markPlayingSong(){
    items[playNum].classList.add('item-active');
    itemsIcon[playNum].classList.add('pause-item-icon');
    for(let i = 0; i < items.length; i++){
        if(i !== playNum){
            items[i].classList.remove('item-active');
            itemsIcon[i].classList.remove('pause-item-icon');
        }
    }
}

function toggleBtn(){
    if(!isPlay){
        playBtn.classList.remove('pause');
        itemsIcon[playNum].classList.remove('pause-item-icon');
    }else{
        playBtn.classList.add('pause');
        itemsIcon[playNum].classList.add('pause-item-icon');
    }
}

function setPlaySong(song){
    const num = playList.findIndex(elem => elem.title == song.previousElementSibling.textContent);
    if(playNum !== num){
        isPlay = false;
    }
    playNum = num;
    audio.src = playList[playNum].src;
    playAudio();
}

list.addEventListener('click', function(event){
    if(event.target.classList.contains('play-item-icon')){
        setPlaySong(event.target);
    }
})

playBtn.addEventListener('click', playAudio);

function playNext(){
    if(playNum == (playList.length - 1)){
        playNum = -1;
    }
    playNum++;
    isPlay = false;
    audio.src = playList[playNum].src;
    audio.currentTime = 0;
    playAudio();
}

function playPrev(){
    if(playNum == 0){
        playNum = playList.length;
    }
    playNum--;
    isPlay = false;
    audio.src = playList[playNum].src;
    audio.currentTime = 0;
    playAudio();
}

next.addEventListener('click', playNext);
prev.addEventListener('click', playPrev);

//________________________volume___________________________

const volumeIcon = document.querySelector('.volume-icon');
const volumeRange = document.querySelector('.volume-range');

function offVolume(){
    if(volumeIcon.classList.contains('volume-off')){
        volumeIcon.classList.remove('volume-off');
        volumeRange.value = '20';
        setVolume();
    }else{
        volumeIcon.classList.add('volume-off');
        volumeRange.value = '0';
        setVolume();
    }
}

function progressRange(){
    const progress = volumeRange.value;
    volumeRange.style.setProperty('--progress', `${progress}%`);
}

function changeIconVolume(){
    if(volumeRange.value == '0'){
        volumeIcon.classList.add('volume-off');
    }else{
        volumeIcon.classList.remove('volume-off');
    }
}

function setVolume(){
    audio.volume = (volumeRange.value / 100);
    progressRange();
    changeIconVolume();
}

volumeRange.addEventListener('input', setVolume);
volumeIcon.addEventListener('click', offVolume);


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
        setLanguageWeather(data);
    }
}

await getWeather();

// ___________________________________________________QUOTES____________________________________________________

const quote = document.querySelector('.quote-text');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');

function randomNumQuote(){
    return Math.floor(Math.random() * 100);
}

async function getQuote(){
    let res;
    if(state.language == 'en'){
        res = await fetch(`assets/quotes.json`);
    }else if(state.language == 'ru'){
        res = await fetch(`assets/quotesRU.json`);
    }
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


settingBtn.addEventListener('click', function(){
    settingBtn.classList.toggle('_active');
})

document.addEventListener('click', function(event){
    const isSetting = event.target == setting || setting.contains(event.target) || settingBtn.contains(event.target) || event.target == settingBtn;
    if(!isSetting){
        settingBtn.classList.remove('_active');
    }
})

function setActiveLanguage(elem){
    const itemsLanguage = document.querySelectorAll('.list-language > .line-item');
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
        setActiveLanguage(event.target);
    }
})


function setActiveSource(elem){
    const itemsSource = document.querySelectorAll('.list-source > .line-item');
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
        setActiveSource(event.target);
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


function setSettings(){
    if(localStorage.getItem('state')){
        state = JSON.parse(localStorage.getItem('state'));
    }
    
    let listItemSource = document.querySelectorAll('.list-source .line-item');
    let elemPhotoSource;
    for(let i = 1; i < listItemSource.length; i++){
        if(listItemSource[i].textContent == state.photoSource){
            elemPhotoSource = listItemSource[i];
        }
    }
    setActiveSource(elemPhotoSource);

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

function showError(err){
    const error = document.querySelector('.setting-error');
    error.textContent = err;

    error.style.visibility = 'visible';
    error.style.opacity = '1';

    function hideError(){
        error.style.visibility = 'hidden';
        error.style.opacity = '0';
    }
    setTimeout(hideError, 3000);
}

// // ___________________________________________________LANGUAGE__________________________________________________

function setLanguageWeather(data){
    if(state.language == 'en'){
        wind.textContent = `Wind speed: ${Math.floor(data.wind.speed)} m/s`;
        humidity.textContent = `Humidity: ${data.main.humidity}%`;
        if(city.value == 'Минск'){
            city.value = 'Minsk';
        }
    }else if(state.language == 'ru'){
        wind.textContent = `Скорость ветра: ${Math.floor(data.wind.speed)} m/s`;
        humidity.textContent = `Влажность воздуха: ${data.main.humidity}%`;
        if(city.value == 'Minsk'){
            city.value = 'Минск';
        }
    }
}

function changeLanguageSettingTitle(){
    const settingTitle = document.querySelector('.setting-title');
    if(state.language == 'ru'){
        if(dictionaryEn[settingTitle.textContent] !== undefined){
            settingTitle.textContent = dictionaryEn[settingTitle.textContent];
        }
    }else if(state.language == 'en'){
        if(dictionaryRu[settingTitle.textContent] !== undefined){
            settingTitle.textContent = dictionaryRu[settingTitle.textContent];
        }
    }
}

function changeLanguageLineNames(){
    const lineNames = document.querySelectorAll('.line-name');
    if(state.language == 'ru'){
        for(let line of lineNames){
            if(dictionaryEn[line.textContent] !== undefined){
                line.textContent = dictionaryEn[line.textContent];
            }
        }
    }else if(state.language == 'en'){
        for(let line of lineNames){
            if(dictionaryRu[line.textContent] !== undefined){
                line.textContent = dictionaryRu[line.textContent];
            }
        }
    }
}

function changeLanguagePlaceholder(){
    const greetingText = document.querySelector('.greeting > .name');
    if(state.language == 'en'){
        if(dictionaryRu[greetingText.placeholder] !== undefined){
            greetingText.placeholder = dictionaryRu[greetingText.placeholder];
        }
    }
    if(state.language == 'ru'){
        if(dictionaryEn[greetingText.placeholder] !== undefined){
            greetingText.placeholder = dictionaryEn[greetingText.placeholder];
        }
    }
}


function changeLanguage(){
    getWeather();
    getQuote();
    showDate();
    showGreeting();
    changeLanguageSettingTitle();
    changeLanguageLineNames();
    changeLanguagePlaceholder()

    const listLanguage = document.querySelectorAll('.list-language > .line-item');

    if(state.language == 'ru'){
        for(let item of listLanguage){
            if(dictionaryEn[item.textContent] !== undefined){
                item.textContent = dictionaryEn[item.textContent];
            }
        }
    }else if(state.language == 'en'){
        for(let item of listLanguage){
            if(dictionaryRu[item.textContent] !== undefined){
                item.textContent = dictionaryRu[item.textContent];
            }
        }
    }
}

//________________________________________________________ TODO________________________________________________
let sheets = {
    'Inbox': [],
    'Today': [],
    'Done': [],
}

const todoBtn = document.querySelector('.todo');
const todo = document.querySelector('.todo-content');
const todoHeader = document.querySelector('.todo-header');
const todoList = document.querySelector('.todo-list');
const todoMain = document.querySelector('.todo-main');
const todoSheets = Array.from(document.querySelectorAll('.todo-sheet'));
const todoInput = document.querySelector('.todo-input');
const listItems = document.querySelector('.list-items')


function showTodo(){
    if(todo.classList.contains('_active')){
        todo.classList.remove('_active');
    }else{
        todo.classList.add('_active');
    }
}

document.addEventListener('click', function(event){
    const isTodo = event.target == todo || todo.contains(event.target) || event.target == todoBtn 
                    || event.target.classList.contains('task-setting-item') || event.target.classList.contains('list-item-delete');
    if(!isTodo){
        todo.classList.remove('_active');
    }
})

todoBtn.addEventListener('click', showTodo);

function showList(){
    if(todoList.classList.contains('_active')){
        todoList.classList.remove('_active');
    }else{
        todoList.classList.add('_active');
    }
    setHeightTodo();
}

todoHeader.addEventListener('click', function(event){
    if((event.target == todoHeader || todoHeader.contains(event.target)) && event.target !== todoList && !todoList.contains(event.target)){
        showList();
    }
});

document.addEventListener('click', function(event){
    const isList = event.target == todoList || todoList.contains(event.target) || event.target == todoHeader || todoHeader.contains(event.target);
    if(!isList){
        todoList.classList.remove('_active')
        setHeightTodo();
    }
})

function setHeightTodo(){
    if(todoList.classList.contains('_active')){
        todoMain.style.minHeight = `${todoList.offsetHeight + todoInput.offsetHeight + 10}px`;
    }else{
        todoMain.style.minHeight = '0px';
    }
}

let activeSheet = 'Today';
const activeSheetName = document.querySelector('.todo-active-name');

if(localStorage.getItem('activeSheet')){
    activeSheet = localStorage.getItem('activeSheet');
    setActiveSheet(activeSheet);
}

function setActiveSheet(nameSheet){
    activeSheetName.textContent = nameSheet;
    activeSheet = nameSheet;
    for(let item of todoSheets){
        if(item.dataset.sheet == nameSheet) {
            item.classList.add('_active');
        }else{
            item.classList.remove('_active')
        }
    }
}

function deleteSheet(nameSheet){
    for(let item of todoSheets){
        if(item.dataset.sheet == nameSheet){
            item.remove();
        }
    }
    if(activeSheet == nameSheet){
        setActiveSheet('Today');
    }

    delete sheets[nameSheet];
}

listItems.addEventListener('click', function(event){
    if(event.target.classList.contains('list-item-delete')){
        event.target.parentElement.remove();
        deleteSheet(event.target.previousElementSibling.textContent);
    }else{
        setActiveSheet(event.target.textContent);
        showList();
    }
})


function createTask(nameTask){
    const newTask = document.createElement('div');
    newTask.classList.add('todo-task');
    
    const newCheckbox = document.createElement('input');
    newCheckbox.classList.add('task-input');
    newCheckbox.type = 'checkbox';
    newTask.append(newCheckbox);

    const newTaskName = document.createElement('input');
    newTaskName.classList.add('task-name')
    newTaskName.value = nameTask;
    newTaskName.disabled = true;
    newTask.append(newTaskName);
    newTask.append(createTaskSetting());
    newTask.append(createTaskSettingList());


    return newTask;
}

function saveTask(nameTask = todoInput.value){
    sheets[activeSheet].push(nameTask);
}

function createTaskSetting(){
    const newTaskSetting = document.createElement('div');
    newTaskSetting.classList.add('task-setting');

    const newTaskSettingIconWrapper = document.createElement('div');
    newTaskSettingIconWrapper.classList.add('task-setting-icon-wrapper');
    newTaskSetting.append(newTaskSettingIconWrapper);

    const newTaskSettingIcon = document.createElement('div');
    newTaskSettingIcon.classList.add('task-setting-icon');
    newTaskSettingIconWrapper.append(newTaskSettingIcon);

    return newTaskSetting;
}

function createTaskSettingList(){
    const newTaskSettingList = document.createElement('div');
    newTaskSettingList.classList.add('task-setting-list');

    for(let i = 0; i < 3; i++){
        const newTaskSettingItem = document.createElement('div');
        newTaskSettingItem.classList.add('task-setting-item');
        newTaskSettingList.append(newTaskSettingItem);
        if(i == 0){
            newTaskSettingItem.textContent = 'Edit';
        }
        if(i == 1){
            newTaskSettingItem.textContent = 'Move to Inbox';
        }
        if(i == 2){
            newTaskSettingItem.textContent = 'Delete';
        }
    }

    return newTaskSettingList;
}

const tasksSetting = Array.from(document.querySelectorAll('.task-setting-list'));

function addTaskInActiveSheet(nameTask = todoInput.value, sheet = activeSheet){
    for(let item of todoSheets){
        if(item.dataset.sheet == sheet) {
            const newTask = createTask(nameTask);
            tasksSetting.push(newTask.lastElementChild);
            item.append(newTask);

            if(sheet == 'Done'){
                newTask.querySelector('.task-input').checked = true;
            }
        }
    }

    setActiveSheet(activeSheet);
}

todoInput.addEventListener('change', function(){
    addTaskInActiveSheet();
    saveTask();
    todoInput.value = '';
});

const listInput = document.querySelector('.list-input');

function createNewSheet(nameSheet = listInput.value){
    const newListItem = document.createElement('li');
    newListItem.classList.add('list-item');

    const newListItemName = document.createElement('div');
    newListItemName.classList.add('list-item-name');
    newListItemName.textContent = nameSheet;
    newListItem.append(newListItemName);

    const newListItemDelete = document.createElement('div');
    newListItemDelete.classList.add('list-item-delete');
    newListItem.append(newListItemDelete);

    listItems.append(newListItem);
    
    const newSheet = document.createElement('div');
    newSheet.classList.add('todo-sheet');
    newSheet.dataset.sheet = nameSheet;
    

    todoMain.append(newSheet);

    todoSheets.push(newSheet);
}

function saveSheet(nameSheet = listInput.value){
    sheets[nameSheet] = [];
}


listInput.addEventListener('change', function(){
    createNewSheet();
    activeSheet = listInput.value;
    setActiveSheet(activeSheet);
    showList();
    saveSheet();
    listInput.value = '';
});


function showTaskSetting(elem){
    
    for(let item of tasksSetting){
        if(item !== elem){
            item.classList.remove('_active');
            item.parentElement.style.minHeight = `0px`;
        }
    }
    if(elem.classList.contains('_active')){
        elem.classList.remove('_active');
        elem.parentElement.style.minHeight = `0px`;
    }else{
        elem.classList.add('_active');
        elem.parentElement.style.minHeight = `${elem.offsetHeight}px`;
    }
}

todoMain.addEventListener('click', function(event){
    if(event.target.classList.contains('task-setting')){
        showTaskSetting(event.target.nextElementSibling);
    }
    
})

todo.addEventListener('click', function(event){
    if(!event.target.classList.contains('task-setting')){
        for(let item of tasksSetting){
            item.classList.remove('_active');
            item.parentElement.style.minHeight = `0px`;
        }
    }
})

function editTask(task){
    const input = task.querySelector('.task-name');
    console.log(input.value);
    const indexTask = sheets[activeSheet].findIndex(elem => elem == input.value);
    
    input.disabled = false;
    input.focus();
    input.addEventListener('change', function(){
        input.disabled = true; 
        sheets[activeSheet][indexTask] = input.value;
    })
}

function moveTask(task, sheet){
    let oldSheet = task.parentElement;
    oldSheet.removeChild(task);

    const taskName = task.querySelector('.task-name').value;
    const indexTask = sheets[activeSheet].findIndex(elem => elem == taskName);
    sheets[activeSheet].splice(indexTask, 1);

    const newSheet = document.querySelector(`div[data-sheet="${sheet}"]`);
    newSheet.append(task);

    sheets[sheet].push(taskName);
}

function deleteTask(task){
    const taskName = task.querySelector('.task-name').value;
    const indexTask = sheets[activeSheet].findIndex(elem => elem == taskName);
    sheets[activeSheet].splice(indexTask, 1);
    task.remove();
}

todoMain.addEventListener('click', function(event){
    if(event.target.classList.contains('task-input')){
        let task = event.target.parentElement;
        if(event.target.checked){
            moveTask(task, 'Done');
        }else{
            moveTask(task, 'Inbox');
        }
    }
    if(event.target.classList.contains('task-setting-item')){
        let task = event.target.parentElement.parentElement;
        if(event.target.textContent == 'Edit'){
            editTask(task);
        }
        if(event.target.textContent == 'Move to Inbox'){
            moveTask(task, 'Inbox');
        }
        if(event.target.textContent == 'Delete'){
            deleteTask(task);
        }
    }
})

function setTodo(){
    if(localStorage.getItem('sheets')){
        sheets = JSON.parse(localStorage.getItem('sheets'));
    }
    for(let sheet in sheets){
        if(sheet !== 'Today' && sheet !== 'Done' && sheet !== 'Inbox'){
            createNewSheet(sheet);
        }
        for(let task of sheets[sheet]){
            addTaskInActiveSheet(task, sheet);
        }
    }
}

setTodo();

// ____________________________________________________LOCAL_STORAGE____________________________________________

function setLocalStorage(){
    localStorage.setItem('name', n.value);
    localStorage.setItem('city', city.value);
    localStorage.setItem('state', JSON.stringify(state));
    localStorage.setItem('tags', tagsValue);
    localStorage.setItem('sheets', JSON.stringify(sheets));
    localStorage.setItem('activeSheet', activeSheet);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
    if(localStorage.getItem('name')) {
        n.value = localStorage.getItem('name');
    }
   
  }
window.addEventListener('load', getLocalStorage)
