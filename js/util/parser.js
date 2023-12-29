class Parser {
	#string = ""
	#pointer = 0
	#prayers = []

	get #length() {
		return this.#string.length
	}

	constructor(text) {
		this.#string = text.toString()

		while (this.#pointer < this.#length) {
			// Prayer
			if (this.#consumeText("Prayer")) {
				// Number
				const numberStart = this.#consume("[Number]") 
				if (numberStart != -1) {
					const prayerNumber = parseInt(this.#string.substring(numberStart, this.#pointer))
					// Text before Scripture
					const oldPointer = this.#pointer
					const scriptureStart = this.#consume("[Number*][Whitespace*][Text][Whitespace*][Number][Colon][Number]")
					if (scriptureStart != -1) {
						const text = this.#string.substring(oldPointer, scriptureStart)
						// Scripture text
						let scripture = this.#string.substring(scriptureStart, this.#pointer)

						// If Scripture has multiple verses, e.g., "-6", "/6/7/8", ",9,10", "-7/8,9-11"
						let verseEnd = -1
						let lastPointer = this.#pointer
						// While there is text in the form "(-|,|/)[Number]"
						while ((verseEnd = this.#consume("[Separator][Number]")) != -1) {
							// Get string
							const sepNumber = this.#string.substring(lastPointer, verseEnd)
							// Add to Scripture text
							scripture += sepNumber

							lastPointer = this.#pointer
						}

						const newPrayer = new Prayer(prayerNumber, text, new Scripture(scripture))
						this.#prayers.push(newPrayer)
					} else {
						throw new Error("Scripture not found in prayer")
					}
				} else {
					throw new Error("Prayer should be followed by a number")
				}
			} else {
				break
			}
		}
	}

	// Get index of first character in `expression` and move pointer to position after `expression`
	#consume(expression/*: String*/) {
		if (this.#pointer >= this.#length) {
			return -1
		}

		/* 
			This regex captures all text in between '[' and ']' e.g.,
			"[Number][Colon][Number*]" => ["Number", "Colon", "Number*"] 
		*/
		const expressions = expression.split(/\[([^\]\[]+)\]/).filter((s) => s !== '')
		// Contains `false` or `true` denoting if it contains an asterisk (which means "optional")
		let optionals = expressions.map((expr) => (expr[expr.length - 1] === '*'))

		// Holds index of last non-optional match
		let lastMandatoryIndex = -1
		let currPointer = this.#pointer
		
		outerLoop:
		while (currPointer < this.#length) {
			let startP = -1
			let lastP = currPointer - 1

			for (let i = 0; i < expressions.length; i++) {
				// Get start and end point of expression
				let [first, next] = this.#find(expressions[i], lastP + 1)

				// If expression is not found (first == -1) 
				if (first == -1) {
					// If it's an optional, we can ignore it
					if (optionals[i]) {
						continue
					}
					// But, if it's mandatory, then we have no match
					return -1
				}

				// Ensure expression is contiguous (appears after previous expression)
				if (startP != -1 /*ensure not first expression*/ && first != lastP + 1) {
					if (!optionals[i]) {
						// If everything up to this point were optionals, discard them
						if (lastMandatoryIndex == -1) {
							startP = first	
						} else {
							// Else, re-start search from after last seen non-optional
							currPointer = lastMandatoryIndex + 1
							continue outerLoop
						}
					} else {
						// For optionals, just skip
						continue
					}
				}
				
				if (!optionals[i]) {
					lastMandatoryIndex = next
				}
				
				// Set `startP` if not already set
				if (startP == -1) {
					startP = first
				}
				// Save end of expressions so far
				lastP = next
			}

			// Finishing for-loop means we matched all compulsory expressions

			// Move pointer to position after all expressions
			this.#pointer = lastP + 1
			// Index of start of expressions
			return startP
		}

		// After searching to end, didn't find match
		return -1
	}

	// Move pointer to position after `text` if it exists in the string
	#consumeText(text/*: String*/) /*-> Boolean*/ {
		let currPointer = this.#pointer
		
		wholeStringLoop:
		while (currPointer < this.#length) {
			// Look for fist occurrence of character in `string[currPointer:]`
			const startIndex = this.#findCharacter(text[0], currPointer)
			if (startIndex == -1) {
				return false
			}

			// From (index of second character) up to (index of last character)
			for (let i = startIndex + 1; i < startIndex + text.length; i++) {
				// If we're going out of bounds, exit while loop
				if (i >= this.#length) {
					break wholeStringLoop
				}

				// Check if the characters don't match up
				if (text[i - startIndex] != this.#string[i]) {
					currPointer += i
					// Start loop from current position
					continue wholeStringLoop
				}
			}

			// If loop finishes, then we can consume text
			this.#pointer = startIndex + text.length
			return true
		}
		
		// If we get here, we've gone through the whole string without finding a match
		return false
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
	#find(type/*: String*/, from/*: Number|Undefined*/) {
		if (from === undefined) {
			from = this.#pointer
		} else if (from < 0 || from >= this.#length) {
			throw new RangeError("Error: `from` in #find() is out of bounds")
		}

		// Remove optional tag, if it exits
		if (type[type.length - 1] === '*') {
			type = type.substr(0, type.length - 1)
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
	#checkType(character/*: String*/) {
		const c = character.toLowerCase()
		if (c >= 'a' && c <= 'z') {
			return "Text"
		} else if (c >= '0' && c <= '9') {
			return "Number"
		} else if (c.trim() === '') {
			return "Whitespace"
		} else if (c == ':') {
			return "Colon"
		} else if (c == '-' || c == '/' || c == ',') {
			return "Separator"
		} else {
			return null
		}
	}
}	
