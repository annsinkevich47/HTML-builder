const fs = require('fs');
const path = require('path');

const pathToSecret = path.resolve(__dirname, 'secret-folder');

fs.readdir(pathToSecret, { withFileTypes: true }, (err, files) => {
  if (err) console.log('Error!' + err);

  files.forEach((file) => {
    if (!file.isFile()) {
      return;
    }

    const extension = path.extname(file.name).slice(1);
    const filePath = path.join(pathToSecret, file.name);
    const name = path.basename(filePath, extension);

    let size;

    fs.stat(filePath, (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        size = stats.size;
        console.log(
          name.slice(0, name.length - 1) +
            ' - ' +
            extension +
            ' - ' +
            size +
            'kb',
        );
      }
    });
  });
});
