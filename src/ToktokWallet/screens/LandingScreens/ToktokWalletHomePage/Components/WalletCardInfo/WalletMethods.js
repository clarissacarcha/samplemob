import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Alert, FlatList, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {APP_FLAVOR, ACCOUNT_TYPE} from 'src/res/constants';
import {useThrottle} from 'src/hooks';
import {useDispatch} from 'react-redux';
import {useAccount} from 'toktokwallet/hooks';
import {moderateScale} from 'toktokwallet/helper';
import _ from 'lodash';

//COMPONENTS
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';

import {SIZE} from 'src/res/variables';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

const {height, width} = Dimensions.get('window');

const Method = ({icon, label, iconstyle, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.servicesContainer}>
      <Image resizeMode="contain" style={[styles.icon, iconstyle]} source={icon} />
      <Text style={styles.servicesLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const WalletMethods = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {checkIfTpinIsSet, tokwaAccount} = useAccount();
  const [appServices, setAppServices] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [actionSheetMenuData, setActionSheetMenuData] = useState([]);

  const othersItem = {
    label: 'More',
    isEnabled: true,
    icon: require('toktokwallet/assets/icons/services/more.png'),
    onPress: () => SheetManager.show('walletMenu_Services'), //to be replaced later
    identifier: 'more',
  };

  const menuDataConstant = [
    {
      label: 'Cash In',
      icon: require('toktokwallet/assets/icons/services/cash-in.png'),
      onPress: () => {
        SheetManager.hide('walletMenu_Services');
        onPressThrottled('ToktokWalletPaymentOptions');
      },
      isEnabled: true,
      identifier: 'cashIn',
    },
    {
      label: 'Bank Transfer',
      icon: require('toktokwallet/assets/icons/services/fund-transfer.png'),
      onPress: () => {
        SheetManager.hide('walletMenu_Services');
        onPressThrottled('ToktokWalletBankTransferHome');
      },
      isEnabled: tokwaAccount.constants.isFundTransferEnabled == '1',
      identifier: 'fundTransfer',
    },
    {
      label: 'Send Money',
      icon: require('toktokwallet/assets/icons/services/send-money.png'),
      onPress: () => {
        SheetManager.hide('walletMenu_Services');
        onPressThrottled('ToktokWalletSendMoney');
      },
      isEnabled: true,
      identifier: 'sendMoney',
    },
    {
      label: 'Scan QR',
      icon: require('toktokwallet/assets/icons/services/qr-code-scan.png'),
      onPress: () => {
        SheetManager.hide('walletMenu_Services');
        onPressThrottled('ToktokWalletScanQrHome');
      },
      isEnabled: true,
      identifier: 'scanQR',
    },
    {
      label: 'Cash Out',
      icon: require('toktokwallet/assets/icons/services/cash-out.png'),
      onPress: () => {
        SheetManager.hide('walletMenu_Services');
        onPressThrottled('ToktokWalletCashOutOTCHome');
      },
      isEnabled: true,
      identifier: 'cashOut',
    },
    {
      label: 'Request Money',
      icon: require('toktokwallet/assets/icons/services/send-money.png'),
      onPress: () => {
        SheetManager.hide('walletMenu_Services');
        onPressThrottled('ToktokWalletRequestMoney');
      },
      isEnabled: true,
      identifier: 'requestMoney',
    },
  ];

  useEffect(() => {
    const appServicesObject = _.keyBy(tokwaAccount.appServices, 'identifier');
    setAppServices(appServicesObject);

    const filteredMenuData = menuDataConstant.filter(menuDataItem => {
      const appService = appServicesObject[menuDataItem.identifier];

      if (!appService) {
        console.log(`Menu item ${menuDataItem.identifier} not set in App Services. Do not bypass this validation.`);
        return false;
      }

      const isEnabled = appService.isEnabled;
      const isEnabledInEarlyAccess = tokwaAccount.constants.isEarlyAccess === 'TRUE' && appService.isEarlyAccess;
      const isDisplayed = isEnabled || isEnabledInEarlyAccess;

      if (!isDisplayed) {
        console.log(`Menu item ${menuDataItem.identifier} is hidden in App Services. Do not bypass this validation.`);
        return false;
      }

      return true;
    });
    if (filteredMenuData.length > 4) {
      const slicedArr = filteredMenuData.slice(0, 3);
      slicedArr.push(othersItem);

      setMenuData(slicedArr);
      setActionSheetMenuData(filteredMenuData);
    } else {
      setMenuData(filteredMenuData);
    }
  }, []);

  const onPress = route => {
    if (APP_FLAVOR == 'D' && ACCOUNT_TYPE == 2) {
      return Alert.alert('', 'Use the toktok customer app for toktokwallet full features.');
    }

    const tpinIsSet = checkIfTpinIsSet();
    if (!tpinIsSet) return;

    if (route === 'ToktokWalletCashOutHomePage') {
      dispatch({
        type: 'SET_TOKWA_EVENTS_REDIRECT',
        payload: {
          event: 'upgradeAccount',
          value: false,
        },
      });
    }
    return navigation.navigate(route);
  };

  const onPressThrottled = useThrottle(onPress, 2000);

  return (
    <View style={styles.content}>
      <ActionSheet id="walletMenu_Services">
        <View style={styles.bottomSheet}>
          <Text style={styles.servicesTitle}>Services</Text>
          <View style={styles.separator} />
          <FlatList
            data={actionSheetMenuData}
            renderItem={({item, index}) => (
              <Method
                label={item.label}
                icon={item.icon}
                onPress={() => {
                  item.onPress();
                }}
              />
            )}
            numColumns={4}
          />
        </View>
        <View style={{width: '100%', height: 10, backgroundColor: 'white', position: 'absolute', bottom: 0}} />
      </ActionSheet>
      {menuData.map((item, index) => {
        if (item.isEnabled) {
          return (
            <Method
              label={item.label}
              icon={item.icon}
              onPress={() => {
                item.onPress();
              }}
            />
          );
        }
        return null;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    width: width,
    paddingHorizontal: 16,
  },
  content: {
    zIndex: 1,
    height: '100%',
    width: '92%',
    position: 'absolute',
    bottom: Platform.OS === 'android' ? moderateScale(45) : moderateScale(50),
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4.84,
    elevation: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletMethod: {
    height: '100%',
    width: (width * 0.9) / 4,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  servicesContainer: {
    width: '25%',
    alignItems: 'center',
    marginVertical: SIZE.MARGIN / 1.5,
  },
  servicesTitle: {
    padding: moderateScale(16),
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
  },
  separator: {
    borderBottomColor: '#F7F7FA',
    borderBottomWidth: 2,
    marginHorizontal: moderateScale(16),
  },
  icon: {
    height: moderateScale(32),
    width: moderateScale(32),
  },
  servicesLabel: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.S,
    marginTop: moderateScale(7),
  },
  moreIcon: {
    height: moderateScale(30),
    width: moderateScale(30),
  },
  bottomSheet: {
    right: 4,
    width: '102%',
    borderWidth: 3,
    borderTopColor: COLOR.ORANGE,
    borderLeftColor: COLOR.ORANGE,
    borderRightColor: COLOR.ORANGE,
    borderRadius: 15,
  },
});

export default WalletMethods;
