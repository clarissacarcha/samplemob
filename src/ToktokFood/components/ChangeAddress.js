import React, {useState, useEffect} from 'react';
import {Image, View, StyleSheet, Text, TouchableOpacity, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import ContentLoader from 'react-native-easy-content-loader';

import {FONT, FONT_SIZE, COLOR} from 'res/variables';
import {markerIcon, down_arrow_ic} from 'toktokfood/assets/images';

import {getStatusbarHeight, verticalScale, moderateScale} from 'toktokfood/helper/scale';

import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import {GET_ALL_TEMPORARY_CART} from 'toktokfood/graphql/toktokfood';
import {useIsFocused} from '@react-navigation/native';

const ChangeAddress = ({title = '', searchBox = true, backOnly = false, styleContainer}) => {
  const navigation = useNavigation();
  const {location} = useSelector((state) => state.toktokFood);

  const onSetLocationDetails = () => {
    navigation.navigate('ToktokFoodAddressDetails');
  };

  const renderLoader = () => (
    <ContentLoader
      active
      pRows={1}
      pWidth={['80%']}
      title={false}
      primaryColor="#FFFFFF"
      secondaryColor="rgba(256,186,28,0.4)"
    />
  );

  return (
    <View onTouchEndCapture={() => onSetLocationDetails()} style={[styles.container, styleContainer]}>
      <Text style={{ color: '#FFA700', fontFamily: FONT.BOLD, fontSize: FONT_SIZE.S }}>
        Deliver to
      </Text>
      <View style={styles.divider} />
      { location.address == undefined ? (
        renderLoader()
      ) : (
        <View style={styles.textAddressContainer}>
          <Image style={styles.addressMarkerIcon} source={markerIcon} />
          <Text style={styles.textAddress} numberOfLines={1}>
            {location.address}
          </Text>
          <Image style={styles.downArrowIc} source={down_arrow_ic} />
        </View>
      )}
    </View>
  );
};

export default ChangeAddress;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal:  moderateScale(25),
    paddingTop: moderateScale(20),
    paddingBottom: moderateScale(15),
  },
  textAddressContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
  },
  textAddress: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.S,
    fontFamily: FONT.REGULAR,
    flexShrink: 1
  },
  addressMarkerIcon: {
    width: moderateScale(18),
    height: moderateScale(18),
    marginRight: 4,
    resizeMode: 'contain'
  },
  divider: {
    marginHorizontal: 10,
    height: '100%',
    width: 1,
    backgroundColor: '#FFA700'
  },
  downArrowIc: {
    width: moderateScale(12),
    height: moderateScale(12),
    marginLeft: 4,
    resizeMode: 'contain'
  }
});
