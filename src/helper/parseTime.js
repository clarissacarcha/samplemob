import moment from 'moment';

export const parseTime = timeString => {
  return moment(timeString, 'HH:mm');
};
