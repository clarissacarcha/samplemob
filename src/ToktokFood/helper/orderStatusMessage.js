// export const orderStatusMessageDelivery = (orderStatus, riderDetails, shopname) => {
//   if(riderDetails == null && (orderStatus == 'po' || orderStatus == 'rp' )){
//     return { id: orderStatus,  title: 'Finding Driver', message: 'Give drivers some time to accept your booking' }
//   } else if(riderDetails != null && (orderStatus == 'po' || orderStatus == 'rp')){
//     return { id: orderStatus,  title: `We've found you a driver`, message: `Driver is heading to ${shopname}` }
//   } else if(orderStatus == 'f') {
//     return { id: orderStatus,  title: 'Your order is on the way to you...', message: 'Driver is heading to you' }
//   } else if(orderStatus == 's') {
//     return { id: orderStatus,  title: 'Order Completed', message: '' }
//   } else if(orderStatus == 'c') {
//     return { id: orderStatus,  title: 'Order Cancelled', message: '' }
//   } else {
//     return { id: 'p',  title: 'Waiting for restaurant confirmation...', message: 'Give restaurant some time to accept your order' }
//   }
// }
export const orderStatusMessageDelivery = (orderStatus, riderDetails, shopname) => {
  if(orderStatus == 'po' || orderStatus == 'rp'){
    return { id: orderStatus,  title: 'Preparing Order', message: 'Give restaurant some time to prepare your order' }
  } else if(orderStatus == 'f') {
    return { id: orderStatus,  title: 'Your order is on the way to you...', message: 'Driver is heading to you' }
  } else if(orderStatus == 's') {
    return { id: orderStatus,  title: 'Order Completed', message: '' }
  } else if(orderStatus == 'c') {
    return { id: orderStatus,  title: 'Order Cancelled', message: '' }
  } else {
    return { id: 'p',  title: 'Waiting for restaurant confirmation...', message: 'Give restaurant some time to accept your order' }
  }
}
export const orderStatusMessagePickUp = (orderStatus, riderDetails, shopname) => {
  if(orderStatus == 'po'){
    return { id: orderStatus,  title: 'Preparing Order', message: 'Give restaurant some time to prepare your order' }
  } else if(orderStatus == 'rp'){
    return { id: orderStatus,  title: 'Your order is ready for pickup', message: 'Restaurant has finished preparing your order and is now ready for pickup' }
  } else if(orderStatus == 's'){
    return { id: orderStatus,  title: 'Order Completed', message: '' }
  } else if(orderStatus == 'c'){
    return { id: orderStatus,  title: 'Order Cancelled', message: '' }
  } else {
    return { id: orderStatus,  title: 'Waiting for restaurant confirmation...', message: 'Give restaurant some time to accept your order' }
  }
}