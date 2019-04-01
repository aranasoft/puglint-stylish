'use strict';
/* eslint-env mocha */
const assert = require('assert');
const {spawn} = require('child_process');
const path = require('path');
const {expect} = require('chai');
const stripColor = require('strip-ansi');

const bin = require.resolve('pug-lint/bin/pug-lint');

function run(args, cb) {
  const command = [bin].concat(args);
  let stdout = '';
  let stderr = '';
  const node = process.execPath;
  const child = spawn(node, command);

  child.stderr.on('data', data => {
    stderr += data;
  });

  child.stdout.on('data', data => {
    stdout += data;
  });

  child.on('error', () => {
    cb();
  });

  child.on('close', code => {
    cb(null, code, stdout, stderr);
  });

  return child;
}

describe('with linting errors', () => {
  let output;

  before(done => {
    const args = ['-r', './', path.resolve('./fixture.pug')];

    run(args, (err, code, stdout) => {
      assert(!err, err);
      output = stripColor(stdout);
      done();
    });
  });

  it('should contain errors', () => {
    return expect(output).to.not.be.empty;
  });

  it('should display filename', () => {
    return expect(output).to.contain('fixture.pug');
  });

  it('should not display current directory path', () => {
    return expect(output).to.not.contain(process.cwd());
  });

  it('should display lint error', () => {
    return expect(output).to.contain('Unexpected character \'#');
  });
});
