import React from 'react';
import {Image, View, StyleSheet, Text, TouchableOpacity, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import ContentLoader from 'react-native-easy-content-loader';

import {FONT, FONT_SIZE, COLOR} from 'res/variables';
import {markerIcon} from 'toktokfood/assets/images';

import {getStatusbarHeight, verticalScale, moderateScale} from 'toktokfood/helper/scale';

const HeaderTitle = ({title = 'toktokfood', showAddress = false, titleOnly = false}) => {
  const navigation = useNavigation();
  const {location} = useSelector((state) => state.toktokFood);

  const onSetLocationDetails = () => {
    navigation.navigate('ToktokFoodAddressDetails');
  };

  const renderText = () => (
    <View style={styles.addressContainer}>
      <Text style={styles.headerLabel}>{title}</Text>
      <View onTouchEndCapture={() => onSetLocationDetails()} style={styles.textAddressContainer}>
        <Image style={styles.addressMarkerIcon} source={markerIcon} />
        <Text style={styles.textAddress} numberOfLines={2}>
          {location.address}
        </Text>
      </View>
    </View>
  );

  const renderLoader = () => (
    <ContentLoader
      active
      pRows={2}
      pWidth={['40%', '70%']}
      title={false}
      primaryColor="#FFFFFF"
      secondaryColor="rgba(256,186,28,0.4)"
    />
  );

  const onBack = () => {
    navigation.goBack();
  };
  return (
    <View
      style={[
        showAddress ? styles.headerWithAddress : styles.headerWithAddress,
        {paddingHorizontal: titleOnly ? moderateScale(14) : 0},
      ]}>
      {!titleOnly && (
        <TouchableOpacity onPress={onBack} style={styles.headerBack}>
          <FIcon5 name="chevron-left" size={15} />
        </TouchableOpacity>
      )}
      {showAddress ? (
        <View style={styles.headerTextContainer}>{!location ? renderLoader() : renderText()}</View>
      ) : (
        <Text style={styles.headerLabel}>{title}</Text>
      )}
    </View>
  );
};

export default HeaderTitle;

const styles = StyleSheet.create({
  headerWithAddress: {
    flexDirection: 'row',
    paddingTop: Platform.OS === 'android' ? verticalScale(getStatusbarHeight + 15) : verticalScale(25),
  },
  headerWithoutAddress: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBack: {
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  headerLabel: {
    marginLeft: 2,
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.XL,
    fontFamily: FONT.BOLD,
  },
  headerTextContainer: {
    flex: 1,
  },
  addressContainer: {
    paddingRight: 10,
  },
  textAddressContainer: {
    alignItems: 'center',
    maxWidth: '90%',
    flexDirection: 'row',
  },
  textAddress: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
  },
  addressMarkerIcon: {
    width: 18,
    height: 18,
    marginRight: 4,
  },
});
