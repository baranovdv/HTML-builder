const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

const fileTemplate = path.join(__dirname, 'template.html');
const pathDeploy = path.join(__dirname, 'project-dist');
const fileDeploy = path.join(pathDeploy, 'index.html');
const pathComponents = path.join(__dirname, 'components');
const pathStyles = path.join(__dirname, 'styles');
const fileStyles = path.join(pathDeploy, 'style.css');
const assets = path.join(__dirname, 'assets');
const assetsDeploy = path.join(pathDeploy, 'assets');

let componentsObject = {};
let template = '';

async function checkFolder(folder) {
  try {
    await fsp.access(folder, fsp.constants.R_OK | fsp.constants.W_OK);
    await fsp.rm(folder, { recursive: true });
    await fsp.mkdir(folder);
  } catch {
    await fsp.mkdir(folder);
  }
}

async function checkFile(fromFolder, toFolder, file) {
  try {
    await fsp.copyFile(path.join(fromFolder,file), path.join(toFolder, file));
  } catch (err) {
    console.error(err.message);
  }
}

async function copyFolder(folder, destination) {
  try {
    await checkFolder(destination);
    const files = await fsp.readdir(folder);
    for(let file of files) {
      fs.stat(path.join(folder, file), (err, stat) => {
        if (!err) {
          if (stat.isFile()) {
            checkFile(folder, destination, file);
          }
          else if (stat.isDirectory()) {
            copyFolder(path.join(folder, file), path.join(destination, file));
          }
        }
        else {
          console.error(err.message);
        }
      });
    }
  } catch (err) {
    console.error(err.message);
  }
}

function writeFile(Array, destination) {
  const output = fs.createWriteStream(destination);
  Array.forEach((chunk) => {
    output.write(chunk);
  });
}

async function createBundleStyles() {
  let bufArray = [];

  try {
    const files = await fsp.readdir(pathStyles);
    for(let file of files) {
      if(path.extname(file) !== '.css') {
        continue;
      }

      const readableStream = fs.createReadStream(path.join(pathStyles, file));
      readableStream.on('data', chunk => {  
        bufArray.push(chunk);
      });
      
      readableStream.on('end', () => {
        writeFile(bufArray, fileStyles);
      });

      readableStream.on('error', error => console.log('Error', error.message));
    }
  } catch (err) {
    console.error(err.message);
  }
}

async function createComponentsArray() {
  try {
    const componentsArray = await fsp.readdir(pathComponents);
    for(let component of componentsArray) {
      const pathComponent = path.join(pathComponents, component);
      const readStreamC = fs.createReadStream(pathComponent, 'utf-8');
      readStreamC.on('data', chunk => {  
        componentsObject[component.split('.')[0]] = chunk;
      });
    }
  }
  catch (err) {
    console.error(err.message);
  }
}

(async function createSite() {
  try {
    await checkFolder(pathDeploy);
    await copyFolder(assets, assetsDeploy);
    const writeStream = fs.createWriteStream(fileDeploy);
    await createBundleStyles();
    await createComponentsArray();

    const readStream = fs.createReadStream(fileTemplate);
    readStream.on('data', chunk => {  
      template += chunk.toString();
    });

    readStream.on('end', () => {
      for (let item in componentsObject){
        template = template.replace(`    {{${item}}}`, componentsObject[item]);
      }
      writeStream.write(template);
    });
  } catch (err) {
    console.error(err.message);
  }
})();

