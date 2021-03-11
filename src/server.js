const express = require('express');
const app = express();
const port = 8000;

const chalk = require('chalk');
const log = console.log;
const prefix = chalk.bold.blue('[KREEDZEU]');

app.use(express.static('src/public'));

app.get('/example', (req, res) => {
  log(prefix, chalk.bold(`Example console message`));
  res.writeHead(200).end('Hello World');
});

app.listen(port, log(chalk.bold(`Server started on http://localhost:${port}`)));
