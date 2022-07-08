import React, {createContext, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

//GRAPHQL & HOOKS
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_CASH_OUT_PROVIDER_PARTNERS} from 'toktokwallet/graphql';

export const VerifyContext = createContext();
const {Provider} = VerifyContext;

const citiesList = [];

export const VerifyContextProvider = ({children}) => {
  const [cashOutProviderPartners, setCashOutProviderPartners] = useState([]);

  const [
    getCashOutProviderPartners,
    {loading: getCashOutProviderPartnersLoading, error: getCashOutProviderPartnersError},
  ] = useLazyQuery(GET_CASH_OUT_PROVIDER_PARTNERS, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: error => {
      // setRefreshing(false);
      console.log(error);
    },
    onCompleted: ({getCashOutProviderPartners}) => {
      console.log(getCashOutProviderPartners);
      setCashOutProviderPartners(getCashOutProviderPartners);
    },
  });

  useEffect(() => {
    getCashOutProviderPartners();
  }, []);

  return (
    <Provider
      value={{
        cashOutProviderPartners,
        getCashOutProviderPartners,
        getCashOutProviderPartnersLoading,
        getCashOutProviderPartnersError,
      }}>
      {children}
    </Provider>
  );
};
