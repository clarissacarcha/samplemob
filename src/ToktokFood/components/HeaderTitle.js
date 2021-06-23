import React from 'react';
import {Image, View, StyleSheet, Text, TouchableOpacity, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import ContentLoader from 'react-native-easy-content-loader';

import {FONT, FONT_SIZE, COLOR} from 'res/variables';
import {markerIcon} from 'toktokfood/assets/images';

const HeaderTitle = ({title = 'TokTok PH'}) => {
  const navigation = useNavigation();
  const {location} = useSelector((state) => state.toktokFood);

  const renderText = () => (
    <View style={styles.addressContainer}>
      <Text style={styles.headerLabel}>{title}</Text>
      <View style={styles.textAddressContainer}>
        <Image style={styles.addressMarkerIcon} source={markerIcon} />
        <Text style={styles.textAddress} numberOfLines={2}>
          {location.formattedAddress}
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
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.headerBack}>
        <FIcon5 name="chevron-left" size={15} />
      </TouchableOpacity>
      <View style={styles.headerTextContainer}>{!location ? renderLoader() : renderText()}</View>
    </View>
  );
};

export default HeaderTitle;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    marginTop: Platform.OS === 'android' ? 53 : 40,
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
