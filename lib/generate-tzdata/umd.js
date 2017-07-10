'use strict';

const path = require('path');
const utils = require('../utils');

/**
 * @param {String} version
 */
module.exports = version => outputDir => () => Promise.resolve().then(() => {
  console.log('\nCreating javascript modules...');

  const outputJsonDir = `${outputDir}/json`;
  const outputJsDir = `${outputDir}/js`;

  const generateJsModules = () => new Promise((resolve, reject) => {
    utils.getFiles(`${outputJsonDir}/**/*.json`)
      .then(files => {
        const processNextZone = () => {
          const file = files.shift();

          if (!file) {
            resolve();
            return;
          }

          const tzName = file.replace(`${outputJsonDir}/`, '').replace('.json', '');
          const tzdata = utils.readJSON(file);

          const outputFile = `${outputJsDir}/${tzName}.js`;
          const outputFileDir = path.dirname(outputFile);

          utils.createDir(outputFileDir)
            .then(() => {
              utils.writeFile(outputFile, umd(tzdata))
            })
            .then(() => {
              processNextZone();
            })
            .catch(reject);
        };

        processNextZone();
      })
      .catch(reject);
  });

  const umd = json => (
`(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // Anonymous AMD
    define([], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory();
  }

  if (typeof global === 'object') {
    root = global;
  }

  // Always expose tzdata to globals
  root.tzdata = factory();
}(this, function () {
  return ${JSON.stringify(json, null, 2)};
})); 
`);

  return utils.createDir(outputJsDir)
    .then(generateJsModules)
    .then(() => {
      console.log('Created javascript modules');
    })
    .catch(() => {
      console.log('Failed to create javascript modules');
    });
});
