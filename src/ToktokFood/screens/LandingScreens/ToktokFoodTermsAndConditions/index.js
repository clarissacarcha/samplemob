import React, {useState, useEffect, useContext} from 'react';
import {Platform, StyleSheet, View, Image, Text, FlatList, TouchableOpacity, ScrollView} from 'react-native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';

// Components
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import Separator from 'toktokfood/components/Separator';

// Hooks
import {useUserLocation} from 'toktokfood/hooks';
import {useSelector} from 'react-redux';
import {moderateScale, getStatusbarHeight, verticalScale, getDeviceHeight} from 'toktokfood/helper/scale';
import {SamplePolicy} from 'toktokfood/helper/strings';
import {arrow_right, help_centre_ic} from 'toktokfood/assets/images';

// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from 'res/variables';

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(70) + getStatusbarHeight : moderateScale(70),
  bgImage: Platform.OS === 'android' ? moderateScale(70) + getStatusbarHeight : moderateScale(70),
};

const DATA = [
  {
    title: "Help Centre",
    icon: ""
  }
]

const ToktokFoodTermsAndConditions = ({ navigation }) => {

  const {location} = useSelector((state) => state.toktokFood);
  const {user} = useSelector((state) => state.session);

  return (
    <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { navigation.goBack() }}>
            <FIcon5 name="chevron-left" size={15} />
          </TouchableOpacity>
          <Text style={styles.headerLabel}>Terms And Conditions</Text>
        </View>
      <Separator />
      <View style={[styles.shadow, { flex: 1 }]}>
        <Text style={styles.title}>
          Terms And Conditions
        </Text>
        <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={{ textAlign: 'center' }}>
              {SamplePolicy}
            </Text>
        </ScrollView>
      </View>
    </View>
  );
};

export default ToktokFoodTermsAndConditions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  shadow: {
    margin: 16,
    padding: 10,
    backgroundColor:"white",
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
  },
  header: {
    paddingHorizontal: 16,
    alignItems: 'center',
    height: Platform.OS === 'android' ? moderateScale(70) + getStatusbarHeight : moderateScale(70),
    flexDirection: 'row',
    paddingTop: getStatusbarHeight
  },
  headerLabel: {
    flex: 1,
    color: COLOR.BLACK,
    textAlign: 'center',
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.XL,
    marginRight: 15
  },
  title: {
    textAlign: 'center',
    color: '#FFA700',
    fontFamily: FONT.BOLD,
    fontSize: 20,
    paddingVertical: 10
  }
});
