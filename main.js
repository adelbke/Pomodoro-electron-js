const { app, BrowserWindow } = require("electron");
// const electron = require("electron");
// const { app, BrowserWindow } = electron

// module for hot reloading
require('electron-reload')(__dirname);

app.whenReady().then(createWindow);


// alternative
// app.on('ready', () => {
// 	createWindow
// });


function createWindow() {
	const window = new BrowserWindow({
		width:400,
		height:150,
		webPreferences:{
			nodeIntegration:true
		},
		frame:false,
		// resizable:false
	});
	window.loadURL(`file://${__dirname}/index.html`);

	window.loadFile("index.html");
}
