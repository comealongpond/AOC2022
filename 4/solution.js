const fs = require('fs');

const main = () => {
	let totalOverlapCount = 0;

	fs.readFile('./input.txt', 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		
		data.split("\n").forEach(function(line, i) {
			let [rangeOne, rangeTwo] = line.split(',');

			// 1.1
			// totalOverlapCount += sectionOverlaps(rangeOne, rangeTwo) ? 1 : 0;

			// 1.2
			totalOverlapCount += segmentOverlaps(rangeOne, rangeTwo) ? 1 : 0; 
		});
		
		console.log(`totalOverlapCount ${totalOverlapCount}`);
	});
	
};

const sectionOverlaps = (r1, r2) => {
	let [r1_low, r1_high] = r1.split('-');
	let [r2_low, r2_high] = r2.split('-');
	[r1_low, r1_high, r2_low, r2_high] = [parseInt(r1_low), parseInt(r1_high), parseInt(r2_low), parseInt(r2_high)];

	//console.log(`${r1_low} >= ${r2_low} && ${r1_high} <= ${r2_high} = ${r1_low >= r2_low && r1_high <= r2_high}`)
	
	return	   (r1_low >= r2_low && r1_high <= r2_high) // r1 in r2
			|| (r2_low >= r1_low && r2_high <= r1_high); // r2 in r1
};

const segmentOverlaps = (r1, r2) => {
	let [r1_low, r1_high] = r1.split('-');
	let [r2_low, r2_high] = r2.split('-');
	[r1_low, r1_high, r2_low, r2_high] = [parseInt(r1_low), parseInt(r1_high), parseInt(r2_low), parseInt(r2_high)];

	// console.log(`
	// 	   ${r1_low} >= ${r2_low} && ${r1_low} <= ${r2_high}
	// 	|| ${r2_low} >= ${r1_low} && ${r2_low} <= ${r1_high}
	// 	|| ${r1_high} >= ${r2_low} && ${r1_high} <= ${r2_high}
	// 	|| ${r2_high} >= ${r1_low} && ${r2_high} <= ${r1_high}

	// 	= ${(r1_low >= r2_low && r1_low <= r2_high)|| (r2_low >= r1_low && r2_low <= r1_high)|| (r1_high >= r2_low && r1_high <= r2_high)|| (r2_high >= r1_low && r2_high <= r1_high)}
	// `);

	return	   (r1_low >= r2_low && r1_low <= r2_high)
			|| (r2_low >= r1_low && r2_low <= r1_high)
			|| (r1_high >= r2_low && r1_high <= r2_high)
			|| (r2_high >= r1_low && r2_high <= r1_high);
};

main();