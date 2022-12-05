const fs = require('fs');

const main = () => {
	let stacks = {};
	let moving = false;

	fs.readFile('./input.txt', 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		
		data.split("\n").forEach(function(line, i) {
			if (line == '' || line.substring(0, 2) == ' 1') 
			{
				if (!moving)
				{
					Object.keys(stacks).forEach(function(el, i) {
						stacks[el] = removeEmpty(stacks[el]).reverse();
					});
					moving = true;
				}
			}
			else if (moving)
			{
				let command = parseCommand(line);
				
				// 1
				//for (let i = 0; i < command['move']; i++)
				//{
				//	stacks[command['to']].push(stacks[command['from']].pop());
				//}

				// 2
				let blocksToMove = [];
				for (let i = 0; i < command['move']; i++)
				{
					blocksToMove.push(stacks[command['from']].pop());
				}
				stacks[command['to']].push(...blocksToMove.reverse());

			}
			else
			{
				let row = parseStackRow(line);

				for (let i = 1; i < row.length+1; i++)
				{
					if (typeof stacks[i] == "undefined")
					{
						stacks[i] = [];
					}
					stacks[i].push(row[i-1]);
				}
			}
		});	

		giveVerdict(stacks);
	});
};

const giveVerdict = (stacks) => {
	let result = "";
	Object.keys(stacks).forEach(function(el, i) {
		result += stacks[el][stacks[el].length-1];
	});

	console.log(result.replaceAll(/(\[|\])/g, ''));
};

const parseStackRow = (row) => {
	let stackRow = row.match(/.{1,4}/g);
	stackRow.forEach(function(el, i) {
		stackRow[i] = el.trim();
	});

	return stackRow;
};

const removeEmpty = (arr) => {
	let newArr = [];
	for (let i = 0; i < arr.length; i++)
	{
		if (arr[i] && arr[i] != "")
		{
			newArr.push(arr[i]);
		}
	}
	return newArr;
};

const parseCommand = (command) => {
	let move = command.match(/move ([0-9]+)/)[1];
	let from = command.match(/from ([0-9]+)/)[1];
	let to = command.match(/to ([0-9]+)/)[1];

	return {
		"move": move,
		"from": from,
		"to": to
	};
};

main();