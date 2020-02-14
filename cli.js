#!/usr/bin/env node

const utils = require('./utils'),
    program = require('commander');

    program
    .usage('<json-file> [options]')
    .option('-o, --output [output]', 'Path of output file. If not provided, then stdout will be used', utils.convertToAbsolutePath)
    .option('-k, --keys [keys]', 'Keys of documents to uplift', utils.constructKeysList, undefined)
    .parse(process.argv);

    Promise.resolve({
      json: utils.readInputFile(program.args && program.args.length && program.args[0]),
      output: program.output,
      options: {
          keys: program.keys
      }
  })
      .then(utils.parseInputFiles)
      .then(utils.flatKeys)
      .then(utils.processOutput);