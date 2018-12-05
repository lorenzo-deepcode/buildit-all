#! /usr/bin/env node

const path = require('path');
const process = require('process');
const shell = require('shelljs');

const babelCli = path.resolve(__dirname, '..', 'node_modules', '.bin', 'babel-node');

const args = process.argv;
args.shift();
args.shift();
const argstring = args.join(' ');

shell.exec(`${babelCli} src/commands/brandai.js ${argstring}`);
