import React from 'react';
import {connect} from 'react-redux';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FONT_SIZE_LARGE, FONT_SIZE_SMALL, DIRTY_WHITE} from '../../../../res/constants';

import DeliveryIcon from '../../../../assets/icons/DeliveryIcon.png';

const MenuIcon = ({label, icon, onPress}) => {
  return (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <View style={styles.menuIconBox}>
        <Image style={styles.menuIcon} source={icon} />
      </View>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
};

const Menu = ({session}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.menuBox}>
      <MenuIcon label={'Delivery'} icon={DeliveryIcon} onPress={() => navigation.push('ToktokDelivery')} />
      <MenuIcon label={'Delivery'} icon={DeliveryIcon} />
      <MenuIcon label={'Delivery'} icon={DeliveryIcon} />
      <MenuIcon label={'Delivery'} icon={DeliveryIcon} />
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

  menuIconBox: {
    height: 50,
    width: 50,
    backgroundColor: DIRTY_WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 10,
  },
  menuIcon: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
});
