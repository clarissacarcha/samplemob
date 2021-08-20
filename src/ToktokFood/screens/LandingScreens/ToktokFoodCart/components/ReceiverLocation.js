import React from 'react';
import {Image, View, Text} from 'react-native';

import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {markerIcon} from 'toktokfood/assets/images';
import {verticalScale} from 'toktokfood/helper/scale';

import styles from '../styles';

const ReceiverLocation = () => {
  const navigation = useNavigation();

  const {location} = useSelector((state) => state.toktokFood);

  const onSetLocationDetails = () => {
    navigation.navigate('ToktokFoodAddressDetails');
  };

  return (
    <>
      <View style={styles.sectionContainer}>
        <View style={[styles.deliverWrapper, {paddingVertical: verticalScale(2)}]}>
          <Text style={styles.sectionTitle}>Delivery To</Text>
          <View onTouchEnd={() => onSetLocationDetails()}>
            <Text style={styles.actionText}>Change Address</Text>
          </View>
        </View>
        <View style={styles.textAddressContainer}>
          <Image style={styles.addressMarkerIcon} source={markerIcon} />
          <Text style={styles.textAddress} numberOfLines={2}>
            {location.address ? location.address : ''}
          </Text>
        </View>
      </View>
    </>
  );
};

export default ReceiverLocation;
