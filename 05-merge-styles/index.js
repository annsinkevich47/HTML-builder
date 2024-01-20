const fs = require('fs');
const path = require('path');

const pathToStyles = path.resolve(__dirname, 'styles');

fs.readdir(pathToStyles, { withFileTypes: true }, (err, files) => {
  if (err) console.log('Error!' + err);

  const arr = [];

  const writeStream = fs.createWriteStream(
    path.join(__dirname, './project-dist/bundle.css'),
  );

  files.forEach((file) => {
    const name = file.name;
    if (!file.isFile() || !name.slice(name.length - 3, name.length) === 'css') {
      return;
    }
    const readableStream = fs.createReadStream(
      path.join(pathToStyles, name),
      'utf-8',
    );
    readableStream.on('data', (chunk) => arr.push(chunk));
    readableStream.on('end', () =>
      writeStream.write(arr.join('').slice(0, -11)),
    );
  });
});
