const fs = require('fs');

console.log('Solving AOC/2 ...');

const translatePlayerMove = {
	'X': 'A',
	'Y': 'B',
	'Z': 'C'
};
const moveScore = {
	X: 1,//Rock
	A: 1,
	Y: 2,//Paper - B
	B: 2,
	Z: 3,//Scissors - C
	C: 3
};
const scoreSets = {
	'A': {
		'A': 3, // draw
		'B': 6, // player won
		'C': 0 // player lost
	},
	'B': {
		'A': 0, // player lost
		'B': 3, // draw
		'C': 6 // player won
	},
	'C': {
		'A': 6, // player won
		'B': 0, // player lost
		'C': 3 // draw
	}
}
const getMoveByScore = (moveSet, desiredScore) => {
	return Object.keys(moveSet).find(key => moveSet[key] === desiredScore);
}
const roundScore = (opponentMove, playerMove, translate = false) => {

	//console.log(`scoreSets[${opponentMove}][translatePlayerMove[${playerMove}]] = ${scoreSets[opponentMove][translatePlayerMove[playerMove]]}`);
	return scoreSets[opponentMove][playerMove];
};

const getMoveForResult = (opponentMove, desiredResult) => {
	if (desiredResult == 'Y')
	{
		return opponentMove; // draw
	}
	
	if (desiredResult == 'X')
	{
		return getMoveByScore(scoreSets[opponentMove], 0); // lowest score
	}
	if (desiredResult == 'Z')
	{
		return getMoveByScore(scoreSets[opponentMove], 6); // highest score
	}

};

const main = () => {
	let totalScore = 0;

	fs.readFile('./input.txt', 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		
		data.split("\n").forEach(function(line, i) {
			let [opponentMove, desiredResult] = line.split(' ');
			let myMove = getMoveForResult(opponentMove, desiredResult);
			totalScore += moveScore[myMove];
			totalScore += roundScore(opponentMove, myMove);
		});

		console.log(`totalScore ${totalScore}`);
	});

}

main();