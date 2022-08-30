import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CheckIdleState, HeaderBack, HeaderTitleRevamp} from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';
import {LayeredSecurityMoneyProtected} from './Components';

const {COLOR} = CONSTANTS;

export const ToktokWalletHelpCentreSecurityPrivacy = ({navigation}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'Privacy Policy'} />,
  });

  return (
    <CheckIdleState>
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <LayeredSecurityMoneyProtected />
        </View>
      </View>
    </CheckIdleState>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
});
