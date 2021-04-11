import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLOR, DARK, DIRTY_WHITE, LIGHT, MEDIUM} from '../../../../res/constants';

const MenuButton = () => {
  const navigation = useNavigation();

  const openDrawer = () => navigation.openDrawer();

  return (
    <TouchableOpacity style={styles.menuBox} onPress={openDrawer}>
      <FeatherIcon name="menu" size={30} color={DARK} />
    </TouchableOpacity>
  );
};

const SearchInput = () => {
  return (
    <View style={styles.inputBox}>
      <TextInput placeholder="Search" placeholderTextColor={LIGHT} style={{flex: 1}} />
      <FeatherIcon name="search" size={25} color={MEDIUM} />
    </View>
  );
};

const NotificationButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.notificationBox} onPress={() => navigation.push('Notifications')}>
      <MaterialCommunityIcon name="bell-outline" size={30} color={'white'} />
    </TouchableOpacity>
  );
};

const Header = () => {
  return (
    <View style={styles.headerBox}>
      <MenuButton />
      <SearchInput />
      <NotificationButton />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerBox: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuBox: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: DIRTY_WHITE,
  },
  notificationBox: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR,
  },
});
