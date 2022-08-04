const time = document.querySelector('.time');
const date = document.querySelector('.date');

function showTime(){
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = `${currentTime}`;
    showDate();
    setInterval(showTime, 1000);
}

function showDate(){
    const d = new Date();
    const options = {weekday: 'long', month: 'long', day: 'numeric'};
    const currentDate = d.toLocaleDateString('en-EN', options);
    date.textContent = `${currentDate}`
}

showTime();
