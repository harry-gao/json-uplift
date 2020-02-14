'use strict';

const path = require('path'),
    fs = require('fs');

module.exports = {
    constructKeysList,
    readInputFile,
    convertToAbsolutePath,
    parseInputFiles,
    flatKeys,
    processOutput
};

function convertToAbsolutePath(filePath) {
    if (filePath && !path.isAbsolute(filePath)) {
        return path.join(process.cwd(), filePath);
    }
    return filePath;
}

function readInputFile(filePath) {
    filePath = convertToAbsolutePath(filePath);
    return fs.readFileSync(filePath).toString();
}

function parseInputFiles(params) {
    if (params.json) {
        params.json = JSON.parse(params.json);
    }
    return params;
}

function flatKeys(params) {
  let keys = params.options.keys || [];
  const output = params.json.map (obj => {
    let newObj = {};
    for (const [k,v] of Object.entries(obj)) {
      {
        if (!keys.includes(k)) {
          newObj[k] = v;
        }else{    
          for (const attr of v){
            newObj[attr.name] = attr.value;
          }
        }
      }
    }
    return newObj;
  });
  params.outputData = JSON.stringify(output, null, 4)
  return params;
}

function writeToFile(filePath, data) {
    fs.writeFileSync(filePath, data);
}

function processOutput(params) {
    if (params.output && params.json) {
        // Write the raw output data when converting from JSON to CSV
        return writeToFile(params.output, params.outputData);
    } else if (params.output) {
        // Pretty print the output when converting from CSV to JSON
        return writeToFile(params.output, JSON.stringify(params.outputData, null, 4));
    }
    // Otherwise, no output was specified so just send it to stdout via the console
    console.log(params.outputData); // eslint-disable-line no-console
}

function constructKeysList(key, keys) {
    // Initialize as empty array, if undefined at start
    if (!keys) {
        keys = [];
    }
    keys.push(...key.split(','));
    return keys;
}