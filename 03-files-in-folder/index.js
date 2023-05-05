const fsp = require('fs').promises;
const path = require('path');
const pathDir = path.join(__dirname, 'secret-folder');


// example - txt - 128.369kb
async function filesInFolder(pathDir) {
  try {
    const files = await fsp.readdir(pathDir, {withFileTypes: true});

    for (const file of files) {
      if(!file.isFile()) {
        continue;
      }
      const name = file.name.split('.')[0];
      const ext = file.name.split('.')[1];
      const stat = await fsp.stat(path.join(pathDir,file.name));
      const size = stat.size;
      
      console.log(`${name} - ${ext} - ${size}b`);
    }
    
  } catch (err) {
    console.error(err);
  }
}

filesInFolder(pathDir);