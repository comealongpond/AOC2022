"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const VALID_TERMINAL_COMMANDS = ['cd', 'ls', 'dir'];
let activeDirectoryPath = [];
;
;
;
// FILESYSTEM STRUCTURE
// '/': {
//     files: [
//         {name: 'abc.txt', size: 1300}
//     ],
//     directories: {
//         'p': {
//             files [
//                 {name: 'cba.txt', size: 310}
//             ],
//             directories: {...}
//         },
//         'a': {...}
//     }
// }
let fileSystem = {
    '/': {
        files: [],
        directories: {}
    }
};
const main = () => {
    const input = fs.readFileSync('input.txt', 'utf8');
    // Build filesystem
    input.split('\n').forEach(function (line, i) {
        parseTerminalLine(line);
    });
    // Pretty print built filesystem
    printFileSystem();
    // Summarize filesystem by directory
    let summarizedDirectories = summarizeDirectories();
    // Puzzle answer
    let answer = sumFoldersSizeLessThan(summarizedDirectories, 100000);
    console.log(`Sum of size of folders less than 100000 = ${answer}`);
};
const parseTerminalLine = (line) => {
    if (line[0] == '$') // Command
     {
        return parseTerminalCommand(line);
    }
    return parseTerminalOutput(line);
};
const parseTerminalCommand = (cmd) => {
    const [token, command, param] = cmd.split(' ');
    if (VALID_TERMINAL_COMMANDS.indexOf(command) == -1) {
        console.log(`Invalid terminal command '${command}'`);
        return;
    }
    if (command == 'cd') // change directory
     {
        if (param == '/') // Step to root
         {
            activeDirectoryPath = ['/'];
        }
        else if (param == '..') // Step up one
         {
            activeDirectoryPath.pop();
        }
        else // Go down one step
         {
            let dirExists = dirExistsInCurrentPath(param);
            if (dirExists) {
                activeDirectoryPath.push(param);
            }
            else {
                // Directory does not exist
                console.log(`CD error. Directory ${param} does not exist in ${activeDirectoryPath.join(' > ')}.`);
            }
        }
    }
};
const dirExistsInCurrentPath = (dirName) => {
    let activeDir = fileSystem;
    let activeDirName = '';
    activeDirectoryPath.forEach((e, i) => {
        activeDir = activeDir[e].directories;
        activeDirName = e;
    });
    return typeof activeDir[dirName] != 'undefined';
};
const dirExists = (dirName) => {
    let summarized = summarizeDirectories();
    let dirPath = [];
    summarized.forEach((el, i) => {
        if (el.name == dirName) {
            // Dir found
            dirPath = el.path.split(' > ');
        }
    });
    return dirPath;
};
const parseTerminalOutput = (output) => {
    const [marker, name] = output.split(' ');
    if (marker == 'dir') {
        // Listing directory
        let thisDir = fileSystem;
        let thisDirName = "";
        activeDirectoryPath.forEach((el, i) => {
            thisDir = thisDir[el].directories;
        });
        if (typeof thisDir[name] == 'undefined') // New directory
         {
            thisDir[name] = {
                files: [],
                directories: {}
            };
        }
    }
    else {
        // Listing file
        let thisDir = fileSystem;
        let thisDirName = activeDirectoryPath[activeDirectoryPath.length - 1];
        activeDirectoryPath.forEach((el, i) => {
            if (i < activeDirectoryPath.length - 1) {
                if (typeof thisDir[el] != 'undefined') {
                    thisDir = thisDir[el].directories;
                }
                else {
                    if (typeof thisDir[thisDirName].directories[el] != 'undefined') {
                        thisDir = thisDir[thisDirName].directories[el].directories;
                    }
                }
            }
        });
        // Do i need to check if file alreay exists?
        thisDir[activeDirectoryPath[activeDirectoryPath.length - 1]].files.forEach((e, i) => {
            if (e.name == name) {
                return; // File already added to directory
            }
        });
        // Add new file to directory
        thisDir[activeDirectoryPath[activeDirectoryPath.length - 1]].files.push({ name: name, size: parseInt(marker) });
    }
};
const summarizeDirectories = () => {
    let summarized = [];
    let depth = 0;
    let rootDirectoryName = '/';
    summarizeDirectory(fileSystem, rootDirectoryName, depth, summarized, '/');
    // console.log(summarized);
    return summarized;
};
const summarizeDirectory = (dir, dirName, depth, summarized, currentPath) => {
    if (typeof dir[dirName] == 'undefined' || depth > 10) // exit cond
     {
        return 0;
    }
    let directoryFileSize = 0;
    if (dir[dirName].files.length) {
        dir[dirName].files.forEach((el, i) => {
            directoryFileSize += el.size;
        });
    }
    if (Object.keys(dir[dirName].directories).length) {
        Object.keys(dir[dirName].directories).forEach((el, i) => {
            directoryFileSize += summarizeDirectory(dir[dirName].directories, el, depth + 1, summarized, currentPath + ' > ' + el);
        });
    }
    summarized.push({
        name: dirName,
        size: directoryFileSize,
        path: currentPath
    });
    return directoryFileSize;
};
const sumFoldersSizeLessThan = (folders, sizeLimit) => {
    let sum = 0;
    folders.forEach((folder, i) => {
        if (folder.size < sizeLimit) {
            sum += folder.size;
        }
    });
    return sum;
};
// Pretty print
const printFileSystem = () => {
    let level = 0;
    printDirectoryContent(fileSystem, '/', level);
};
const printDirectoryContent = (dir, dirName, level) => {
    if (typeof dir[dirName] == 'undefined' || level > 10) {
        console.log(`${dirName} does not exist in`);
        console.log(dir);
        return;
    }
    else {
        let tabs = '';
        for (let i = 0; i < level; i++) {
            tabs += '\t';
        }
        console.log(`${tabs} ${dirName}`);
        tabs += '\t';
        if (dir[dirName].files.length) {
            dir[dirName].files.forEach((el, i) => {
                console.log(`${tabs} ${el.name} (${el.size}kb)`);
            });
        }
        if (Object.keys(dir[dirName].directories).length) {
            Object.keys(dir[dirName].directories).forEach((el, i) => {
                printDirectoryContent(dir[dirName].directories, el, level + 1);
            });
        }
    }
};
main();
