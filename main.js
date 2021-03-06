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
	const width = mainScreen.size.width - widthOffset;
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

	app.on('browser-window-focus', () => {
		if (win) {
			win.setSize(width, height);
		}
	});

	app.on('browser-window-blur', () => {
		if (win) {
			win.setSize(1, 1);
		}
	});
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
