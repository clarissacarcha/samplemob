/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Container} from './Styled';
//NATIVE COMPONENTS
import {useNavigation, useRoute} from '@react-navigation/native';
import {ScrollView} from 'react-native';
//COMPONENTS
import {BtPaymentSummaryConfirm, BtPaymentSummaryDetails} from 'toktokwallet/compositions';
import {HeaderBack, HeaderTitleRevamp} from 'toktokwallet/components';

const ToktokWalletBankTransferPaymentSummary = (props: PropsType): React$Node => {
  const navigation = useNavigation();
  const route = useRoute();

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'Bank Transfer'} />,
  });

  return (
    <Container>
      <ScrollView keyboardShouldPersistTaps="handled">
        <BtPaymentSummaryDetails route={route} navigation={navigation} />
      </ScrollView>
      <BtPaymentSummaryConfirm route={route} navigation={navigation} />
    </Container>
  );
};

export default ToktokWalletBankTransferPaymentSummary;
