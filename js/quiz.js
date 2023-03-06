var mode = "0";

var question = document.getElementById("question"); // <p> tag
document.getElementById("checkButton").addEventListener("click", randomizeQuestion); // TODO: change this

function changeMode()
{
	mode = document.getElementById("mode").value;
	console.log(mode);
}

function getRandomInt(max) // Exclusive
{
	return Math.floor(Math.random() * max);
}

function randomizeQuestion()
{
	if (mode == "0")
	{
		let invert = getRandomInt(2);
		if (invert == 0)
			question.innerHTML = german[getRandomInt(german.length)];
		else
			question.innerHTML = polish[getRandomInt(polish.length)];
	}
	// TODO: Should iterate through the list, not randomize
	else if (mode == "1")
		question.innerHTML = polish[getRandomInt(polish.length)];
	else
		question.innerHTML = german[getRandomInt(german.length)];
}