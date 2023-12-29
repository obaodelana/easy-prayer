class Scripture {
	#book = "Genesis"
	#chapter = 1
	#verses = []

	constructor(text) {
		// Form: [Book] [Number]:[Number]{(-|/|,)[Number]}
		const formRegex = /(\d*\s*\w+)\s*(\d+):(.*)/
		const [, book, chapter, verseStr] = text.match(formRegex)

		this.#book = book
		this.#chapter = parseInt(chapter)
	
		const verseSplits = verseStr.split(/[,/]/)
		for (const verse of verseSplits) {
			if (verse.contains("-")) {
				const [start, end] = verse.split("-")
				for (let i = parseInt(start); i <= parseInt(end); i++) {
					this.#verses.push(i)
				}
			} else {
				this.#verses.push(parseInt(verse))
			}
		}
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
