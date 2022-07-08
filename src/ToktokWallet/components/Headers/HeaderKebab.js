import React, {useState, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, Linking} from 'react-native';
import {Menu, MenuOptions, MenuOption, MenuTrigger} from 'react-native-popup-menu';
import {useNavigation} from '@react-navigation/native';
import {moderateScale} from 'toktokwallet/helper';

const {width} = Dimensions.get('window');

export const HeaderKebab = ({onPress, color = '#F6841F', refNo, format, showSettings}) => {
  const [showDropDown, setShowDropDown] = useState(false);

  const dropDownRef = useRef(null);

  const navigation = useNavigation();

  const navigate = name => {
    navigation.navigate(name);
    setShowDropDown(false);
    dropDownRef.current.close();
  };

  const ViewPrivacyPolicy = () => {
    return Linking.openURL('https://toktok.ph/privacy-policy');
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
          <View style={[styles.dropDown, {bottom: showSettings ? -167 : -120}]}>
            {showSettings && (
              <>
                <TouchableOpacity onPress={() => navigate('ToktokWalletSettings')} style={styles.content}>
                  <Text>Settings</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
              </>
            )}
            <TouchableOpacity onPress={ViewPrivacyPolicy} style={styles.content}>
              <Text>Privacy Policy</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity onPress={() => navigate('ToktokWalletTermsConditions')} style={styles.content}>
              <Text>Terms and Conditions</Text>
            </TouchableOpacity>
          </View>
        </MenuOptions>
      </Menu>
    </>
  );
};

const styles = StyleSheet.create({
  threeDotIconButton: {
    paddingHorizontal: moderateScale(20),
  },
  dotStyle: {
    height: 3.5,
    width: 3.5,
    backgroundColor: '#F6841F',
    borderRadius: 2,
  },
  dropDown: {
    position: 'absolute',
    width: width * 0.45,
    backgroundColor: 'white',
    right: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 5,
  },
  divider: {
    flex: 1,
    marginHorizontal: 10,
    height: 1,
    backgroundColor: 'rgba(0,0,0,.1)',
  },
  content: {
    padding: 15,
    justifyContent: 'flex-end',
  },
});
