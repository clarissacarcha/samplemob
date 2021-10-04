import React, {useState, useEffect, useContext} from 'react';
import {useRoute} from '@react-navigation/native';
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

import styles from './styles';
import {COLOR} from 'res/variables';
import {
  ReceiverLocation,
  MyOrderList,
  OrderTotal,
  PaymentDetails,
  RiderNotes,
  ShippingOption,
  VerifyContextProvider,
  VerifyContext,
} from './components';

import {useSelector} from 'react-redux';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import CheckOutOrderHelper from 'toktokfood/helper/CheckOutOrderHelper';
import {
  GET_SHIPPING_FEE,
  PATCH_PLACE_CUSTOMER_ORDER,
  DELETE_SHOP_TEMPORARY_CART,
  CHECK_SHOP_VALIDATIONS,
} from 'toktokfood/graphql/toktokfood';
import {clearTemporaryCart} from 'toktokfood/helper/TemporaryCart';

import moment from 'moment';
import 'moment-timezone';

// Utils
import {moderateScale} from 'toktokfood/helper/scale';
import EnterPinCode from 'toktokfood/components/EnterPinCode';
import {FONT, FONT_SIZE} from '../../../../res/variables';
import { onErrorAlert } from 'src/util/ErrorUtility';
import { useAlert } from 'src/hooks';

const MainComponent = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const nowDate = moment().format('YYYY-DD-YYYY');

  const {shopname} = route.params;
  const {location, customerInfo, shopLocation, receiver} = useSelector((state) => state.toktokFood);
  const {totalAmount, temporaryCart, toktokWallet, paymentMethod, pmLoading} = useContext(VerifyContext);

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
  const alert = useAlert();

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
            des_lat: shopLocation.latitude,
            des_lng: shopLocation.longitude,
          },
        },
      });
    }
  }, [temporaryCart, location]);

  const [getDeliverFee, {data}] = useLazyQuery(GET_SHIPPING_FEE, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getShippingFee}) => {
      setDeliveryInfo(getShippingFee);
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
        console.log(deleteShopTemporaryCart, 'DELETE');
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
      onError: (error) => {
        setRefreshing(false);
        setShowLoader(false);
        setLoadingWallet(false);
        setTimeout(() => {
          onErrorAlert({alert, error})
        }, 500)
      },
    },
  );

  const requestToktokWalletCredit = () => {
    return new Promise(async (resolve, reject) => {
      let totalPrice = 0;
      if (orderType === 'Delivery') {
        totalPrice = parseInt(temporaryCart.totalAmount) + parseInt(delivery.price ? delivery.price : 0);
      } else {
        totalPrice = parseInt(temporaryCart.totalAmount);
      }
      const result = await CheckOutOrderHelper.requestTakeMoneyId(totalPrice, paymentMethod, toktokWallet);
      if (result.data.postRequestTakeMoney.success === 1) {
        resolve(result.data.postRequestTakeMoney);
      } else {
        reject(result.data.postRequestTakeMoney);
      }
    });
  };

  const tokwaVerifyPin = (pinCode) => {
    let {requestTakeMoneyId, validator} = toktokWalletCredit;
    return new Promise(async (resolve, reject) => {
      const result = await CheckOutOrderHelper.verifyPin({pinCode, requestTakeMoneyId, validator});
      if (result.data.verifyPin.success === 1) {
        resolve(result.data.verifyPin);
      } else {
        reject(result.data.verifyPin);
      }
    });
  };

  const [postCustomerOrder] = useMutation(PATCH_PLACE_CUSTOMER_ORDER, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'no-cache',
    onError: (error) => {
      setShowLoader(false);
      setTimeout(() => {
        onErrorAlert({alert, error})
      }, 500)
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
              Alert.alert('', 'Something went wrong.')      
            }, 500)
          })
      } else {
        // error prompt
        setShowLoader(false);
        setTimeout(() => {
          Alert.alert('', 'Network error occurred. Please check your internet connection.');
        }, 500);
      }
    },
  });

  const fixOrderLogs = async () => {
    let orderLogs = {
      sys_shop: temporaryCart.items[0]?.shopid,
      branchid: temporaryCart.items[0]?.branchid,
      delivery_amount: delivery?.price ? delivery.price : 0,
      hash: delivery?.hash ? delivery.hash : '',
      hash_delivery_amount: delivery?.hash_price ? delivery.hash_price : '',
      daystoship: 0,
      daystoship_to: 0,
      items: await fixItems(),
    };
    return [orderLogs];
  };

  const fixItems = async () => {
    let items = [];
    return Promise.all(
      temporaryCart.items.map(async (item) => {
        let data = {
          sys_shop: item.shopid,
          product_id: item.productid,
          amount: item.totalAmount,
          srp_amount: item.totalAmount,
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

  const fixAddOns = (addonsDetails) => {
    let addons = [];
    return Promise.all(
      addonsDetails.map((item) => {
        let {id, optionPrice, optionName, optionDetailsName} = item;
        let data = {addon_id: id, addon_name: optionName, addon_price: optionPrice, option_name: optionDetailsName};
        addons.push(data);
      }),
    ).then(() => {
      return addons;
    });
  };

  const toktokWalletPaymentMethod = (pinCode) => {
    tokwaVerifyPin(pinCode)
      .then((data) => {
        if (data.success == 1) {
          const {requestTakeMoneyId, validator, cart} = toktokWalletCredit;
          const WALLET = {
            pin: pinCode,
            request_id: requestTakeMoneyId,
            pin_type: validator,
          };
          setShowLoader(true);
          placeCustomerOrderProcess(cart, WALLET);
        } else {
          setErrorMessage(`Incorrent ${toktokWalletCredit.validator}. Please try again.`);
          setShowLoader(false);
        }
      })
      .catch((err) => {
        setErrorMessage(`Incorrent ${toktokWalletCredit.validator}. Please try again.`);
        setShowLoader(false);
      });
  };

  const placeCustomerOrder = async () => {
    if (delivery !== null && !pmLoading) {
      paymentMethod == 'COD' ? setShowLoader(true) : setLoadingWallet(true);
      const CUSTOMER_CART = await fixOrderLogs();
      await refetch({variables: {input: {shopId: `${temporaryCart.items[0]?.shopid}`}}})
        .then(({data}) => {
          let { isOpen } = data.checkShopValidations;
          if (isOpen == 1) {
            if (paymentMethod == 'TOKTOKWALLET') {
              requestToktokWalletCredit()
                .then(async ({data}) => {
                  let {requestTakeMoneyId, validator} = data;
                  setShowEnterPinCode(true);
                  setLoadingWallet(false);
                  setToktokWalletCredit({
                    requestTakeMoneyId,
                    validator,
                    cart: CUSTOMER_CART,
                  });
                })
                .catch((err) => {
                  // Show dialog error about toktokwallet request failed.
                  setLoadingWallet(false);
                  console.log(err, 'ERROR ON PLACING CART');
                  setTimeout(() => {
                    Alert.alert('', 'Something went wrong.');
                  }, 500);
                });
            } else {
              placeCustomerOrderProcess(CUSTOMER_CART);
            }
          } else {
            setShowLoader(false);
            setLoadingWallet(false);
            setTimeout(() => {
              Alert.alert(`${shopname} is not accepting orders right now...`, '');
            }, 500);
          }
        })
        .catch((error) => {
          console.log(error)
          setShowLoader(false);
          setLoadingWallet(false);
          setTimeout(() => {
            onErrorAlert({alert, error})
          }, 500)
        })
      
     
    }
  };

  const mobileNumberFormat = () => {
    let {conno} = customerInfo;
    if (conno.charAt(0) == '6') {
      return `+${conno}`;
    }
    return conno;
  };

  const hasCustomReceiver = () => Object.keys(receiver).length > 0;

  const placeCustomerOrderProcess = async (CUSTOMER_CART, WALLET) => {
    const CUSTOMER = {
      name: hasCustomReceiver() ? receiver.contactPerson : `${customerInfo.firstName} ${customerInfo.lastName}`,
      contactnumber: hasCustomReceiver() ? receiver.contactPersonNumber : mobileNumberFormat(),
      email: customerInfo.email,
      address: location.address,
      user_id: customerInfo.userId,
      latitude: location.latitude,
      longitude: location.longitude,
      regCode: '0',
      provCode: '0',
      citymunCode: '0',
    };

    const ORDER = {
      total_amount: temporaryCart.totalAmount,
      srp_totalamount: temporaryCart.totalAmount,
      notes: riderNotes,
      order_isfor: orderType == 'Delivery' ? 1 : 2, // 1 Delivery | 2 Pick Up Status
      order_type: 2,
      payment_method: paymentMethod,
      order_logs: CUSTOMER_CART,
    };
    const data = WALLET ? {...WALLET, ...CUSTOMER, ...ORDER} : {...CUSTOMER, ...ORDER};
    postCustomerOrder({
      variables: {
        input: data,
      },
    });
  };

  const onPressChange = (action) => {
    setRefreshing(action != undefined);
    checkShopValidations({variables: {input: {shopId: `${temporaryCart.items[0]?.shopid}`}}});
  };

  const LoadingComponent = () => <Loader visibility={showLoader} message="Placing order..." />;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : null} style={styles.container}>
      <HeaderImageBackground searchBox={false}>
        <HeaderTitle backOnly />
      </HeaderImageBackground>
      <Loader hasImage={false} loadingIndicator visibility={loadingWallet} message="loading..." />
      {paymentMethod == 'COD' ? (
        <Loader visibility={showLoader} message="Placing order..." />
      ) : (
        <EnterPinCode
          visible={showEnterPinCode}
          setVisible={() => {
            setShowEnterPinCode(false);
            setErrorMessage('');
          }}
          callBackFunc={(pinCode) => {
            setShowLoader(true);
            toktokWalletPaymentMethod(pinCode);
          }}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          title={toktokWalletCredit.validator}>
          <Loader visibility={showLoader} message="Placing order..." />
        </EnterPinCode>
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
        {orderType == 'Delivery' && <ReceiverLocation />}
        <Separator />
        <MyOrderList />
        <Separator />
        {/* <AlsoOrder /> */}
        {delivery === null ? (
          <View style={[styles.sectionContainer, styles.totalContainer]}>
            <ActivityIndicator color={COLOR.ORANGE} />
          </View>
        ) : (
          <OrderTotal subtotal={totalAmount} deliveryFee={delivery.price} forDelivery={orderType === 'Delivery'} />
        )}
        <Separator />
        <PaymentDetails refreshing={refreshing} />
        <Separator />
        <RiderNotes
          showPlaceOrder={delivery != null && !pmLoading}
          notes={riderNotes}
          onNotesChange={(n) => setRiderNotes(n)}
          onPlaceOrder={() => placeCustomerOrder()}
        />
        {checkShop != null && (
          <OrderTypeSelection
            value={orderType}
            visibility={showOrderType}
            date={moment().format('MMM DD, YYYY')}
            onValueChange={(type) => {
              setShowOrderType(false);
              setOrderType(type);
            }}
            shopname={shopname}
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
