const { remote } = require('electron');

const lineLength = 39;
let themes = [];
let parts = [];
let index = 0;
let themeIndex = 0;

window.addEventListener('keyup', (event) => {
	if (event.key === 'Escape') {
		remote.getCurrentWindow().close();
	}
});

document.getElementById('file').addEventListener('change', (even) => {
	const reader = new FileReader();
	reader.onloadend = (event) => {
		themes = JSON.parse(event.target.result);
		init();
	};

	reader.readAsText(even.target.files[0]);
});

const notLargePhrases = (phrases) => {
	return phrases.reduce((acc, current) => {
		if (current.length > lineLength) {
			const parts = current.split(' ');

			let middle = parts.length / 2;
			if (parts.length % 2 !== 0) {
				middle = Math.floor(middle);
			}

			return acc.concat([
				parts.slice(0, middle).join(' '),
				parts.slice(middle, parts.length).join(' '),
			]);
		}

		return acc.concat(current);
	}, []);
};

const checkTexts = (text) => {
	return notLargePhrases(
		notLargePhrases(
			text.split('').reduce(
				(acc, current) => {
					const last = acc[acc.length - 1];

					if (current === ',' || current === '.') {
						return acc.splice(0, acc.length - 1).concat([last + current, '']);
					}

					return acc.splice(0, acc.length - 1).concat(last + current);
				},
				[''],
			),
		),
	);
};

const init = () => {
	console.log('iint');

	document.getElementById('file-label').remove();

	window.addEventListener('wheel', (event) => {
		if (event.deltaY > 0) {
			mouseDown();
		} else {
			mouseUp();
		}
		updateText();
	});

	window.addEventListener('mouseup', (event) => {
		if (event.which === 1) {
			mouseLeft();
		}

		if (event.which === 3) {
			mouseRight();
		}

		updateText();
	});
	window.addEventListener('keyup', (event) => {
		if (event.key === 'ArrowDown') {
			mouseDown();
		}

		if (event.key === 'ArrowUp') {
			mouseUp();
		}

		if (event.key === 'ArrowRight') {
			mouseRight();
		}

		if (event.key === 'ArrowLeft') {
			mouseLeft();
		}

		updateText();
	});

	parts = themes.map(({ title, text }) => {
		return {
			title,
			text: checkTexts(text),
		};
	});

	updateText();
};

const mouseDown = () => {
	if (index >= parts[themeIndex].text.length - 1) {
		return;
	}
	index += 1;
};
const mouseUp = () => {
	if (index <= 0) {
		return;
	}

	index -= 1;
};
const mouseLeft = () => {
	if (themeIndex <= 0) {
		return;
	}

	themeIndex -= 1;
	index = 0;
};
const mouseRight = () => {
	if (themeIndex >= parts.length - 1) {
		return;
	}

	index = 0;
	themeIndex += 1;
};

const textElement = document.getElementById('text');
const textTitle = document.getElementById('title');

const updateText = () => {
	console.log(index, themeIndex);

	textElement.textContent = parts[themeIndex].text[index];
	textTitle.textContent = parts[themeIndex].title;
};
