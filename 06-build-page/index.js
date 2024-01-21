const fs = require('fs');
const path = require('path');

const pathToArticles = path.join(__dirname, './components/articles.html');
const pathToFooter = path.join(__dirname, './components/footer.html');
const pathToHeader = path.join(__dirname, './components/header.html');
let sample = '';
let articles = '';
let footer = '';
let header = '';

const readableStreamTemplate = fs.createReadStream(
  path.join(__dirname, './template.html'),
  'utf-8',
);

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) throw err;
});

const readableStreamArticles = fs.createReadStream(pathToArticles, 'utf-8');
const readableStreamFooter = fs.createReadStream(pathToFooter, 'utf-8');
const readableStreamHeader = fs.createReadStream(pathToHeader, 'utf-8');
readableStreamHeader.on('data', (chunk) => (header += chunk));
readableStreamArticles.on('data', (chunk) => (articles += chunk));
readableStreamFooter.on('data', (chunk) => (footer += chunk));
readableStreamTemplate.on('data', (chunk) => (sample += chunk));

const writeHtml = fs.createWriteStream(
  path.join(__dirname, './project-dist', 'index.html'),
);

readableStreamTemplate.on('end', () => {
  if (sample.includes('{{header}}')) {
    sample = sample.replace('{{header}}', header);
  }
  if (sample.includes('{{articles}}')) {
    sample = sample.replace('{{articles}}', articles);
  }
  if (sample.includes('{{footer}}')) {
    sample = sample.replace('{{footer}}', footer);
  }
  //   console.log(sample);
  writeHtml.write(sample);
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
