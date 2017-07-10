'use strict';

const moment = require('moment');
const utils = require('../utils');

const format = 'MMM D HH:mm:ss YYYY';

module.exports = version => outputDir => () => Promise.resolve().then(() => {
  console.log(`\nCollecting all zdump data into a single json file...`);

  const zdumpDir = `${outputDir}/zdump`;

  const outputJsonDir = `${outputDir}/json`;
  const outputJsonFile = `${outputJsonDir}/${version}-all.json`;

  const collectData = files => files.map(file => {
    const content = utils.readFileSync(file);
    const lines = content.split('\n');
    const name = file.replace('.zdump', '').replace(`${zdumpDir}/`, '');

    const abbr = [];
    const offset = [];
    const until  = [];
    const dst = [];

    lines.forEach(line => {
      const parts = line.split(/\s+/);
      const utc = moment.utc(parts.slice(2, 6).join(' '), format);
      const local = moment.utc(parts.slice(9, 13).join(' '), format);

      if (parts.length < 13) {
        return;
      }

      offset.push(+utc.diff(local, 'minutes', true).toFixed(4));
      until.push(+utc);
      abbr.push(parts[13]);
      dst.push(parts[14].split('=')[1] === '1');
    });

    return {
      name,
      abbr,
      until,
      offset,
      dst,
    };
  });

  const getFiles = () => utils.getFiles(`${zdumpDir}/**/*.zdump`, {});

  const mapData = zones => zones.reduce((result, zone) => {
    result[zone.name] = zone;
    return result;
  }, {});

  const writeData = data => utils.writeFile(
    outputJsonFile,
    JSON.stringify(data, null, 2)
  );

  return utils.createDir(outputJsonDir)
    .then(getFiles)
    .then(collectData)
    .then(mapData)
    .then(writeData)
    .then(() => {
      console.log(`Collected all zdump data into ${outputJsonDir}`);
    })
    .catch(err => {
      console.error(err);
      throw err;
    });
});
