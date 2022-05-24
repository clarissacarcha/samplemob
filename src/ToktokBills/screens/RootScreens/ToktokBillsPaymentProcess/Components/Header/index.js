import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ImageBackground} from 'react-native';
import {useNavigation} from '@react-navigation/native';

//UTIL
import {moderateScale, numberFormat} from 'toktokbills/helper';
import {ErrorUtility} from 'toktokbills/util';

//COMPONENTS
import {OrangeButton, LoadingIndicator} from 'toktokbills/components';
import {AlertOverlay} from 'src/components';

//FONTS & COLORS & IMAGES
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';
import {VerifyContext} from '../VerifyContextProvider';
import {banner_bg} from 'toktokbills/assets';

export const Header = ({billType, billItemSettings = {}, tokwaBalance = 0}) => {
  const navigation = useNavigation();
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <ImageBackground source={banner_bg} resizeMode="cover">
      <View style={styles.headerContainer}>
        <View style={{justifyContent: 'center'}}>
          {imageLoading && (
            <View style={{position: 'absolute', right: 0, left: 0}}>
              <LoadingIndicator isLoading={true} size="small" />
            </View>
          )}
          <Image
            source={{uri: billItemSettings?.logo}}
            style={styles.logo}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />
        </View>
        <Text style={styles.billerName}>{billItemSettings?.descriptions}</Text>
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
});
