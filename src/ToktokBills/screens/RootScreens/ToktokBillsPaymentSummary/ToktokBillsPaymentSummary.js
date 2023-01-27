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
import {PaymentSummaryButton, PaymentSummaryDetails} from 'toktokbills/compositions';
import {HeaderBack, HeaderTitle} from 'toktokbills/components';

const ToktokBillsPaymentSummary = (props: PropsType): React$Node => {
  const navigation = useNavigation();
  const route = useRoute();

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={'Payment Summary'} />,
  });

  return (
    <Container>
      <ScrollView keyboardShouldPersistTaps="handled">
        <PaymentSummaryDetails route={route} navigation={navigation} />
      </ScrollView>
      <PaymentSummaryButton route={route} navigation={navigation} />
    </Container>
  );
};

export default ToktokBillsPaymentSummary;
