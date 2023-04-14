const fs = require('fs');
const now = new Date();
if (!fs.existsSync('write.txt')) {
  return console.log('write.txt not found!!');
}

// Tương tự với write thì read cũng vậy.
// fs.readFile() sẽ cần nhiều bộ nhớ RAM hơn để xử lý.

if (fs.existsSync('upper.txt')) {
  fs.unlinkSync('upper.txt');
}

const upper = fs.createWriteStream('upper.txt');
// .on() dùng để bắt những trạng thái có thể xảy ra khi stream, tương tự IO
// https://nodejs.org/api/stream.html

fs.createReadStream('write.txt')
  .on('data', chunck => {
    upper.write(chunck.toString().toLocaleUpperCase());
  })
  .on('close', () => console.log(new Date() - now));
