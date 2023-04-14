const fs = require('fs');

if (!process.argv[2]) {
  throw new Error('Invalid search term!!');
}

if (!process.argv[3]) {
  throw new Error('Invalid path!!!');
}

const word = process.argv[2];
const path = process.argv[3];

if (!fs.existsSync(path)) {
  throw new Error('Folder or file no exist !!');
}

const listSearch = [];
const listRes = [];
if (fs.lstatSync(path).isDirectory()) {
  const arr = fs.readdirSync(path);
  for (const iterator of arr) {
    if (iterator.includes('.txt')) {
      listSearch.push(path + '/' + iterator);
    }
  }
  if (listSearch.length == 0) {
    throw new Error('No .txt was found in this folder !!');
  }
} else {
  if (path.includes('.txt')) {
    listSearch.push(path);
  } else {
    throw new Error('File is not .txt file !!');
  }
}

for (const iterator of listSearch) {
  const content = fs.readFileSync(iterator).toString();
  if (content.includes(word)) {
    const firstSentence = content.split('.')[0];
    listRes.push({ path: iterator, firstSentence });
  }
}
console.log(JSON.stringify(listRes, null, 2));
