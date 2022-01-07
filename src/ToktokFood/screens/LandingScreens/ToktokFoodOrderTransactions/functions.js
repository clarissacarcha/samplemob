import moment from 'moment';

export const getOrderStatus = (focusTab) => {
  switch(focusTab){
    case 1:
      return 'p, po, rp, f'
    case 2:
      return 's'
    case 3:
      return 'c'
    case 4:
      return 'decline'
    
    default:
      return ''
  }
}

export const getSubMessageStatus = (item) => {
  switch(item.orderStatus){
    case 's':
      return `${item.orderIsfor === 1 ? 'Delivered on' : 'Picked up on'} ${moment(item.dateShipped).format('ll')} at ${moment(item.dateShipped).format('hh:mm A')}`;
    case 'c':
      return `Cancelled on ${moment(item.dateCancelledDeclined).format('ll')} at ${moment(
        item.dateCancelledDeclined,
      ).format('hh:mm A')}`;
    case 'rp':
      return 'Ready for Pickup';
    case 'po':
      return 'Processing Order';
    case 'f':
      return 'Your order is on the way to you';
    default:
      return 'Pending';
  }
}
export const sameDay = (d1, d2) => {

  d1 = new Date(moment(d1).format())
  d2 = new Date(moment(d2).format())

  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}
export const dayTitle = (dateOrdered) => {
  let date = moment(dateOrdered);
  if (moment().diff(date, 'days') >= 1) {
      return date.format('LL')
  }
  return date.calendar().split(' ')[0]; 
}

export const isPastOrder = (dateOrdered, focusTab) => {
  const today = moment().format('YYYY-MM-DD');
  const orderedDate = moment(dateOrdered).format('YYYY-MM-DD');
  return moment(today).isAfter(orderedDate) && focusTab === 1;
};
