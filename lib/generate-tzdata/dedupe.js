'use strict';

const path = require('path');
const utils = require('../utils');

const dedupeZones = zones => Object.keys(zones)
  .map(zoneName => dedupeZone(zones[zoneName]))
  .reduce((acc, zone) => {
    acc[zone.name] = zone;
    return acc;
  }, {});

const dedupeZone = zone => {
  const abbr = [];
  const offset = [];
  const until = [];
  const dst = [];
  const name = zone.name;

  const len = zone.abbr.length;
  let idx = len;

  while (idx--) {
    if (abbr[0] === zone.abbr[idx] && offset[0] === zone.offset[idx]) {
      continue;
    }

    until.unshift(idx === len - 1 ? Infinity : zone.until[idx + 1]);
    abbr.unshift(zone.abbr[idx]);
    offset.unshift(zone.offset[idx]);
    dst.unshift(zone.dst[idx])
  }

  return {
    name,
    abbr,
    until,
    offset,
    dst,
  }
}

module.exports = version => outputDir => () => Promise.resolve().then(() => {
  console.log('\nRemoving duplicates from tzdata...');

  const srcFile = `${outputDir}/json/${version}-all.json`;
  const outputFile = `${outputDir}/json/${version}-all.json`;

  const json = utils.readJSON(srcFile);
  const zones = dedupeZones(json);

  const links = [];

  const output = {
    version,
    zones,
    links,
  };

  return utils.writeJSON(outputFile, output)
    .then(() => {
      console.log('Removed duplicates from tzdata');
    })
    .catch(err => {
      console.log('Failed to remove duplicates from tzdata', err);
      throw err;
   });
});
