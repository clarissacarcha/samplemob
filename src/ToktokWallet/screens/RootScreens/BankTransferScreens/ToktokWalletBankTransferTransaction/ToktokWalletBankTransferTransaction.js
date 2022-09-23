/**
 * @format
 * @flow
 */

import React, {useEffect} from 'react';

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
} from 'toktokwallet/compositions';
import {HeaderBack, HeaderTitleRevamp, LoadingIndicator} from 'toktokwallet/components';
//HOOKS
import {useAccount} from 'toktokwallet/hooks';
import {useSelector} from 'react-redux';

const MainComponent = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const headerHeight = useHeaderHeight();

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'Bank Transfer'} />,
  });

  const {getMyAccountLoading, getMyAccount} = useAccount({isOnErrorAlert: false});
  const {user} = useSelector(state => state.session);
  const {bankDetails} = route.params;

  useEffect(() => {
    if (user.toktokWalletAccountId) {
      getMyAccount();
    }
  }, [user, getMyAccount]);

  if (getMyAccountLoading) {
    return (
      <Container>
        <LoadingIndicator isLoading={true} isFlex />
      </Container>
    );
  }
  return (
    <Container>
      <Container>
        <KeyboardAvoidingViewContainer headerHeight={headerHeight}>
          <BtTransactionHeader bankDetails={bankDetails} />
          <BtTransactionForm bankDetails={bankDetails} />
        </KeyboardAvoidingViewContainer>
      </Container>
      <BtProceedButton bankDetails={bankDetails} />
    </Container>
  );
};

const ToktokWalletBankTransferTransaction = (props: PropsType): React$Node => {
  return (
    <BtVerifyContextProvider>
      <MainComponent />
    </BtVerifyContextProvider>
  );
};

export default ToktokWalletBankTransferTransaction;
