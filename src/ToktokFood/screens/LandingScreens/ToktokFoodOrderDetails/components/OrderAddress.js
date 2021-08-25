import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE} from 'res/variables';

// Images
import {locationOutline, phoneBlack, store, user} from 'toktokfood/assets/images';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';

const OrderAddress = () => {
  const {location} = useSelector((state) => state.toktokFood);

  console.log(location);
  const {person, username} = useSelector((state) => state.session.user);
  const fullname = `${person.firstName} ${person.lastName}`;

  return (
    <View style={styles.addressContainer}>
      <View style={styles.dividerContainer}>
        <FIcon5 name="circle" color={COLORS.YELLOWTEXT} size={15} />
        <View style={styles.divider} />
        <FIcon5 name="circle" color={COLORS.YELLOWTEXT} size={15} />
      </View>
      <View style={styles.addressInfo}>
        <Text style={styles.restaurant}>Restaurant</Text>
        <View style={styles.restauranContainer}>
          <Image style={styles.icons} source={locationOutline} resizeMode="contain" />
          <Text style={styles.addressText}>Manila City</Text>
        </View>
        <View style={styles.restauranContainer}>
          <Image style={styles.icons} source={store} resizeMode="contain" />
          <Text style={styles.addressText}>Starbucks (32nd Street)</Text>
        </View>
        <View style={styles.horizontalContainer} />

        <Text style={styles.restaurant}>Deliver to</Text>
        <View style={styles.restauranContainer}>
          <Image style={styles.icons} source={locationOutline} resizeMode="contain" />
          <Text font style={styles.addressText} numberOfLines={1}>
            {location.address}
          </Text>
        </View>
        <View style={styles.restauranContainer}>
          <Image style={styles.icons} source={user} resizeMode="contain" />
          <Text style={styles.addressText}>{fullname}</Text>
        </View>
        <View style={styles.restauranContainer}>
          <Image style={styles.icons} source={phoneBlack} resizeMode="contain" />
          <Text style={styles.addressText}>{username}</Text>
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
    paddingHorizontal: moderateScale(20),
  },
  addressInfo: {
    flex: 1,
    paddingHorizontal: moderateScale(10),
  },
  addressText: {
    fontWeight: '300',
    fontSize: FONT_SIZE.S,
    marginLeft: 5,
  },
  dividerContainer: {
    height: verticalScale(64),
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
    marginVertical: verticalScale(4),
    marginBottom: verticalScale(6),
  },
  horizontalDivider: {
    borderColor: '#DDDDDD',
    borderWidth: 0.4,
  },
  icons: {
    width: 12,
    height: 12,
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
