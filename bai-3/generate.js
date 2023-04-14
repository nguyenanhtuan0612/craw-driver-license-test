#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const featurePath = path.join(__dirname, 'src/features/feature1');

const newFolderName = process.argv[2];
const folderPath = process.argv[3];

if (!process.argv[2]) {
  return console.log('foleder name is invalid!!');
}

if (!process.argv[3]) {
  return console.log('folder path is invalid!!');
}

const newFolderPath = path.join(`${folderPath}/${newFolderName}`);

if (fs.existsSync(newFolderPath)) {
  return;
}
fs.mkdirSync(newFolderPath);

fs.readdirSync(featurePath).forEach(folder => {
  const childFolderPath = path.join(__dirname, `src/features/feature1/${folder}`);

  const newChildFolderPath = path.join(`${folderPath}/${newFolderName}/${folder}`);

  fs.mkdirSync(newChildFolderPath);

  fs.readdirSync(childFolderPath).forEach(file => {
    const sourceFilePath = path.join(childFolderPath, file);
    const targetFilePath = path.join(newChildFolderPath, file);
    fs.copyFileSync(sourceFilePath, targetFilePath);
  });
});
