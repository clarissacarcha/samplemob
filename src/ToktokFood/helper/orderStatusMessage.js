export const orderStatusMessage = (orderStatus, riderDetails, shopname) => {
  if(riderDetails == null && (orderStatus == 'po' || orderStatus == 'rp' )){
    return { id: orderStatus,  title: 'Finding Driver', message: 'Give drivers some time to accept your booking' }
  } else if(riderDetails != null && (orderStatus == 'po' || orderStatus == 'rp')){
    return { id: orderStatus,  title: `We've found you a driver`, message: `Driver is heading to ${shopname}` }
  } else if(orderStatus == 'f') {
    return { id: orderStatus,  title: 'Your order is on the way to you...', message: 'Driver is heading to you' }
  } else if(orderStatus == 's') {
    return { id: orderStatus,  title: `Order Delivered`, message: '' }
  } else if(orderStatus == 'c') {
    return { id: orderStatus,  title: `Order Cancelled`, message: '' }
  } else {
    return { id: 'p',  title: 'Waiting for restaurant confirmation...', message: 'Give restaurant some time to accept your order' }
  }
}