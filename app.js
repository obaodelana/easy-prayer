class Prayer {
	number = 1;
	text = "";
	book = "";
	chapter = 1;
	verses = [];
	passage = "";

	constructor(number = 1) {
		this.number = number;
	}

	get biblePath() {
		const verseRange = (this.verses.length > 1
			&& this.verses[this.verses.length - 1] == this.verses[0] + this.verses.length - 1)
			? `${this.verses[0]}-${this.verses[this.verses.length - 1]}`
			: this.verses.join(",");
		return this.book + ` ${this.chapter}:${verseRange}`
	}

	toString() {
		return `Prayer ${this.number}\n${this.text}\n${this.biblePath}\n\r${this.biblePath}\n${this.passage}\n\r`;
	}
}

class Parser {
	words = [];
	wordIndex = 0;

	prayers = [];

	constructor(text) {
		const separators = /(?:\s*(\d\s*\w+[.]*)(\s*)(\d+))|(\d+)|(\s+)/;
		this.words = text.split(separators).filter((w) => {
			return w != undefined && !w.includes('\n') && !w.includes('\r') && w.length > 0
		});
		// console.log(this.words);
		// return;

		let prayerCount = 0;
		while (this.wordIndex < this.words.length) {
			let prayerFound = this.consumeUntil(/p?rayer/);
			if (!prayerFound) {
				if (prayerCount > 0) {
					break;
				}
				throw new Error(`Word 'prayer' not found when trying to parse "Prayer ${prayerCount + 1}"`);
			} else {
				this.consume();
			}
			
			let prayerHasNumber = this.consumeUntil(/[0-9]/);
			if (!prayerHasNumber) {
				throw new Error(`No number found while parsing "Prayer ${prayerCount + 1}"`);
			} else {
				this.prayers.push(new Prayer(parseInt(this.consume())));
			}

			let hasText = this.consumeUntil(/\w/);
			if (!hasText) {
				throw new Error(`No text in "Prayer ${prayerCount + 1}`);
			} else {				
				let prayerText = "";
				while (!this.expectBibleBook()) {
					let word = this.consume();
					if (word == null) break; 

					prayerText += word;
				}	
				this.prayers[prayerCount].text = prayerText.trimEnd();
			}

			let bibleBook = this.expectBibleBook();
			if (bibleBook == null) {
				throw new Error(`No Bible book included in "Prayer ${prayerCount + 1}"`)
			}
			this.prayers[prayerCount].book = bibleBook;
			this.consume();

			let hasChapter = this.consumeUntil(/[0-9]/);
			if (!hasChapter) {
				throw new Error(`No chapter after book in "Prayer ${prayerCount + 1}"`);
			} else {
				this.prayers[prayerCount].chapter = parseInt(this.consume());
			}

			let hasVerse = this.consumeUntil(/[0-9]/);
			if (hasVerse) {
				const startingVerse = parseInt(this.consume());
				this.prayers[prayerCount].verses = [startingVerse];

				if (this.expect(/[-/,]/)) {
					do {
						let sep = this.consume();
						let hasMoreVerses = this.consumeUntil(/[0-9]/);
						if (!hasMoreVerses) {
							throw new Error(`Invalid '${sep}' found in Bible description in "Prayer ${prayerCount + 1}"`);
						} else {
							const endVerse = parseInt(this.consume());
							if (sep.includes('-')) {
								for (let verse = startingVerse + 1; verse <= endVerse; verse++) {
									this.prayers[prayerCount].verses.push(verse);
								}
							} else {
								this.prayers[prayerCount].verses.push(endVerse);
							}
						}
					} while (this.expect(/[/,]/));
				}
			}

			prayerCount++;
		}
	}

	expectBibleBook() {
		if (this.expect(/(\d\s*)?\w+/, /\s+/, /\d+/, ":", /\d+/)) {
			return this.words[this.wordIndex];
		}
		return null;
	}

	expect(...expressions) {
		if (this.wordIndex + (expressions.length - 1) < this.words.length) {
			let allMatch = true;
			for (let i = 0; i < expressions.length; i++) {
				if (this.words[this.wordIndex + i].match(new RegExp(expressions[i], "i")) == null) {
					allMatch = false;
				}
			}
			return allMatch;
		}
		return false;
	}

	consume() {
		if (this.wordIndex < this.words.length) {
			return this.words[this.wordIndex++];
		}
		return null;
	}

	consumeUntil(expression) {
		let startingIndex = this.wordIndex;
		while (this.wordIndex < this.words.length) {
			if (this.words[this.wordIndex].match(new RegExp(expression, "i"))) {
				return true;
			}
			this.wordIndex++;
		}
		this.wordIndex = startingIndex;
		return false;
	}
}

const button = document.getElementById("button");
button.addEventListener("click", build);

async function build() {
	const textArea = document.getElementById("textarea");
	let prayers = parse(textArea.value);
	textArea.value = await generate(prayers);
}

function parse(text) {
	let parser = new Parser(text);
	try {
		return parser.prayers;
	} catch(e) {
		return [];
	}
}

async function generate(prayers) {
	let string = "";
	for (const prayer of prayers) {
		await fetch(`https://bible-api.com/${prayer.biblePath}?translation=kjv&verse_numbers=true`)
		.then(response => {
			if (response.ok) {
				return response.json();
			}	
			return "error";
		})
		.then(data => {
			prayer.passage = data["text"].replace(/\n/g, ' ');
		})
		.catch(error => {
			return "error";
		});
		string += prayer.toString();
	}
	return string;
}
