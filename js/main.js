let textStore = ""
let prayers = null

function test() {
	const tests = [
		"Prayer 1: FATHER, THANK YOU FOR GATHERING MULTITUDES INTO OUR SERVICE LAST SUNDAY AND GRANTING EVERY WORSHIPPER AN ENCOUNTER WITH YOUR WORD. 2 Corinthians 3:18 ",
		"Prayer 2: FATHER, WE BREAK THE HOLD OF THE GATES OF HELL FROM THE LIVES OF ALL THAT ARE ORDAINED FOR SALVATION AND ESTABLISHMENT IN THIS CHURCH THIS WEEK. Luke 11:21–22 When a strong man armed keepeth his palace, his goods are in peace: 22 But when a stronger than he shall come upon him, and overcome him, he taketh from him all his armour wherein he trusted, and divideth his spoils.",
		`Prayer 3: FATHER, CONTINUE TO SEND US YOUR WORD OF LIFE, LEADING TO THE SUPERNATURAL GROWTH AND EXPANSION OF THIS CHURCH. Acts 6:7 And the word of God increased; and the number of the disciples multiplied in Jerusalem greatly; and a great company of the priests were obedient to the faith.

	Prayer 4: FATHER, LET THE FEAR OF GOD BE THE NEW LIFESTYLE OF EVERY WINNER. Proverbs 8:13 The fear of the Lord is to hate evil: pride, and arrogancy, and the evil way, and the froward mouth, do I hate. 
	`,
		`WEDNESDAY, SEPTEMBER 6, 2023

	Prayer 1: FATHER, THANK YOU FOR GATHERING MULTITUDES INTO OUR SERVICE LAST SUNDAY AND GRANTING EVERY WORSHIPPER AN ENCOUNTER WITH YOUR WORD. 2 Corinthians 3:18 But we all, with open face beholding as in a glass the glory of the Lord, are changed into the same image from glory to glory, even as by the Spirit of the Lord.
	
	Prayer 2: FATHER, WE BREAK THE HOLD OF THE GATES OF HELL FROM THE LIVES OF ALL THAT ARE ORDAINED FOR SALVATION AND ESTABLISHMENT IN THIS CHURCH THIS WEEK. Luke 11:21–22 When a strong man armed keepeth his palace, his goods are in peace: 22 But when a stronger than he shall come upon him, and overcome him, he taketh from him all his armour wherein he trusted, and divideth his spoils.
	
	Prayer 3: FATHER, CONTINUE TO SEND US YOUR WORD OF LIFE, LEADING TO THE SUPERNATURAL GROWTH AND EXPANSION OF THIS CHURCH. Acts 6:7 And the word of God increased; and the number of the disciples multiplied in Jerusalem greatly; and a great company of the priests were obedient to the faith.
	
	Prayer 4: FATHER, LET THE FEAR OF GOD BE THE NEW LIFESTYLE OF EVERY WINNER. Proverbs 8:13 The fear of the Lord is to hate evil: pride, and arrogancy, and the evil way, and the froward mouth, do I hate. 
	
	Prayer 5:  FATHER, LET THIS CHURCH YET EXPERIENCE NEW DIMENSIONS OF CHURCH GROWTH, FAR ABOVE ALL WE EVER KNEW. Ezekiel 36:37 Thus saith the Lord God; I will yet for this be enquired of by the house of Israel, to do it for them; I will increase them with men like a flock.
	
	Prayer 6: FATHER, GATHER RECORD BREAKING MULTITUDES INTO OUR SERVICES THIS COMING SUNDAY AND LET EVERY WORSHIPPER RETURN WITH THE KEYS OF GOOD OLD AGE BY YOUR WORD. Isaiah 65:20 There shall be no more thence an infant of days, nor an old man that hath not filled his days: for the child shall die an hundred years old; but the sinner being an hundred years old shall be accursed.
	`,
		`WEDNESDAY, JUNE 7, 2023

	Prayer 1: FATHER, THANK YOU FOR DRAFTING GREAT MULTITUDES TO OUR SERVICES LAST SUNDAY, AND BREAKING EVERY INVISIBLE BARRIER IN THE LIFE OF EVERY WORSHIPPER. Zechariah 4:7 Who art thou, O great mountain? before Zerubbabel thou shalt become a plain: and he shall bring forth the headstone thereof with shoutings, crying, Grace, grace unto it.
	 
	Prayer 2: FATHER, BY THE BLOOD, DESTROY ALL INTERFERENCES OF THE DEVIL AGAINST THE CONTINUOUS GROWTH OF THIS CHURCH. Revelation 12:11 And they overcame him by the blood of the Lamb, and by the word of their testimony; and they loved not their lives unto the death.
	
	Prayer 3: FATHER, LET THERE BE FRESH REVELATIONS FROM OUR ALTARS, THEREBY CAUSING THE MULTITUDES TO GATHER INTO OUR SERVICES ALL THROUGH THIS SEASON OF GLORY. Acts 13:44 And the next sabbath day came almost the whole city together to hear the word of God.
	Prayer 4: FATHER, IGNITE NEW ORDER OF PASSION FOR KINGDOM ADVANCEMENT ENDEAVOURS IN THE LIFE OF EVERY WINNER. Haggai 1:14 And the Lord stirred up the spirit of Zerubbabel the son of Shealtiel, governor of Judah, and the spirit of Joshua the son of Josedech, the high priest, and the spirit of all the remnant of the people; and they came and did work in the house of the Lord of hosts, their God, 
	
	Prayer 5:  FATHER, IN THE NAME OF JESUS, OPEN THE HEART OF EVERY CONTACT ON THE HARVEST FIELD TO THE GOSPEL, THEREBY LEADING MANY TO CHRIST. Acts 16:14 And a certain woman named Lydia, a seller of purple, of the city of Thyatira, which worshipped God, heard us: whose heart the Lord opened, that she attended unto the things which were spoken of Paul.
	
	Prayer 6: FATHER, DRAFT RECORD–BREAKING MULTITUDES TO OUR SERVICES THIS COMING SUNDAY, GRANTING ALL–ROUND REST TO EVERY WORSHIPPER BY YOUR WORD. 2 Chronicles 15:15 And all Judah rejoiced at the oath: for they had sworn with all their heart, and sought him with their whole desire; and he was found of them: and the Lord gave them rest round about.
	`,
		`Prayer 1
	Father, in the Name of Jesus and by the HolyGhost, strengthen me with Might in my inner man, so I can continue to prevail on the Altar of Prayer
	
	Ephesians 3:16 KJV
	That he would grant you, according to the riches of his glory, to be strengthened with might by his Spirit in the inner man;
	Ephesians 3:16 KJV
	
	Prayer 2
	Father, in the Name of Jesus, grant me vivid and life transforming encounters with Your Word at the forthcoming Annual Youth Alive Convention that will turn me into a global Kingdom Giant.
	
	Ezekiel 2:1‭-‬2 KJV
	And he said unto me, Son of man, stand upon thy feet, and I will speak unto thee. And the spirit entered into me when he spake unto me, and set me upon my feet, that I heard him that spake unto me.`,
	]

	const correct = [
		[
			new Prayer(1, "FATHER, THANK YOU FOR GATHERING MULTITUDES INTO OUR SERVICE LAST SUNDAY AND GRANTING EVERY WORSHIPPER AN ENCOUNTER WITH YOUR WORD.", new Scripture("2 Corinthians", 3, [18]))
		],
		[
			new Prayer(2, "FATHER, WE BREAK THE HOLD OF THE GATES OF HELL FROM THE LIVES OF ALL THAT ARE ORDAINED FOR SALVATION AND ESTABLISHMENT IN THIS CHURCH THIS WEEK.", new Scripture("Luke", 11, [21, 22]))
		],
		[
			new Prayer(3, "FATHER, CONTINUE TO SEND US YOUR WORD OF LIFE, LEADING TO THE SUPERNATURAL GROWTH AND EXPANSION OF THIS CHURCH.", new Scripture("Acts", 6, [7])),
			new Prayer(4, "FATHER, LET THE FEAR OF GOD BE THE NEW LIFESTYLE OF EVERY WINNER.", new Scripture("Proverbs", 8, [13]))
		],
		[
			new Prayer(1, "FATHER, THANK YOU FOR GATHERING MULTITUDES INTO OUR SERVICE LAST SUNDAY AND GRANTING EVERY WORSHIPPER AN ENCOUNTER WITH YOUR WORD.", new Scripture("2 Corinthians", 3, [18])),
			new Prayer(2, "FATHER, WE BREAK THE HOLD OF THE GATES OF HELL FROM THE LIVES OF ALL THAT ARE ORDAINED FOR SALVATION AND ESTABLISHMENT IN THIS CHURCH THIS WEEK.", new Scripture("Luke", 11, [21, 22])),
			new Prayer(3, "FATHER, CONTINUE TO SEND US YOUR WORD OF LIFE, LEADING TO THE SUPERNATURAL GROWTH AND EXPANSION OF THIS CHURCH.", new Scripture("Acts", 6, [7])),
			new Prayer(4, "FATHER, LET THE FEAR OF GOD BE THE NEW LIFESTYLE OF EVERY WINNER.", new Scripture("Proverbs", 8, [13])),
			new Prayer(5, "FATHER, LET THIS CHURCH YET EXPERIENCE NEW DIMENSIONS OF CHURCH GROWTH, FAR ABOVE ALL WE EVER KNEW.", new Scripture("Ezekiel", 36, [37])),
			new Prayer(6, "FATHER, GATHER RECORD BREAKING MULTITUDES INTO OUR SERVICES THIS COMING SUNDAY AND LET EVERY WORSHIPPER RETURN WITH THE KEYS OF GOOD OLD AGE BY YOUR WORD.", new Scripture("Isaiah", 65, [20]))
		],
		[
			new Prayer(1, "FATHER, THANK YOU FOR DRAFTING GREAT MULTITUDES TO OUR SERVICES LAST SUNDAY, AND BREAKING EVERY INVISIBLE BARRIER IN THE LIFE OF EVERY WORSHIPPER.", new Scripture("Zechariah", 4, [7])),
			new Prayer(2, "FATHER, BY THE BLOOD, DESTROY ALL INTERFERENCES OF THE DEVIL AGAINST THE CONTINUOUS GROWTH OF THIS CHURCH.", new Scripture("Revelation", 12, [11])),
			new Prayer(3, "FATHER, LET THERE BE FRESH REVELATIONS FROM OUR ALTARS, THEREBY CAUSING THE MULTITUDES TO GATHER INTO OUR SERVICES ALL THROUGH THIS SEASON OF GLORY.", new Scripture("Acts", 13, [44])),
			new Prayer(4, "FATHER, IGNITE NEW ORDER OF PASSION FOR KINGDOM ADVANCEMENT ENDEAVOURS IN THE LIFE OF EVERY WINNER.", new Scripture("Haggai", 1, [14])),
			new Prayer(5, "FATHER, IN THE NAME OF JESUS, OPEN THE HEART OF EVERY CONTACT ON THE HARVEST FIELD TO THE GOSPEL, THEREBY LEADING MANY TO CHRIST.", new Scripture("Acts", 16, [14])),
			new Prayer(6, "FATHER, DRAFT RECORD–BREAKING MULTITUDES TO OUR SERVICES THIS COMING SUNDAY, GRANTING ALL–ROUND REST TO EVERY WORSHIPPER BY YOUR WORD.", new Scripture("2 Chronicles", 15, [15]))
		],
		[
			new Prayer(1, "Father, in the Name of Jesus and by the HolyGhost, strengthen me with Might in my inner man, so I can continue to prevail on the Altar of Prayer", new Scripture("Ephesians", 3, [16])),
			new Prayer(2, "Father, in the Name of Jesus, grant me vivid and life transforming encounters with Your Word at the forthcoming Annual Youth Alive Convention that will turn me into a global Kingdom Giant.", new Scripture("Ezekiel", 2, [1, 2]))
		]
	]

	for (let i = 0; i < tests.length; i++) {
		console.log(`Test ${i + 1}: ${correct[i].length} tests`)
		const parser = new Parser(tests[i])
		for (let j = 0; j < parser.prayers.length; j++) {
			const answer = parser.prayers[j]
			if (answer.equals(correct[i][j])) {
				console.log(`${j + 1}: Passed`)
			} else {
				console.log(`${j + 1}: Failed\n--------------\nExpected: ${correct[i][j]}\nOutput: ${answer}-------------`)
			}
		}
		console.log("")
	}
}

function generate() {
	const text = document.getElementById("textbox").value.trim()
	if (text == textStore) {
		return
	} else {
		textStore = text
	}

	if (text.trim() !== '') {
		prayers = null

		try {
			const parser = new Parser(text)
			prayers = parser.prayers
			if (prayers.length == 0) {
				showError("No Prayers found")
			} else {
				showError("")
				showPrayers(prayers)
			}
		} catch (error) {
			showError(error)
		}
	}
}

function createText(element, text) {
	let e = document.createElement(element)
	if (text !== undefined) {
		e.appendChild(document.createTextNode(text.toString()))
	}
	return e
}

async function showPrayers(prayers) {
	const button = document.querySelector("button.generate")
	button.textContent = "Generating..."

	const outputSection = document.getElementById("output")
	// Remove all children
	while (outputSection.firstChild) {
		outputSection.removeChild(outputSection.lastChild)
	}

	for (const prayer of prayers) {
		const scripture = prayer.scripture
		/*
			<div class="prayer">
				<h3>Prayer 1</h3>
				<p>FATHER, WE BREAK THE HOLD OF THE GATES OF HELL FROM THE LIVES OF ALL THAT ARE ORDAINED FOR SALVATION AND ESTABLISHMENT IN THIS CHURCH THIS WEEK.<br>Acts 6:7</p>
				<br>
				<h3>Acts 6:7</h3>
				<p>And the word of God increased; and the number of the disciples multiplied in Jerusalem greatly; and a great company of the priests were obedient to the faith.</p>
			</div>
		*/
		const prayerDiv = document.createElement("div")
		prayerDiv.classList.add("prayer")
		prayerDiv.appendChild(createText("h3", prayer.title))
		prayerDiv.appendChild(createText("p", prayer.text))
		prayerDiv.appendChild(createText("p", scripture))

		const bibleDiv = document.createElement("div")
		bibleDiv.classList.add("prayer")
		bibleDiv.appendChild(createText("h3", scripture.toString()))
		bibleDiv.appendChild(createText("p", await scripture.getText()))

		outputSection.appendChild(prayerDiv)
		outputSection.appendChild(bibleDiv)
	}

	button.textContent = "Generate"
}

function showError(message) {
	document.querySelector("#input h3.error").textContent = message.toString()
}

// test()
