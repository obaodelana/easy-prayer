const TokenType = Object.freeze({
	Text: "text",
	Number: "number",
	Delimiter: "delimiter",
})

class Token {
	#string = ""
	#type = TokenType.Text

	constructor(string, type) {
		this.#string = string
		this.#type = (type !== undefined) ? type : TokenType.Text
	}

	get string() { return this.#string }
	get type() { return this.#type }

	toString() { return this.#string }
}

class Parser {
	#pointer = 0
	#tokens = []
	#prayers = []

	get prayers() { return Object.freeze(this.#prayers) }

	constructor(string) {
		this.#tokens = Object.freeze(this.#tokenize(string)) // Make immutable

		let counter = 1;
		while (this.#pointer < this.#tokens.length) {
			let prayerNumber = counter++
			let prayerText = ""
			let book = ""
			let chapter = 0
			let verses = []

			// Look for "Prayer"
			if (this.#consume("[Text Prayer]") == -1) {
				break
			}

			// Get number after "Prayer"
			const prayerNumberIndex = this.#consume("[Number]")
			if (prayerNumberIndex != -1) {
				prayerNumber = parseInt(this.#tokens[prayerNumberIndex])
			} else {
				throw new Error(`One of the prayers have no number`)
			}

			// Remove unnecessary delimiter after prayer number
			if (this.#pointer < this.#tokens.length) {
				const currToken = this.#tokens[this.#pointer]
				if (currToken !== undefined && currToken.type == "delimiter") {
					this.#pointer++
				}
			}

			// Look for Scripture reference
			const oldPointer = this.#pointer
			const scriptureStartIndex = this.#consume("[Number*][Text][Number][Delimiter :][Number]", false)
			if (scriptureStartIndex == -1) {
				throw new Error(`Prayer ${prayerNumber} does not have a Scripture`)
			} else {
				prayerText = this.#tokens.slice(oldPointer, scriptureStartIndex).join(" ")
			}

			// Get book, chapter and starting verse
			let afterBook = scriptureStartIndex + 1
			// If "Book" contains a number
			if (!isNaN(parseInt(this.#tokens[scriptureStartIndex]))) {
				book = `${this.#tokens[scriptureStartIndex]} ${this.#tokens[scriptureStartIndex + 1]}`
				afterBook += 1
			} else {
				book = this.#tokens[scriptureStartIndex].toString()
			}
			chapter = parseInt(this.#tokens[afterBook])
			verses.push(parseInt(this.#tokens[afterBook + 2])) // Start verse

			// Get extra verses if any
			let lastPointer = this.#pointer
			let endVerseStart = -1
			endVerseLoop:
			while ((endVerseStart = this.#consume("[Delimiter][Number]", false)) != -1) {
				const delimiter = this.#tokens[endVerseStart].string
				const number = parseInt(this.#tokens[endVerseStart + 1])
				switch (delimiter) {
					case '-': case '–': case '—':
						const lastVerse = verses[verses.length - 1]
						if (lastVerse > number) {
							throw new Error(`Prayer ${prayerNumber} has an invalid verse range`)
						} else {
							for (let i = lastVerse + 1; i <= number; i++) {
								verses.push(i)
							}
						}
						break;
					case ',': case '/':
						verses.push(number)
						break;
					// Invalid match
					default:
						this.#pointer = lastPointer
						break endVerseLoop
				}

				lastPointer = this.#pointer
			}

			this.#prayers.push(new Prayer(prayerNumber, prayerText, new Scripture(book, chapter, verses)))
		}
	}

	#tokenize(string) {
		if (typeof (string) !== "string") {
			throw new TypeError()
		}

		const numbers = "0123456789"
		const delimiters = [':', ',', '/', '-', '–', '—']

		let tokens = []
		let str = ""
		for (let i = 0; i < string.length; i++) {
			let c = string[i]
			// If it's not a regular printable character and not a delimiter
			if (!(c >= ' ' && c <= '~') && !delimiters.includes(c)) {
				continue
			}

			const isWhitespace = (c.trim() === '')
			const isNumber = (c >= '0' && c <= '9')
			const isDelimiter = delimiters.includes(c)

			if (isNumber) {
				str += c
				while (i + 1 < string.length && (string[i + 1] >= '0' && string[i + 1] <= '9')) {
					str += string[++i]
				}
				tokens.push(new Token(str, TokenType.Number))
			} else if (isDelimiter) {
				tokens.push(new Token(c, TokenType.Delimiter))
			} else if (!isWhitespace) {
				str += c
				while (i + 1 < string.length
					&& string[i + 1].trim() !== ''
					&& !numbers.includes(string[i + 1])) {
					str += string[++i]
				}
				tokens.push(new Token(str))
			} else {
				// Ignore whitespace
				while (i + 1 < string.length && string[i + 1].trim() === '') {
					i++
				}
			}

			str = ""
		}

		return tokens
	}

	/*
	 * expression: string - Defines the pattern to look out for
	 * from: number - Starting position of loop (defaults to `#pointer)
	 */
	#consume(expression, consumePrayer) {
		if (consumePrayer === undefined) {
			consumePrayer = true
		}

		let [startP, endP] = this.#find(expression, this.#pointer, consumePrayer)
		// We got a match
		if (startP != -1 && endP != -1) {
			this.#pointer = endP + 1 // Consume
		}

		return startP
	}

	#find(expression, from, consumePrayer) {
		if (from === undefined) {
			from = this.#pointer
		}
		if (consumePrayer === undefined) {
			consumePrayer = true
		}

		let firstP = -1
		let lastP = -1

		// Get "..." in "[...]"
		const expressions = expression.split(/\[([^\[\]]+)\]/).filter((e) => e !== '')
		const optionals = expressions.map((e) => e[e.length - 1] == '*')

		tokenLoop:
		for (let i = from; i < this.#tokens.length; i++) {
			for (let j = 0; j < expressions.length; j++) {
				const tokenIndex = i + j
				if (tokenIndex >= this.#tokens.lengths || this.#tokens[tokenIndex] === undefined) {
					if (!optionals[j]) {
						return [-1, -1]
					}
				} else {
					const words = expressions[j].split(' ', 2)
					let type = words[0].toLowerCase()
					let string = (words.length == 2) ? words[1] : this.#tokens[tokenIndex].string
					// Remove '*' at the end
					if (type[type.length - 1] == '*') {
						type = type.substring(0, type.length - 1)
					} else if (string[string.length - 1] == '*') {
						string = string.substring(0, string.length - 1)
					}

					// We got a match
					if (type == this.#tokens[tokenIndex].type && string == this.#tokens[tokenIndex].string) {
						if (firstP == -1) {
							firstP = tokenIndex
						}
						lastP = tokenIndex
						// If we somehow stumble on the string "Prayer" and we're not allowed to consume it
					} else if (!consumePrayer && this.#tokens[tokenIndex].string == "Prayer") {
						// Then, we're entering another prayer, so stop consuming
						return [-1, -1];
						// Not a match (for non-optionals, we move to next token)
					} else if (!optionals[j]) {
						firstP = lastP = -1
						continue tokenLoop
					}
				}
			}

			// Completely matched expression
			break
		}

		return [firstP, lastP]
	}
}
