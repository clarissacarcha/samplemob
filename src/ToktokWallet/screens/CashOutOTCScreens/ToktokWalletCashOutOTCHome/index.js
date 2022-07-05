import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

//COMPONENTS
import {HeaderBack, HeaderTitle} from 'src/revamp';

import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;
const {height, width} = Dimensions.get('window');

export const ToktokWalletCashOutOTCHome = ({navigation}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack color={COLOR.YELLOW} />,
    headerTitle: () => <HeaderTitle label={['Cash Out']} />,
  });

  return (
    <View>
      <Text>CASH OUT OTC PARTNER</Text>
    </View>
  );
};

const styles = StyleSheet.create({});
