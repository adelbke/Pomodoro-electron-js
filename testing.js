class Duration {
	constructor(milliseconds) {
		this.milliseconds = milliseconds;
	}

	addMilliseconds(milliseconds) {
		this.milliseconds = this.milliseconds + milliseconds;
	}

	addSeconds(seconds) {
		this.milliseconds += seconds * 1000;
	}

	addMinutes(minutes) {
		this.milliseconds += minutes * 60000;
	}

	static minutes(minute) {
		return minute * 60000;
	}

	addHours(hours) {
		this.milliseconds += hours * 3600000;
	}

	getHours() {
		return Math.floor(this.milliseconds / 3600000);
	}

	getMinutes() {
		return Math.floor(this.milliseconds / 60000);
	}

	getSeconds() {
		return Math.floor(this.milliseconds / 1000);
	}

	getMilliseconds() {
		return this.milliseconds % 1000;
	}

	toFormattedString() {
		var hours, minutes, seconds, milliseconds;

		hours = Math.floor(this.milliseconds / 3600000);
		var ms = this.milliseconds%3600000;

		minutes = Math.floor(ms / 60000);
		ms = ms%60000;

		seconds = Math.floor(ms / 1000);

		return `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}:${(
			"0" + seconds
		).slice(-2)}`;
	}

	value() {
		return {
			hours: this.getHours(),
			minutes: this.getMinutes(),
			seconds: this.getSeconds(),
			milliseconds: this.getMilliseconds(),
		};
	}
}

class Timer {
	// setup the timer
	constructor(duration, timeUpCallback) {
		this.duration = duration;
		this.topCallBack = timeUpCallback;
		this.counting = false;
		this._offset = new Duration(0);
	}

	start() {
		this.startTime = new Date();
		var currentObject = this;
		this.mainTimeout = setTimeout(function () {
			currentObject.stopTime = new Date();
			currentObject.counting = false;
			currentObject.startTime = null;
			currentObject.topCallBack();
		}, this.duration.milliseconds - this._offset.milliseconds);
		this.counting = true;
	}

	pause() {
		this.stopTime = new Date();
		clearInterval(this.mainTimeout);
		this._offset = new Duration(
			this.stopTime.getTime() -
				this.startTime.getTime() +
				this._offset.milliseconds
		);
		this.counting = false;
	}

	stop() {
		this.stopTime = null;
		this._offset = new Duration(0);
		this.counting = false;
		clearInterval(this.mainTimeout);
	}

	getCount() {
		if (this.counting) {
			// this is counting so we start from now back to starting time + the offset
			return new Duration(
				new Date().getTime() -
					this.startTime.getTime() +
					this._offset.milliseconds
			);
		} else {
			// this isn't counting so we use the stopped Time
			return this._offset;
		}
	}
}


class Pomodoro{
	static start(){
		if(!Pomodoro.cycleindex){
			Pomodoro.cycleindex = 0;
		}
		Pomodoro.counting = true
		Pomodoro.Cycles[Pomodoro.cycleindex].timer.start();

	}
	static Cycles = [
		{
			timer: new Timer(new Duration(Duration.minutes(25)),Pomodoro.done),
			type:"Work"
		},
		{
			timer: new Timer(new Duration(Duration.minutes(5)),Pomodoro.done),
			type:"Break"
		},
		{
			timer: new Timer(new Duration(Duration.minutes(25)),Pomodoro.done),
			type:"Work"
		},
		{
			timer: new Timer(new Duration(Duration.minutes(5)),Pomodoro.done),
			type:"Break"
		},
		{
			timer: new Timer(new Duration(Duration.minutes(25)),Pomodoro.done),
			type:"Work"
		},
		{
			timer: new Timer(new Duration(Duration.minutes(5)),Pomodoro.done),
			type:"Break"
		},
		{
			timer: new Timer(new Duration(Duration.minutes(25)),Pomodoro.done),
			type:"Work"
		},
		{
			timer: new Timer(new Duration(Duration.minutes(20)),Pomodoro.done),
			type:"Break"
		},
	];

	static done(){
		let nextIndex = Pomodoro.cycleindex >= Pomodoro.Cycles.length ? 0:Pomodoro.cycleindex+=1;
		let current = Pomodoro.Cycles[Pomodoro.cycleindex];
		current.timer.stop();
		Pomodoro.cycleindex = nextIndex;
		Pomodoro.start()
	}

	static pause(){
		Pomodoro.Cycles[Pomodoro.cycleindex].timer.pause();
		Pomodoro.counting = false;
	}

	static reset(){
		let current = Pomodoro.Cycles[Pomodoro.cycleindex];
		current.timer.stop();
		Pomodoro.cycleindex = 0;
	}

	static getCurrent(){
		return Pomodoro.Cycles[Pomodoro.cycleindex];
	}
}


const timerElement = document.getElementById('timer');
const mainButton = document.getElementById('main-button');
const resetButton = document.getElementById('reset-button');
const cycleIndicator = document.getElementById('cycle-inidcator');
const remainingIndicator = document.getElementById('remaining-time');
const typeIndicator = document.getElementById('type-indicator');

function setButtonToStop() {
	mainButton.classList.remove('btn-primary')
	mainButton.classList.add('btn-danger')
	mainButton.innerText = "Stop timer";
}

function setButtonToStart() {
	mainButton.classList.add('btn-primary')
	mainButton.classList.remove('btn-danger')
	mainButton.innerText = "Start timer";
}

mainButton.addEventListener("click",function () {
	if(Pomodoro.counting){
		Pomodoro.pause();
		setButtonToStart();
	}else{
		setButtonToStop();
		Pomodoro.start();
		cycleIndicator.innerText = "Cycle: "+(Pomodoro.cycleindex+1)
		typeIndicator.innerText = Pomodoro.getCurrent().type
		setInterval(function () {
			let timer = Pomodoro.getCurrent().timer;
			timerElement.innerText = timer.getCount().toFormattedString();
			remainingIndicator.innerHTML = "Remaining <br>"+new Duration(timer.duration.milliseconds - timer.getCount().milliseconds).toFormattedString()
		},1000);
	}
	
});

resetButton.addEventListener("click",function () {
	Pomodoro.reset();
	cycleIndicator.innerText = "";
	typeIndicator.innerText = "";
})