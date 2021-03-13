const express = require('express');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const app = express();
const port = 8000;

const chalk = require('chalk');
const log = console.log;
const prefix = chalk.bold.blue('[KREEDZEU]');

const savedFiles = 'uploads/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, savedFiles);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype !== 'image/jpeg' ||
    path.extname(file.originalname) !== '.jpg'
  )
    cb(new Error('Wrong filetype'));
  cb(null, true);
};

const upload = multer({
  dest: savedFiles,
  storage: storage,
  fileFilter: fileFilter,
});

app.use(express.static('src/public'));

app.post('/upload', upload.single('file'), (req, res) => {
  try {
    res.status(200);
    log(prefix, chalk.blue(`File uploaded successfully`));
    const file = req.file;
    const removeExtension = file.originalname.split('.').shift();
    const extension = '.webp';
    sharp(file.path)
      .resize(640, 360)
      .toFile(`${removeExtension}${extension}`, (err, info) => {
        if (err) return new Error(err);
        console.log(info);
      });
  } catch (error) {
    if (error) {
      log(prefix, chalk.red.bold('There has been a problem.'));
      throw new Error(error);
    }
  }
});

app.listen(port, log(chalk.bold(`Server started on http://localhost:${port}`)));
