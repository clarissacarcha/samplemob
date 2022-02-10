export const arrangeAddons = addons => {
  if (addons.length > 0) {
    let selectedAddons = {};
    addons.map(item => {
      let {id, optionPrice, optionName, optionDetailsName} = item;
      let data = {addon_id: id, addon_name: optionName, addon_price: optionPrice};
      if (selectedAddons[optionDetailsName] != undefined) {
        selectedAddons[optionDetailsName].push(data);
      } else {
        selectedAddons = {...selectedAddons, [optionDetailsName]: [data]};
      }
    });
    return selectedAddons;
  }
};
export const tokwaErrorTitle = pinAttempt => {
  // console.log(pinAttempt.message)
  if (pinAttempt.message == 'Please set up your TPIN first in toktokwallet settings.') {
    return 'Set up your TPIN';
  } else {
    return 'TPIN Max Attempts Reached';
  }
};
export const tokwaErrorMessage = pinAttempt => {
  if (pinAttempt.message == 'Please set up your TPIN first in toktokwallet settings.') {
    return 'It seems that you have not set your TPIN yet. Please set up TPIN first to proceed with payment';
  } else {
    return pinAttempt.message;
  }
};
export const tokwaErrorBtnTitle = pinAttempt => {
  if (pinAttempt.message == 'Please set up your TPIN first in toktokwallet settings.') {
    return 'Go to toktokwallet settings';
  } else {
    return 'OK';
  }
};

export const getDeductedVoucher = (shipping, deliveryFee) => {
  let totalDelivery = 0;
  if (shipping?.amount > 0) {
    const {amount, is_percentage} = shipping;
    const pAmount = is_percentage !== 0 ? (amount / 100) * deliveryFee : amount;
    // const totalSF = deliveryFee - pAmount;
    // totalDelivery = pAmount;
    totalDelivery = pAmount > deliveryFee ? deliveryFee : pAmount;
  } else {
    totalDelivery = deliveryFee;
  }
  return totalDelivery;
};

export const getMobileNumberFormat = customerInfo => {
  let {conno} = customerInfo;
  if (conno.charAt(0) == '6') {
    return `+${conno}`;
  }
  return conno;
};

export const getOrderType = consumer => {
  let orderType = 2;
  if (consumer) {
    orderType = 4;
  }
  return orderType;
};

export const getItemOrderType = consumer => {
  let orderType = 1;
  if (consumer) {
    orderType = 3;
  }
  return orderType;
};

export const handleShippingVouchers = async shippingVoucher => {
  let sVoucher = [];
  return Promise.all(
    shippingVoucher.map(item => {
      const {is_percentage, id, shopid, vname, vcode, amount} = item.voucher;
      sVoucher.push({
        is_percentage: parseInt(is_percentage),
        id: null,
        shopid,
        vname,
        vcode,
        amount,
      });
    }),
  ).then(() => {
    return {shippingvouchers: sVoucher};
  });
};

export const handleAutoShippingVouchers = async autoShipping => {
  const {is_percentage, id, shopid, vname, vcode, amount} = autoShipping.voucher;
  let sVoucher = {
    ...autoShipping.voucher,
    is_percentage: parseInt(is_percentage),
    // id: parseInt(id),
    // shopid,
    // vname,
    // vcode,
    // amount,
  };
  delete sVoucher.__typename;
  return {shippingvouchers: [sVoucher]};
};
