class Scripture {
	#book = "Genesis"
	#chapter = 1
	#verses = []

	constructor(book, chapter, verses) {
		this.#book = book
		this.#chapter = parseInt(chapter)
		this.#verses = verses
	}

	toString() {
		let verseString = this.#verses[0].toString()

		const verseLen = this.#verses.length
		const lastVerse = this.#verses[verseLen - 1]

		if (verseLen > 1) {
			// 1-5
			if (lastVerse == (this.#verses[0] + verseLen - 1)) {
				verseString += `-${lastVerse}`
			// 1,4,5
			} else {
				verseString = this.#verses.join(",")
			}
		}

		// Genesis 2:1-5
		return `${this.#book} ${this.#chapter}:${verseString}`
	}

	equals(other) {
		return (this.toString() == other.toString())
	}
}
