const fs = require('fs');
const now = new Date();
if (fs.existsSync('write.txt')) {
  fs.unlinkSync('write.txt');
}

// Bài này phải dùng steam vì
// fs.appendFile('write.txt', 'Hey there!', () => {}); sẽ gây tràn bộ nhớ.
// Stream sẽ giúp đọc hoặc ghi 1 cục dữ liệu lớn theo đường ống tránh việc tràn bộ nhớ.
const writer = fs.createWriteStream('write.txt');
for (let i = 0; i < 3000000; i++) {
  //fs.appendFile('write.txt', 'Hey there!', () => {});
  writer.write(
    `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley\n`
  );

  if (i == 2999999) {
    console.log(new Date() - now);
  }
}
