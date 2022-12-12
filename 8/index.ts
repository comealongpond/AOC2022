import { readFileSync } from 'fs';

interface Point {
    x: number,
    y: number
};

const main = (): void => {
    const lines: string[][] = readFileAsArray('./input.txt', '');
    console.log(lines);

    let highestSore: number = 0;;

    for (let i = 0; i < lines.length; i++)
    {
        for (let j = 0; j < lines[i].length; j++)
        {
            const visibleLeft = isLeftLower(lines, i, j);
            const visibleRight = isRightLower(lines, i, j);
            const visibleBottom = isBottomLower(lines, i, j);
            const visibleTop = isTopLower(lines, i, j);

            const thisPointScore = visibleLeft * visibleRight * visibleBottom * visibleTop;
            if (thisPointScore > highestSore)
            {
                highestSore = thisPointScore;
            }
        }
    }

    console.log(`highestSore ${highestSore}`);
};

const readFileAsArray = (filePath: string, delimiter: string): string[][] => {
    return readFileSync(filePath, 'utf-8')
    .split('\n')
    .map(line => line.split(delimiter));
};

const isLeftLower = (grid: string[][], row: number, col: number): number => {
    // check if the given position is at the leftmost edge of the grid
    if (col === 0) return 0;

    // get the number at the given position
    const num = Number(grid[row][col]);

    // iterate over the numbers to the left of the given position
    let index: number = 1;
    for (let i = col - 1; i >= 0; i--) {
        // check if any of the numbers to the left are greater than the given number
        if (Number(grid[row][i]) >= num) return index;
        index++;
    }

    // if no numbers to the left are greater than the given number, return true
    return index-1;
};

const isRightLower = (grid: string[][], row: number, col: number): number => {
    // check if the given position is at the rightmost edge of the grid
    if (col === grid[0].length - 1) return 0;

    // get the number at the given position
    const num = Number(grid[row][col]);

    // iterate over the numbers to the right of the given position
    let index: number = 1;
    for (let i = col + 1; i < grid[0].length; i++) {
        // check if any of the numbers to the right are greater than the given number
        if (Number(grid[row][i]) >= num) return index;
        index++;
    }

    // if no numbers to the right are greater than the given number, return true
    return index-1;
};

const isBottomLower = (grid: string[][], row: number, col: number): number => {
    // check if the given position is at the bottommost edge of the grid
    if (row === grid.length - 1) return 0;

    // get the number at the given position
    const num = Number(grid[row][col]);

    // iterate over the numbers below the given position
    let index: number = 1;
    for (let i = row + 1; i < grid.length; i++) {
        // check if any of the numbers below are greater than the given number
        if (Number(grid[i][col]) >= num) return index;
        index++;
    }

    // if no numbers below are greater than the given number, return true
    return index-1;
};

const isTopLower = (grid: string[][], row: number, col: number): number => {
    // check if the given position is at the topmost edge of the grid
    if (row === 0) return 0;

    // get the number at the given position
    const num = Number(grid[row][col]);

    // iterate over the numbers above the given position
    let index: number = 1;
    for (let i = row - 1; i >= 0; i--) {
        // check if any of the numbers above are greater than the given number
        if (Number(grid[i][col]) >= num) return index;
        index++;
    }

    // if no numbers above are greater than the given number, return true
    return index-1;
};

const isPointInArray = (point: Point, points: Point[]): boolean => {
    // iterate over the array of points
    for (const p of points) {
        // check if the given point has the same x and y coordinates as the current point in the array
        if (p.x === point.x && p.y === point.y) return true;
    }

    // if the point is not found in the array, return false
    return false;
};

main();