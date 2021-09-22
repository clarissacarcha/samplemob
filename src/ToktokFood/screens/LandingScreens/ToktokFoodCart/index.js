import React, {useState, useEffect, useContext} from 'react';
import {useRoute} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator, View, Alert, RefreshControl} from 'react-native';

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
import {arrangeAddons} from './functions';

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
  bgImage: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
};

const MainComponent = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const nowDate = moment().format('YYYY-DD-YYYY');

  const {amount, cart, shopId, shopname} = route.params;
  const {location, customerInfo, shopLocation} = useSelector((state) => state.toktokFood);
  const {totalAmount, temporaryCart} = useContext(VerifyContext);

  const [riderNotes, setRiderNotes] = useState('');
  const [delivery, setDeliveryInfo] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [showOrderType, setShowOrderType] = useState(false);
  const [orderType, setOrderType] = useState('Delivery');
  const [refreshing, setRefreshing] = useState(false);
  const [checkShop, setCheckShop] = useState(null);

  useEffect(() => {
    checkShopValidations({variables: {input: {shopId: shopId}}});
    if (temporaryCart && temporaryCart.items.length > 0) {
      getDeliverFee({
        variables: {
          input: {
            shopid: +shopId,
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
      onError: (err) => {
        setTimeout(() => {
          Alert.alert('', 'Something went wrong.');
        }, 100);
      },
      onCompleted: ({deleteShopTemporaryCart}) => {
        // console.log(patchTemporaryCartItem)
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
        setCheckShop(checkShopValidations);
      },
    },
  );

  const requestToktokWalletCredit = () => {
    return new Promise(async (resolve, reject) => {
      let WALLET_REQUEST = 0;
      if (orderType === 'Delivery') {
        WALLET_REQUEST = parseInt(totalAmount) + parseInt(delivery.price ? delivery.price : 0);
      } else {
        WALLET_REQUEST = parseInt(totalAmount);
      }
      const {data} = await CheckOutOrderHelper.requestTakeMoneyId(WALLET_REQUEST);
      if (data.postRequestTakeMoney.success === 1) {
        resolve(data.postRequestTakeMoney.data);
      } else {
        reject();
      }
    });
  };

  const [postCustomerOrder] = useMutation(PATCH_PLACE_CUSTOMER_ORDER, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'no-cache',
    onError: (error) => {
      setShowLoader(false);
      console.log(`LOCATION LOG ERROR: ${error}`);
    },
    onCompleted: async ({checkoutOrder}) => {
      if (checkoutOrder.status == 200) {
        deleteShopTemporaryCart({
          variables: {
            input: {
              userid: customerInfo.userId,
              shopid: +shopId,
              branchid: 0,
            },
          },
        }).then(() => {
          setShowLoader(false);
          navigation.replace('ToktokFoodDriver', {referenceNum: checkoutOrder.referenceNum});
        });
      } else {
        // error prompt
        setShowLoader(false);
        setTimeout(() => {
          Alert.alert(checkoutOrder.message);
        }, 100);
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

  const placeCustomerOrder = async () => {
    if (delivery !== null) {
      setShowLoader(true);
      const CUSTOMER_CART = await fixOrderLogs();
      const shopValidation = await refetch({variables: {input: {shopId: shopId}}});

      if (shopValidation.data?.checkShopValidations?.isOpen == 1) {
        requestToktokWalletCredit()
          .then(async (wallet) => {
            const WALLET = {
              pin: '123456',
              request_id: wallet.requestTakeMoneyId,
              pin_type: wallet.validator,
            };
            const CUSTOMER = {
              name: `${customerInfo.firstName} ${customerInfo.lastName}`,
              contactnumber: customerInfo.conno,
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
              payment_method: 'TOKTOKWALLET',
              order_logs: CUSTOMER_CART,
            };

            postCustomerOrder({
              variables: {
                input: {
                  ...WALLET,
                  ...CUSTOMER,
                  ...ORDER,
                },
              },
            });
          })
          .catch(() => {
            // Show dialog error about toktokwallet request failed.
            console.log('ERROR ON PLACING CART');
          });
      } else {
        setShowLoader(false);
        setTimeout(() => {
          Alert.alert(`${shopname} is not accepting orders right now...`, '');
        }, 100);
      }
    }
  };

  const onPressChange = (action) => {
    setRefreshing(action != undefined);
    checkShopValidations({variables: {input: {shopId: shopId}}});
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : null} style={styles.container}>
      <HeaderImageBackground customSize={CUSTOM_HEADER}>
        <HeaderTitle showAddress={false} title="Order Details" />
      </HeaderImageBackground>
      <Loader visibility={showLoader} message="Placing order..." />
      <ScrollView
        contentContainerStyle={{paddingBottom: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70)}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onPressChange('refresh')}
            colors={['#FFA700']}
            tintColor="#FFA700"
          />
        }>
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
        <PaymentDetails />
        <Separator />
        <RiderNotes
          showPlaceOrder={delivery != null}
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
