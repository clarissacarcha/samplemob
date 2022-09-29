/**
 * @format
 * @flow
 */

import React, {useEffect, useContext, useState} from 'react';

import type {PropsType} from './types';
import {Container, KeyboardAvoidingViewContainer} from './Styled';
//NATIVE COMPONENTS
import {useNavigation, useRoute} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/stack';
//COMPONENTS
import {
  BtProceedButton,
  BtTransactionHeader,
  BtVerifyContextProvider,
  BtTransactionForm,
  BtVerifyContext,
} from 'toktokwallet/compositions';
import {HeaderBack, HeaderTitleRevamp, HeaderRight, LoadingIndicator} from 'toktokwallet/components';
import {ToastModal} from 'toktokbills/components';
import {AlertOverlay} from 'src/components';
//HOOKS
import {useAccount} from 'toktokwallet/hooks';
import {useSelector} from 'react-redux';
//GRAPHQL
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {PATCH_REMOVE_ACCOUNT, POST_CASH_OUT_BANK_ACCOUNT} from 'toktokwallet/graphql';
import {useMutation} from '@apollo/react-hooks';
import {usePrompt} from 'src/hooks';
import {TransactionUtility} from 'toktokwallet/util';

const MainComponent = ({route, favoriteDetails}) => {
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const prompt = usePrompt();
  const [favoriteId, setFavoriteId] = useState(favoriteDetails ? favoriteDetails.id : 0);
  const [favoriteModal, setFavoriteModal] = useState({show: false, message: ''});
  const onRefreshFavorite = route.params?.onRefreshFavorite ? route.params.onRefreshFavorite : null;
  const screenLabel = route.params?.screenLabel ? route.params.screenLabel : 'Bank Transfer';

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={screenLabel} />,
    headerRight: () => <HeaderRight onPress={onPressFavorite} isFavorite={favoriteId !== 0} />,
  });

  const {getMyAccountLoading, getMyAccount} = useAccount({isOnErrorAlert: false});
  const {data, changeErrorMessages, fees, errorMessages} = useContext(BtVerifyContext);
  const {user} = useSelector(state => state.session);
  const {bankDetails} = route.params;

  const [postCashOutBankAccount, {loading: postCashOutBankAccountLoading}] = useMutation(POST_CASH_OUT_BANK_ACCOUNT, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: details => {
      if (onRefreshFavorite) {
        onRefreshFavorite();
      }
      setFavoriteId(details.postCashOutBankAccount.id);
      setFavoriteModal({show: true, message: 'Added to your Favorites'});
    },
    onError: error => {
      TransactionUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        title: 'Duplicate Favorite',
        isPop: false,
      });
    },
  });

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

  useEffect(() => {
    if (user.toktokWalletAccountId) {
      getMyAccount();
    }
  }, [user, getMyAccount]);

  const onPressFavorite = () => {
    if (favoriteId !== 0) {
      return patchRemoveAccount({
        variables: {
          input: {
            accountId: +favoriteId,
          },
        },
      });
    }

    const isAccountNameValid = isRequired('accountName', data.accountName);
    const isAccountNumValid = checkAccountNumber();

    if (errorMessages.amount !== '') {
      changeErrorMessages('amount', '');
    }

    if (isAccountNameValid && isAccountNumValid) {
      postCashOutBankAccount({
        variables: {
          input: {
            cashOutBankId: bankDetails.id,
            accountName: data.accountName,
            accountNumber: data.accountNumber,
          },
        },
      });
    }
  };

  const isRequired = (key, value) => {
    let error = value === '' ? 'This is a required field' : '';
    changeErrorMessages(key, error);
    return !error;
  };

  const checkAccountNumber = () => {
    let error = data.accountNumber === '' ? 'This is a required field' : '';
    if (fees.type === 'Pesonet' && data.accountNumber.length > 16) {
      error = 'Account Number maximum length must be 16';
    }
    changeErrorMessages('accountNumber', error);
    return !error;
  };

  if (getMyAccountLoading) {
    return (
      <Container>
        <LoadingIndicator isLoading={true} isFlex />
      </Container>
    );
  }
  return (
    <Container>
      <ToastModal visible={favoriteModal.show} setVisible={setFavoriteModal} message={favoriteModal.message} />
      <AlertOverlay visible={postCashOutBankAccountLoading || patchRemoveAccountLoading} />
      <Container>
        <KeyboardAvoidingViewContainer headerHeight={headerHeight}>
          <BtTransactionHeader bankDetails={bankDetails} />
          <BtTransactionForm bankDetails={bankDetails} />
        </KeyboardAvoidingViewContainer>
      </Container>
      <BtProceedButton bankDetails={bankDetails} screenLabel={screenLabel} />
    </Container>
  );
};

const ToktokWalletBankTransferTransaction = (props: PropsType): React$Node => {
  const route = useRoute();
  const favoriteDetails = route.params?.favoriteDetails ? route.params.favoriteDetails : null;

  return (
    <BtVerifyContextProvider favoriteDetails={favoriteDetails}>
      <MainComponent route={route} favoriteDetails={favoriteDetails} />
    </BtVerifyContextProvider>
  );
};

export default ToktokWalletBankTransferTransaction;
