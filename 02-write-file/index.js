const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

console.log('Enter the text please.');

stdin.on('data', (data) => {
  process.on('SIGINT', function () {
    console.log('Thank you for entering text!');
    process.exit();
  });

  if (data.toString().trim() == 'exit') {
    process.exit(stdout.write('Thank you for entering text!'));
  }

  output.write(data);
});
