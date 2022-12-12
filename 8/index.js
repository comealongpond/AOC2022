"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
;
var main = function () {
    var lines = readFileAsArray('./input.txt', '');
    console.log(lines);
    var highestSore = 0;
    ;
    for (var i = 0; i < lines.length; i++) {
        for (var j = 0; j < lines[i].length; j++) {
            var visibleLeft = isLeftLower(lines, i, j);
            var visibleRight = isRightLower(lines, i, j);
            var visibleBottom = isBottomLower(lines, i, j);
            var visibleTop = isTopLower(lines, i, j);
            var thisPointScore = visibleLeft * visibleRight * visibleBottom * visibleTop;
            if (thisPointScore > highestSore) {
                highestSore = thisPointScore;
            }
        }
    }
    console.log("highestSore ".concat(highestSore));
};
var readFileAsArray = function (filePath, delimiter) {
    return (0, fs_1.readFileSync)(filePath, 'utf-8')
        .split('\n')
        .map(function (line) { return line.split(delimiter); });
};
var isLeftLower = function (grid, row, col) {
    // check if the given position is at the leftmost edge of the grid
    if (col === 0)
        return 0;
    // get the number at the given position
    var num = Number(grid[row][col]);
    // iterate over the numbers to the left of the given position
    var index = 1;
    for (var i = col - 1; i >= 0; i--) {
        // check if any of the numbers to the left are greater than the given number
        if (Number(grid[row][i]) >= num)
            return index;
        index++;
    }
    // if no numbers to the left are greater than the given number, return true
    return index - 1;
};
var isRightLower = function (grid, row, col) {
    // check if the given position is at the rightmost edge of the grid
    if (col === grid[0].length - 1)
        return 0;
    // get the number at the given position
    var num = Number(grid[row][col]);
    // iterate over the numbers to the right of the given position
    var index = 1;
    for (var i = col + 1; i < grid[0].length; i++) {
        // check if any of the numbers to the right are greater than the given number
        if (Number(grid[row][i]) >= num)
            return index;
        index++;
    }
    // if no numbers to the right are greater than the given number, return true
    return index - 1;
};
var isBottomLower = function (grid, row, col) {
    // check if the given position is at the bottommost edge of the grid
    if (row === grid.length - 1)
        return 0;
    // get the number at the given position
    var num = Number(grid[row][col]);
    // iterate over the numbers below the given position
    var index = 1;
    for (var i = row + 1; i < grid.length; i++) {
        // check if any of the numbers below are greater than the given number
        if (Number(grid[i][col]) >= num)
            return index;
        index++;
    }
    // if no numbers below are greater than the given number, return true
    return index - 1;
};
var isTopLower = function (grid, row, col) {
    // check if the given position is at the topmost edge of the grid
    if (row === 0)
        return 0;
    // get the number at the given position
    var num = Number(grid[row][col]);
    // iterate over the numbers above the given position
    var index = 1;
    for (var i = row - 1; i >= 0; i--) {
        // check if any of the numbers above are greater than the given number
        if (Number(grid[i][col]) >= num)
            return index;
        index++;
    }
    // if no numbers above are greater than the given number, return true
    return index - 1;
};
var isPointInArray = function (point, points) {
    // iterate over the array of points
    for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
        var p = points_1[_i];
        // check if the given point has the same x and y coordinates as the current point in the array
        if (p.x === point.x && p.y === point.y)
            return true;
    }
    // if the point is not found in the array, return false
    return false;
};
main();
