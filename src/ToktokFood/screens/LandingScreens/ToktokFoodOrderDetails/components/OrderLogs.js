import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import DashedLine from 'react-native-dashed-line';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE} from 'res/variables';

// Images
import {delivered, pickedUp} from 'toktokfood/assets/images';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';
import moment from 'moment';

const OrderFee = ({ status = 2, data }) => {

  let { dateOrdered } = data
  console.log(data)
  const renderLogInfo = (title, date, isDone) => (
    <View style={styles.logContainer}>
      <View style={styles.logsTitle}>
        { isDone ? <View style={{ backgroundColor: COLORS.YELLOWTEXT, height: moderateScale(14), width: moderateScale(14), borderRadius: 10  }} />
          : <FIcon5 name="circle" color={"#CECECE"} size={moderateScale(15)} /> }
        <Text style={styles.logText}>{title}</Text>
      </View>
      {!!date && <Text style={styles.dateText}>{date}</Text>}
    </View>
  );

  const renderDash = () => (
    <View style={styles.dashedLine}>
      <DashedLine axis="vertical" dashGap={1} dashColor="#DDDDDD" dashLength={3} />
    </View>
  );

  const renderDashImage = (dash = true, image) => (
    <View style={styles.dashedImage}>
      {dash && <DashedLine axis="vertical" dashGap={1} dashColor="#DDDDDD" dashLength={5} />}
      <Image style={[styles.pickedUp, {borderRadius: 10, height: 130, marginTop: 8}]} source={image} resizeMode="cover" />
    </View>
  );

  console.log(status >= 4)
  return (
    <View style={styles.container}>
      <Text style={styles.deliverLogs}>Delivery Logs</Text>
      {renderLogInfo('Order Placed', moment(dateOrdered).format('lll'), status >= 1)}
      {renderDash()}
      {renderLogInfo('On the way to restaurant', 'Feb 16 2021 - 1:26 pm', status >= 2)}
      {renderDash()}
      {renderLogInfo('Food Picked Up', '', status >= 3)}
      {renderDash()}
      {/* {renderDashImage(true, pickedUp)} */}
      {renderLogInfo('On the Way to Recipient', '', status >= 4)}
      {renderDash()}
      {renderLogInfo('Item Delivered', '', status >= 5)}
      {/* {renderDashImage(false, delivered)} */}
    </View>
  );
};

export default OrderFee;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: verticalScale(8),
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
  },
  dateText: {
    fontWeight: '300',
    fontSize: FONT_SIZE.S,
  },
  deliverLogs: {
    fontWeight: '500',
    fontSize: FONT_SIZE.M,
    marginBottom: verticalScale(10),
  },
  dashedLine: {
    height: verticalScale(15),
    paddingLeft: moderateScale(6),
    // paddingVertical: 3,
    flexDirection: 'row',
  },
  dashedImage: {
    height: verticalScale(145),
    flex: 1,
    paddingLeft: moderateScale(6),
    flexDirection: 'row',
  },
  logContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logText: {
    fontWeight: '300',
    fontSize: FONT_SIZE.M,
    marginLeft: moderateScale(10),
  },
  logsTitle: {
    flexDirection: 'row',
  },
  pickedUp: {
    flex: 1,
    height: verticalScale(140),
    marginTop: verticalScale(5),
    marginLeft: moderateScale(10),
  },
});
