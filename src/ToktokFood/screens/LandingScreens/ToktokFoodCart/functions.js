
export const arrangeAddons = (addons) => {
  if(addons.length > 0){
    let selectedAddons = {};
    addons.map((item) => {
      let { id, optionPrice, optionName, optionDetailsName } = item;
      let data = { addon_id: id, addon_name: optionName, addon_price: optionPrice }
      if(selectedAddons[optionDetailsName] != undefined){
        selectedAddons[optionDetailsName].push(data)
      } else {
        selectedAddons = { ...selectedAddons, [optionDetailsName]: [data] }
      }
    })
    return selectedAddons
  }
}
export const tokwaErrorTitle = (pinAttempt) => {
  // console.log(pinAttempt.message)
  if(pinAttempt.message == 'Please set up your TPIN first in toktokwallet settings.'){
    return 'Set up your TPIN'
  } else {
    return 'OTP/TPIN Max Attempts Reached'
  }
}
export const tokwaErrorMessage = (pinAttempt) => {
  if(pinAttempt.message == 'Please set up your TPIN first in toktokwallet settings.'){
    return 'It seems that you have not set your TPIN yet. Please set up TPIN first to proceed with payment'
  } else {
    return pinAttempt.message
  }
}
export const tokwaErrorBtnTitle = (pinAttempt) => {
  if(pinAttempt.message == 'Please set up your TPIN first in toktokwallet settings.'){
    return 'Go to toktokwallet settings'
  } else {
    return 'OK'
  }
}
