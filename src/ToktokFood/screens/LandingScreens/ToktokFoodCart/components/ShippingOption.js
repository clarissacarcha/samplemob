import React from 'react';
import {Image, View, Text} from 'react-native';

import {order_type_icon} from 'toktokfood/assets/images';
import {verticalScale} from 'toktokfood/helper/scale';

import styles from '../styles';

const ShippingOption = ({ orderType, onPressChange }) => {

  return (
    <>
      <View style={styles.sectionContainer}>
        <View style={[styles.deliverWrapper, {paddingVertical: verticalScale(2)}]}>
          <Image source={order_type_icon} style={styles.orderTypeIcon} />
          <Text style={styles.subtitle2}>{`${orderType}: Now`}</Text>
          <View onTouchEnd={onPressChange}>
            <Text style={styles.actionText}>Change</Text>
          </View>
        </View>
        {/* <View style={styles.textAddressContainer}>
          <Text style={styles.textAddress} numberOfLines={2}>
            ASAP
          </Text>
        </View> */}
      </View>
    </>
  );
};

export default ShippingOption;
