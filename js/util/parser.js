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

	get string() { return this.#string}
	get type() { return this.#type }

	toString() { return this.#string }
}

class Parser {
	#pointer = 0
	#tokens = []
	#prayers = []

	get prayers() { return this.#prayers }

	constructor(string) {
		this.#tokens = Object.freeze(this.#tokenize(string)) // Make immutable
		while (this.#pointer < this.#tokens.length) {
			let prayerNumber = 0
			let prayerText = ""
			let book = ""
			let chapter = 0
			let verses = []

			if (this.#consume("[Text Prayer]") == -1) {
				break
			}

			const prayerNumberIndex = this.#consume("[Number]")
			if (prayerNumberIndex != -1) {
				prayerNumber = parseInt(this.#tokens[prayerNumberIndex])
			}
			// Remove unnecessary delimiter after prayer number
			if (this.#pointer < this.#tokens.length) {
				const currToken = this.#tokens[this.#pointer]
				if (currToken != undefined && currToken.type == "delimiter") {
					this.#pointer++
				}
			}

			const oldPointer = this.#pointer
			const scriptureStartIndex = this.#consume("[Number*][Text][Number][Delimiter :][Number]")
			if (scriptureStartIndex == -1) {
				throw new Error(`Prayer ${prayerNumber} does not have a Scripture reference`)
			} else {
				prayerText = this.#tokens.slice(oldPointer, scriptureStartIndex).join(" ")
			}

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
			
			let lastPointer = this.#pointer
			let endVerseStart = -1
			let nextPrayer = -1
			endVerseLoop:
			while ((endVerseStart = this.#consume("[Delimiter][Number]")) != -1) {
				const currPointer = this.#pointer
				nextPrayer = this.#consume("[Text Prayer]", lastPointer)
				// In this case, we're actually looking at the Scripture of the next prayer, instead of the current one
				if (nextPrayer != -1 && endVerseStart >= nextPrayer) {
					this.#pointer = lastPointer
					break
				} else {
					lastPointer = this.#pointer = currPointer
				}

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
			}

			this.#prayers.push(new Prayer(prayerNumber, prayerText, new Scripture(book, chapter, verses)))
		}
	}
	
	#tokenize(string) {
		if (typeof(string) !== "string") {
			throw new TypeError()
		}
		
		let tokens = []
		let str = ""
		for (let i = 0; i < string.length; i++) {
			let c = string[i]
			
			const isWhitespace = (c.trim() === '')
			const isNumber = (c >= "0" && c <= "9")
			const isDelimiter = [':', ',', '/', '-', '–', '—'].includes(c)
			
			if (isNumber) {
				str += c
				while (i + 1 < string.length && (string[i+1] >= "0" && string[i+1] <= "9")) {
					str += string[++i]
				}
				tokens.push(new Token(str, TokenType.Number))
			} else if (isDelimiter) {
				tokens.push(new Token(c, TokenType.Delimiter))
			} else if (!isWhitespace) {
				str += c
				while (i + 1 < string.length
					&& string[i + 1].trim() !== ''
					&& !"0123456789".includes(string[i + 1])) {
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
	
	#consume(expression, from) {
		if (from === undefined) {
			from = this.#pointer
		} 

		// Get "..." in "[...]"
		const expressions = expression.split(/\[([^\[\]]+)\]/).filter((e) => e !== '')
		const optionals = expressions.map((e) => e[e.length - 1] == '*')

		let startP = -1
		let endP = -1

		tokenLoop:
		for (let i = from; i < this.#tokens.length; i++) {
			startP = endP = -1
			
			for (let j = 0; j < expressions.length; j++) {
				const tokenIndex = i + j
				if (tokenIndex >= this.#tokens.lengths || this.#tokens[tokenIndex] === undefined) {
					if (!optionals[j]) {
						return -1
					}
				} else {
					const words =  expressions[j].split(' ', 2)
					let type = words[0].toLowerCase()
					let string = (words.length == 2) ? words[1] : this.#tokens[tokenIndex].string
					// Remove '*' at the end
					if (type[type.length - 1] == '*') {
						type =  type.substring(0, type.length - 1)
					} else if (string[string.length - 1] == '*') {
						string = string.substring(0, string.length - 1)
					}

					// We got a match
					if (type == this.#tokens[tokenIndex].type && string == this.#tokens[tokenIndex].string) {
						if (startP == -1) {
							startP = tokenIndex
						}
						endP = tokenIndex
					// Not a match (for non-optionals, we move to next token)
					} else if (!optionals[j]) {
						continue tokenLoop
					}
				}
			}

			// Completely matched expression
			this.#pointer = endP + 1
			break
		}

		return startP
	} 
}	
