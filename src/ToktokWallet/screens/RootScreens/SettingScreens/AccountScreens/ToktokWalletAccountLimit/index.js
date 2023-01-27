import React from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {FlagSecureScreen, CheckIdleState, HeaderBack, HeaderTitleRevamp} from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';
//SELF IMPORTS
import {Header, Limits, TransactionHistory} from './Components';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const ToktokWalletAccountLimit = ({navigation}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={['Account Summary Limits', '']} />,
  });
  return (
    <FlagSecureScreen>
      <CheckIdleState>
        {/* <Separator/> */}
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
          <Header />
          <Limits />
          <TransactionHistory />
        </ScrollView>
      </CheckIdleState>
    </FlagSecureScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
});
