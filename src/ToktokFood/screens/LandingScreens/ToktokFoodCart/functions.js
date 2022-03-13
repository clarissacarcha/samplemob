import _ from 'lodash';

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

export const getResellerDiscount = async (promotions, cartItems) => {
  let totalReseller = 0;
  const productIds = [];
  return Promise.all(
    promotions.map(item => {
      const filteredId = item.product_id.split(',');
      productIds.push(...filteredId);

      cartItems.map(items => {
        const filteredProd = _.includes(productIds, items.productid);
        // const filteredProd = items.filter(product => _.includes(productIds, items.productid))
        if (filteredProd) {
          const deductedDiscount = item?.discount_type === '3' ? items?.basePrice - 1 : item?.discount_totalamount;
          // console.log(items, deductedDiscount);
          totalReseller += deductedDiscount;
          // totalReseller += (items?.resellerDiscount || items?.basePrice) - item?.discounted_totalamount;
        }
      });
    }),
  ).then(() => {
    return totalReseller;
  });
};

export const getTotalAmountOrder = async (promotions, cartItems) => {
  let totalAmount = 0;
  const productIds = [];
  return Promise.all(
    promotions.map(item => {
      const filteredId = item.product_id.split(',');
      productIds.push(...filteredId);

      cartItems.map(items => {
        const filteredProd = _.includes(productIds, items.productid);
        // const filteredProd = items.filter(product => _.includes(productIds, items.productid))
        // console.log(filteredProd, items, totalAmount);

        if (filteredProd) {
          const deductedDiscount = item?.discount_type === '3' ? 1 : items?.basePrice - item?.discount_totalamount;

          const resellerDiscount = (items.quantity - 1) * (items?.resellerDiscount || items?.basePrice);
          totalAmount += deductedDiscount + resellerDiscount;
          // totalReseller += (items?.resellerDiscount || items?.basePrice) - item?.discounted_totalamount;
        } else {
          const resellerDiscount = items.quantity * (items?.resellerDiscount || items?.basePrice);
          totalAmount += resellerDiscount;
        }
      });
    }),
  ).then(() => {
    return totalAmount;
  });
};

export const getCartTotalAmountOrder = async (promotions, cartItems) => {
  let totalAmount = 0;
  const productIds = [];
  return Promise.all(
    promotions.map(item => {
      const filteredId = item.product_id.split(',');
      productIds.push(...filteredId);

      cartItems.map(items => {
        const filteredProd = _.includes(productIds, items.productid);
        // const filteredProd = items.filter(product => _.includes(productIds, items.productid))
        // console.log(filteredProd, items.productid);

        if (filteredProd) {
          const deductedDiscount = item?.discount_type === '3' ? 1 : items?.basePrice - item?.discount_totalamount;

          const resellerDiscount = (items.quantity - 1) * (items?.resellerDiscount || items?.basePrice);
          totalAmount += items.basePrice + resellerDiscount;
          // totalReseller += (items?.resellerDiscount || items?.basePrice) - item?.discounted_totalamount;
        } else {
          const resellerDiscount = items.quantity * (items?.resellerDiscount || items?.basePrice);
          totalAmount += resellerDiscount;
        }
      });
    }),
  ).then(() => {
    return totalAmount;
  });
};

export const getTotalAmount = async (promos, deliveryFee) => {
  let autoApply = promos.filter(promo => promo.type === 'auto');
  let shipping = promos.filter(promo => promo.type === 'shipping');
  let deals = promos.filter(promo => promo.type === 'deal');
  let promotions = promos.filter(promo => promo.type === 'promotion');
  let totalAmount = 0;

  await autoApply.map(async promo => {
    const deductedAmount = await getDeductedVoucher(promo, deliveryFee);
    totalAmount += deductedAmount;
  });
  await shipping.map(async promo => {
    const deductedAmount = await getDeductedVoucher(promo, deliveryFee);
    totalAmount += deductedAmount;
  });
  // await deals.map(async promo => {
  //   totalAmount += promo?.discount_totalamount;
  // });
  // await promotions.map(async promo => {
  //   totalAmount += promo?.discount_totalamount;
  // });
  return totalAmount;
};

export const getTotalDiscountAmount = async (promos, deliveryFee) => {
  let autoApply = promos.filter(promo => promo.type === 'auto');
  let shipping = promos.filter(promo => promo.type === 'shipping');
  let deals = promos.filter(promo => promo.type === 'deal');
  let promotions = promos.filter(promo => promo.type === 'promotion');
  let totalAmount = 0;

  await autoApply.map(async promo => {
    const deductedAmount = await getDeductedVoucher(promo, deliveryFee);
    totalAmount += deductedAmount;
  });
  await shipping.map(async promo => {
    const deductedAmount = await getDeductedVoucher(promo, deliveryFee);
    totalAmount += deductedAmount;
  });
  await deals.map(async promo => {
    totalAmount += promo?.discount_totalamount;
  });
  await promotions.map(async promo => {
    totalAmount += promo?.discount_totalamount;
  });
  return totalAmount;
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

export const getShippingVoucher = async promos => {
  let autoApply = promos.filter(promo => promo.type === 'auto');
  let shipping = promos.filter(promo => promo.type === 'shipping');
  autoApply = await autoApply.map(promo => {
    let shippingObj = {...promo, amount: promo.amount};
    delete shippingObj.__typename;
    return shippingObj;
  });
  shipping = await shipping.map(promo => {
    let shippingObj = {...promo, amount: promo.origAmount};
    delete shippingObj.__typename;
    return shippingObj;
  });

  await [...autoApply, ...shipping].map(promo => {
    delete promo.origAmount;
    delete promo.__typename;
  });
  // console.log(autoApply, shipping)
  return [...autoApply, ...shipping];
};

export const getPromotionVouchers = async (promos, shop_id) => {
  let deals = promos.filter(promo => promo.type === 'deal');
  let promotions = promos.filter(promo => promo.type === 'promotion');

  deals = await deals.map(promo => {
    delete promo.origAmount;
    delete promo.__typename;
    return {...promo, shop_id: String(shop_id)};
  });
  promotions = await promotions.map(promo => {
    delete promo.origAmount;
    delete promo.__typename;
    return {...promo, shop_id: String(shop_id)};
  });
  const promoData = [...deals, ...promotions].map(promo => {
    const removeKeys = promo.items.map(item => {
      delete item.__typename;
      return item;
    });
    return {...promo, items: removeKeys, type: 'promotion'};
  });
  return promoData;
};

export const getTotalDeductedVoucher = (promos, deliveryFee) => {
  const groupPromo = _(promos)
    .groupBy('type')
    .map((objs, key) => ({
      amount: _.sumBy(objs, 'amount'),
      discount_totalamount: _.sumBy(objs, 'discount_totalamount'),
      type: key,
    }))
    .value();
  const promotions = groupPromo.filter(promo => promo.type === 'promotion');
  const deal = groupPromo.filter(promo => promo.type === 'deal');
  const autoApply = groupPromo.filter(promo => promo.type === 'auto');
  const shipping = groupPromo.filter(promo => promo.type === 'shipping');
  let totalDeducted = 0;

  if (promotions.length > 0) {
    totalDeducted += promotions[0].discount_totalamount;
  }
  if (deal.length > 0) {
    totalDeducted += deal[0].discount_totalamount;
  }
  if (shipping.length > 0) {
    totalDeducted += shipping[0].amount;
  }
  if (autoApply.length > 0) {
    const {amount} = autoApply[0];
    if (amount > 0) {
      totalDeducted += amount;
    } else {
      totalDeducted += deliveryFee;
    }
  }

  return totalDeducted;
};

export const getTotalDeductedDeliveryFee = (promos, deliveryFee) => {
  const groupPromo = _(promos)
    .groupBy('type')
    .map((objs, key) => ({
      amount: _.sumBy(objs, 'amount'),
      discount_totalamount: _.sumBy(objs, 'discount_totalamount'),
      type: key,
    }))
    .value();
  // const promotions = groupPromo.filter(promo => promo.type === 'promotion');
  // const deal = groupPromo.filter(promo => promo.type === 'deal');
  const autoApply = groupPromo.filter(promo => promo.type === 'auto');
  const shipping = groupPromo.filter(promo => promo.type === 'shipping');
  let totalDeducted = 0;

  // if (promotions.length > 0) {
  //   totalDeducted += promotions[0].discount_totalamount;
  // }
  // if (deal.length > 0) {
  //   totalDeducted += deal[0].discount_totalamount;
  // }
  if (shipping.length > 0) {
    totalDeducted += shipping[0].amount;
  }
  if (autoApply.length > 0) {
    const {amount} = autoApply[0];
    if (amount > 0) {
      totalDeducted += amount;
    } else {
      totalDeducted += deliveryFee;
    }
  }

  return deliveryFee - totalDeducted;
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
  if (consumer?.referralCode) {
    orderType = 3;
  }
  if (consumer?.franchiseeCode) {
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

export const parseAmountComputation = async cartItem => {
  let sVoucher = [];
  return Promise.all(
    cartItem.map(item => {
      const {basePrice, quantity, productid} = item;
      delete item.__typename;

      sVoucher.push({
        product_id: productid,
        amount: basePrice,
        srp_amount: basePrice,
        srp_totalamount: Number(basePrice.toFixed(2)) * quantity,
        total_amount: Number(basePrice.toFixed(2)) * quantity,
        quantity: quantity,
      });
    }),
  ).then(() => {
    return sVoucher;
  });
};

export const handleShippingVouchers = async shippingVoucher => {
  let sVoucher = [];
  return Promise.all(
    shippingVoucher.map(item => {
      const {is_percentage, id, shopid, vname, vcode, amount} = item.voucher;
      delete item.voucher.__typename;
      sVoucher.push({
        ...item.voucher,
        is_percentage: parseInt(is_percentage),
        // id: null,
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
