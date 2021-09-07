import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

// Fonts/Colors
import {COLORS} from 'res/constants';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';
import {orderStatusMessage} from 'toktokfood/helper/orderStatusMessage';

const OrderTitle = ({ transaction, rider }) => {
  const { shopDetails, orderStatus, isconfirmed, address } = transaction;
  const status = orderStatusMessage(orderStatus, rider, `${shopDetails.shopname} (${shopDetails.address})`);

  return (
    <View style={styles.detailsContainer}>
      <Text style={styles.title}>Waiting for restaurant confirmation...</Text>
      <Text style={styles.status}>Give restaurant some time to accept your order</Text>
      { rider != null && (
        <View style={styles.timeContainer}>
          <MaterialIcon name="schedule" size={16} color={COLORS.YELLOWTEXT} />
          <Text style={styles.time}>Estimated time: 10:00 - 10:30</Text>
        </View>
      )}
    </View>
  );
};

export default OrderTitle;

const styles = StyleSheet.create({
  detailsContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
    // Box Shadow
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowRadius: 2,
    // shadowOffset: {
    //   width: 0,
    //   height: -3,
    // },
    // shadowColor: '#000',
    // elevation: 4,
    // shadowOpacity: 0.1,
  },
  status: {
    fontWeight: '300',
    marginTop: verticalScale(5),
  },
  time: {
    fontWeight: '400',
    marginLeft: moderateScale(5),
  },
  timeContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(5),
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
  },
});
