<<<<<<< HEAD
import React, {useState, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {Menu, MenuOptions, MenuOption, MenuTrigger} from 'react-native-popup-menu';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

export const HeaderKebab = ({onPress, color = '#F6841F', refNo, format}) => {
  const [showDropDown, setShowDropDown] = useState(false);

  const dropDownRef = useRef(null);

  const navigation = useNavigation();

  const navigate = name => {
    navigation.navigate(name);
    setShowDropDown(false);
    dropDownRef.current.close();
  };

  return (
    <>
      <Menu ref={dropDownRef}>
        <MenuTrigger customStyles={{TriggerTouchableComponent: TouchableOpacity}}>
          <View style={styles.threeDotIconButton}>
            <View style={styles.dotStyle}></View>
            <View style={{...styles.dotStyle, marginVertical: 4}}></View>
            <View style={styles.dotStyle}></View>
          </View>
        </MenuTrigger>
        <MenuOptions>
          <View style={styles.dropDown}>
            <TouchableOpacity onPress={''} style={styles.privacyContainer}>
              <Text style={styles.privacyText}>Privacy Policy</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              onPress={() => navigate('ToktokWalletTermsConditions')}
              style={styles.termsConditionsContainer}>
              <Text style={styles.termsConditionsText}>Terms and Conditions</Text>
            </TouchableOpacity>
          </View>
        </MenuOptions>
      </Menu>
    </>
=======
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import CONSTANTS from 'common/res/constants';

// FONTS, ICONS, COLORS AND IMAGES
import {VectorIcon, ICON_SET} from 'src/revamp';

//HELPER
const {COLOR, FONT_FAMILY: FONT} = CONSTANTS;

export const HeaderKebab = ({onPress, color = '#F6841F', refNo, format}) => {
  return (
    <TouchableOpacity onPress={''} style={styles.backContainer}>
      <VectorIcon color={COLOR.ORANGE} size={21} iconSet={ICON_SET.Entypo} name="dots-three-vertical" />
    </TouchableOpacity>
>>>>>>> 01c4ce4f87c530b572aa82f94bc3a42a95defbf1
  );
};

const styles = StyleSheet.create({
<<<<<<< HEAD
  threeDotIconButton: {
    paddingLeft: 25 / 2,
    paddingRight: 23,
  },
  dotStyle: {
    height: 4,
    width: 4,
    backgroundColor: '#F6841F',
    borderRadius: 2,
  },
  dropDown: {
    position: 'absolute',
    width: width * 0.45,
    backgroundColor: 'white',
    bottom: -120,
    right: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 5,
  },
  privacyContainer: {
    paddingHorizontal: 10,
    marginBottom: 16,
    paddingTop: 10,
  },
  privacyText: {
    fontSize: 13,
  },
  divider: {
    flex: 1,
    marginHorizontal: 10,
    height: 1,
    backgroundColor: 'rgba(0,0,0,.1)',
  },
  termsConditionsContainer: {
    paddingHorizontal: 10,
    paddingTop: 16,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  termsConditionsText: {
    fontSize: 13,
=======
  backContainer: {
    paddingHorizontal: 15,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
>>>>>>> 01c4ce4f87c530b572aa82f94bc3a42a95defbf1
  },
});
