import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ImageBackground} from 'react-native';
import {useNavigation} from '@react-navigation/native';

//UTIL
import {moderateScale} from 'toktokwallet/helper';

//COMPONENTS
import {LoadingIndicator, PolicyNote} from 'toktokwallet/components';

//FONTS & COLORS & IMAGES
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
import {VerifyContext} from '../VerifyContextProvider';
import {banner, info_icon} from 'toktokwallet/assets';

export const Header = ({route}) => {
  const navigation = useNavigation();

  const {logo, description} = route.params.otcPartnerDetails;
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <>
      <ImageBackground source={banner.banner_logo} resizeMode="cover">
        <View style={styles.headerContainer}>
          <View style={{justifyContent: 'center'}}>
            {imageLoading && logo && (
              <View style={{position: 'absolute', right: 0, left: 0}}>
                <LoadingIndicator isLoading={true} size="small" />
              </View>
            )}
            {logo && (
              <Image
                source={{
                  uri: logo,
                }}
                style={styles.logo}
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
              />
            )}
          </View>
          <Text style={logo ? styles.description : styles.nologo}>{description}</Text>
        </View>
      </ImageBackground>
      <PolicyNote
        note1="All transactions made before 01:00 PM will be processed within the day."
        note2="All transactions after 01:00 PM will be processed the next banking day."
      />
    </>
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
  description: {
    fontSize: FONT_SIZE.M,
    marginTop: moderateScale(10),
  },
  nologo: {
    paddingVertical: moderateScale(20),
    fontSize: FONT_SIZE.M,
  },
  note: {
    flexDirection: 'row',
    backgroundColor: COLOR.LIGHT_YELLOW,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(16),
  },
  noteText: {
    color: '#F6841F',
    fontSize: FONT_SIZE.S,
    marginHorizontal: moderateScale(10),
  },
  noteLogo: {
    height: moderateScale(12),
    width: moderateScale(12),
    marginTop: Platform.OS == 'android' ? moderateScale(3) : 0,
  },
});
