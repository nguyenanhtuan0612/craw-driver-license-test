const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const cliProgress = require('cli-progress');
const colors = require('ansi-colors');

async function craw() {
  const listTestPage = await axios.get('https://vnexpress.net/interactive/2016/thi-sat-hach-lai-xe');
  const listTestPageData = cheerio.load(listTestPage.data);
  const arr = [];
  const listTest = listTestPageData('div.dethi_item');
  listTest.each((i, el) => {
    const linkTest = 'https://vnexpress.net' + listTestPageData(el).find('a').attr('href');
    arr.push(linkTest);
  });

  if (fs.existsSync('test')) {
    fs.rmSync('test', { recursive: true, force: true });
  }
  fs.mkdirSync('test');

  if (fs.existsSync('public/images')) {
    fs.rmSync('public/images', { recursive: true, force: true });
  }
  fs.mkdirSync('public/images');
  const b2 = new cliProgress.SingleBar({
    format: 'Tải ảnh |' + colors.yellow('{bar}') + '| {percentage}% || {value}/{total} Image',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  });

  const b1 = new cliProgress.SingleBar({
    format: 'Tải đề |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Questions',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  });

  const arrImage = [];
  b1.start(60, 0, {});
  for (const [index, link] of arr.entries()) {
    const test = await axios.get(link);
    const testData = cheerio.load(test.data);
    const testObj = { name: `Đề ${index + 1}`, listQuestion: [] };

    for (let i = 1; i <= 35; i++) {
      const qs = testData(`div#question_${i}`);
      const qsName = testData(qs).find('p.cauhoi_txt').text();
      const qsContent = testData(qs).find('p.noidung_cauhoi').text();
      const imgLink = testData(qs).find('p.noidung_cauhoi').find('img').attr('src');
      let pathImg = null;

      if (imgLink) {
        arrImage.push(imgLink);
        const nameImg = imgLink.split('https://i-vnexpress.vnecdn.net/2020/09/04/')[1];
        pathImg = '/images/' + nameImg;
      }

      const questionObj = {
        name: qsName,
        content: qsContent,
        image: pathImg,
        answers: [],
      };

      const answersElements = testData(qs).find('div.noidung_dapan > ul').children();
      answersElements.each((index, element) => {
        questionObj.answers.push(testData(element).find('span').text());
      });
      testObj.listQuestion.push(questionObj);
    }
    b1.increment();
    fs.writeFileSync(`test/${testObj.name}.json`, JSON.stringify(testObj));
  }
  b1.stop();

  b2.start(arrImage.length, 0, {});
  const promise = new Promise(async (resolve, reject) => {
    for (const [index, imgLink] of arrImage.entries()) {
      function sleep(ms) {
        return new Promise(resolve => {
          setTimeout(resolve, ms);
        });
      }

      const nameImg = imgLink.split('https://i-vnexpress.vnecdn.net/2020/09/04/')[1];
      axios
        .get(imgLink, { responseType: 'stream' })
        .then(res => {
          res.data.pipe(fs.createWriteStream('public/images/' + nameImg)).on('finish', () => {
            b2.increment();
            if (b2.getProgress() == 1) {
              b2.stop();
              return resolve();
            }
          });
        })
        .catch(err => {
          console.log(nameImg);
          return reject(err);
        });

      sleep(1000);
    }
  });
  await promise;
}

return craw();
