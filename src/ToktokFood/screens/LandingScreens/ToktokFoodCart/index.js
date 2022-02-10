/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useContext} from 'react';
import {useRoute, useIsFocused} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  View,
  Alert,
  RefreshControl,
  Text,
} from 'react-native';

import Loader from 'toktokfood/components/Loader';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import OrderTypeSelection from 'toktokfood/components/OrderTypeSelection';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import Separator from 'toktokfood/components/Separator';
import DialogMessage from 'toktokfood/components/DialogMessage';
import AlertModal from 'toktokfood/components/AlertModal';

import styles from './styles';
import {COLOR} from 'res/variables';
import {
  ReceiverLocation,
  MyOrderList,
  OrderTotal,
  OrderVoucher,
  PaymentDetails,
  RiderNotes,
  ShippingOption,
  VerifyContextProvider,
  VerifyContext,
} from './components';
import {
  getDeductedVoucher,
  getItemOrderType,
  getMobileNumberFormat,
  getOrderType,
  handleAutoShippingVouchers,
  handleShippingVouchers,
  tokwaErrorBtnTitle,
  tokwaErrorMessage,
  tokwaErrorTitle,
} from './functions';

import {useSelector} from 'react-redux';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {
  GET_AUTO_SHIPPING,
  GET_SHIPPING_FEE,
  PATCH_PLACE_CUSTOMER_ORDER,
  DELETE_SHOP_TEMPORARY_CART,
  CHECK_SHOP_VALIDATIONS,
  REQUEST_TAKE_MONEY,
  VERIFY_PIN,
} from 'toktokfood/graphql/toktokfood';

import moment from 'moment';
import 'moment-timezone';

// Utils
import {moderateScale} from 'toktokfood/helper/scale';
import EnterPinCode from 'toktokfood/components/EnterPinCode';
import {FONT, FONT_SIZE} from '../../../../res/variables';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useAlert} from 'src/hooks';

const MainComponent = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const nowDate = moment().format('YYYY-DD-YYYY');

  const {shopname} = route.params;
  const {location, customerInfo, customerFranchisee, receiver} = useSelector(state => state.toktokFood);
  const {user} = useSelector(state => state.session);
  const {
    totalAmount,
    temporaryCart,
    toktokWallet,
    paymentMethod,
    pmLoading,
    autoShippingVoucher,
    setAutoShippingVoucher,
    setPaymentMethod,
    shippingVoucher,
  } = useContext(VerifyContext);

  const [autoShipping, setAutoShipping] = useState(0);
  const [riderNotes, setRiderNotes] = useState('');
  const [delivery, setDeliveryInfo] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [showOrderType, setShowOrderType] = useState(false);
  const [orderType, setOrderType] = useState('Delivery');
  const [refreshing, setRefreshing] = useState(false);
  const [checkShop, setCheckShop] = useState(null);
  const [showEnterPinCode, setShowEnterPinCode] = useState(false);
  const [toktokWalletCredit, setToktokWalletCredit] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pinAttempt, setPinAttempt] = useState({show: false, message: ''});
  const [tokWaPlaceOrderErr, setTokWaPlaceOrderErr] = useState({error: {}, visible: false});
  const alert = useAlert();
  const isFocus = useIsFocused();

  const [closeInfo, setCloseInfo] = useState({visible: false, shopName: ''});

  const [getAutoShipping, {loading: loadingShipping}] = useLazyQuery(GET_AUTO_SHIPPING, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onError: error => console.log('getAutoShipping', error.response),
    onCompleted: ({getAutoShipping}) => {
      // console.log(getAutoShipping);
      if (getAutoShipping.success) {
        setAutoShippingVoucher(getAutoShipping);
      }
      setAutoShipping(getAutoShipping);
    },
  });

  useEffect(() => {
    if (temporaryCart && temporaryCart.items.length > 0) {
      checkShopValidations({variables: {input: {shopId: `${temporaryCart.items[0]?.shopid}`}}});
      getDeliverFee({
        variables: {
          input: {
            shopid: +temporaryCart.items[0]?.shopid,
            date_today: nowDate,
            origin_lat: location.latitude,
            origin_lng: location.longitude,
            des_lat: temporaryCart.items[0]?.shopLatitude,
            des_lng: temporaryCart.items[0]?.shopLongitude,
          },
        },
      });
    }
  }, [temporaryCart, location, isFocus]);

  useEffect(() => {
    if (delivery) {
      const {items} = temporaryCart;
      const {email} = customerInfo;

      getAutoShipping({
        variables: {
          input: {
            region: items[0]?.shopRegion,
            email,
            subtotal: [{shopid: items[0]?.shopid, subtotal: temporaryCart.totalAmount}],
            cartItems: [{shopid: items[0]?.shopid, shippingfee: delivery?.price}],
            brandId: items[0].companyId,
            paymentMethod: paymentMethod === 'COD' ? 'CASH' : paymentMethod,
          },
        },
      });
    }
  }, [paymentMethod]);

  const [getDeliverFee] = useLazyQuery(GET_SHIPPING_FEE, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getShippingFee}) => {
      const {items} = temporaryCart;
      const {email} = customerInfo;
      setDeliveryInfo(getShippingFee);
      // console.log({
      //   input: {
      //     region: items[0]?.shopRegion,
      //     email,
      //     subtotal: [{shopid: items[0]?.shopid, subtotal: temporaryCart.totalAmount}],
      //     cartItems: [{shopid: items[0]?.shopid, shippingfee: getShippingFee?.price}],
      //     brandId: items[0].companyId,
      //     paymentMethod: 'CASH',
      //   },
      // });
      getAutoShipping({
        variables: {
          input: {
            region: items[0]?.shopRegion,
            email,
            subtotal: [{shopid: items[0]?.shopid, subtotal: temporaryCart.totalAmount}],
            cartItems: [{shopid: items[0]?.shopid, shippingfee: getShippingFee?.price}],
            brandId: items[0].companyId,
            paymentMethod: paymentMethod === 'COD' ? 'CASH' : paymentMethod,
          },
        },
      });
    },
  });

  const [deleteShopTemporaryCart, {loading: deleteLoading, error: deleteError}] = useMutation(
    DELETE_SHOP_TEMPORARY_CART,
    {
      client: TOKTOK_FOOD_GRAPHQL_CLIENT,
      variables: {
        input: {
          userid: customerInfo.userId,
          shopid: temporaryCart.items[0]?.shopid,
          branchid: 0,
        },
      },
      onCompleted: ({deleteShopTemporaryCart}) => {
        // console.log(deleteShopTemporaryCart, 'DELETE');
      },
    },
  );

  const [checkShopValidations, {loading: shopValidationLoading, error: shopValidationError, refetch}] = useLazyQuery(
    CHECK_SHOP_VALIDATIONS,
    {
      client: TOKTOK_FOOD_GRAPHQL_CLIENT,
      fetchPolicy: 'network-only',
      onCompleted: ({checkShopValidations}) => {
        setRefreshing(false);
        setShowLoader(false);
        setLoadingWallet(false);
        setCheckShop(checkShopValidations);
      },
      onError: error => {
        setRefreshing(false);
        setShowLoader(false);
        setLoadingWallet(false);
        setTimeout(() => {
          onErrorAlert({alert, error});
        }, 500);
      },
    },
  );

  const [postResquestTakeMoney] = useMutation(REQUEST_TAKE_MONEY, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    onError: error => {
      setShowLoader(false);
      setTimeout(() => {
        onErrorAlert({alert, error});
      }, 500);
    },
    onCompleted: ({postResquestTakeMoney}) => {},
  });

  const [verifyPin] = useMutation(VERIFY_PIN, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    onError: error => {
      setShowLoader(false);
      setTokWaPlaceOrderErr({error, visible: true});
    },
    onCompleted: ({verifyPin}) => {},
  });

  const [postCustomerOrder] = useMutation(PATCH_PLACE_CUSTOMER_ORDER, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'no-cache',
    onError: error => {
      console.log('tpin-error', error);
      setShowLoader(false);
      if (toktokWallet.paymentMethod == 'COD') {
        setTimeout(() => {
          onErrorAlert({alert, error});
        }, 500);
      } else {
        setTokWaPlaceOrderErr({error, visible: true});
      }
    },
    onCompleted: async ({checkoutOrder}) => {
      console.log(checkoutOrder);
      if (checkoutOrder.status == '200') {
        deleteShopTemporaryCart()
          .then(() => {
            setTimeout(() => {
              setShowLoader(false);
              navigation.replace('ToktokFoodDriver', {referenceNum: checkoutOrder.referenceNum});
            }, 5000);
          })
          .catch(() => {
            setShowLoader(false);
            setTimeout(() => {
              Alert.alert('', 'Something went wrong.');
            }, 500);
          });
      } else {
        // error prompt
        setShowLoader(false);
        setTimeout(() => {
          setTokWaPlaceOrderErr({
            message: checkoutOrder.message,
            visible: true,
          });
        }, 500);
      }
    },
  });

  const fixOrderLogs = async () => {
    const VOUCHER_FlAG =
      shippingVoucher.length > 0 ? shippingVoucher[0]?.voucher?.handle_shipping_promo : autoShipping?.success ? 1 : 0;

    let orderLogs = {
      sys_shop: temporaryCart.items[0]?.shopid,
      branchid: temporaryCart.items[0]?.branchid,
      delivery_amount: delivery?.price ? delivery.price : 0,
      hash: delivery?.hash ? delivery.hash : '',
      hash_delivery_amount: delivery?.hash_price ? delivery.hash_price : '',
      original_shipping_fee: delivery?.price ? delivery.price : 0,
      // order_type: 1,
      // order_type: await getItemOrderType(customerFranchisee),
      handle_shipping_promo: Number(VOUCHER_FlAG),
      daystoship: 0,
      daystoship_to: 0,
      items: await fixItems(),
    };
    return [orderLogs];
  };

  const fixItems = async () => {
    let items = [];
    return Promise.all(
      temporaryCart.items.map(async item => {
        let data = {
          sys_shop: item.shopid,
          product_id: item.productid,
          amount: item.basePrice,
          srp_amount: item.basePrice,
          srp_totalamount: item.totalAmount,
          total_amount: item.totalAmount,
          quantity: item.quantity,
          order_type: 1,
          notes: item.notes,
          addons: await fixAddOns(item.addonsDetails),
        };
        items.push(data);
      }),
    ).then(() => {
      return items;
    });
  };

  const fixAddOns = addonsDetails => {
    let addons = [];
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

  const onToktokWalletOrder = async () => {
    let totalPrice = temporaryCart?.totalAmountWithAddons;
    let deductedFee = 0;
    const CUSTOMER_CART = await fixOrderLogs();
    const SHIPPING_VOUCHERS = autoShipping?.success
      ? await handleAutoShippingVouchers(autoShippingVoucher)
      : await handleShippingVouchers(shippingVoucher);

    if (orderType === 'Delivery') {
      if (SHIPPING_VOUCHERS?.shippingvouchers.length) {
        deductedFee = getDeductedVoucher(SHIPPING_VOUCHERS?.shippingvouchers[0], delivery?.price);
      }
      totalPrice = temporaryCart.totalAmountWithAddons + (delivery.price - deductedFee);
    }
    // console.log(totalPrice, temporaryCart);
    postResquestTakeMoney({
      variables: {
        input: {
          currency: toktokWallet.currency,
          amount: totalPrice,
          toktokuser_id: toktokWallet.toktokuser_id,
          payment_method: paymentMethod,
          name: toktokWallet.name,
          notes: toktokWallet.notes,
        },
      },
    }).then(({data}) => {
      let {success, message} = data.postRequestTakeMoney;
      if (success == 1) {
        let {requestTakeMoneyId, validator} = data.postRequestTakeMoney.data;
        setShowEnterPinCode(true);
        setLoadingWallet(false);
        setToktokWalletCredit({
          requestTakeMoneyId,
          validator,
          cart: CUSTOMER_CART,
          orderRefNum: data.postRequestTakeMoney.orderRefNum,
          hashAmount: data.postRequestTakeMoney.hash_amount,
        });
      } else {
        setLoadingWallet(false);
        let parseError = JSON.parse(message);
        let messageErr = parseError.errors[0].message;
        setTimeout(() => {
          setPinAttempt({show: true, message: messageErr});
        }, 100);
      }
    });
  };

  const toktokWalletPaymentMethod = pinCode => {
    verifyPin({
      variables: {
        input: {
          request_money_id: toktokWalletCredit.requestTakeMoneyId,
          pin: +pinCode,
          pin_type: toktokWalletCredit.validator,
        },
      },
    }).then(({data}) => {
      let {success, message} = data.verifyPin;
      if (success == 1) {
        const {requestTakeMoneyId, validator, cart, orderRefNum, hashAmount} = toktokWalletCredit;
        const WALLET = {
          pin: pinCode,
          request_id: requestTakeMoneyId,
          pin_type: validator,
          reference_num: orderRefNum,
          hash_amount: hashAmount,
        };
        placeCustomerOrderProcess(cart, WALLET);
      } else {
        setShowLoader(false);
        let parseError = JSON.parse(message);
        let remainingAttempts = parseError.errors[0].payload?.remainingAttempts;
        if (remainingAttempts > 0) {
          setErrorMessage(
            `Incorrect ${toktokWalletCredit.validator}. Please try again. You have ${remainingAttempts} attempt/s left.`,
          );
        } else {
          setPinAttempt({show: true, message: parseError.errors[0].message});
        }
      }
    });
  };

  const placeCustomerOrder = async () => {
    if (delivery !== null && !pmLoading) {
      paymentMethod == 'COD' ? setShowLoader(true) : setLoadingWallet(true);
      const CUSTOMER_CART = await fixOrderLogs();

      await refetch({variables: {input: {shopId: `${temporaryCart.items[0]?.shopid}`}}})
        .then(async ({data}) => {
          let {isOpen} = data.checkShopValidations;
          if (isOpen === 1) {
            if (paymentMethod === 'TOKTOKWALLET') {
              await onToktokWalletOrder();
            } else {
              placeCustomerOrderProcess(CUSTOMER_CART);
            }
          } else {
            setShowLoader(false);
            setLoadingWallet(false);
            setTimeout(() => {
              // Alert.alert(`${temporaryCart.items[0]?.shopName} is not accepting orders right now...`, '');
              setCloseInfo({visible: true, shopName: temporaryCart.items[0]?.shopName});
            }, 500);
          }
        })
        .catch(error => {
          setShowLoader(false);
          setLoadingWallet(false);
          setTimeout(() => {
            onErrorAlert({alert, error});
          }, 500);
        });
    }
  };

  const processData = (WALLET, CUSTOMER, ORDER, SHIPPING_VOUCHERS) => {
    if (shippingVoucher.length > 0 || autoShipping?.success) {
      const deductedFee = getDeductedVoucher(SHIPPING_VOUCHERS?.shippingvouchers[0], delivery?.price);

      const DEDUCTVOUCHER = {
        ...ORDER,
        order_logs: [{...ORDER.order_logs[0], delivery_amount: delivery?.price - deductedFee}],
      };

      return WALLET
        ? {...WALLET, ...CUSTOMER, ...DEDUCTVOUCHER, ...SHIPPING_VOUCHERS}
        : {...CUSTOMER, ...DEDUCTVOUCHER, ...SHIPPING_VOUCHERS};
    } else {
      return WALLET ? {...WALLET, ...CUSTOMER, ...ORDER} : {...CUSTOMER, ...ORDER};
    }
  };

  const placeCustomerOrderProcess = async (CUSTOMER_CART, WALLET) => {
    const SHIPPING_VOUCHERS = autoShipping?.success
      ? await handleAutoShippingVouchers(autoShippingVoucher)
      : await handleShippingVouchers(shippingVoucher);
    const ORDER = {
      total_amount: temporaryCart.totalAmount,
      srp_totalamount: temporaryCart.totalAmount,
      notes: riderNotes,
      order_isfor: orderType == 'Delivery' ? 1 : 2, // 1 Delivery | 2 Pick Up Status
      // order_type: 2,
      order_type: await getOrderType(customerFranchisee),
      payment_method: paymentMethod,
      order_logs: CUSTOMER_CART,
    };
    const CUSTOMER = {
      company_id: String(temporaryCart?.items[0]?.companyId),
      name:
        receiver.contactPerson && receiver.contactPerson !== ''
          ? receiver.contactPerson
          : `${customerInfo.firstName} ${customerInfo.lastName}`,
      contactnumber:
        receiver.contactPersonNumber && receiver.contactPersonNumber !== ''
          ? receiver.contactPersonNumber
          : getMobileNumberFormat(customerInfo),
      email: customerInfo.email,
      address: location.address,
      user_id: customerInfo.userId,
      latitude: location.latitude,
      longitude: location.longitude,
      regCode: '0',
      provCode: '0',
      citymunCode: '0',
    };
    const data = processData(WALLET, CUSTOMER, ORDER, SHIPPING_VOUCHERS);
    // console.log(data, SHIPPING_VOUCHERS);
    postCustomerOrder({
      variables: {
        input: data,
      },
    });
  };

  const onPressChange = action => {
    setRiderNotes('');
    setRefreshing(action != undefined);
    checkShopValidations({variables: {input: {shopId: `${temporaryCart.items[0]?.shopid}`}}});
  };

  const setUpTpinCallBack = () => {
    placeCustomerOrder();
  };

  const handleNavigationTokWaSetupPin = () => {
    // redirect to this route
    navigation.navigate('ToktokWalletRestricted', {
      component: 'noPin',
      setUpTpinCallBack: setUpTpinCallBack,
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : null} style={styles.container}>
      <HeaderImageBackground searchBox={false}>
        <HeaderTitle backOnly />
      </HeaderImageBackground>

      <DialogMessage
        visibility={closeInfo.visible}
        title="Restaurant Closed"
        // messages={`${closeInfo.shopName} is currently not accepting orders right now. Please try again another time. Thank you!`}
        restaurantClosedMessage={() => (
          <Text style={{textAlign: 'center', marginTop: moderateScale(8), marginBottom: moderateScale(15)}}>
            <Text style={{color: COLOR.YELLOW, fontWeight: '700'}}>{closeInfo.shopName} </Text>
            is currently not accepting orders right now. Please try again another time. Thank you!
          </Text>
        )}
        type="warning"
        btn1Title="OK"
        onCloseModal={() => {
          setCloseInfo({visible: false, shopName: ''});
        }}
      />

      <DialogMessage
        visibility={showConfirmation}
        title={'Proceed with Order?'}
        messages={'Are you sure you want to proceed with your order?'}
        type="warning"
        btn1Title="Cancel"
        btn2Title="Proceed"
        onCloseBtn1={() => {
          setShowConfirmation(false);
        }}
        onCloseBtn2={() => {
          setShowConfirmation(false);
          placeCustomerOrder();
        }}
        hasTwoButtons
      />
      <Loader hasImage={false} loadingIndicator visibility={loadingWallet} message="Loading" />
      {paymentMethod == 'COD' && (
        <>
          {/* <AlertModal
            message={tokWaPlaceOrderErr.message}
            visible={tokWaPlaceOrderErr.visible}
            error={tokWaPlaceOrderErr.error}
            close={() => setTokWaPlaceOrderErr({error: {}, visible: false})}
          /> */}
          <DialogMessage
            visibility={tokWaPlaceOrderErr.visible}
            title="Unavailable Products"
            messages="We're sorry. Some products in your cart are unavailable at the moment. Please try again another time."
            type="warning"
            onCloseModal={() => {
              setTokWaPlaceOrderErr({error: {}, visible: false});
            }}
            btnTitle="OK"
          />
          <Loader visibility={showLoader} hasImage={false} loadingIndicator message="Processing Order" />
        </>
      )}
      {showEnterPinCode ? (
        <EnterPinCode
          visible={showEnterPinCode}
          setVisible={() => {
            setShowEnterPinCode(false);
            setErrorMessage('');
          }}
          callBackFunc={pinCode => {
            setShowLoader(true);
            toktokWalletPaymentMethod(pinCode);
          }}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          title={toktokWalletCredit.validator}>
          <Loader visibility={showLoader} hasImage={false} loadingIndicator message="Processing Order" />
          <DialogMessage
            visibility={pinAttempt.show}
            title={tokwaErrorTitle(pinAttempt)}
            messages={tokwaErrorMessage(pinAttempt)}
            type="warning"
            onCloseModal={() => {
              setPinAttempt({show: false, message: ''});
              setShowEnterPinCode(false);
              if (pinAttempt.message == 'Please set up your TPIN first in toktokwallet settings.') {
                handleNavigationTokWaSetupPin();
              }
            }}
            btnTitle={tokwaErrorBtnTitle(pinAttempt)}
          />
          <DialogMessage
            visibility={tokWaPlaceOrderErr.visible}
            title="Unavailable Products"
            messages="We're sorry. Some products in your cart are unavailable at the moment. Please try again another time."
            type="warning"
            onCloseModal={() => {
              setTokWaPlaceOrderErr({error: {}, visible: false});
            }}
            btnTitle="OK"
          />
          {/* <AlertModal
            message={tokWaPlaceOrderErr.message}
            visible={tokWaPlaceOrderErr.visible}
            error={tokWaPlaceOrderErr.error}
            close={() => setTokWaPlaceOrderErr({error: {}, visible: false})}
          /> */}
        </EnterPinCode>
      ) : (
        <DialogMessage
          visibility={pinAttempt.show}
          title={tokwaErrorTitle(pinAttempt)}
          messages={tokwaErrorMessage(pinAttempt)}
          type="warning"
          onCloseModal={() => {
            setPinAttempt({show: false, message: ''});
            setShowEnterPinCode(false);
            if (pinAttempt.message == 'Please set up your TPIN first in toktokwallet settings.') {
              handleNavigationTokWaSetupPin();
            }
          }}
          btnTitle={tokwaErrorBtnTitle(pinAttempt)}
        />
      )}
      <ScrollView
        contentContainerStyle={{paddingBottom: Platform.OS === 'android' ? 0 : moderateScale(70)}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onPressChange('refresh')}
            colors={['#FFA700']}
            tintColor="#FFA700"
          />
        }>
        <View style={{paddingTop: 15, paddingBottom: 10, paddingHorizontal: moderateScale(16)}}>
          <Text style={{fontSize: FONT_SIZE.L, fontFamily: FONT.BOLD}}>Order Details</Text>
        </View>
        {checkShop == null && !refreshing ? (
          <View style={styles.totalContainer}>
            <ActivityIndicator color={COLOR.ORANGE} />
          </View>
        ) : (
          <ShippingOption
            checkShop={checkShop}
            orderType={orderType}
            onPressChange={() => {
              onPressChange();
              setShowOrderType(true);
            }}
          />
        )}
        <Separator />
        {orderType === 'Delivery' && <ReceiverLocation />}
        <Separator />

        <MyOrderList />
        <Separator />

        {orderType === 'Delivery' && !autoShipping?.success && (
          <>
            <OrderVoucher autoShipping={autoShipping} />
            <Separator />
          </>
        )}

        {/* <AlsoOrder /> */}
        {delivery === null ? (
          <View style={[styles.sectionContainer, styles.totalContainer]}>
            <ActivityIndicator color={COLOR.ORANGE} />
          </View>
        ) : (
          <OrderTotal
            autoShipping={autoShipping}
            subtotal={totalAmount}
            deliveryFee={delivery.price}
            forDelivery={orderType === 'Delivery'}
          />
        )}
        <Separator />
        <PaymentDetails orderType={orderType} loadingShipping={loadingShipping} refreshing={refreshing} />
        <Separator />
        <RiderNotes
          forDelivery={orderType === 'Delivery'}
          showPlaceOrder={delivery == null || pmLoading || user?.toktokWalletAccountId == null}
          notes={riderNotes}
          onNotesChange={n => setRiderNotes(n)}
          onPlaceOrder={() => setShowConfirmation(true)}
        />
        {checkShop != null && (
          <OrderTypeSelection
            value={orderType}
            visibility={showOrderType}
            date={moment().format('MMM DD, YYYY')}
            onValueChange={type => {
              setShowOrderType(false);
              setOrderType(type);
              setPaymentMethod('TOKTOKWALLET');
            }}
            shopname={temporaryCart.items[0]?.shopName}
            allowPickup={checkShop?.allowPickup}
            handleModal={() => {
              setShowOrderType(!showOrderType);
            }}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const ToktokFoodCart = () => {
  return (
    <VerifyContextProvider>
      <MainComponent />
    </VerifyContextProvider>
  );
};
export default ToktokFoodCart;
