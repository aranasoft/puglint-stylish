'use strict';
var path = require('path');
var chalk = require('chalk');
var table = require('text-table');
var logSymbols = require('log-symbols');
var stringLength = require('string-length');
var plur = require('plur');

module.exports = function (results) {
  var total = results.length;
  var ret = '';
  var headers = [];
  var prevfile;

  ret += table(results.map(function (err, i) {
    // console.log(item);

    var line = [
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
    stringLength: stringLength
  }).split('\n').map(function (item, i) {
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
