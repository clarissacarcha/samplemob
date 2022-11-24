import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ImageBackground} from 'react-native';
import {useNavigation} from '@react-navigation/native';

//UTIL
import {moderateScale, numberFormat} from 'toktokbills/helper';
import {ErrorUtility} from 'toktokbills/util';

//COMPONENTS
import {OrangeButton, LoadingIndicator, AlertOverlay} from 'toktokbills/components';

//FONTS & COLORS & IMAGES
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';
import {VerifyContext} from '../VerifyContextProvider';
import {banner_bg} from 'toktokbills/assets';

export const Header = ({billType, billItemSettings = {}, tokwaBalance = 0}) => {
  const navigation = useNavigation();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <ImageBackground source={banner_bg} resizeMode="cover">
      <View style={styles.headerContainer}>
        <View style={{justifyContent: 'center'}}>
          {imageLoading && billItemSettings?.logo && !imageError && (
            <View style={{position: 'absolute', right: 0, left: 0}}>
              <LoadingIndicator isLoading={true} size="small" />
            </View>
          )}
          {billItemSettings?.logo && !imageError && (
            <Image
              source={{
                uri: billItemSettings?.logo,
              }}
              style={styles.logo}
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              onError={err => {
                setImageError(!!err);
              }}
            />
          )}
        </View>
        <Text style={billItemSettings?.logo && !imageError ? styles.billerName : styles.billerNologo}>
          {billItemSettings?.descriptions}
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginTop: moderateScale(15),
    marginBottom: moderateScale(15),
  },
  logo: {
    width: moderateScale(130),
    height: moderateScale(60),
    resizeMode: 'contain',
  },
  billerName: {
    fontSize: FONT_SIZE.M,
    marginTop: moderateScale(10),
  },
  billerNologo: {
    paddingVertical: moderateScale(20),
    fontSize: FONT_SIZE.M,
  },
});
