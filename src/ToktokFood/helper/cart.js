import _ from 'lodash';

export const getResellerDiscount = async (promotions, deals, cartItems, hasTotal = false) => {
  let totalAmount = 0;
  let totalReseller = 0;
  const productIds = [];
  const deductedProducts = [];

  return Promise.all(
    promotions.map(item => {
      const filteredId = item.product_id.split(',');
      productIds.push(...filteredId);
      if (
        (Number(item?.on_top) && deals.length > 0) ||
        (Number(item?.on_top) > 0 && !deals.length) ||
        (Number(!item?.on_top) && !deals.length) ||
        (item?.on_top === '0' && !deals.length)
      ) {
        cartItems.map(items => {
          const filteredProd = _.includes(productIds, items.productid);
          console.log('filteredProd', filteredProd);
          if (filteredProd && totalReseller === 0) {
            const {discounted_totalamount, voucher_code} = item;
            const {basePrice, quantity, resellerDiscount} = items;
            const totalItemsNotIncluded = (resellerDiscount || basePrice) * (quantity - 1);
            const totalItemsResellerNotIncluded = (basePrice - resellerDiscount) * (quantity - 1);
            const hasReseller = resellerDiscount ? totalItemsResellerNotIncluded : 0;
            const deductedDiscount =
              item?.discount_type === '3'
                ? items?.basePrice - discounted_totalamount + (hasTotal ? totalItemsNotIncluded : 0)
                : item?.discount_totalamount;
            totalReseller += deductedDiscount + hasReseller;
            totalAmount += discounted_totalamount + (hasTotal ? totalItemsNotIncluded : 0);
            deductedProducts.push({id: items.productid, amount: totalReseller, code: voucher_code});
            // totalReseller += (items?.resellerDiscount || items?.basePrice) - item?.discounted_totalamount;
          } else {
            totalAmount += (items?.resellerDiscount ?? items?.basePrice) * items.quantity;
          }
        });
      }
    }),
  ).then(async () => {
    await deals.map(item => {
      const filteredId = item.product_id.split(',');
      productIds.push(...filteredId);
      if (item?.on_top || !promotions.length) {
        cartItems.map(items => {
          const filteredProd = _.includes(productIds, items.productid);
          const filteredDeductedProd = deductedProducts.filter(product => product.id === items.productid);
          if (filteredProd && !filteredDeductedProd.length) {
            const {discounted_totalamount} = item;
            const deductedDiscount =
              item?.discount_type === '3' ? items?.basePrice - discounted_totalamount : item?.discount_totalamount;
            totalReseller += deductedDiscount;
            totalAmount += discounted_totalamount;
          }
          if (filteredDeductedProd.length) {
            const {basePrice, quantity} = items;
            const {discount_totalamount, discounted_totalamount, vcode} = item;
            const productTotalAmount = basePrice * quantity;
            const deductedDiscount =
              item?.discount_type === '3' ? basePrice - discounted_totalamount : discount_totalamount;
            const totalDiscount = deductedDiscount + filteredDeductedProd[0].amount;
            const discountVoucher = vcode !== filteredDeductedProd[0].code ? 0 : totalDiscount;
            totalReseller += discountVoucher > productTotalAmount ? discounted_totalamount : discountVoucher;
            totalAmount += discounted_totalamount;
          }

          if (!filteredDeductedProd.length && !filteredProd) {
            totalAmount += (items?.resellerDiscount ?? items?.basePrice) * items.quantity;
          }
        });
      }
    });

    if (hasTotal) {
      return totalAmount > 0 ? totalAmount : 0;
    }
    return totalReseller;
  });
};

export const getTotalResellerDiscount = async (promotions, cartItems) => {
  let totalAmount = 0;
  const productIds = [];
  return Promise.all(
    promotions.map(item => {
      const filteredId = item.product_id.split(',');
      productIds.push(...filteredId);

      cartItems.map(items => {
        const filteredProd = _.includes(productIds, items.productid);
        if (!filteredProd) {
          const resellerDiscount = items.quantity * (items?.basePrice - items?.resellerDiscount);
          totalAmount += items?.resellerDiscount > 0 ? resellerDiscount : 0;
        }
      });
    }),
  ).then(() => {
    return totalAmount;
  });
};

export const getDeductedVoucher = (shipping, deliveryFee) => {
  let totalDelivery = 0;
  if (shipping?.amount > 0) {
    const {amount, is_percentage} = shipping;
    // const pAmount = is_percentage !== 0 ? (amount / 100) * deliveryFee : amount;
    // totalDelivery = pAmount > deliveryFee ? deliveryFee : pAmount;
    totalDelivery = amount;
  } else {
    totalDelivery = deliveryFee;
  }
  return totalDelivery;
};

export const getTotalAmount = async (promos, deliveryFee) => {
  let autoApply = promos.filter(promo => promo.type === 'auto');
  let shipping = promos.filter(promo => promo.type === 'shipping');
  let totalAmount = 0;
  await autoApply.map(async promo => {
    const deductedAmount = await getDeductedVoucher(promo, deliveryFee);
    totalAmount += deductedAmount;
  });
  await shipping.map(async promo => {
    const deductedAmount = await getDeductedVoucher(promo, deliveryFee);
    totalAmount += deductedAmount;
  });
  return totalAmount;
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
    let shippingObj = {...promo, amount: promo.origAmount ?? promo.amount};
    delete shippingObj.__typename;
    return shippingObj;
  });

  await [...autoApply, ...shipping].map(promo => {
    delete promo.origAmount;
    delete promo.__typename;
  });
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

export const getTotalDeductedDeliveryFee = (promos, deliveryFee) => {
  const groupPromo = _(promos)
    .groupBy('type')
    .map((objs, key) => ({
      amount: _.sumBy(objs, 'amount'),
      discount_totalamount: _.sumBy(objs, 'discount_totalamount'),
      sf_discount: _.sumBy(objs, 'sf_discount'),
      type: key,
    }))
    .value();
  const autoApply = groupPromo.filter(promo => promo.type === 'auto');
  const shipping = groupPromo.filter(promo => promo.type === 'shipping');
  let totalDeducted = 0;
  if (shipping.length > 0) {
    totalDeducted += Number(shipping[0].amount) || deliveryFee;
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
