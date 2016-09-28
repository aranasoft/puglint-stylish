'use strict';
/* eslint-env mocha */
var assert = require('assert');
var spawn = require('child_process').spawn;
var path = require('path');
var chalk = require('chalk');
var expect = require('chai').expect;

var bin = require.resolve('pug-lint/bin/pug-lint');

function run(args, cb) {
  var command = [bin].concat(args);
  var stdout = '';
  var stderr = '';
  var node = process.execPath;
  var child = spawn(node, command);

  if (child.stderr) {
    child.stderr.on('data', function (chunk) {
      stderr += chunk;
    });
  }

  if (child.stdout) {
    child.stdout.on('data', function (chunk) {
      stdout += chunk;
    });
  }

  child.on('error', cb);

  child.on('close', function (code) {
    cb(null, code, stdout, stderr);
  });

  return child;
}

describe('with linting errors', function () {
  var output;

  before(function (done) {
    var args = ['-r', './', path.resolve('./fixture.pug')];

    run(args, function (err, code, stdout) {
      assert(!err, err);
      output = chalk.stripColor(stdout || '');
      done();
    });
  });

  it('should display filename', function () {
    return expect(output).to.contain('fixture.pug');
  });

  it('should not display current directory path', function () {
    return expect(output).to.not.contain(process.cwd());
  });

  it('should display lint error', function () {
    return expect(output).to.contain('unexpected text "|');
  });
});
