const { app, BrowserWindow, screen } = require('electron');
const debug = require('electron-debug');

debug({
	showDevTools: false,
});

const height = 150;
const y = 0;
const widthOffset = 200;

function createWindow() {
	const [mainScreen] = screen.getAllDisplays();
	const x = widthOffset / 2;
	const win = new BrowserWindow({
		width: mainScreen.size.width - widthOffset,
		height,
		x,
		y,
		webPreferences: {
			nodeIntegration: true,
		},
		frame: false,
	});
	win.setAlwaysOnTop(true, 'floating');
	win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	app.quit();
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
