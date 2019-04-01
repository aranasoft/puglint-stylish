'use strict';
const path = require('path');
const chalk = require('chalk');
const table = require('text-table');
const logSymbols = require('log-symbols');
const stringLength = require('string-length');
const plur = require('plur');

module.exports = results => {
  const total = results.length;
  let ret = '';
  const headers = [];
  let prevfile;

  ret += table(results.map((err, i) => {
    const line = [
      '',
      chalk.gray('line ' + err.line),
      chalk.gray('col ' + err.column),
      chalk.blue(err.msg)
    ];

    if (err.filename !== prevfile) {
      headers[i] = path.relative(process.cwd(), err.filename);
    }

    prevfile = err.filename;

    return line;
  }), {
    stringLength
  }).split('\n').map((item, i) => {
    return headers[i] ? '\n' + chalk.underline(headers[i]) + '\n' + item : item;
  }).join('\n') + '\n\n';

  if (total > 0) {
    ret += '  ' + logSymbols.error + '  ' + total + ' ' + plur('error', total);
  } else {
    ret += '  ' + logSymbols.success + ' No problems';
    ret = '\n' + ret.trim();
  }

  console.log(ret + '\n');
};
