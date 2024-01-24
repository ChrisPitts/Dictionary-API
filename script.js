function searchButtonClicked() {
	searchWord(document.getElementById('searchbar').value);
}

function searchWord(word) {
	document.getElementById('searchbar').value = word;

	console.log(document.getElementById('searchbar').value);
	// document.querySelector('#container__main').innerHTML = `<h1>${word}</h1>`;

	let data;
	const request = new XMLHttpRequest();

	request.open(
		'GET',
		`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
	);
	request.responseType = 'json';

	request.onload = () => {
		if (request.status != 200) handleHTTPError(request.status);
		else {
			data = request.response;

			console.log(data[0]);
			generateHTML(data[0]);
		}
	};

	request.send();
}

function handleHTTPError(status) {
	switch (status) {
		case 404:
			alert('Word not found');
			break;
		default:
			alert(`Error ${status}`);
	}
}

function generateHTML(data) {
	let container = document.querySelector('#container__main');
	container.innerHTML = '';

	generateWordSection(data);
	generateDefinitions(data);

	
    if (data.sourceUrls.length != 0)
    {
        let sourceParagraph = document.createElement('p');
        sourceParagraph.innerHTML = `Source: <a href=${data.sourceUrls[0]}>${data.sourceUrls[0]}</a>`;
        container.appendChild(sourceParagraph);
	}
}

function generateWordSection(data) {
	let container = document.createElement('div');
	container.classList.add('container__word');
	document.querySelector('#container__main').appendChild(container);

	let wordDiv = document.createElement('div');
	container.appendChild(wordDiv);

	wordDiv.innerHTML = `<h1>${data.word}</h1>
    <p>${data['phonetic']}</p>`;

	// Create audio button
	if (data.phonetics.length != 0) {
		let button = document.createElement('button');
		button.classList.add('audio');
		let btnImg = document.createElement('img');
		btnImg.src = 'assets/images/icon-play.svg';
		button.appendChild(btnImg);
		container.appendChild(button);

		button.onclick = () => {
			let audio = new Audio(data.phonetics[data.phonetics.length - 1].audio);
			audio.play();
		};
	}
}

function generateDefinitions(data) {
	data.meanings.forEach((meaning) => {
		let section = document.createElement('section');
		document.querySelector('#container__main').appendChild(section);

		// create the part of speech header
		let header = document.createElement('h2');
		header.innerHTML = `${meaning.partOfSpeech}`;
		section.appendChild(header);

		// add the definitions
		let list = document.createElement('ul');
		section.appendChild(list);

		meaning.definitions.forEach((definition) => {
			let item = document.createElement('li');
			item.innerHTML = definition.definition;
			list.appendChild(item);
			if (definition.example) {
				let exampleParagraph = document.createElement('p');
				exampleParagraph.classList.add('example');
				exampleParagraph.innerHTML = `Example: "${definition.example}"`;
				list.appendChild(exampleParagraph);
			}
		});

		// GENERATE SYNONYMS
		if (meaning.synonyms.length != 0) {
			let span = document.createElement('div');
			section.appendChild(span);
			span.innerHTML = `Synonyms: `;
			meaning.synonyms.forEach((synonym) => {
				let button = document.createElement('button');
				button.classList.add('synonym');
				button.innerHTML = `${synonym}`;
				button.onclick = () => {
					searchWord(synonym);
				};
				span.appendChild(button);
			});
		}

		// GENERATE ANTONYMS
		if (meaning.antonyms.length != 0) {
			let span = document.createElement('div');
			section.appendChild(span);
			span.innerHTML = `Antonyms: `;
			meaning.antonyms.forEach((antonym) => {
				let button = document.createElement('button');
				button.classList.add('synonym');
				button.innerHTML = `${antonym}`;
				button.onclick = () => {
					searchWord(antonym);
				};
				span.appendChild(button);
			});
		}
	});
}
