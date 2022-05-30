import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLOR, DARK, MEDIUM, FONT_SIZE, FONTS} from 'src/res/constants';
import FIcon from 'react-native-vector-icons/Feather';
import {moderateScale} from 'toktokbills/helper';

import NoInternetConnection from 'src/assets/images/NoInternetConnection.png';

const imageWidth = Dimensions.get('window').width - 200;

export const SomethingWentWrong = ({onRefetch, error}) => {
  const {graphQLErrors, networkError} = error; 
  return (
    <View style={styles.container}>
      <Image source={NoInternetConnection} style={styles.image} resizeMode={'contain'} />
      <Text style={styles.textBold}>No Internet Connection</Text>
      { networkError && <Text style={styles.text}>Please connect to a network to use the app.</Text> }
      {onRefetch && (
        <TouchableOpacity onPress={onRefetch} style={styles.autoFill}>
          <Text style={{color: "white", fontSize: FONT_SIZE.L, fontFamily: FONTS.BOLD}}>Try again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: imageWidth, 
    width: imageWidth,
    marginBottom: moderateScale(10)
  },
  text: {
    fontSize: FONT_SIZE.M,
    marginBottom: moderateScale(10)
  },
  textBold: {
    color: "#F6841F",
    fontSize: FONT_SIZE.XL,
    fontFamily: FONTS.BOLD,
    marginBottom: moderateScale(10)
  },
  autoFillBox: {
    margin: 20,
    borderRadius: 10,
  },
  autoFill: {
    backgroundColor: "#F6841F",
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(100),
    paddingVertical: moderateScale(10),
    marginTop: moderateScale(24)
  },
});
