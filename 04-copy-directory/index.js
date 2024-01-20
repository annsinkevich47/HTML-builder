const fs = require('fs');
const path = require('path');

const pathToFolder = path.resolve(__dirname, 'files');
console.log(pathToFolder);

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
});

fs.readdir(pathToFolder, { withFileTypes: true }, (err, files) => {
  if (err) console.log('Error!' + err);

  files.forEach((file) => {
    const sourceFilePath = path.join(__dirname, 'files', file.name);
    const copyFilePath = path.join(__dirname, 'files-copy', file.name);
    fs.copyFile(sourceFilePath, copyFilePath, (err) => {
      if (err) {
        console.log('Error Found:', err);
      }
    });
  });
});
