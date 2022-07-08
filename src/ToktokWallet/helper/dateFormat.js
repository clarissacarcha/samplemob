import moment from 'moment';

export const sameDay = (d1, d2) => {
  d1 = new Date(moment(d1).format());
  d2 = new Date(moment(d2).format());

  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
};
export const dayTitle = dateOrdered => {
  let date = moment(dateOrdered);
  if (!moment().isSame(date, 'date')) {
    return date.format('ll');
  }
  return date.calendar().split(' ')[0];
};
