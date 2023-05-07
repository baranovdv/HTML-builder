const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

const pathProject = path.join(__dirname, 'project-dist');
const pathStyles = path.join(__dirname, 'styles');

function writeFile(Array) {
  const output = fs.createWriteStream(path.join(pathProject, 'bundle.css'));
  Array.forEach((chunk) => {
    output.write(chunk);
  });
}

(async function createBundleStyles() {
  let bufArray = [];

  try {
    const files = await fsp.readdir(pathStyles);
    for(let file of files) {
      console.log(path.extname(file));
      if(path.extname(file) !== '.css') {
        continue;
      }

      const readableStream = fs.createReadStream(path.join(pathStyles, file));
      readableStream.on('data', chunk => {  
        bufArray.push(chunk);
      });
      
      readableStream.on('end', () => {
        writeFile(bufArray);
      });

      readableStream.on('error', error => console.log('Error', error.message));
    }

  } catch (err) {
    console.error(err.message);
  }
}
)();