import React, {useState, useEffect, useContext} from 'react';
import {Platform, StyleSheet, View, Image, Text, FlatList, TouchableOpacity} from 'react-native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';

// Components
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderSearchBox from 'toktokfood/components/HeaderSearchBox';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import { clearTemporaryCart } from 'toktokfood/helper/TemporaryCart';
import {VerifyContext} from './VerifyContextProvider';

// Hooks
import {useUserLocation} from 'toktokfood/hooks';
import {useSelector} from 'react-redux';
import {moderateScale, getStatusbarHeight} from 'toktokfood/helper/scale';
import {arrow_right, terms_and_conditions_ic, policy_ic, contact_support_ic} from 'toktokfood/assets/images';

// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from 'res/variables';

const DATA = [
  {
    title: 'Terms and Conditions',
    icon: terms_and_conditions_ic,
    screen: 'ToktokFoodTermsAndConditions'
  },
  {
    title: 'Privacy Policy',
    icon: policy_ic,
    screen: 'ToktokFoodPrivacyPolicy'
  },
  {
    title: 'Contact Us',
    icon: contact_support_ic,
    screen: 'ToktokFoodContactUs'
  }
]

export const HelpCentre = () => {

  const navigation = useNavigation();
  const {location} = useSelector((state) => state.toktokFood);
  const {user} = useSelector((state) => state.session);
  const { showHelpCentreList, setShowHelpCentreList } = useContext(VerifyContext);

  const onPress = (screen) => {
    navigation.navigate(screen)
  }

  const renderItem = ({ item }) => {
    return (
      <View style={{ paddingBottom: 16 }}>
        <TouchableOpacity onPress={() => onPress(item.screen)} style={[styles.shadow, styles.boxContainer]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={item.icon} style={{ height: 25, width: 25, resizeMode: 'contain' }} />
            <Text style={{ fontSize: FONT_SIZE.L, paddingHorizontal: 5 }}>{item.title}</Text>
          </View>
          <Image source={arrow_right} style={{ height: 15, width: 15, resizeMode: 'contain' }} />
        </TouchableOpacity>
      </View>
    )
  }

  if(!showHelpCentreList){ return null }
  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
  },
  shadow: {
    backgroundColor:"whitesmoke",
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  boxContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  }
});
