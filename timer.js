const currentTimeElement = document.getElementById('current-time');
const timerElement = document.getElementById('timer');
const btnStart = document.getElementById('btn-start');


// setup the "clock"
let time;

setInterval(function () {
	time = new Date();
	currentTimeElement.innerText = time.toLocaleTimeString('UK');
},1000);


// setup the timer time

let timer = new Date(0,0,0,0,0,0,0);
timerElement.innerText = timer.toLocaleTimeString('UK');

const startTimer = () =>{
	var targetTime = new Date();
	const minute25 = new Date();
	minute25.setMinutes(25);
	targetTime+= minute25;
}
btnStart.addEventListener('click',startTimer);
