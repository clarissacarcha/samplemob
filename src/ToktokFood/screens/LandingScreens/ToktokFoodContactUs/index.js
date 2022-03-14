import React, {useState, useEffect, useContext} from 'react';
import {Platform, Linking, StyleSheet, View, Image, Text, FlatList, TouchableOpacity, ScrollView, KeyboardAvoidingView} from 'react-native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';

// Components
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import Separator from 'toktokfood/components/Separator';

// Hooks
import {useSelector} from 'react-redux';
import {moderateScale, getStatusbarHeight, verticalScale, getDeviceHeight} from 'toktokfood/helper/scale';
import {SamplePolicy} from 'toktokfood/helper/strings';
import {arrow_right, email_ic, call_ic} from 'toktokfood/assets/images';

// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from 'res/variables';
import { ContactForm } from './components';

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

const ToktokFoodContactUs = ({ navigation }) => {

  const {location} = useSelector((state) => state.toktokFood);
  const {user} = useSelector((state) => state.session);

  const onEmail = () => {
    const url = `mailto:food@toktok.ph`;
    Linking.openURL(url);
  }

  const onTelNumber = () => {
    const url = `tel:(623) 8424 8617`;
    Linking.openURL(url);
  }

  return (
    <KeyboardAvoidingView enabled behavior={Platform.OS == 'ios' ? 'position' : 'padding'} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity hitSlop={styles.hitSlop} onPress={() => { navigation.goBack() }}>
          <FIcon5 name="chevron-left" size={15} />
        </TouchableOpacity>
        <Text style={styles.headerLabel}>Contact Us</Text>
      </View>
      <Separator />
      <View style={[styles.shadow]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10, backgroundColor: 'white' }}
          keyboardShouldPersistTaps='handled'
        >
            <Text style={styles.title}>
              Contact Us
            </Text>
            <Text style={{ textAlign: 'center' }}>
              Email us with any of your inquiries or contact us with the contact information provided below. We will gladly discuss with you the best possible solution to your needs.
            </Text>
            <View style={styles.contactContainer}>
              <TouchableOpacity onPress={() => onTelNumber()} style={styles.btnContainter}>
                <Image source={call_ic} style={styles.icons} />
                <Text style={{ marginLeft: 10 }}>(632) 8424 8617</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onEmail()} style={styles.btnContainter}>
                <Image source={email_ic} style={styles.icons} />
                <Text style={{ marginLeft: 10 }}>food@toktok.ph</Text>
              </TouchableOpacity>
            </View>
            <ContactForm />
        </ScrollView>
      </View>

      </KeyboardAvoidingView>

  );
};

export default ToktokFoodContactUs;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  shadow: {
    margin: 16,
    padding: 16,
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
    height: getDeviceHeight - moderateScale(130)
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
  },
  btnContainter: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icons: {
    height: moderateScale(25),
    width: moderateScale(25),
    resizeMode: 'contain'
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: moderateScale(20)
  },
  hitSlop: {
    top: moderateScale(40),
    bottom: moderateScale(40),
    left: moderateScale(40),
    right: moderateScale(40)
  }
});
