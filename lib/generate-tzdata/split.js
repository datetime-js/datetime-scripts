'use strict';

const path = require('path');
const utils = require('../utils');

/**
 * @param {String} version
 */
module.exports = version => outputDir => () => Promise.resolve().then(() => {
  console.log('\nSplitting zones into individual files...');

  const outputJsonDir = `${outputDir}/json`;
  const allZonesJsonFile = `${outputJsonDir}/${version}-all.json`;

  const getZoneTzdata = (zoneName, tzdata) => {
    const links = tzdata.links;
    const version = tzdata.version;
    const zones = {};

    const zone = {
      version,
      zones,
      links,
    };

    zone.zones[zoneName] = tzdata.zones[zoneName];

    return zone;
  }

  const createZones = tzdata => new Promise((resolve, reject) => {
    const zones = Object.keys(tzdata.zones);

    const createNextZone = () => {
      const zoneName = zones.shift();
      const zone = tzdata.zones[zoneName];

      if (!zone) {
        return resolve()
      }

      const zoneTzdata = getZoneTzdata(zoneName, tzdata);

      const outputFile = `${outputJsonDir}/${zoneName}.json`;
      const outputDir = path.dirname(outputFile);

      utils.createDir(outputDir)
        .then(() => utils.writeJSON(outputFile, zoneTzdata))
        .then(createNextZone)
        .catch(reject);
    };

    createNextZone()
  });

  const allZones = utils.readJSON(allZonesJsonFile);

  return createZones(allZones)
    .then(() => {
      console.log('Split zones into individual files');
    })
    .catch(err => {
      console.log('Failed to split zones into individual files', err);
      throw err;
    });
});
