const fs = require('fs');
const path = require('path');
const pathDir = __dirname;

const readableStream = fs.createReadStream(path.join(pathDir,'text.txt'), 'utf-8');

readableStream.on('data', chunk => {
  console.log(chunk);
});

readableStream.on('error', error => console.log('Error', error.message));