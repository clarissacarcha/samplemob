import React, {useState, useRef, useEffect} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Animated,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native';
import {useAccount} from 'toktokwallet/hooks';

//COMPONENTS
import {HeaderBack, HeaderTitle} from 'src/revamp';

import {moderateScale, currencyCode, numberFormat} from 'toktokwallet/helper';

import {banner} from 'toktokwallet/assets';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;
const {height, width} = Dimensions.get('window');

export const TransferableAndNonTransferableBalance = ({navigation}) => {
  const [showDetails, setShowDetails] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0));
  const {tokwaAccount} = useAccount();

  useEffect(() => {
    Animated.timing(fadeAnim.current, {
      toValue: showDetails ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showDetails]);

  return (
    <View style={[styles.container, showDetails && styles.borderBottomRadius]}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          setShowDetails(prev => !prev);
        }}
        style={styles.informationContainer}>
        <View style={styles.currencyCodeContainer}>
          <Text style={styles.currencyCode}>{currencyCode}</Text>
        </View>
        <Text style={styles.label}>Transferable and Non-transferable Balance</Text>
      </TouchableOpacity>
      {showDetails && (
        <Animated.View style={[styles.contentContainer, {opacity: fadeAnim.current}]}>
          <View style={{padding: moderateScale(16)}}>
            <View style={styles.titleContainer}>
              <Text style={styles.label}>Transferable Balance</Text>
              <Text style={{fontFamily: FONT.BOLD}}>
                {currencyCode}
                {numberFormat(tokwaAccount.wallet.transferableBalance)}
              </Text>
            </View>
            <Text style={{marginTop: moderateScale(15)}}>
              Cash Ins via online banks, debit card, OTC bank, OTC non-bank and JC Wallet can be transferred to other
              toktokwallet users’ accounts and/or bank accounts.
            </Text>
          </View>
          <View style={styles.separator} />
          <View style={{padding: moderateScale(15)}}>
            <View style={styles.titleContainer}>
              <Text style={styles.label}>Non-Transferable Balance</Text>
              <Text style={{fontFamily: FONT.BOLD}}>
                {currencyCode}
                {numberFormat(tokwaAccount.wallet.creditCardBalance)}
              </Text>
            </View>
            <Text style={{marginTop: moderateScale(16)}}>
              Cash Ins via credit card, or foreign debit card cannot be transferred to any toktokwallet users’ accounts
              and/or bank accounts. This toktokwallet balance can only be used as payments for goods and services.
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2,
    elevation: 3,
    backgroundColor: 'white',
    // borderRadius: 5,
  },
  informationContainer: {
    padding: moderateScale(16),
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyCodeContainer: {
    borderRadius: moderateScale(50),
    borderColor: COLOR.ORANGE,
    borderWidth: 1,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(Platform.OS == 'android' ? 4 : 5),
    marginRight: moderateScale(10),
  },
  label: {
    fontFamily: FONT.BOLD,
    color: COLOR.ORANGE,
  },
  currencyCode: {
    fontSize: FONT_SIZE.XL,
    color: COLOR.ORANGE,
  },
  contentContainer: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderTopColor: '#C4C4C470',
    borderTopWidth: 1,
    paddingBottom: moderateScale(8),
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    backgroundColor: '#F7F7FA',
    height: 1,
    marginHorizontal: moderateScale(15),
  },
  borderBottomRadius: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
});
