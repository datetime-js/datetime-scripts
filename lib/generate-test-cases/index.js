'use strict';

const moment = require('moment-timezone');

const DATE_FORMATS = [
  'YYYY-MM-DDTHH:mm:ss',
];

const OFFSETS = require('./offsets')();

module.exports = (timezone, tzdata) => {
  const timezoneTzdata = tzdata.zones[timezone];

  const data = [];

  const group = {
    zone: timezone,
  };

  group.dateArray = generateDateArrayTests(timezoneTzdata);

  const points = group.dateArray.map(point => point.date);

  DATE_FORMATS.forEach(format => {
    group[format] = [];

    points.forEach(point => {
      OFFSETS.forEach(offset => {
        const dateStr = getDateStr(point, timezone, offset, format);
        const testCase = createFormatTestCase(dateStr, timezone, format);

        group[format].push(testCase);
      });
    });
  });

  data.push(group);

  return data;
};

/**
 * ---------------------------------------------------------------------------------------
 * Helpers
 * ---------------------------------------------------------------------------------------
 */

const createFormatTestCase = (dateStr, timezone) => {
  const momentDt = moment.tz(dateStr, timezone);

  const date = [
    momentDt.year(),
    momentDt.month() + 1,
    momentDt.date(),
    momentDt.hour(),
    momentDt.minute(),
    momentDt.second(),
    momentDt.millisecond()
  ];

  return {
    date,
    dateStr,
  };
}

const generateDateArrayTests = timezoneTzdata => {
  const cases = [];

  timezoneTzdata.until.forEach(until => {
    if (typeof until === 'number') {
      const points = [
        until - 10 * 24 * 60 * 60 * 1000,
        until - 1,
        until,
        until + 1,
        until + 10 * 24 * 60 * 60 * 1000,
      ];

      cases.push(...points.map(point => getTestData(point, timezoneTzdata)))
    }
  });

  return cases;
}

const getDateStr = (dt, zone, offset, format) => {
  const momentDt = moment.tz([dt[0], dt[1] - 1, dt[2], dt[3], dt[4], dt[5], dt[6]], zone);
  return momentDt.format(format) + offset;
}

const getTestData = (timestamp, timezoneTzdata) => {
  const momentInst = moment.tz(timestamp, timezoneTzdata.name);

  const dateAttrs = [
    momentInst.year(),
    momentInst.month(),
    momentInst.date(),
    momentInst.hour(),
    momentInst.minute(),
    momentInst.second(),
    momentInst.millisecond()
  ];

  timestamp = moment.tz(dateAttrs, timezoneTzdata.name).valueOf();

  const date = [
    dateAttrs[0],
    dateAttrs[1] + 1,
    dateAttrs[2],
    dateAttrs[3],
    dateAttrs[4],
    dateAttrs[5],
    dateAttrs[6],
  ];

  return {
    date,
    timestamp,
  };
}
