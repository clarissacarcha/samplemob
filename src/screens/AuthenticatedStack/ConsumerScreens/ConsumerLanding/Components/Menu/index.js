import React from 'react';
import {connect} from 'react-redux';
import {View, Text, StyleSheet, TouchableOpacity, Image, Share} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FONT, FONT_SIZE, COLOR, SIZE} from '../../../../../../res/variables';

import DeliveryIcon from '../../../../../../assets/toktok/icons/menu/Toktok.png';
import WalletIcon from '../../../../../../assets/toktok/icons/menu/ToktokWallet.png';
import PabiliIcon from '../../../../../../assets/toktok/icons/menu/Pabili.png';
import ProfileIcon from '../../../../../../assets/icons/ProfileIcon.png';
import OthersIcon from '../../../../../../assets/icons/OthersIcon.png';

const MenuIcon = ({label, icon, onPress}) => {
  return (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
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
      {/* <MenuIcon
        label={'toktokwallet'}
        icon={WalletIcon}
        onPress={() => {
          navigation.push('ToktokWalletHomePage');
        }}
      /> */}
      <MenuIcon
        label={'profile'}
        icon={ProfileIcon}
        onPress={() => {
          navigation.push('ConsumerProfile');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  menuBox: {
    paddingVertical: SIZE.MARGIN / 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
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
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: COLOR.LIGHT,
  },
  menuIcon: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
});
