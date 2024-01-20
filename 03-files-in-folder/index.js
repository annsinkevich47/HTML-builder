const fs = require('fs');
const path = require('path');

const pathToSecret = path.resolve(__dirname, 'secret-folder');

fs.readdir(pathToSecret, { withFileTypes: true }, (err, files) => {
  if (err) console.log('Error!' + err);

  files.forEach((file) => {
    if (!file.isFile()) {
      return;
    }

    const name = file.name.substring(0, file.name.indexOf('.'));
    const extension = path.extname(file.name).slice(1);
    let size;
    const filePath = path.join(pathToSecret, file.name);

    fs.stat(filePath, (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        size = stats.size;
        console.log(name + ' - ' + extension + ' - ' + size + 'kb');
      }
    });
  });
});
