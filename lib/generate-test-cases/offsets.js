const getOffsetStr = minutes => {
  const sign = minutes < 0 ? '-' : '+';
  let hours = minutes / 60;

  if (minutes >= 0) {
    hours = Math.floor(hours);
  } else {
    hours = Math.ceil(hours);
  }

  hours = Math.abs(hours);
  minutes = Math.abs(minutes);

  minutes = Math.abs(minutes - hours * 60);
  minutes = minutes === 0 ? '0' + minutes : String(minutes);

  hours = hours < 10 ? '0' + hours : String(hours);

  return sign + hours + ':' + minutes;
}

module.exports = () => {
  const offsets = [];

  for (let idx = -95; idx < 96; idx++) {
    offsets.push(getOffsetStr(idx * 15));
  }

  return offsets;
};
