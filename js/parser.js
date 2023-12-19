// TODO: Unit test each function
class Parser {
	#string = ""
	#pointer = 0

	get #length() {
		return this.#string.length
	}

	constructor(text) {
		string = text

		while (this.#pointer < this.#length) {
			// Prayer
			this.#consumeText("Prayer")
			// Number
			const numberStart = this.#consumeUntil("[Number]") 
			const prayerNumber = parseInt(this.#string.substring(numberStart, this.#pointer))
			// Text before Scripture
			const oldPointer = this.#pointer
			const scriptureStart = this.#consumeUntil("[Text][Whitespace][Number][Colon][Number]")
			const text = this.#string.substring(oldPointer, scriptureStart)
			// Scripture
			
		}
	}

	// TODO: Make whitespace optional

	// Get index of first character in `expression` and move pointer to position after `expression`
	#consumeUntil (expression/*: String*/) /*-> Number*/{
		if (typeof(expression) !== String) {
			throw new TypeError("Error: Expected consumeUntil(expression: String)")
		}
		if (this.#pointer >= this.#length) {
			return -1
		}

		// "[Number][Colon][Number]" => ["Number", "Colon", "Number"]
		const expressions = expression.split(/[(\w+)]/)

		// Check if first expression exists in string
		let [startP, lastP] = this.#find(expressions[0])
		if (startP == -1) {
			return -1
		}

		// For all other expressions
		for (let i = 1; i < expressions.length; i++) {
			// Get their start and end point
			let [first, next] = this.#find(expressions[i], lastP + 1)
			// The start of the current expression should start immediately after the previous
			if (first == -1 || first != lastP + 1) {
				return -1
			}
			// Save end of expressions so far
			lastP = next
		}

		// Move pointer to position after all expressions
		this.#pointer = lastP + 1
		// Index of start of expressions
		return startP
	}

	// TODO: Continue checking until we reach end of string

	// Move pointer to position after `text` if it exists in the string
	#consumeText(text/*: String*/) /*-> Boolean*/ {
		const startIndex = this.#findCharacter(text[0])
		if (startIndex == -1) {
			return false
		}

		// From (index of second character) up to (index of last character)
		for (let i = startIndex + 1; i < startIndex + text.length; i++) {
			// Check if the characters match up
			if (text[i - startIndex] != this.#string[i]) {
				return false
			}
		}

		// Consume text
		this.#pointer = startIndex + text.length
		return true
	}

	// Find first occurrence of `character` in the string, if it doesn't occur, return -1
	#findCharacter(character/*: String*/, from/*: Number|Undefined*/) /*-> Int*/ {
		if (from === undefined) {
			from = this.#pointer
		} else if (from < 0 || from >= this.#length) {
			throw new RangeError("Error: `from` in #findCharacter() is out of bounds")
		}

		// Linear search for character
		for (let i = from; i < this.#length; i++) {
			if (this.#string[i] == character) {
				return i
			}
		}
		return -1
	}
	
	// Return start- and end-index of expression `type` in the string
	#find(type/*: String*/, from/*: Number|Undefined*/) /*-> [Number, Number]*/ {
	if (from === undefined) {
			from = this.#pointer
		} else if (from < 0 || from >= this.#length) {
			throw new RangeError("Error: `from` in #find() is out of bounds")
		}

		let startIndex = -1
		let endIndex = -1
		for (let i = from; i < this.#length; i++) {
			// If character matches the type we're looking
			if (this.#checkType(this.#string[i]) == type) {
				// If this is the first time I've encountered `type`
				if (startIndex == -1) {
					startIndex = endIndex = i
				// Keep track of last time `type` is encountered
				} else {
					endIndex = i
				}
			// If character doesn't match, and we've seen it before
			} else if (startIndex != -1) {
				break
			}
		}

		return [startIndex, endIndex]
	}

	// Determine what expression type `character` is
	#checkType(character/*: String*/) /*-> String*/{
		const c = character.toLowerCase()
		if (c >= 'a' && c <= 'z') {
			return "Text"
		} else if (c >= '0' && c <= '9') {
			return "Number"
		} else if (c == ' ' || c == '\n' || c == '\r' || c == '\t' || c == '\f' || c == '\v') {
			return "Whitespace"
		} else if (c == ':') {
			return "Colon"
		} else if (c == '-') {
			return "Hyphen"
		} else {
			return null
		}
	}
}	
