import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useThrottle} from 'src/hooks';
import {useNavigation} from '@react-navigation/native';
import {useAccount} from 'toktokwallet/hooks';
import {moderateScale} from 'toktokwallet/helper';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
export const Header = () => {
  const navigation = useNavigation();
  const onPress = useThrottle(() => navigation.navigate('ToktokWalletUpgradeAccount'));
  const {tokwaAccount} = useAccount();

  return (
    <View style={styles.container}>
      <Text style={styles.accountLevel}>
        Your Account is{' '}
        <Text style={[styles.accountLevel, {fontFamily: FONT.BOLD}]}>{tokwaAccount?.person?.accountType?.title}</Text>.
      </Text>
      <TouchableOpacity onPress={onPress} style={styles.upgradeAccountBtn}>
        <Text style={styles.upgradeAccount}>
          Do you want a higher limits?
          <Text style={[styles.upgradeAccount, {color: COLOR.ORANGE}]}> Upgrade your account.</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountLevel: {
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.REGULAR,
    marginTop: moderateScale(10),
  },
  upgradeAccount: {
    fontSize: FONT_SIZE.S,
    fontFamily: FONT.REGULAR,
    color: '#525252',
  },
  upgradeAccountBtn: {
    marginTop: moderateScale(10),
  },
});
