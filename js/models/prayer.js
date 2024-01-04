class Prayer {
	#number = 1;
	#text = "";
	#scripture

	constructor(number, text, scripture) {
		if (typeof (number) !== "number"
			|| typeof (text) !== "string"
			|| !(scripture instanceof Scripture)) {
			throw new TypeError("Error: Expects Prayer(number: Number, text: String, scripture: Scripture(...))")
		}

		this.#number = number
		this.#text = text
		this.#scripture = scripture
	}

	get title() { return `Prayer ${this.#number}` }

	get text() { return this.#text }

	get scripture() { return this.#scripture }

	toString() {
		return `Prayer ${this.#number}\n${this.#text}\n\r${this.#scripture}\n`;
	}

	equals(other) {
		return (this.title == other.title
			&& this.text == other.text
			&& this.scripture.equals(other.scripture))
	}
}
