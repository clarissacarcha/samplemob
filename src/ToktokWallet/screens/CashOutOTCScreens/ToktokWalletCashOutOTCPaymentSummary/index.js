import React from 'react';
import {Dimensions, StyleSheet, Text, View, ScrollView} from 'react-native';

//COMPONENTS
import {HeaderBack, HeaderTitleRevamp} from 'toktokwallet/components';
import {ConfirmButton, PaymentDetails} from './Components';

import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;
const {height, width} = Dimensions.get('window');

export const ToktokWalletCashOutOTCPaymentSummary = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={['Payment Summary']} />,
  });

  return (
    <>
      <View style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <PaymentDetails route={route} />
        </ScrollView>
        <ConfirmButton />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
