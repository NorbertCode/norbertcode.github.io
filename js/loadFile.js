// Arrays of phrases in both languages
// Initialize them here to keep them global for the entire file
var german = new Array();
var polish = new Array();

// Load the correct file on load
fetch("topics/test.txt")
	.then(response => response.text())
	.then(text => readFile(text))
	.catch((error) => console.error(error));
	
function readFile(text)
{
	const phrases = text.split('\n'); // Divide the text file into lines
	// Divide lines into languages
	for (let i = 0; i < phrases.length; i++)
	{
		let line = phrases[i].split(',');
		german.push(line[0]);
		polish.push(line[1]);
	}
}