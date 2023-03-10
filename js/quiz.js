/*** INITIALIZATION ***/

// Arrays of phrases in both languages
// Initialize them here to keep them global for the entire file
var german = new Array();
var polish = new Array();

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
var currentQuestionIndex; // Used only in modes 2 and 3
var correctAnswer;

// Trigger check button when the user presses enter while typing
document.getElementById("input").addEventListener("keypress", function(event) 
{
	if (event.key === "Enter") 
	{
		// Cancel the default action, if needed
		event.preventDefault();
		document.getElementById("checkButton").click();
	}
});

function changeTopic()
{
	let fileName = document.getElementById("topic").value;
	currentQuestionIndex = 0;
	loadFile(fileName);
}

function changeMode()
{
	mode = document.getElementById("mode").value;
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
	let question = document.getElementById("question"); // <p> tag
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
	let button = document.getElementById("checkButton");
	button.innerHTML = "SPRAWD??";
	button.removeEventListener("click", pickQuestion);
	button.addEventListener("click", checkAnswer);
	
	document.getElementById("input").value = "";
	document.getElementById("feedback").innerHTML = "";
}

function checkAnswer()
{
	let userInput = document.getElementById("input").value;
	let feedback = document.getElementById("feedback");
	
	if (userInput.toLowerCase() == correctAnswer.toLowerCase())
	{
		feedback.innerHTML = "??wietnie! Poprawna odpowied??.";
		feedback.style.color = "#1fad45";
	}
	else
	{
		feedback.innerHTML = "Niestety, poprawna odpowied?? to " + correctAnswer;
		feedback.style.color = "#d60b33";
	}
	
	// Change button
	let button = document.getElementById("checkButton");
	button.innerHTML = "NAST??PNE";
	button.removeEventListener("click", checkAnswer);
	button.addEventListener("click", pickQuestion);
}

function addCharacter(character)
{
	let input = document.getElementById("input");
	input.value += character;
	input.focus(); // So the mobile keyboard doesn't close when you add a character
}

function getRandomInt(max) // Exclusive
{
	return Math.floor(Math.random() * max);
}