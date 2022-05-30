import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLOR, DARK, MEDIUM, FONT_SIZE, FONTS} from 'src/res/constants';
import FIcon from 'react-native-vector-icons/Feather';
import {moderateScale} from 'toktokbills/helper';

import NoInternetConnection from 'src/assets/images/NoInternetConnection.png';
import SomethingWrong from 'src/assets/images/SomethingWentWrong.png';

const imageWidth = Dimensions.get('window').width - 200;

export const SomethingWentWrong = ({onRefetch, error}) => {
  const {graphQLErrors, networkError} = error; 
  if (networkError){
    return (
      <View style={styles.container}>
        <Image source={NoInternetConnection} style={styles.image} resizeMode={'contain'} />
        <Text style={styles.textBold}>No Internet Connection</Text>
        <Text style={styles.text}>Please connect to a network to use the app.</Text>
        {onRefetch && (
          <TouchableOpacity onPress={onRefetch} style={styles.autoFill}>
            <Text style={{color: "white", fontSize: FONT_SIZE.L, fontFamily: FONTS.BOLD}}>Try again</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Image source={SomethingWrong} style={styles.image} resizeMode={'contain'} />
        <Text style={styles.text2}>Oops! Something went wrong...</Text>
        <Text style={styles.text2}>{graphQLErrors[0].message}</Text>
        {onRefetch && (
          <TouchableOpacity onPress={onRefetch} style={styles.autoFill2}>
            <Text style={{color: "white", fontSize: FONT_SIZE.L, fontFamily: FONTS.BOLD}}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }
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
  text2: {
    color: "#787777",
    fontSize: FONT_SIZE.L,
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
    marginTop: moderateScale(20)
  },
  autoFill2: {
    backgroundColor: "#F6841F",
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(50),
    paddingVertical: moderateScale(10),
    marginTop: moderateScale(60)
  },
});
