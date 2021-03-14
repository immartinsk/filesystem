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
    log(prefix, chalk.blue(`File uploaded successfully`));
    const file = req.file;
    const removeExtension = file.originalname.split('.').shift();
    const extension = '.webp';
    const dir = 'uploads/img';
    const thumbPath = `./${removeExtension}-t.webp`;
    const heroPath = `./${removeExtension}-h.webp`;
    const newHeroPath = `./uploads/img/hero/${removeExtension}.webp`;
    const newThumbPath = `./uploads/img/thumb/${removeExtension}.webp`;

    if (fs.existsSync(dir)) {
      log(chalk.blue(prefix, 'Directory found'));
    } else {
      log(chalk.red('Directory not found'));
      log(chalk.blue(prefix, 'Creating necessary directory.'));
      fs.mkdirSync(dir);
    }

    sharp(file.path)
      .resize(640, 360)
      .toFile(`${removeExtension}${extension}`, (err, info) => {
        if (err) return new Error(err);
        fs.rename(thumbPath, newThumbPath, (err) => {
          if (err) throw err;
        });
      });

    sharp(file.path)
      .resize(1280, 720)
      .toFile(`${removeExtension}${extension}`, (err, info) => {
        if (err) return new Error(err);
        fs.rename(heroPath, newHeroPath, (err) => {
          if (err) throw err;
        });
      });

    setTimeout(function () {
      fs.unlinkSync(file.path);
      log(prefix, chalk.yellow('All files have been moved.'));
      log(prefix, chalk.yellow('Original file has been deleted.'));
    }, 1000);
  } catch (error) {
    if (error) {
      log(prefix, chalk.red.bold('There has been a problem.'));
      throw new Error(error);
    }
  }
});

app.listen(port, log(chalk.bold(`Server started on http://localhost:${port}`)));
