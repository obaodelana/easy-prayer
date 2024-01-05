# [Easy Prayer](https://obaodelana.github.io/easy-prayer/index.html)

Given a document, the parser extracts expressions of the form:
```text
"Prayer" [Number] [Text] [Number*] [Text] [Number]:[Number]([-,/][Number])*
```
(* denotes "optional")
* The first `[Number]` denotes the prayer number
* The first `[Text]` is the actual prayer found between the number and the Scripture reference.
* `[Number*] [Text]` is the book of the Bible (the optional number is for cases like " 1 Corinthians")
* Then, `[Number]:Number` is the chapter and verse
* Lastly, we have `[-,/][Number]` for cases we have extra verses "e.g. Luke 4:3 **- 6, 9, 10**"

For example, given a document containing
```text
Prayer 5:  FATHER, LET THIS CHURCH YET EXPERIENCE NEW DIMENSIONS OF CHURCH GROWTH, FAR ABOVE ALL WE EVER KNEW. Ezekiel 36:37 Thus saith the Lord God; I will yet for this be enquired of by the house of Israel, to do it for them; I will increase them with men like a flock.
```
The parser returns
```js
new Prayer(5,
	"FATHER, LET THIS CHURCH YET EXPERIENCE NEW DIMENSIONS OF CHURCH GROWTH, FAR ABOVE ALL WE EVER KNEW.",
	new Scripture(
		"Ezekiel",
		36,
		[37]
	)
)
```


At first, I implemented this with Regex, but it was too slow (as the documents would get increasingly complicated). So, I implemented a small linear-time parser. All it does is tokenize the input string, and look for custom patterns (see `js/util/parser.js`).

I don't really like the fact that Javascript is dynamically-typed, so I'm going to learn Typescript now ;)