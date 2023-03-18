/*** INITIALIZATION ***/

// Arrays of phrases in both languages
// Initialize them here to keep them global for the entire file
let german = new Array();
let polish = new Array();

changeTopic(); // Set the topic and load the appropriate file

function loadFile(fileName)
{
	german = new Array();
	polish = new Array();

	fetch("topics/" + fileName)
		.then(response => response.text())
		.then(text => { parseFile(text); pickQuestion()})
		.catch((error) => console.error(error));
}
	
function parseFile(text)
{
	console.log(text);
	let phrases = text.split('|'); // Divide the text file into lines
	
	// Divide lines into languages
	for (let i = 0; i < phrases.length; i++)
	{
		// I guess because of how different software handles stuff like this
		// You have to split the text into lines and remove line breaks separately
		phrases[i] = phrases[i].replace("\n", "");
		phrases[i] = phrases[i].replace("|", ""); // Make sure there are no line brakes. If this wasn't done the last phrase in Polish would have one at the end
		
		let line = phrases[i].split(';');
		if (line[0] != null && line[0] != "")
		{
			german.push(line[0]);
			polish.push(line[1]);
		}
	}
}


//*** QUIZ ***/

var mode = "0";
var currentQuestionIndex = 0; // Used only in modes 2 and 3
var correctAnswer = "";

// Trigger check button when the user presses enter while typing
document.querySelector("#input").addEventListener("keypress", function(event) 
{
	if (event.key === "Enter") 
	{
		// Cancel the default action, if needed
		event.preventDefault();
		document.querySelector("#checkButton").click();
	}
});

function changeTopic()
{
	let fileName = document.querySelector("#topic").value;
	currentQuestionIndex = 0;
	loadFile(fileName);
}

function changeMode()
{
	mode = document.querySelector("#mode").value;
	pickQuestion();
}

function pickQuestion()
{
	// Pick integer and language
	let index = 0;
	let questionLang = 0;
	if (mode == "0")
	{
		index = getRandomInt(polish.length);
		questionLang = getRandomInt(2);
	}
	else // Modes which increment through phrases
	{
		index = currentQuestionIndex;
		currentQuestionIndex = currentQuestionIndex + 1 < polish.length ? currentQuestionIndex + 1 : 0;
		
		questionLang = parseInt(mode) - 1;
	}
	
	// Set appropriate values
	let question = document.querySelector("#question"); // <p> tag
	if (questionLang == 0)
	{
		question.innerHTML = german[index];
		correctAnswer = polish[index];
	}
	else
	{
		question.innerHTML = polish[index];
		correctAnswer = german[index];
	}
	
	// Change button
	let button = document.querySelector("#checkButton");
	button.innerHTML = "SPRAWDŹ";
	button.removeEventListener("click", pickQuestion);
	button.addEventListener("click", checkAnswer);
	
	let input = document.querySelector("#input");
	input.value = "";
	input.focus();
	document.querySelector("#feedback").innerHTML = "";
}

function checkAnswer()
{
	let userInput = document.querySelector("#input").value;
	let feedback = document.querySelector("#feedback");

	// inputChars are converted to outputChars so special characters don't matter
	const inputChars = [',', '.', "?", 'ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż', 'ä', 'ö', 'ü', 'ß'];
	const outputChars = ['', '', "", 'a', 'c', 'e', 'l', 'n', 'o', 's', 'z', 'z', 'a', 'o', 'u', 'ss'];

	let processedCorrectAnswer = correctAnswer; // Temporary variable used as a clone of correctAnswer, so correctAnswer still has special characters
	for (let i = 0; i < inputChars.length; i++)
	{
		userInput = replaceAll(userInput, inputChars[i], outputChars[i]);
		processedCorrectAnswer = replaceAll(processedCorrectAnswer, inputChars[i], outputChars[i]);
	}

	if (userInput.toLowerCase() == processedCorrectAnswer.toLowerCase())
	{
		feedback.innerHTML = "Świetnie! Poprawna odpowiedź.";
		feedback.style.color = "#1fad45";
	}
	else
	{
		feedback.innerHTML = "Niestety, poprawna odpowiedź to \'" + correctAnswer + "\'";
		feedback.style.color = "#d60b33";
	}
	
	// Change button
	let button = document.querySelector("#checkButton");
	button.innerHTML = "NASTĘPNE";
	button.removeEventListener("click", checkAnswer);
	button.addEventListener("click", pickQuestion);
}

function addCharacter(character)
{
	let input = document.querySelector("#input");
	input.value += character;
	input.focus(); // So the mobile keyboard doesn't close when you add a character
}

function getRandomInt(max) // Exclusive
{
	return Math.floor(Math.random() * max);
}

// The only way to replace all instances of a certain character in a string is using regex,
// but for some reason when I put a variable in a regexp it returned nothing, so this is another way to do that
function replaceAll(string, search, replacement) 
{
    return string.split(search).join(replacement);
};