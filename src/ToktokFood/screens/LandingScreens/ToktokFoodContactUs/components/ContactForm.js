import React, {useState, useEffect, useContext} from 'react';
import {Platform, StyleSheet, View, Image, Text, FlatList, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';

// Components
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import Separator from 'toktokfood/components/Separator';

// Hooks
import {useUserLocation} from 'toktokfood/hooks';
import {useSelector} from 'react-redux';
import {moderateScale, getStatusbarHeight, verticalScale, getDeviceHeight} from 'toktokfood/helper/scale';
import {SamplePolicy} from 'toktokfood/helper/strings';
import {arrow_right, email_ic, call_ic} from 'toktokfood/assets/images';
import YellowButton from 'toktokfood/components/YellowButton';

// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from 'res/variables';

export const ContactForm = ({  }) => {

  const {location} = useSelector((state) => state.toktokFood);
  const {user} = useSelector((state) => state.session);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={'Name'}
        placeholderTextColor={'#9E9E9E'}
      />
      <TextInput
        style={styles.input}
        placeholder={'Email'}
        placeholderTextColor={'#9E9E9E'}
      />
      <View style={styles.input}>
        <TextInput
          style={{  textAlignVertical: 'top', height: moderateScale(80), }}
          placeholder={'Message'}
          placeholderTextColor={'#9E9E9E'}
          multiline={true}
          numberOfLines={5}
        />
      </View>
      <View style={styles.btnContainer}>
        <YellowButton label='Submit' btnStyle={styles.btnStyle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  input: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15
  },
  btnContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(30)
  },
  btnStyle: {
    width: '50%',
    borderRadius: 5
  }
});
