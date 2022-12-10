import * as fs from 'fs';
import { dirname } from 'path';
import { nextTick } from 'process';

const VALID_TERMINAL_COMMANDS = ['cd', 'ls', 'dir'];

let activeDirectoryPath: string[] = [];

// Define filesystem
interface File {
    name: string,
    size: number
};
interface Directory {
    [key: string]: { // Bad idea
        files: File[],
        directories: Directory
    }
};
interface Folder {
    name: string,
    size: number,
    path: string
};

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
let fileSystem: Directory = { // Fix, no default directory needed
    '/': {
        files: [],
        directories: {}
    }
};

const main = (): void => {
    const input = fs.readFileSync('input.txt','utf8');

    // Build filesystem
    input.split('\n').forEach(function(line, i) {
        parseTerminalLine(line);
    });

    // Pretty print built filesystem
    printFileSystem();

    // Summarize filesystem by directory
    let summarizedDirectories: Folder[] = summarizeFolders();

    // Puzzle answer 1
    let answer: number = sumFoldersSizeLessThan(summarizedDirectories, 100000);
    console.log(`Sum of size of folders less than 100000 = ${answer}`);

    // Puzzle answer 2
    let totalFilesystemSize: number = getTotalFilesystemSize(summarizedDirectories);
    console.log(`totalFilesystemSize ${totalFilesystemSize}`);
    const freeSpace: number = 70000000 - totalFilesystemSize;
    const spaceNeeded: number = 30000000 - freeSpace;
    console.log(`Free space needed = ${spaceNeeded}`);
    let answer2: Folder = smallestFolderBiggerThan(summarizedDirectories, spaceNeeded);
    console.log(`Smallest folder deletable = ${answer2.size}`);
    
};

const parseTerminalLine = (line: string): void => {
    if (line[0] == '$') // Command
    {
        return parseTerminalCommand(line);
    }
    
    return parseTerminalOutput(line);
};

const parseTerminalCommand = (cmd: string): void => {
    const [token, command, param] = cmd.split(' ');

    if (VALID_TERMINAL_COMMANDS.indexOf(command) == -1)
    {
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
            let dirExists: boolean = dirExistsInCurrentPath(param);
            if (dirExists)
            {
                activeDirectoryPath.push(param);
            }
            else
            {
                // Directory does not exist
                console.log(`CD error. Directory ${param} does not exist in ${activeDirectoryPath.join(' > ')}.`);
            }
        }
    }
};

const dirExistsInCurrentPath = (dirName: string): boolean => {

    let activeDir: Directory = fileSystem;
    let activeDirName: string = '';
    activeDirectoryPath.forEach((e, i) => {
        activeDir = activeDir[e].directories;
        activeDirName = e;
    });

    return typeof activeDir[dirName] != 'undefined';
};

const dirExists = (dirName: string): string[] => {
    let summarized: Folder[] = summarizeFolders();
    let dirPath: string[] = [];

    summarized.forEach((el, i) => {
        if (el.name == dirName)
        {
            // Dir found
            dirPath = el.path.split(' > ');
        }
    });

    return dirPath;
};

const parseTerminalOutput = (output: string): void => {
    const [marker, name] = output.split(' ');

    if (marker == 'dir')
    {
        // Listing directory
        let thisDir: Directory = fileSystem;
        let thisDirName: string = "";
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
    else
    {
        // Listing file
        let thisDir: Directory = fileSystem;
        let thisDirName: string = activeDirectoryPath[activeDirectoryPath.length-1];
        activeDirectoryPath.forEach((el, i) => {
            if (i < activeDirectoryPath.length-1)
            {
                if (typeof thisDir[el] != 'undefined')
                {
                    thisDir = thisDir[el].directories;
                }
                else
                {
                    if (typeof thisDir[thisDirName].directories[el] != 'undefined')
                    {
                        thisDir = thisDir[thisDirName].directories[el].directories;
                    }
                }
            }
        });

        // Do i need to check if file alreay exists?
        thisDir[activeDirectoryPath[activeDirectoryPath.length-1]].files.forEach((e,i) => {
            if (e.name == name)
            {
                return; // File already added to directory
            }
        });

        // Add new file to directory
        thisDir[activeDirectoryPath[activeDirectoryPath.length-1]].files.push({name: name, size: parseInt(marker)});
    }
};

const smallestFolderBiggerThan = (directories: Folder[], limit: number): Folder => {
    let closestFolder: Folder = {name: '', size: 10000000000, path: ''};

    directories.forEach((e,i) => {
        if (e.size > limit && e.size - limit < closestFolder.size - limit)
        {
            closestFolder = e;
        }
    });

    return closestFolder;
};

const summarizeFolders = (): Folder[] => {
    let summarized: Folder[] = [];
    let depth:number = 0;
    let rootDirectoryName: string = '/';
    
    summarizeDirectory(fileSystem, rootDirectoryName, depth, summarized, '/');

    // console.log(summarized);

    return summarized;
};

const summarizeDirectory = (dir: Directory, dirName: string, depth: number, summarized: Folder[], currentPath: string): number => {
    if (typeof dir[dirName] == 'undefined' || depth > 10) // exit cond
    {
        return 0;
    }

    let directoryFileSize: number = 0;
    if (dir[dirName].files.length)
    {
        dir[dirName].files.forEach((el, i) => {
            directoryFileSize += el.size;
        });
    }
    if (Object.keys(dir[dirName].directories).length)
    {
        Object.keys(dir[dirName].directories).forEach((el, i) => {
            directoryFileSize += summarizeDirectory(dir[dirName].directories, el, depth + 1, summarized, currentPath+' > '+el);
        });
    }

    summarized.push({
        name: dirName,
        size: directoryFileSize,
        path: currentPath
    });

    return directoryFileSize;
};

const sumFoldersSizeLessThan = (folders: Folder[], sizeLimit: number): number => {
    let sum: number = 0;
    folders.forEach((folder, i) => {
        if (folder.size < sizeLimit)
        {
            sum += folder.size;
        }
    });

    return sum;
};

const getTotalFilesystemSize = (folders: Folder[]): number => {
    let size: number = 0;
    folders.forEach((e,i) => {
        if (e.name == '/')
        {
            // Found root
            size =  e.size;
        }
    });

    return size;
};

// Pretty print
const printFileSystem = (): void => {

    let level: number = 0;
    printDirectoryContent(fileSystem, '/', level);
};

const printDirectoryContent = (dir: Directory, dirName: string,  level: number) => {
    if (typeof dir[dirName] == 'undefined' || level > 10)
    {
        console.log(`${dirName} does not exist in`);
        console.log(dir);
        return;
    }
    else
    {
        let tabs: string = '';
        for (let i = 0; i < level; i++)
        {
            tabs += '\t';
        }

        console.log(`${tabs} ${dirName}`);
        tabs += '\t';

        if (dir[dirName].files.length)
        {
            dir[dirName].files.forEach((el, i) => {
                console.log(`${tabs} ${el.name} (${el.size}kb)`);
            });
        }
        if (Object.keys(dir[dirName].directories).length)
        {
            Object.keys(dir[dirName].directories).forEach((el, i) => {
                printDirectoryContent(dir[dirName].directories, el, level+1);
            });
        }
    }
};


main();