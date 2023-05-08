const fsp = require('fs').promises;
const path = require('path');

const pathDir = path.join(__dirname, 'files');

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

async function copyDir(folder) {
  const folderCopy = path.join(path.dirname(folder), path.basename(folder) + '-copy');
  try {
    await checkFolder(folderCopy);
    const files = await fsp.readdir(folder);
    for(let file of files) {
      console.log(file);
      checkFile(folder, folderCopy, file);
    }
  } catch (err) {
    console.error(err.message);
  }
}

copyDir(pathDir);