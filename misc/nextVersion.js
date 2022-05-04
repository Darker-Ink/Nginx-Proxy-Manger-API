const fs = require('node:fs');
const path = require('node:path');
const file = fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8');

const FileJson = JSON.parse(file);

const version = FileJson.version.split('.');
const firstNum = parseInt(version[0], 10);
const secondNum = parseInt(version[1], 10);
const thirdNum = parseInt(version[2], 10);
if (thirdNum >= 9) {
    version[2] = 0;
    version[1] = secondNum + 1;
} else {
    version[2] = thirdNum + 1;
}

if (secondNum >= 9) {
    version[1] = 0;
    version[0] = firstNum + 1;
}


FileJson.version = version.join('.');

fs.writeFileSync(path.join(__dirname, '../package.json'), JSON.stringify(FileJson, null, 2));