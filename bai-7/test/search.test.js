const { execSync } = require('child_process');
const { expect } = require('chai');
const should = require('chai').should();

describe('case missing process.argv ', () => {
  it('should throw error Invalid search term', function () {
    expect(() => {
      execSync('node search.js');
    }).to.throw(Error, 'Invalid search term!!');
  });

  it('should throw error Invalid path', function () {
    expect(() => {
      execSync('node search.js là');
    }).to.throw(Error, 'Invalid path!!');
  });
});

describe('case invalid search word', () => {
  it('should throw error have /n', function () {
    expect(() => {
      execSync('node search.js hel\no folder1');
    }).to.throw();
  });

  it('should throw error have "', function () {
    expect(() => {
      console.log('node search.js hel"no folder1');
      execSync('node search.js hel"no folder1');
    }).to.throw();
  });
});

describe('case path not exist', () => {
  it('path not exist', function () {
    expect(() => {
      execSync('node search.js là folder12');
    }).to.throw(Error, 'Folder or file no exist !!');
  });

  it('file not exist', function () {
    expect(() => {
      execSync('node search.js là folder1.txt');
    }).to.throw(Error, 'Folder or file no exist !!');
  });
});

describe('case not .txt file', () => {
  it('not found .txt in dir', function () {
    expect(() => {
      execSync('node search.js là folder2');
    }).to.throw(Error, 'No .txt was found in this folder !!');
  });

  it('file is not .txt file', function () {
    expect(() => {
      execSync('node search.js là folder1/heslo.ts');
    }).to.throw(Error, 'File is not .txt file !!');
  });
});

describe('no error', () => {
  it('path is dir and found word', function () {
    const data = execSync('node search.js là folder1').toString();
    const json = JSON.parse(data);
    json.should.be.a('array').with.lengthOf(2);
  });

  it('path is dir and not found word', function () {
    const data = execSync('node search.js meow folder1').toString();
    const json = JSON.parse(data);
    json.should.be.a('array').with.lengthOf(0);
  });

  it('path is file and found word', function () {
    const data = execSync('node search.js là folder1/google.txt').toString();
    const json = JSON.parse(data);
    json.should.be.a('array').with.lengthOf(1);
  });

  it('path is file and not found word', function () {
    const data = execSync('node search.js meow folder1/google.txt').toString();
    const json = JSON.parse(data);
    json.should.be.a('array').with.lengthOf(0);
  });
});
