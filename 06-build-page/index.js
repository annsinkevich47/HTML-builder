const fs = require('fs');
const path = require('path');

const pathToDir = path.join(__dirname, './components');

let sample = '';
let sampleStart = '';
let sampleEnd = '';
let nameTag = '';

const readableStreamTemplate = fs.createReadStream(
  path.join(__dirname, './template.html'),
  'utf-8',
);

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) throw err;
});

readableStreamTemplate.on('data', (chunk) => (sample += chunk));

const writeHtml = fs.createWriteStream(
  path.join(__dirname, './project-dist', 'index.html'),
);

readableStreamTemplate.on('end', () => {
  replaceTag();
  function replaceTag() {
    sampleStart = sample.indexOf('{{');
    sampleEnd = sample.indexOf('}}');
    nameTag = sample.slice(sampleStart + 2, sampleEnd);
    fs.readFile(path.join(pathToDir, nameTag + '.html'), (err, data) => {
      if (!err && data) {
        if (sample.includes('{{')) {
          sample = sample.replace('{{' + nameTag + '}}', data);
          replaceTag();
        }
        if (!sample.includes('{{')) {
          writeHtml.write(sample);
        }
      }
    });
  }
});

fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log('Error!' + err);

    const arr = [];

    const writeStream = fs.createWriteStream(
      path.join(__dirname, './project-dist/style.css'),
    );

    files.forEach((file) => {
      const name = file.name;
      if (
        !file.isFile() ||
        !name.slice(name.length - 3, name.length) === 'css'
      ) {
        return;
      }
      const readableStream = fs.createReadStream(
        path.join(path.join(__dirname, 'styles'), name),
        'utf-8',
      );
      readableStream.on('data', (chunk) => arr.push(chunk));
      readableStream.on('end', () => writeStream.write(arr.join('')));
    });
  },
);

fs.mkdir(
  path.join(__dirname, './project-dist/assets'),
  { recursive: true },
  (err) => {
    if (err) {
      return console.error(err);
    }
  },
);

fs.readdir(
  path.join(__dirname, './assets'),
  { withFileTypes: true },
  (err, folders) => {
    if (err) console.log('Error!' + err);

    folders.forEach((folder) => {
      fs.mkdir(
        path.join(__dirname, './project-dist/assets', folder.name),
        { recursive: true },
        (err) => {
          if (err) {
            return console.error(err);
          }
          fs.readdir(
            path.join(__dirname, './assets', folder.name),
            { withFileTypes: true },
            (err, files) => {
              if (err) console.log('Error!' + err);

              files.forEach((file) => {
                const sourceFilePath = path.join(
                  __dirname,
                  'assets',
                  folder.name,
                  file.name,
                );
                const copyFilePath = path.join(
                  __dirname,
                  'project-dist/assets',
                  folder.name,
                  file.name,
                );
                fs.copyFile(sourceFilePath, copyFilePath, (err) => {
                  if (err) {
                    console.log('Error Found:', err);
                  }
                });
              });
            },
          );
        },
      );
    });
  },
);
