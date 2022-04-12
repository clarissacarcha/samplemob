import React, {useRef, useEffect, useCallback, useState} from 'react';
import _ from 'lodash';
import {useSelector} from 'react-redux';
import {View, Text, StyleSheet, TouchableOpacity, Image, Share, FlatList, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';
import {FONT, FONT_SIZE, COLOR, SIZE} from '../../../../../../../res/variables';
import {Shadow} from '../../../../../../../revamp';

// import DeliveryIcon from '../../../../../../../assets/toktok/icons/menu/Toktok.png';
// import PabiliIcon from '../../../../../../../assets/toktok/icons/menu/Pabili.png';
// import ToktokfoodIcon from '../../../../../../../assets/toktok/icons/menu/ToktokfoodMenu.png';
// import ToktokGoIcon from '../../../../../../../assets/toktok/icons/menu/ToktokGo.png';
// import WalletIcon from '../../../../../../../assets/toktok/icons/menu/ToktokWallet.png';
// import ProfileIcon from '../../../../../../../assets/toktok/icons/menu/Profile.png';
// import ToktokMallIcon from '../../../../../../../assets/toktok/icons/menu/ToktokMall.png';
// import TalkToUsIcon from '../../../../../../../assets/toktok/icons/menu/TalkToUs.png';
// import WhatsNewIcon from '../../../../../../../assets/toktok/icons/menu/WhatsNew.png';

import DeliveryIcon from '../../../../../../../assets/toktok/icons/menu/DeliveryService.png';
import PabiliIcon from '../../../../../../../assets/toktok/icons/menu/PabiliService.png';
import ToktokfoodIcon from '../../../../../../../assets/toktok/icons/menu/FoodService.png';
import ToktokGoIcon from '../../../../../../../assets/toktok/icons/menu/GoService.png';
import WalletIcon from '../../../../../../../assets/toktok/icons/menu/WalletService.png';
import LoadIcon from '../../../../../../../assets/toktok/icons/menu/LoadService.png';
// import ToktokMallIcon from '../../../../../../../assets/toktok/icons/menu/MallService.png';

import ProfileIcon from '../../../../../../../assets/toktok/icons/menu/ProfileService.png';
import HelpIcon from '../../../../../../../assets/toktok/icons/menu/HelpService.png';
import PromosIcon from '../../../../../../../assets/toktok/icons/menu/PromosService.png';

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
      {isNew && (
        <View style={styles.new}>
          <Text style={styles.newText}>NEW</Text>
        </View>
      )}
      <View style={styles.menuIconBox}>
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
      identifier: 'wallet',
      label: 'Wallet',
      icon: WalletIcon,
      onPress: () => navigation.push('ToktokWalletLoginPage'),
    },
    // {
    //   identifier: 'foodComingSoon',
    //   label: 'Food',
    //   icon: ToktokfoodIcon,
    //   onPress: () => navigation.push('ToktokfoodMerchantComingSoon'),
    //   isNew: true,
    // },
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
      onPress: () => navigation.push('ToktokGoLanding'),
      isNew: true,
    },
    {
      identifier: 'go',
      label: 'Go',
      icon: ToktokGoIcon,
      onPress: () => navigation.push('ToktokGoLanding'),
      isNew: true,
    },
    {
      identifier: 'load',
      label: 'Load',
      icon: LoadIcon,
      onPress: () => navigation.push('ToktokLoadHome'),
      isNew: true,
    },
    // {
    //   identifier: 'mall',
    //   label: 'Mall',
    //   icon: ToktokMallIcon,
    //   onPress: () => navigation.push('ToktokMallLanding'),
    // },
    {
      identifier: 'promos',
      label: 'Promos',
      icon: PromosIcon,
      onPress: () => navigation.push('SuperAppPromos'),
    },
    // {
    //   identifier: 'profile',
    //   label: 'Profile',
    //   icon: ProfileIcon,
    //   onPress: () => navigation.push('ToktokProfile'),
    // },
    {
      identifier: 'help',
      label: 'Help',
      icon: HelpIcon,
      onPress: () => navigation.push('TalkToUs'),
    },
  ];

  useEffect(() => {
    const appServicesObject = _.keyBy(state.appServices, 'identifier');
    setAppServices(appServicesObject);

    const filteredMenuData = menuDataConstant.filter(menuDataItem => {
      if (['profile', 'promos', 'help'].includes(menuDataItem.identifier)) {
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
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  menuButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '25%',
    marginVertical: SIZE.MARGIN / 2,
  },
  label: {
    fontSize: FONT_SIZE.M,
    // color: COLOR.YELLOW,
  },
  menuIconBox: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    // backgroundColor: COLOR.TRANSPARENT_YELLOW,
    // borderWidth: 1,
  },
  menuIcon: {
    height: 50,
    width: 50,
    resizeMode: 'contain',
  },
  new: {
    height: 18,
    width: 40,
    backgroundColor: '#ED3A19',
    position: 'absolute',
    top: 0,
    right: 9,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9,
  },
  newText: {
    fontSize: 10,
    color: 'white',
  },
});
