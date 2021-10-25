/* eslint-disable react-hooks/exhaustive-deps */
import React, {createContext, useState, useEffect} from 'react';
import {useLazyQuery} from '@apollo/react-hooks';
import {useRoute} from '@react-navigation/native';
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
  const {user} = useSelector((state) => state.session);
  const {userId} = routes.params;
  const [totalAmount, setTotalAmount] = useState(0);
  const [temporaryCart, setTemporaryCart] = useState({
    cartItemsLength: 0,
    totalAmount: 0,
    items: [],
  });
  const [toktokWallet, setToktokWallet] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('TOKTOKWALLET');
  const [pmLoading, setPMLoading] = useState(false);

  const [getAllTemporaryCart, {data, loading, error}] = useLazyQuery(GET_ALL_TEMPORARY_CART, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getAllTemporaryCart}) => {
      let {items, totalAmount} = getAllTemporaryCart;
      console.log(getAllTemporaryCart, 'temp cart');
      setTemporaryCart({
        cartItemsLength: items.length,
        totalAmount,
        items: items,
      });
    },
  });

  useEffect(() => {
    getAllTemporaryCart({
      variables: {
        input: {
          userId: userId,
        },
      },
    });
  }, []);

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
      }}>
      {children}
    </Provider>
  );
};
