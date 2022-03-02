import React, {useRef, useEffect, useCallback, useState} from 'react';
import {useSelector} from 'react-redux';
import {View, Text, StyleSheet, TouchableOpacity, Image, Share} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';
import {FONT, FONT_SIZE, COLOR, SIZE} from '../../../../../../../res/variables';

import DeliveryIcon from '../../../../../../../assets/images/MenuIcons/Delivery.png';
import PabiliIcon from '../../../../../../../assets/images/MenuIcons/Pabili.png';
import MallIcon from '../../../../../../../assets/images/MenuIcons/Mall.png';
import GoIcon from '../../../../../../../assets/images/MenuIcons/Go.png';
import ToktokfoodIcon from '../../../../../../../assets/images/MenuIcons/Food.png';
import WalletIcon from '../../../../../../../assets/images/MenuIcons/Wallet.png';

import ToktokMallIcon from '../../../../../../../assets/toktokmall-assets/icons/toktokmall-logo.png';
import OthersIcon from '../../../../../../../assets/icons/OthersIcon.png';

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

  const [showToktokWallet, setShowToktokWallet] = useState(true);

  useEffect(() => {
    if (constants != null && state != null) {
      if (constants.isToktokwalletAvailable == 0) {
        if (!state.session.user.hasEarlyAccess && !state.session.user.hasDriverAccount) {
          setShowToktokWallet(false);
        }
      }
    }
  }, [constants, state]);

  return (
    <View style={styles.menuBox}>
      
        <MenuIcon
          label={'Delivery'}
          icon={DeliveryIcon}
          onPress={() => navigation.push('ToktokDelivery', {setUserLocation})}
        />

        <MenuIcon 
          label={'Pabili'} 
          icon={PabiliIcon} 
          onPress={() => navigation.push('Pabili')} 
        />

        {/* <MenuIcon
          label={'Mall'}
          icon={MallIcon}
          onPress={() => {
            // navigation.push('ToktokProfile');
          }}
        /> */}
    
        {showToktokWallet && (
          <MenuIcon
            label={'Wallet'}
            icon={WalletIcon}
            onPress={() => {
              navigation.push('ToktokWalletLoginPage');
            }}
          />
        )}
       
        {/* TOKTOKFOOD COMING SOON */}
        {constants.isToktokfoodComingSoonDisplayed == 1 && (
          <MenuIcon
            label={'Food'}
            icon={ToktokfoodIcon}
            onPress={() => {
              navigation.push('ToktokfoodMerchantComingSoon');
            }}
          />
        )}

        <MenuIcon
          label={'Go'}
          icon={GoIcon}
          onPress={() => {
            // navigation.push('ToktokProfile');
          }}
          isNew
        />
      
    </View>
  );
};

const styles = StyleSheet.create({
  menuBox: {
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: 'white',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    shadowColor: '#000',

    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  menuButton: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  label: {
    fontSize: FONT_SIZE.M,
    color: COLOR.BLACK,
    marginTop: -20
  },
  menuIconBox: {
    height: 50,
    width: 50,
    marginVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
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
    backgroundColor: COLOR.RED,
    position: 'absolute',
    top: 0,
    right: 0,
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