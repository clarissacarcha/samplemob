/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
/**
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import type {PropsType} from './types';
import {Container, AmountText, Row, LoaderContainer, Button, ClosedShopText} from './Styled';
import ContentLoader from 'react-native-easy-content-loader';
import {useSelector, useDispatch} from 'react-redux';
import {
  getResellerDiscount,
  getTotalAmount,
  getShippingVoucher,
  getPromotionVouchers,
  getOrderType,
  getTotalDeductedDeliveryFee,
} from 'toktokfood/helper/cart';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {
  PATCH_PLACE_CUSTOMER_ORDER,
  DELETE_SHOP_TEMPORARY_CART,
  REQUEST_TAKE_MONEY,
  GET_SHOP_STATUS,
} from 'toktokfood/graphql/toktokfood';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import Alert from 'toktokfood/components/Alert';
import StyledText from 'toktokfood/components/StyledText';
import {useNavigation} from '@react-navigation/native';
import {useGetActivities} from 'toktokfood/hooks';
import _ from 'lodash';

const MAX_AMOUNT_LIMIT_WITH_TOKWA = 3000;
const MAX_AMOUNT_LIMIT_WITHOUT_TOKWA = 2000;

const CartPlaceOrder = (props: PropsType): React$Node => {
  const {
    amountText = 0,
    cartData = {},
    paymentMethod = 'toktokwallet',
    scroll,
    cartPaymentMethodCoordinates = 0,
    startAnimation = () => null,
    endAnimation = () => null,
    deliveryReceiver = '',
    receiverContact = '',
    receiverLandmark = '',
    cartDriverNote = '',
    cartServiceType = '',
    cartDeliveryInfo = {},
    userWallet = {},
    setIsInsufficientBalance = bool => null,
    cartRefetch = ({}) => {},
  } = props;
  const {promotionVoucher, customerInfo, location, loader, customerFranchisee, customerWallet} = useSelector(
    state => state.toktokFood,
  );
  const {user} = useSelector(state => state.session);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [shopStatus, setShopStatus] = useState({});
  const [isExceeded, setIsExceeded] = useState(false);
  const [hasDisabledItem, setHasDisabledItem] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const orderStatus = 'p, po, rp, f';
  const {data: ongoingOrders} = useGetActivities(orderStatus, 50);

  useEffect(() => {
    if (ongoingOrders?.getTransactions?.length >= 4) {
      setIsExceeded(true);
    }
  }, [ongoingOrders]);

  const reformData = (WALLET, CUSTOMER, ORDER, SHIPPING_VOUCHERS) => {
    if (promotionVoucher.length > 0) {
      const DEDUCTVOUCHER = {
        ...ORDER,
        order_logs: [{...ORDER.order_logs[0]}],
      };
      return WALLET
        ? {...WALLET, ...CUSTOMER, ...DEDUCTVOUCHER, ...SHIPPING_VOUCHERS}
        : {...CUSTOMER, ...DEDUCTVOUCHER, ...SHIPPING_VOUCHERS};
    } else {
      return WALLET ? {...WALLET, ...CUSTOMER, ...ORDER} : {...CUSTOMER, ...ORDER};
    }
  };

  const getOrderData = async (CUSTOMER_CART, WALLET) => {
    const promotions = promotionVoucher.filter(promo => promo.type === 'promotion');
    const deals = promotionVoucher.filter(promo => promo.type === 'deal');
    const {items} = cartData;

    const totalPrice =
      promotions.length > 0 || deals.length > 0
        ? await getResellerDiscount(promotions, deals, cartData?.items, true)
        : cartData?.totalAmount;
    const deductedPrice = promotions.length > 0 || deals.length > 0 ? totalPrice : cartData?.totalAmount;

    const amount = await getTotalAmount(promotionVoucher, 0);
    // const parsedAmount = Number((deductedPrice - amount).toFixed(2));
    const parsedAmount = Number(deductedPrice.toFixed(2));

    console.log('totalPrice', totalPrice);
    console.log('deductedPrice', deductedPrice);
    console.log('amount', amount);
    console.log('parsedAmount', parsedAmount);

    const replaceName = deliveryReceiver.replace(/[^a-z0-9 ]/gi, '');
    const replaceLandMark = receiverLandmark.replace(/[^a-z0-9 ]/gi, '');

    const ORDER_DATA = {
      total_amount: deductedPrice > 0 ? parsedAmount : cartData?.totalAmount,
      srp_totalamount: cartData?.totalAmount,
      notes: cartDriverNote.replace(/[^a-z0-9 ]/gi, ''),
      order_isfor: cartServiceType === 'Delivery' ? 1 : 2, // 1 Delivery | 2 Pick Up Status
      order_type: await getOrderType(customerFranchisee),
      payment_method: paymentMethod === 'cash' ? 'COD' : paymentMethod.toUpperCase(),
      order_logs: CUSTOMER_CART,
    };

    const CUSTOMER_DATA = {
      shopid: cartData?.items[0].shopid,
      company_id: String(cartData?.items[0]?.companyId),
      name: replaceName,
      contactnumber: receiverContact,
      landmark: replaceLandMark,
      email: customerInfo.email,
      address: location.address,
      user_id: Number(customerInfo.userId),
      latitude: location.latitude,
      longitude: location.longitude,
      regCode: items[0]?.shopRegion,
      provCode: '0',
      citymunCode: '0',
      shippingvouchers: await getShippingVoucher(promotionVoucher),
      vouchers: await getPromotionVouchers(promotionVoucher, cartData?.items[0].shopid),
      reseller_account_type: customerFranchisee?.franchiseeAccountType || '',
      reseller_code: customerFranchisee?.franchiseeCode || '',
      referral_code: customerFranchisee?.franchiseeCode ? '' : customerFranchisee?.referralCode || '',
      discounted_totalamount: deductedPrice > 0 ? parsedAmount : cartData?.totalAmount,
      service_type: 'toktokfood',
      service_fee: 0,
    };

    if (cartData?.pabiliShopDetails?.isShopPabiliMerchant) {
      console.log(
        'service',
        cartData?.pabiliShopResellerDiscount,
        cartData?.pabiliShopServiceFee,
        cartData?.pabiliShopDetails,
      );
      const serviceFeeDiscount = _.sumBy(promotionVoucher, e => e.service_fee_discount);
      const pabiliServiceFee =
        (cartData?.pabiliShopResellerDiscount || cartData?.pabiliShopServiceFee) - serviceFeeDiscount;
      CUSTOMER_DATA.service_type = 'pabili';
      CUSTOMER_DATA.service_fee = Number(pabiliServiceFee.toFixed(2));
    }

    const data = reformData(WALLET, CUSTOMER_DATA, ORDER_DATA, {});
    return data;
  };

  const getCustomerCart = async () => {
    const autoApply = promotionVoucher.filter(promo => promo.type === 'auto');
    const shipping = promotionVoucher.filter(promo => promo.type === 'shipping');
    const VOUCHER_FlAG =
      shipping.length > 0 ? shipping[0]?.handle_shipping_promo : autoApply[0]?.handle_shipping_promo ? 1 : 0;
    const deliveryFeeDiscount = cartDeliveryInfo?.deliveryFeeDiscount || 0;
    const deliveryFee = cartDeliveryInfo?.price - deliveryFeeDiscount;
    const orderLogs = {
      sys_shop: cartData?.items[0]?.shopid,
      branchid: cartData?.items[0]?.branchid,
      delivery_amount: deliveryFee || 0,
      hash: cartDeliveryInfo?.hash || '',
      hash_delivery_amount: cartDeliveryInfo?.hash_price || '',
      original_shipping_fee: cartDeliveryInfo?.price || 0,
      handle_shipping_promo: Number(VOUCHER_FlAG),
      daystoship: 0,
      daystoship_to: 0,
      items: await getCartItems(),
    };
    return [orderLogs];
  };

  const [deleteShopTemporaryCart] = useMutation(DELETE_SHOP_TEMPORARY_CART, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    variables: {
      input: {
        userid: customerInfo.userId,
        shopid: cartData?.items[0]?.shopid,
        branchid: 0,
      },
    },
    onCompleted: ({deleteShopTemporaryCart}) => {
      dispatch({type: 'SET_TOKTOKFOOD_PROMOTIONS', payload: []});
      const payload = {...loader, isVisible: false};
      dispatch({type: 'SET_TOKTOKFOOD_LOADER', payload});
      setTimeout(() => setIsAlertVisible(true), 500);
    },
  });

  const [postCustomerOrder] = useMutation(PATCH_PLACE_CUSTOMER_ORDER, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'no-cache',
    onError: error => {
      console.log('postCustomerOrder', JSON.stringify(error));
    },
    onCompleted: async ({checkoutOrder}) => {
      console.log('checkoutOrder', checkoutOrder);
      if (checkoutOrder.status === '200') {
        setReferenceNumber(checkoutOrder?.referenceNum);
        deleteShopTemporaryCart();
      } else {
        const payload = {...loader, isVisible: false};
        dispatch({type: 'SET_TOKTOKFOOD_LOADER', payload});
      }
    },
  });

  const handleProcessProceed = async ({pinCode, data}) => {
    navigation.goBack();
    const payload = {isVisible: true, text: 'Placing Order', type: null};
    dispatch({type: 'SET_TOKTOKFOOD_LOADER', payload});
    const CUSTOMER_CART = await getCustomerCart();
    const WALLET = {
      pin: pinCode,
      request_id: data?.requestMoneyDetails?.requestTakeMoneyId,
      pin_type: data?.requestMoneyDetails?.validator,
      reference_num: data?.orderRefNum,
      hash_amount: data?.hash,
    };
    const result = await getOrderData(CUSTOMER_CART, WALLET);
    console.log('RESULT', JSON.stringify(result));
    postCustomerOrder({
      variables: {
        input: result,
      },
    });
  };

  const [requestTakeMoney] = useMutation(REQUEST_TAKE_MONEY, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    onError: error => console.log(error.response),
    onCompleted: ({postRequestTakeMoney}) => {
      const payload = {...loader, isVisible: false};
      dispatch({type: 'SET_TOKTOKFOOD_LOADER', payload});
      const {success, data, orderRefNum, hash_amount} = postRequestTakeMoney;
      if (success === 1) {
        const payload = {
          totalAmount: parseFloat(amountText).toFixed(2),
          tokwaBalance: userWallet?.getMyAccount?.wallet?.balance,
          requestMoneyDetails: data,
          hash: hash_amount,
          orderRefNum,
        };
        return navigation.navigate('ToktokWalletTPINValidator', {
          callBackFunc: handleProcessProceed,
          onPressCancelYes: () => navigation.goBack(),
          enableIdle: false,
          data: payload,
        });
      }
    },
  });

  const getItemAddOns = async addonsDetails => {
    const addons = [];
    return Promise.all(
      addonsDetails.map(item => {
        let {id, optionPrice, optionName, optionDetailsName} = item;
        let data = {addon_id: id, addon_name: optionName, addon_price: optionPrice, option_name: optionDetailsName};
        addons.push(data);
      }),
    ).then(() => {
      return addons;
    });
  };

  const getCartItems = async () => {
    const items = [];
    return Promise.all(
      cartData?.items.map(async item => {
        const totalAmount =
          (item.resellerDiscount ? item.resellerDiscount.toFixed(2) : item.basePrice.toFixed(2)) * item.quantity;
        let data = {
          sys_shop: item.shopid,
          product_id: item.productid,
          amount: Number((item.resellerDiscount ?? item.basePrice).toFixed(2)),
          srp_amount: item.basePrice,
          srp_totalamount: Number(item.basePrice.toFixed(2)) * item.quantity,
          total_amount: Number(totalAmount.toFixed(2)),
          quantity: item.quantity,
          order_type: 1,
          notes: item.notes.replace(/[^a-z0-9 ]/gi, ''),
          addons: await getItemAddOns(item.addonsDetails),
        };
        items.push(data);
      }),
    ).then(() => {
      return items;
    });
  };

  const onToktokWalletPlaceOrder = async () => {
    const promotions = promotionVoucher.filter(promo => promo.type === 'promotion');
    const deals = promotionVoucher.filter(promo => promo.type === 'deal');
    const deliveryFeeDiscount = cartDeliveryInfo?.deliveryFeeDiscount || 0;
    const deliveryPrice = cartDeliveryInfo?.price - deliveryFeeDiscount || 0;
    const totalPrice =
      promotions.length > 0 || deals.length > 0
        ? await getResellerDiscount(promotions, deals, cartData?.items, true)
        : cartData?.totalAmountWithAddons;
    const deductedPrice =
      promotions.length > 0 || deals.length > 0
        ? totalPrice + cartData?.addonsTotalAmount
        : cartData?.totalAmountWithAddons;

    const amount = await getTotalAmount(promotionVoucher, cartDeliveryInfo?.price || 0);
    let parseAmount = parseFloat(((cartDeliveryInfo?.price || 0) + deductedPrice - amount).toFixed(2));

    if (cartData?.pabiliShopDetails?.isShopPabiliMerchant) {
      const pabiliServiceFee = cartData?.pabiliShopResellerDiscount || cartData?.pabiliShopServiceFee;
      parseAmount += pabiliServiceFee;
    }

    // console.log('cartData', cartData?.totalAmountWithAddons, cartData?.addonsTotalAmount);
    // console.log('totalPrice', totalPrice);
    // console.log('deductedPrice', deductedPrice);
    // console.log('amount', amount);
    console.log('requestTakeMoney', Number(amountText.toFixed(2)));

    requestTakeMoney({
      variables: {
        input: {
          currency: userWallet?.getMyAccount?.wallet?.currency?.code,
          amount: Number(amountText.toFixed(2)),
          toktokuser_id: user.id,
          payment_method: paymentMethod.toUpperCase(),
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          notes: 'Payment by toktokfood customer',
        },
      },
    });
  };

  const isInsufficientBalance = () => {
    const total = parseFloat(amountText).toFixed(2);
    const balance = userWallet?.getMyAccount?.wallet?.balance;
    if (total > balance) {
      const payload = {...loader, isVisible: false};
      dispatch({type: 'SET_TOKTOKFOOD_LOADER', payload});
      setTimeout(() => {
        scroll?.scrollToPosition(0, cartPaymentMethodCoordinates);
        setIsInsufficientBalance(true);
      }, 500);
      return;
    } else {
      setIsInsufficientBalance(false);
      onToktokWalletPlaceOrder();
    }
  };

  const [fetchShopStatus] = useLazyQuery(GET_SHOP_STATUS, {
    variables: {
      input: {
        shopId: cartData?.items[0]?.shopid,
      },
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'cache-and-network',
    onCompleted: ({getShopStatus}) => {
      setShopStatus(getShopStatus);
      if (getShopStatus.status === 'open') {
        cartRefetch({
          variables: {
            input: {
              userId: customerInfo.userId,
            },
          },
        });
        setTimeout(async () => {
          const evalDisabledResult = cartData?.items.filter(item => item.isDisabled === true);
          // console.log('evalDisabledResult', evalDisabledResult, cartData?.items);
          if (evalDisabledResult.length > 0) {
            const payload = {...loader, isVisible: false};
            dispatch({type: 'SET_TOKTOKFOOD_LOADER', payload});
            setHasDisabledItem(true);
            setTimeout(() => setIsAlertVisible(true), 500);
          } else {
            setHasDisabledItem(false);
            if (paymentMethod === 'toktokwallet') {
              isInsufficientBalance();
            } else {
              const CUSTOMER_CART = await getCustomerCart();
              const result = await getOrderData(CUSTOMER_CART);
              console.log('RESULT', JSON.stringify(result));
              postCustomerOrder({
                variables: {
                  input: result,
                },
              });
            }
          }
        }, 500);
      } else {
        const payload = {...loader, isVisible: false};
        dispatch({type: 'SET_TOKTOKFOOD_LOADER', payload});
        setTimeout(() => setIsAlertVisible(true), 500);
      }
    },
    onError: error => console.log('getShopDetails', error),
  });

  const playAnimation = () => {
    startAnimation();
    scroll?.scrollToPosition(0, cartPaymentMethodCoordinates);
    setTimeout(() => {
      endAnimation();
    }, 1000);
  };

  const validatePaymentMethod = () => {
    // if (isExceeded) {
    //   setIsAlertVisible(true);
    // } else {
    if (
      (!customerWallet && paymentMethod === 'toktokwallet') ||
      (customerWallet && amountText > MAX_AMOUNT_LIMIT_WITH_TOKWA && paymentMethod === 'cash') ||
      (!customerWallet && amountText > MAX_AMOUNT_LIMIT_WITHOUT_TOKWA && paymentMethod === 'cash')
    ) {
      playAnimation();
    } else {
      const text = paymentMethod === 'toktokwallet' ? 'Please Wait' : 'Placing Order';
      const payload = {isVisible: true, text, type: null};
      dispatch({type: 'SET_TOKTOKFOOD_LOADER', payload});
      fetchShopStatus();
    }
    // }
  };

  const onPlaceOrder = () => {
    validatePaymentMethod();
  };

  const renderAmountTextComponent = () => {
    if (!amountText || isNaN(amountText)) {
      return (
        <LoaderContainer>
          <ContentLoader active title={false} pRows={1} pWidth={130} pHeight={22} />
        </LoaderContainer>
      );
    }

    return <AmountText>Total: &#x20B1;{parseFloat(amountText).toFixed(2)}</AmountText>;
  };

  const renderPlaceOrderButtonComponent = () => {
    return <Button buttonText="Place Order" disabled={!amountText || isNaN(amountText)} onPress={onPlaceOrder} />;
  };

  const renderAlertComponent = () => {
    var title = '';
    var subtitle = '';
    var type;
    var buttonText = '';
    var buttonText2 = '';
    var onPress = () => {};
    var onPress2 = () => {};

    // if (isExceeded) {
    //   title = 'Ongoing Order Exceeded';
    //   type = 'warning';
    //   subtitle =
    //     'You are allowed to have 4 ongoing orders only. Please wait for your other orders to be completed before placing an order.';
    //   buttonText = 'OK';
    //   onPress = () => setIsAlertVisible(false);
    // } else {
    if (referenceNumber) {
      title = 'Order Placed';
      type = 'success';
      subtitle = 'Your order has been placed successfully! You can check your order status in activities.';
      buttonText = 'OK';
      onPress = () => {
        setIsAlertVisible(false);
        navigation.replace('ToktokFoodOrder', {referenceNum: referenceNumber, orderStatus: 'p'});
      };
    } else {
      if (shopStatus?.status !== 'open') {
        title = 'Currently Closed';
        type = 'warning';
        buttonText = 'OK';
        onPress = () => setIsAlertVisible(false);
      } else {
        if (hasDisabledItem) {
          title = 'Currently Unavailable';
          subtitle =
            'Some items in your cart is currently unavailable.  Please remove for now and try again. Thank you!';
          type = 'warning';
          buttonText = 'OK';
          onPress = () => setIsAlertVisible(false);
        }
      }
    }
    // }

    const BodyComponent = () => {
      if (shopStatus?.status !== 'open') {
        return (
          <ClosedShopText>
            <StyledText mode="semibold">{shopStatus?.shopname} </StyledText>
            is currently not accepting orders right now. Please try again another time. Thank you!
          </ClosedShopText>
        );
      }
      return null;
    };

    return (
      <Alert
        isVisible={isAlertVisible}
        type={type}
        title={title}
        subtitle={subtitle}
        buttonText={buttonText}
        onPress={onPress}
        buttonText2={buttonText2}
        onPress2={onPress2}
        BodyComponent={() => <BodyComponent />}
      />
    );
  };

  return (
    <Container>
      <Row>
        {renderAmountTextComponent()}
        {renderPlaceOrderButtonComponent()}
        {renderAlertComponent()}
      </Row>
    </Container>
  );
};

export default CartPlaceOrder;
