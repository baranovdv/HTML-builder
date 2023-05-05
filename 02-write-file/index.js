const fs = require('fs');
const path = require('path');
const pathDir = __dirname;

const output = fs.createWriteStream(path.join(pathDir, 'text.txt'));

process.stdout.write('Enter your text: ');
process.stdin.on('data', data => {
  if(data.toString().trim() === 'exit') {
    output.end();
    process.exit();
  }
  output.write(data);
});

process.on('exit', () => {
  process.stdout.write('\nGoodbye');
});

process.on('SIGINT', () => {
  process.exit();
});

process.stdin.on('error', error => console.log('Error', error.message));