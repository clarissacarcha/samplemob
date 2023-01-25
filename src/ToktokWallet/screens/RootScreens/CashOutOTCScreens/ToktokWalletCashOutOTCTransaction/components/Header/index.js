import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Platform, ImageBackground} from 'react-native';
import {useNavigation} from '@react-navigation/native';

//UTIL
import {moderateScale, pendingCashOutNote} from 'toktokwallet/helper';

//COMPONENTS
import {LoadingIndicator, PolicyNote} from 'toktokwallet/components';

//FONTS & COLORS & IMAGES
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
import {banner} from 'toktokwallet/assets';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';

export const Header = ({route}) => {
  const navigation = useNavigation();

  const {logo, description, provider} = route.params.otcPartnerDetails;
  const [imageLoading, setImageLoading] = useState(true);
  const notes = pendingCashOutNote(provider.key);

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
          <TouchableOpacity
            hitSlop={{left: 10, top: 10, right: 10, bottom: 10}}
            style={styles.seeNearbyContainer}
            onPress={() => {
              navigation.navigate('ToktokWalletCashOutOtcSeeNearby', {description});
            }}>
            <Text style={styles.seeNearby}>See Nearby {description}</Text>
            <FIcon5 name="chevron-right" size={moderateScale(10)} color={COLOR.ORANGE} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <PolicyNote note1={notes.note1} note2={notes.note2} noteTextStyles={{fontSize: FONT_SIZE.S}} />
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
    marginTop: Platform.OS === 'android' ? moderateScale(3) : 0,
  },
  seeNearby: {
    color: '#F6841F',
    fontSize: FONT_SIZE.S,
    marginRight: moderateScale(5),
  },
  seeNearbyContainer: {
    flexDirection: 'row',
    marginTop: moderateScale(5),
    alignItems: 'center',
  },
});
