import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {throttle} from 'lodash';
import {CardShadow, CardHeader, CardBody, CardRow, Hairline, SizedBox} from '../../../../../components/widgets';
import {COLOR, LIGHT, MEDIUM, DARK} from '../../../../../res/constants';
import {YellowIcon} from '../../../../../components/ui';

const SchedulePhrase = ({bookingData}) => {
  let fromDate = moment(bookingData.senderStop.scheduledFrom, 'YYYY-MM-DD - HH:mm:ss').format('h:mm A');
  let toDate = moment(bookingData.senderStop.scheduledTo, 'YYYY-MM-DD - HH:mm:ss').format('h:mm A');

  if (fromDate === '12:00 AM') {
    fromDate = 'Anytime';
  }

  if (toDate === '11:59 PM') {
    toDate = 'Anytime';
  }

  return (
    <Text numberOfLines={1} style={{paddingRight: 10, color: MEDIUM, fontSize: 11, fontFamily: 'Rubik-Medium'}}>
      Pick Up
      <Text style={{color: COLOR, fontFamily: 'Rubik-Medium'}}> From </Text>
      {fromDate}
      <Text style={{color: COLOR, fontFamily: 'Rubik-Medium'}}> To </Text>
      {toDate}
    </Text>
  );
};

const DeliverySchedule = ({bookingData}) => {
  if (bookingData.orderType === 'ASAP') {
    return null;
  }

  return (
    <View style={[styles.directionsBox, {borderTopWidth: StyleSheet.hairlineWidth, borderColor: LIGHT}]}>
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        <YellowIcon set="Fontisto" name="clock" />
        {/* <YellowIcon set="FontAwesome5" name="hands-helping" size={14} /> */}

        <View style={{marginLeft: 10}}>
          <SchedulePhrase bookingData={bookingData} />
        </View>
      </View>
    </View>
  );
};

const SenderDetailsCard = ({bookingData, marginTop, marginBottom}) => {
  const navigation = useNavigation();

  const onPress = throttle(
    () => {
      navigation.push('StopDetails', {
        stopData: bookingData.senderStop,
        deliveryOrderType: bookingData.orderType,
        scheduledDate: bookingData.scheduledDate,
        index: null,
        headerLabel: 'Sender',
      });
    },
    1000,
    {trailing: false},
  );

  return (
    <>
      {marginTop && <SizedBox />}
      <CardShadow>
        <CardHeader label={['Sender', 'Details']} iconSet={'FontAwesome5'} iconName={'map-marker-alt'} iconSize={16} />

        <CardBody onPress={onPress}>
          <CardRow
            title={bookingData.senderStop.name ? bookingData.senderStop.name : 'Contact Person'}
            value={bookingData.senderStop.mobile ? `+63${bookingData.senderStop.mobile}` : 'Mobile Number'}
            iconSet="Material"
            iconName="person"
            iconSize={22}
            minHeight={40}
            iconMarginTop={6}
          />
          <Hairline />
          <CardRow
            value={bookingData.senderStop.formattedAddress ? bookingData.senderStop.formattedAddress : 'Address'}
            iconSet="Entypo"
            iconName="location"
            minHeight={40}
            iconMarginTop={6}
          />

          <DeliverySchedule label="Pick Up" bookingData={bookingData} />

          {bookingData.senderStop.landmark !== '' && (
            <>
              <Hairline />
              <CardRow
                value={bookingData.senderStop.landmark}
                iconSet="FontAwesome5"
                iconName="landmark"
                iconSize={14}
                minHeight={40}
                iconMarginTop={6}
              />
            </>
          )}
        </CardBody>
      </CardShadow>
      {marginBottom && <SizedBox />}
    </>
  );
};

export default SenderDetailsCard;

const styles = StyleSheet.create({
  directionsBox: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
