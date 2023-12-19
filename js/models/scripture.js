class Scripture {
	#book = "Genesis"
	#chapter = 1
	#verses = [1]

	constructor(book, chapter, verses) {
		// Ensure proper type for each variable
		if (typeof(book) !== String
			|| typeof(chapter) !== Number
			|| !Array.isArray(verses)) {
			throw new TypeError("Error: Expects Scripture(book: String, chapter: Number, verses: Array")
		}
		this.#book = book
		this.#chapter = chapter
		this.#verses = verses
	}

	toString() {
		let verseString = this.#verses[0].toString()

		const verseLen = this.#verses.length
		const lastVerse = this.#verses[verseLen - 1]

		// 1-5
		if (lastVerse == (this.#verses[0] + verseLen - 1)) {
			verseString += `-${lastVerse}`
		// 1,4,5
		} else {
			verseString = this.#verses.join(",")
		}

		// Genesis 2:1-5
		return `${this.#book} ${this.#chapter}:${verseString}`
	}
}
