import React, {createContext, useEffect, useState} from 'react';
import _ from 'lodash';

//GRAPHQL & HOOKS
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_CASH_OUT_PROVIDER_PARTNERS_HIGHLIGHTED} from 'toktokwallet/graphql';

export const VerifyContext = createContext();
const {Provider} = VerifyContext;

export const VerifyContextProvider = ({children}) => {
  const [cashOutProviderPartnersHighlighted, setCashOutProviderPartnersHighlighted] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [
    getCashOutProviderPartnersHighlighted,
    {loading: getHighlightedPartnersLoading, error: getHighlightedPartnersError},
  ] = useLazyQuery(GET_CASH_OUT_PROVIDER_PARTNERS_HIGHLIGHTED, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: error => {
      setRefreshing(false);
      console.log(error);
    },
    onCompleted: data => {
      const groupData = _(data.getCashOutProviderPartnersHighlighted)
        .sortBy(item => item.description)
        .groupBy(item => (item.category === 2 ? 'Bank Partners' : 'Non-bank Partners'))
        .value();

      setCashOutProviderPartnersHighlighted([
        {'Bank Partners': groupData['Bank Partners']},
        {'Non-bank Partners': groupData['Non-bank Partners']},
      ]);
      setRefreshing(false);
    },
  });

  useEffect(() => {
    getCashOutProviderPartnersHighlighted();
  }, [getCashOutProviderPartnersHighlighted]);

  return (
    <Provider
      value={{
        cashOutProviderPartnersHighlighted,
        getCashOutProviderPartnersHighlighted,
        getHighlightedPartnersLoading,
        getHighlightedPartnersError,
        refreshing,
        setRefreshing,
      }}>
      {children}
    </Provider>
  );
};
