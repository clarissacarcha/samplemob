import React, {createContext, useState, useEffect} from 'react';
import {availableTips} from 'toktokfood/helper/strings';
import {useRoute} from '@react-navigation/native';
// import { getTemporaryCart } from 'toktokfood/helper/TemporaryCart';
import {TOKTOK_FOOD_GRAPHQL_CLIENT, TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {GET_TEMPORARY_CART} from 'toktokfood/graphql/toktokfood';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import { GET_MY_ACCOUNT } from 'toktokwallet/graphql';
import {useSelector} from 'react-redux';
export const VerifyContext = createContext();
const {Provider} = VerifyContext;

export const VerifyContextProvider = ({children}) => {

  const routes = useRoute();
  const {user} = useSelector((state) => state.session);
  const { shopId, userId } = routes.params;
  const [totalAmount, setTotalAmount] = useState(0);
  const [temporaryCart, setTemporaryCart] = useState({
    cartItemsLength: 0,
    totalAmount: 0,
    items: []
  });
  const [toktokWallet, setToktokWallet] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('TOKTOKWALLET');
  const [pmLoading, setPMLoading] = useState(false);

  const [getTemporaryCart, {data, loading, error}] = useLazyQuery(GET_TEMPORARY_CART, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({ getTemporaryCart }) => {
      let { items, totalAmount } = getTemporaryCart
      setTemporaryCart({
        cartItemsLength: items.length,
        totalAmount,
        items: items
      })
    },
  });

  useEffect(() => {
    getTemporaryCart({
      variables: {
        input: {
          shopId: +shopId,
          userId: userId
        },
      },
    })
  }, [])

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
        pmLoading
      }}
    >
      {children}
    </Provider>
  )
}
