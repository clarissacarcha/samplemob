import React, {useRef, useEffect, useCallback, useState} from 'react';
import _ from 'lodash';
import {useSelector} from 'react-redux';
import {View, Text, StyleSheet, TouchableOpacity, Image, Share, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';
import {FONT, FONT_SIZE, COLOR, SIZE} from '../../../../../../../res/variables';

import DeliveryIcon from '../../../../../../../assets/toktok/icons/menu/Toktok.png';
import PabiliIcon from '../../../../../../../assets/toktok/icons/menu/Pabili.png';
import ToktokfoodIcon from '../../../../../../../assets/toktok/icons/menu/ToktokfoodMenu.png';
import ToktokGoIcon from '../../../../../../../assets/toktok/icons/menu/ToktokGo.png';
import WalletIcon from '../../../../../../../assets/toktok/icons/menu/ToktokWallet.png';
import ProfileIcon from '../../../../../../../assets/icons/ProfileIcon.png';
import ToktokMallIcon from '../../../../../../../assets/toktokmall-assets/icons/toktokmall-logo.png';
import OthersIcon from '../../../../../../../assets/icons/OthersIcon.png';
import AppServices from '../../../../../../../store/redux/reducers/AppServices';

const MenuIcon = ({label, icon, onPress, isNew = false}) => {
  const useThrottle = (cb, delayDuration) => {
    const options = {leading: true, trailing: false}; // add custom lodash options
    const cbRef = useRef(cb);
    // use mutable ref to make useCallback/throttle not depend on `cb` dep
    useEffect(() => {
      cbRef.current = cb;
    });
    return useCallback(
      throttle((...args) => cbRef.current(...args), delayDuration, options),
      [delayDuration],
    );
  };

  const onPressThrottled = useThrottle(onPress, 1000);

  return (
    <TouchableOpacity style={styles.menuButton} onPress={onPressThrottled}>
      <View style={styles.menuIconBox}>
        {isNew && (
          <View style={styles.new}>
            <Text style={styles.newText}>NEW</Text>
          </View>
        )}
        <Image style={styles.menuIcon} source={icon} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

export const Menu = ({setUserLocation, constants}) => {
  const navigation = useNavigation();
  const state = useSelector(state => state);
  const [appServices, setAppServices] = useState(null);
  const [menuData, setMenuData] = useState([]);

  /**
   * DO NOT EDIT THIS VARIABLE
   */
  const menuDataConstant = [
    {
      identifier: 'delivery',
      label: 'Delivery',
      icon: DeliveryIcon,
      onPress: () => navigation.push('ToktokDelivery', {setUserLocation}),
    },
    {
      identifier: 'pabili',
      label: 'Pabili',
      icon: PabiliIcon,
      onPress: () => navigation.push('Pabili'),
    },
    {
      identifier: 'foodComingSoon',
      label: 'Food',
      icon: ToktokfoodIcon,
      onPress: () => navigation.push('ToktokfoodMerchantComingSoon'),
      isNew: true,
    },
    {
      identifier: 'food',
      label: 'Food',
      icon: ToktokfoodIcon,
      onPress: () => navigation.push('TokTokFoodSplashScreen'),
      isNew: true,
    },
    {
      identifier: 'goComingSoon',
      label: 'Go',
      icon: ToktokGoIcon,
      onPress: () => navigation.push('ToktokgoComingSoon'),
      isNew: true,
    },
    {
      identifier: 'wallet',
      label: 'Wallet',
      icon: WalletIcon,
      onPress: () => navigation.push('ToktokWalletLoginPage'),
    },
    {
      identifier: 'mall',
      label: 'Mall',
      icon: ToktokMallIcon,
      onPress: () => navigation.push('ToktokMallLanding'),
    },
    {
      identifier: 'profile',
      label: 'Profile',
      icon: ProfileIcon,
      onPress: () => navigation.push('ToktokProfile'),
    },
  ];

  useEffect(() => {
    const appServicesObject = _.keyBy(state.appServices, 'identifier');
    setAppServices(appServicesObject);

    const filteredMenuData = menuDataConstant.filter(menuDataItem => {
      if (menuDataItem.identifier === 'profile') {
        return true;
      }

      const appService = appServicesObject[menuDataItem.identifier];

      /**
       * DO NOT BYPASS THIS VALIDATION. ASK FOR HELP IF UNSURE.
       *  Check if menuDataItem.identified exists in appServices
       */
      if (!appService) {
        console.log(`Menu item ${menuDataItem.identifier} not set in App Services. Do not bypass this validation.`);
        return false;
      }

      /**
       * DO NOT BYPASS THIS VALIDATION. ASK FOR HELP IF UNSURE.
       * Check if menuDataItem should be displayed.
       */
      const isEnabled = appService.isEnabled;
      const isEnabledInEarlyAccess = constants.isEarlyAccess === 'TRUE' && appService.isEarlyAccess;
      const isDisplayed = isEnabled || isEnabledInEarlyAccess;

      if (!isDisplayed) {
        console.log(`Menu item ${menuDataItem.identifier} is hidden in App Services. Do not bypass this validation.`);
        return false;
      }

      return true;
    });

    console.log(JSON.stringify({filteredMenuData}, null, 2));

    setMenuData(filteredMenuData);
  }, []);

  if (!appServices) {
    return <View />;
  }

  return (
    <View style={styles.menuBox}>
      <FlatList
        keyExtractor={item => item.identifier}
        data={menuData}
        numColumns={4}
        renderItem={({item}) => (
          <MenuIcon label={item.label} icon={item.icon} onPress={item.onPress} isNew={item.isNew} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  menuBox: {
    marginHorizontal: 8,
    backgroundColor: 'white',
  },
  menuButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '25%',
    marginVertical: SIZE.MARGIN / 2,
  },
  label: {
    fontSize: FONT_SIZE.M,
    color: COLOR.YELLOW,
  },
  menuIconBox: {
    height: 50,
    width: 50,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: COLOR.TRANSPARENT_YELLOW,
    overflow: 'hidden',
  },
  menuIcon: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  new: {
    height: 12,
    width: 25,
    backgroundColor: COLOR.ORANGE,
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9,
  },
  newText: {
    fontSize: 8,
    color: 'white',
  },
});
