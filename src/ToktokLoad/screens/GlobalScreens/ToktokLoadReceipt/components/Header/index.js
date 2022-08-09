import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

//UTIL
import {moderateScale} from 'toktokload/helper';

//FONTS & COLORS & IMAGES
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';
import {load_logo} from 'src/ToktokLoad/assets/images';

export const Header = ({route}) => {
  const mobileNumber = route.params.receipt.destinationNumber;
  const {iconUrl} = route.params.receipt.loadDetails.networkDetails;
  const [networkSize, setNetworkSize] = useState({width: moderateScale(50), height: moderateScale(30)});

  useEffect(() => {
    Image.getSize(iconUrl, (width, height) => {
      setNetworkSize({width: width - moderateScale(50), height: height - moderateScale(10)});
    });
  }, []);

  return (
    <View style={{alignItems: 'center'}}>
      {/* <Image source={load_logo} style={styles.logo} />
      <View style={styles.logoTextContainer}>
        <Text>
          <Text style={styles.headerText} >Thank you for using </Text>
          <Text style={styles.toktokText}>toktok</Text>
          <Text style={styles.loadText}>load!</Text>
        </Text>
      </View> */}
      <Text style={styles.headerText}>Successfully loaded to</Text>
      <Image
        source={{uri: iconUrl}}
        style={{height: networkSize.height, width: networkSize.width}}
        resizeMode="contain"
      />
      <Text style={styles.mobile}>{mobileNumber}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontFamily: FONT.SEMI_BOLD,
    paddingBottom: moderateScale(10),
  },
  mobile: {
    fontSize: FONT_SIZE.XL + 3,
    paddingTop: moderateScale(10),
  },
});
