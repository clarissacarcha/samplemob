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
      Deliver
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

const RecipientCard = ({bookingData, stopData, deliveryOrderType, scheduledDate, index}) => {
  const {name, mobile, landmark, formattedAddress} = stopData;

  const navigation = useNavigation();

  const onPress = throttle(
    () => {
      navigation.push('StopDetails', {
        stopData,
        deliveryOrderType,
        scheduledDate,
        index,
        headerLabel: 'Recipient',
      });
    },
    1000,
    {trailing: false},
  );

  return (
    <CardBody onPress={onPress}>
      <CardRow
        title={name ? name : 'Contact Person'}
        value={mobile ? `+63${mobile}` : 'Mobile Number'}
        iconSet="Material"
        iconName="person"
        iconSize={22}
        minHeight={40}
        iconMarginTop={6}
      />
      <Hairline />
      <CardRow
        value={formattedAddress ? formattedAddress : 'Delivery Address'}
        iconSet="Entypo"
        iconName="location"
        minHeight={40}
        iconMarginTop={6}
      />

      <DeliverySchedule label="Pick Up" bookingData={bookingData} />

      {landmark !== '' && (
        <>
          <Hairline />
          <CardRow
            value={landmark}
            iconSet="FontAwesome5"
            iconName="landmark"
            iconSize={14}
            minHeight={40}
            iconMarginTop={6}
          />
        </>
      )}
    </CardBody>
  );
};

const RecipientDetailsCard = ({bookingData, marginTop, marginBottom}) => {
  const {recipientStop, orderType, scheduledDate} = bookingData;

  const renderRecipientCards = () => {
    return recipientStop.map((stop, index) => (
      <RecipientCard
        bookingData={bookingData}
        stopData={stop}
        deliveryOrderType={orderType}
        scheduledDate={scheduledDate}
        index={index}
      />
    ));
  };

  return (
    <>
      {marginTop && <SizedBox />}
      <CardShadow>
        <CardHeader
          label={['Recipient', 'Details']}
          iconSet={'FontAwesome5'}
          iconName={'map-marker-alt'}
          iconSize={16}
        />

        {renderRecipientCards()}
      </CardShadow>
      {marginBottom && <SizedBox />}
    </>
  );
};

export default RecipientDetailsCard;

const styles = StyleSheet.create({
  directionsBox: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
