import moment from 'moment-timezone';
import webexTz from 'webex-time-zones';


function formatSecond(second) {
  if (second.indexOf('+') !== -1) {
    return second.split('+')[0];
  }
  return second.split('-')[0];
}

export function getStartDate(fromDate, timeZone) {
  const fromDateFormat = moment(fromDate)
    .tz(timeZone)
    .format();
  const date = fromDateFormat.split('T')[0];
  const time = fromDateFormat.split('T')[1].split('Z')[0];
  const [year, month, dateNumber] = date.split('-');
  const [hour, minute, second] = time.split(':');
  const startDate = `${month}/${dateNumber}/${year} ${hour}:${minute}:${formatSecond(second)}`;
  return startDate;
}

export function findTimeDifferenceBetweenTwoDate(fromDate, toDate) {
  const fromTime = new Date(fromDate).getTime();
  const toTime = new Date(toDate).getTime();
  const timeDifference = toTime - fromTime;
  if (timeDifference < 0) {
    throw new Error('Time difference is smaller than zero');
  }
  const timeDifferenceInMinute = timeDifference / (1000 * 60);
  return timeDifferenceInMinute;
}

export function getTimeZoneIdFromTimeZone(timeZone) {
  const offset = moment
    .tz(timeZone)
    .toLocaleString()
    .split('GMT')[1];
  let offsetFormated;
  if (offset[0] === '+') {
    offsetFormated = `${offset[1]}${offset[2]}:${offset[3]}${offset[4]}`;
  } else {
    offsetFormated = `${offset[0]}${offset[1]}${offset[2]}:${offset[3]}${offset[4]}`;
  }
  const timeZoneId = webexTz.getIdByOffset(offsetFormated);
  return timeZoneId;
}
