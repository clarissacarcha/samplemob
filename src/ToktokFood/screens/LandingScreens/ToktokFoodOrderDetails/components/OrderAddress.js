import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE} from 'res/variables';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';

const OrderAddress = () => {
  const {location} = useSelector((state) => state.toktokFood);
  return (
    <View style={styles.addressContainer}>
      <View>
        <FIcon5 name="circle" color={COLORS.YELLOWTEXT} size={15} />
        <View style={styles.divider} />
        <FIcon5 name="circle" color={COLORS.YELLOWTEXT} size={15} />
      </View>
      <View style={styles.addressInfo}>
        <Text style={styles.restaurant}>Restaurant</Text>
        <View style={styles.restauranContainer}>
          <MaterialIcon name="room" size={14} color={COLORS.BLACK} />
          <Text style={styles.addressText}>Manila City</Text>
        </View>
        <View style={styles.restauranContainer}>
          <MaterialIcon name="store" size={14} color={COLORS.BLACK} />
          <Text style={styles.addressText}>Starbucks (32nd Street)</Text>
        </View>
        <View style={styles.horizontalContainer} />

        <Text style={styles.restaurant}>Deliver to</Text>
        <View style={styles.restauranContainer}>
          <MaterialIcon name="room" size={14} color={COLORS.BLACK} />
          <Text font style={styles.addressText} numberOfLines={1}>
            {location.formattedAddress}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default OrderAddress;

const styles = StyleSheet.create({
  addressContainer: {
    backgroundColor: 'white',
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderColor: 'whitesmoke',
    flexDirection: 'row',
    padding: moderateScale(20),
    paddingHorizontal: moderateScale(30),
  },
  addressInfo: {
    flex: 1,
    paddingHorizontal: moderateScale(10),
  },
  addressText: {
    fontWeight: '300',
    fontSize: FONT_SIZE.S,
  },
  divider: {
    alignSelf: 'center',
    borderColor: '#DDDDDD',
    borderWidth: 0.4,
    flex: 1,
  },
  horizontalContainer: {
    borderColor: '#DDDDDD',
    borderTopWidth: 1,
    marginVertical: verticalScale(3),
    marginBottom: verticalScale(6),
  },
  horizontalDivider: {
    borderColor: '#DDDDDD',
    borderWidth: 0.4,
  },
  restaurant: {
    fontWeight: '500',
    fontSize: FONT_SIZE.M,
  },
  restauranContainer: {
    flexDirection: 'row',
    marginVertical: moderateScale(3),
  },
});
