const { app, BrowserWindow } = require("electron");
// const electron = require("electron");
// const { app, BrowserWindow } = electron


app.whenReady().then(createWindow);


// alternative
// app.on('ready', () => {
// 	createWindow
// });


function createWindow() {
	const window = new BrowserWindow({
		width:800,
		height:600,
		webPreferences:{
			nodeIntegration:true
		}
	});

	window.loadFile("index.html");
}
