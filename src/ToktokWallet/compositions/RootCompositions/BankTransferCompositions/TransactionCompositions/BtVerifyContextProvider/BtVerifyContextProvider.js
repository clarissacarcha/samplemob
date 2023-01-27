/**
 * @format
 * @flow
 */

import React, {createContext, useState} from 'react';

import type {PropsType} from './types';
import {} from './Styled';
import {useAccount} from 'toktokwallet/hooks';
import {numberFormat, currencyCode} from 'toktokwallet/helper';

//GRAPHQL & HOOKS
import {useMutation} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_COMPUTE_CONVENIENCE_FEE, PATCH_REMOVE_ACCOUNT} from 'toktokwallet/graphql';
import {TransactionUtility} from 'toktokwallet/util';
import {usePrompt} from 'src/hooks';
import {useNavigation} from '@react-navigation/native';

export const BtVerifyContext: React$Context<any> = createContext<any>();
const {Provider} = BtVerifyContext;

export const BtVerifyContextProvider = (props: PropsType): React$Node => {
  const {tokwaAccount} = useAccount();
  const {children, favoriteDetails, onRefreshFavorite, event} = props;
  const prompt = usePrompt();
  const navigation = useNavigation();

  const [data, setData] = useState({
    accountName: favoriteDetails ? favoriteDetails.accountName : '',
    accountNumber: favoriteDetails ? favoriteDetails.accountNumber : '',
    amount: '',
    emailAddress: tokwaAccount.person.emailAddress,
    purpose: '',
  });
  const [fees, setFees] = useState({
    systemServiceFee: 0,
    providerServiceFee: 0,
    totalServiceFee: 0,
    type: '',
    feeInformation: '',
  });

  const [errorMessages, setErrorMessages] = useState({
    accountName: '',
    accountNumber: '',
    amount: '',
    emailAddress: '',
    purpose: '',
  });

  const [loading, setLoading] = useState(false);
  const [isPromptModalError, setIsPromptModalError] = useState(false);
  const [favoriteId, setFavoriteId] = useState(favoriteDetails ? favoriteDetails.id : 0);
  const [favoriteModal, setFavoriteModal] = useState({show: false, message: ''});

  const changeDataValue = (key, value) => {
    setData(oldstate => ({
      ...oldstate,
      [key]: value,
    }));
  };

  const changeAmount = value => {
    changeErrorMessages('amount', '');
    changeDataValue('amount', value);
  };

  const changeErrorMessages = (key, value) => {
    setErrorMessages(oldstate => ({...oldstate, [key]: value}));
  };

  const changeFeesValue = (key, value) => {
    setFees(oldstate => ({...oldstate, [key]: value}));
  };

  const [postComputeConvenienceFee, {loading: computeConvenienceFeeLoading}] = useMutation(
    POST_COMPUTE_CONVENIENCE_FEE,
    {
      client: TOKTOK_WALLET_GRAPHQL_CLIENT,
      onError: error => {
        const {graphQLErrors} = error;
        if (isPromptModalError) {
          if (graphQLErrors[0]?.payload?.errorCode === 'BANK_DEACTIVATED' && onRefreshFavorite) {
            onRefreshFavorite();
          }
          TransactionUtility.StandardErrorHandling({
            error,
            navigation,
            prompt,
            isPop: false,
            message:
              graphQLErrors[0]?.payload?.errorCode === 'BANK_DEACTIVATED' && favoriteId
                ? 'Bank is no longer available. This will be removed from your favorites.'
                : 'Bank is no longer available. You cannot proceed with your transaction.',
            onPress: () => {
              navigation.pop(event === 'see all' ? 2 : 1);
            },
          });
        }
      },
      onCompleted: fee => {
        const {providerServiceFee, systemServiceFee, type} = fee.postComputeConvenienceFee;
        const totalServiceFee = providerServiceFee + systemServiceFee;
        const feeInformation =
          totalServiceFee > 0
            ? `Additional ${currencyCode}${numberFormat(
                totalServiceFee,
              )} convenience fee will be charged for this transaction.`
            : 'Convenience fee is waived for this transaction.';

        setFees({
          systemServiceFee,
          providerServiceFee,
          totalServiceFee,
          feeInformation,
          type: type === 'pesonet' ? 'Pesonet' : 'Instapay',
        });
      },
    },
  );

  const [patchRemoveAccount, {loading: patchRemoveAccountLoading}] = useMutation(PATCH_REMOVE_ACCOUNT, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: details => {
      setFavoriteId(0);
      setFavoriteModal({show: true, message: 'Removed from your Favorites'});
      if (onRefreshFavorite) {
        onRefreshFavorite();
      }
    },
    onError: error => {
      TransactionUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        isPop: false,
      });
    },
  });

  return (
    <Provider
      value={{
        data,
        setData,
        errorMessages,
        changeErrorMessages,
        changeDataValue,
        fees,
        changeFeesValue,
        postComputeConvenienceFee,
        computeConvenienceFeeLoading,
        changeAmount,
        loading,
        setLoading,
        isPromptModalError,
        setIsPromptModalError,
        favoriteId,
        setFavoriteId,
        patchRemoveAccountLoading,
        favoriteModal,
        setFavoriteModal,
      }}>
      {children}
    </Provider>
  );
};
