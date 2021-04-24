import React from 'react';
import {connect} from 'react-redux';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FONT_SIZE_LARGE, FONT_SIZE_SMALL, DIRTY_WHITE, APP_FLAVOR, FONT_REGULAR} from '../../../../res/constants';

import DeliveryIcon from '../../../../assets/toktok/icons/menu/Toktok.png';
import WalletIcon from '../../../../assets/toktok/icons/menu/ToktokWallet.png';
import ProfileIcon from '../../../../assets/icons/ProfileIcon.png';
import OthersIcon from '../../../../assets/icons/OthersIcon.png';

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

const Menu = ({session, setUserLocation}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.menuBox}>
      <MenuIcon
        label={'Delivery'}
        icon={DeliveryIcon}
        onPress={() => navigation.push('ToktokDelivery', {setUserLocation})}
      />
      <MenuIcon
        label={'toktokwallet'}
        icon={WalletIcon}
        onPress={() => {
          navigation.push('TokTokWallet');
        }}
      />
      <MenuIcon
        label={'Profile'}
        icon={ProfileIcon}
        onPress={() => {
          const route = APP_FLAVOR == 'C' ? 'ConsumerProfile' : 'DriverProfile';
          navigation.push(route);
        }}
      />
      <MenuIcon label={'Pabili'} icon={OthersIcon} onPress={() => navigation.push('Pabili')} />
      {/* <MenuIcon label={'Others'} icon={OthersIcon} /> */}
    </View>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(Menu);

const styles = StyleSheet.create({
  menuBox: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  menuButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: FONT_REGULAR,
  },
  menuIconBox: {
    height: 50,
    width: 50,
    backgroundColor: DIRTY_WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  menuIcon: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
});
