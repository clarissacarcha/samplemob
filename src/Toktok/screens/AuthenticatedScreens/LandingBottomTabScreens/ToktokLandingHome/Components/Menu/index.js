import React, {useRef, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Share} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';
import {FONT, FONT_SIZE, COLOR, SIZE} from '../../../../../../../res/variables';

import DeliveryIcon from '../../../../../../../assets/toktok/icons/menu/Toktok.png';
import WalletIcon from '../../../../../../../assets/toktok/icons/menu/ToktokWallet.png';
import PabiliIcon from '../../../../../../../assets/toktok/icons/menu/Pabili.png';
import ProfileIcon from '../../../../../../../assets/icons/ProfileIcon.png';
import ToktokMallIcon from '../../../../../../../assets/toktokmall-assets/icons/toktokmall-logo.png';
import OthersIcon from '../../../../../../../assets/icons/OthersIcon.png';

const MenuIcon = ({label, icon, onPress}) => {
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
        <Image style={styles.menuIcon} source={icon} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

export const Menu = ({setUserLocation}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.menuBox}>
      <MenuIcon
        label={'delivery'}
        icon={DeliveryIcon}
        onPress={() => navigation.push('ToktokDelivery', {setUserLocation})}
      />
      <MenuIcon label={'pabili'} icon={PabiliIcon} onPress={() => navigation.push('Pabili')} />
      <MenuIcon
        label={'toktokwallet'}
        icon={WalletIcon}
        onPress={() => {
          navigation.push('ToktokWalletHomePage');
        }}
      />
      <MenuIcon
        label={'profile'}
        icon={ProfileIcon}
        onPress={() => {
          navigation.push('ToktokProfile');
        }}
      />
      {/* <MenuIcon
        label={'toktokfood'}
        icon={ProfileIcon}
        onPress={() => {
          navigation.push('ToktokFoodLanding');
        }}
      />
      <MenuIcon
        label={'toktokmall'}
        icon={ToktokMallIcon}
        onPress={() => {
          navigation.push('ToktokMallLanding');
        }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  menuBox: {
    paddingVertical: SIZE.MARGIN / 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    flexWrap: 'wrap',
  },
  menuButton: {
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  menuIcon: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
});
