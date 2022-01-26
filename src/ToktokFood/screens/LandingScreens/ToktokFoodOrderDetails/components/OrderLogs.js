import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import DashedLine from 'react-native-dashed-line';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE, FONT} from 'res/variables';

// Images
import {delivered, pickedUp} from 'toktokfood/assets/images';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';
import moment from 'moment';

const OrderFee = ({ status = 2, transaction, riderDetails }) => {

  let {
    dateOrdered,
    dateFulfilled,
    dateShipped,
    dateReadyPickup,
    deliveryImgurl,
    deliveryImgurl2,
    orderIsfor,
    dateBookingConfirmed,
    orderStatus,
    isdeclined,
    dateCancelled,
    dateDeclined
  } = transaction
  const otwRestaurantDate = riderDetails ? riderDetails.deliveryLogs.find((item) => (item.status == 3)) : null
  const pickedupOrderDate = riderDetails ? riderDetails.deliveryLogs.find((item) => (item.status == 4)) : null
  
  const renderLogInfo = (title, date) => (
    <View style={styles.logContainer}>
      <View style={styles.logsTitle}>
        { date != 'Invalid date' ? (
          <View style={{ backgroundColor: COLORS.YELLOWTEXT, height: moderateScale(14), width: moderateScale(14), borderRadius: 10  }} />
        ) : (
          <FIcon5 name="circle" color={"#CECECE"} size={moderateScale(15)} />
        )}
        <Text style={[styles.logText, { color: orderStatus == 'c' ? '#FFA700' : 'black' }]}>{title}</Text>
      </View>
      {date != 'Invalid date' && <Text style={styles.dateText}>{date}</Text>}
    </View>
  );

  const renderDash = () => (
    <View style={styles.dashedLine}>
      <DashedLine axis="vertical" dashGap={1} dashColor="#DDDDDD" dashLength={3} />
    </View>
  );

  const renderDashImage = (dash = true, image) => (
    <View style={styles.dashedImage}>
      {dash && <DashedLine axis="vertical" dashGap={1} dashColor="#DDDDDD" dashLength={3} />}
      <Image style={[styles.pickedUp, {borderRadius: 10, height: verticalScale(150)}]} source={{ uri: image }} resizeMode="cover" />
    </View>
  );

  const displayComponent = () => {
    if(orderStatus == 'c'){
      let date = isdeclined == 1 ? dateDeclined : dateCancelled;
      return renderLogInfo('Cancelled', moment(date).format('lll'))
    } else if(orderIsfor == 1){
      return (
        <>
          {renderLogInfo('Order Placed', moment(dateOrdered).format('lll'))}
          {renderDash()}
          {renderLogInfo('On the way to restaurant', moment(otwRestaurantDate?.createdAt ?? 'Invalid Date').format('lll'))}
          {renderDash()}
          {renderLogInfo('Picked up order', moment(pickedupOrderDate?.createdAt ?? 'Invalid Date').format('lll'))}
          {(deliveryImgurl == null ) && renderDash() }
          {( deliveryImgurl != null )
            && renderDashImage(true, deliveryImgurl)}
          {renderLogInfo('On the Way to Recipient', moment(dateFulfilled).format('lll'))}
          {renderDash()}
          {renderLogInfo('Item Delivered', moment(dateShipped).format('lll'))}
          {(moment(dateShipped).format('lll') != 'Invalid date' && deliveryImgurl2 != null )
          && renderDashImage(false, deliveryImgurl2)}
        </>
      )
    } else {
      return (
        <>
          {renderLogInfo('Order Placed', moment(dateOrdered).format('lll'))}
          {renderDash()}
          {renderLogInfo('Ready for Pickup', moment(dateReadyPickup).format('lll'))}
          {renderDash()}
          {renderLogInfo('Picked up order', moment(dateShipped).format('lll'))}
        </>
      )
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.deliverLogs}>Order Logs</Text>
      {displayComponent()}
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
    fontSize: FONT_SIZE.S,
  },
  deliverLogs: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
    marginBottom: verticalScale(10),
  },
  dashedLine: {
    paddingLeft: moderateScale(6),
    height: verticalScale(16),
    flexDirection: 'row'
  },
  dashedImage: {
    flex: 1,
    paddingLeft: moderateScale(6),
    flexDirection: 'row',
    height: verticalScale(170)
  },
  logContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logText: {
    fontSize: FONT_SIZE.M,
    marginLeft: moderateScale(10),
  },
  logsTitle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  pickedUp: {
    flex: 1,
    height: verticalScale(140),
    marginLeft: moderateScale(10),
    marginTop: verticalScale(10)
  },
});
