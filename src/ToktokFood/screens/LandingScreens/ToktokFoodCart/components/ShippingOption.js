import React from 'react';
import {Image, View, Text} from 'react-native';

import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {markerIcon} from 'toktokfood/assets/images';
import {verticalScale} from 'toktokfood/helper/scale';

import styles from '../styles';

const ShippingOption = ({ orderType, setShowOrderType }) => {
  const navigation = useNavigation();

  const {location} = useSelector((state) => state.toktokFood);
  const label = orderType == 'DELIVERY' ? 'Delivery' : 'Pick up';
  
  return (
    <>
      <View style={styles.sectionContainer}>
        <View style={[styles.deliverWrapper, {paddingVertical: verticalScale(2)}]}>
          <Text style={styles.sectionTitle}>{`Estimated ${label} time:`}</Text>
          <View onTouchEnd={() => setShowOrderType(true)}>
            <Text style={styles.actionText}>Change</Text>
          </View>
        </View>
        <View style={styles.textAddressContainer}>
          <Text style={styles.textAddress} numberOfLines={2}>
            ASAP
          </Text>
        </View>
      </View>
    </>
  );
};

export default ShippingOption;
