import React from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

// Fonts/Colors
import {COLORS} from 'res/constants';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';

const DriverDetailsView = () => {
  const {location} = useSelector((state) => state.toktokFood);

  const renderAddress = () => (
    <View style={styles.addressContainer}>
      <View>
        <FIcon5 name="circle" color={COLORS.YELLOWTEXT} size={15} />
        <View style={styles.divider} />
        {/* Commented for status change */}
        {/* <FIcon5 name="circle" color={COLORS.YELLOWTEXT} size={15} /> */}
        <MaterialIcon name="lens" size={16} color={COLORS.YELLOWTEXT} />
      </View>
      <View style={styles.addressInfo}>
        <Text>Starbucks (32nd Street)</Text>
        <View style={styles.horizontalContainer}>
          <View style={styles.horizontalDivider} />
        </View>
        <Text>{location.formattedAddress}</Text>
      </View>
    </View>
  );

  const renderTitle = () => (
    <View style={styles.detailsContainer}>
      <Text style={styles.title}>Waiting for restaurant confirmation...</Text>
      <Text style={styles.status}>Give restaurant some time to accept your order</Text>
      <View style={styles.timeContainer}>
        <MaterialIcon name="schedule" size={16} color={COLORS.YELLOWTEXT} />
        <Text style={styles.time}>Estimated time: 10:00 - 10:30</Text>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{paddingBottom: verticalScale(720)}} style={styles.container}>
      {renderTitle()}
      {renderAddress()}
      {renderAddress()}
      {renderAddress()}
    </ScrollView>
  );
};

export default DriverDetailsView;

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
  container: {
    paddingTop: verticalScale(10),
  },
  detailsContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowColor: '#000',
    elevation: 4,
    shadowOpacity: 0.1,
  },
  divider: {
    alignSelf: 'center',
    borderColor: '#DDDDDD',
    borderWidth: 0.4,
    flex: 1,
  },
  horizontalContainer: {
    paddingVertical: verticalScale(15),
  },
  horizontalDivider: {
    borderColor: '#DDDDDD',
    borderWidth: 0.3,
    flex: 1,
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
