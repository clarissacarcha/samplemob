/* eslint-disable react-hooks/exhaustive-deps */
import React, {createContext, useState, useEffect} from 'react';
import {useLazyQuery} from '@apollo/react-hooks';
import {useRoute, useIsFocused, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

// Components
// import LoadingIndicator from 'toktokfood/components/LoadingIndicator';

// import {availableTips} from 'toktokfood/helper/strings';

// Queries
// import {GET_MY_ACCOUNT} from 'toktokwallet/graphql';
import {GET_ALL_TEMPORARY_CART} from 'toktokfood/graphql/toktokfood';
import {TOKTOK_FOOD_GRAPHQL_CLIENT, TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';

export const VerifyContext = createContext();

const {Provider} = VerifyContext;

export const VerifyContextProvider = ({children}) => {
  const routes = useRoute();
  const isFocus = useIsFocused();
  const navigation = useNavigation();
  const {user} = useSelector(state => state.session);
  const {userId} = routes.params;
  const [totalAmount, setTotalAmount] = useState(0);
  const [pabiliShopServiceFee, setPabiliShopServiceFee] = useState(0);
  const [pabiliShopDetails, setPabiliShopDetails] = useState(null);
  const [temporaryCart, setTemporaryCart] = useState({
    cartItemsLength: 0,
    totalAmount: 0,
    items: [],
  });
  const [toktokWallet, setToktokWallet] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('TOKTOKWALLET');
  const [pmLoading, setPMLoading] = useState(false);
  const [autoShippingVoucher, setAutoShippingVoucher] = useState([]);
  const [shippingVoucher, setShippingVoucher] = useState([]);

  const [getAllTemporaryCart, {data, loading, error}] = useLazyQuery(GET_ALL_TEMPORARY_CART, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getAllTemporaryCart}) => {
      let {
        items,
        srpTotalAmount,
        totalAmount,
        totalAmountWithAddons,
        addonsTotalAmount,
        pabiliShopResellerDiscount,
        pabiliShopServiceFee,
        pabiliShopDetails,
      } = getAllTemporaryCart;
      // console.log(getAllTemporaryCart);
      setPabiliShopServiceFee(pabiliShopServiceFee);
      setPabiliShopDetails(pabiliShopDetails);
      setTemporaryCart({
        pabiliShopResellerDiscount,
        cartItemsLength: items.length,
        srpTotalAmount,
        totalAmount,
        totalAmountWithAddons,
        addonsTotalAmount,
        items: items,
      });
    },
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setTemporaryCart({
        cartItemsLength: 0,
        totalAmount: 0,
        items: [],
      });
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (isFocus) {
      getAllTemporaryCart({
        variables: {
          input: {
            userId: userId,
          },
        },
      });
    }
  }, [isFocus]);

  return (
    <Provider
      value={{
        totalAmount,
        setTotalAmount,
        temporaryCart,
        setTemporaryCart,
        toktokWallet,
        setToktokWallet,
        paymentMethod,
        setPaymentMethod,
        setPMLoading,
        pmLoading,
        shippingVoucher,
        setShippingVoucher,
        autoShippingVoucher,
        setAutoShippingVoucher,
        pabiliShopServiceFee,
        pabiliShopDetails,
      }}>
      {children}
    </Provider>
  );
};
