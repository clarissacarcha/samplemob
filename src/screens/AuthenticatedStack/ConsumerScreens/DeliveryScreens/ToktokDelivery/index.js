import React, {useCallback, useMemo, useRef, useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useLazyQuery} from '@apollo/react-hooks';
import {connect} from 'react-redux';
import moment from 'moment';
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from '@gorhom/bottom-sheet';
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import {HeaderBack, HeaderTitle} from '../../../../../components';
import {useAlert} from '../../../../../hooks';
import {COLOR, LIGHT, ORANGE, FONT_REGULAR} from '../../../../../res/constants';
import {GeolocationUtility, PermissionUtility} from '../../../../../util';
import {GET_GOOGLE_GEOCODE_REVERSE} from '../../../../../graphql';

import {WhiteButton, BlackButton} from '../../../../../revamp';

//SELF IMPORTS
import Greeting from './Greeting';

const SCHEDULES = [
  {label: 'Anytime', value: '23:59:59'},
  {label: '12:00 AM', value: '00:00:00'},
  {label: '12:30 AM', value: '00:30:00'},
  {label: '01:00 AM', value: '01:00:00'},
  {label: '01:30 AM', value: '01:30:00'},
  {label: '02:00 AM', value: '02:00:00'},
  {label: '02:30 AM', value: '02:30:00'},
  {label: '03:00 AM', value: '03:00:00'},
  {label: '03:30 AM', value: '03:30:00'},
  {label: '04:00 AM', value: '04:00:00'},
  {label: '04:30 AM', value: '04:30:00'},
  {label: '05:00 AM', value: '05:00:00'},
  {label: '05:30 AM', value: '05:30:00'},
  {label: '06:00 AM', value: '06:00:00'},
  {label: '06:30 AM', value: '06:30:00'},
  {label: '07:00 AM', value: '07:00:00'},
  {label: '07:30 AM', value: '07:30:00'},
  {label: '08:00 AM', value: '08:00:00'},
  {label: '08:30 AM', value: '08:30:00'},
  {label: '09:00 AM', value: '09:00:00'},
  {label: '09:30 AM', value: '09:30:00'},
  {label: '10:00 AM', value: '10:00:00'},
  {label: '10:30 AM', value: '10:30:00'},
  {label: '11:00 AM', value: '11:00:00'},
  {label: '11:30 AM', value: '11:30:00'},
  {label: '12:00 PM', value: '12:00:00'},
  {label: '12:30 PM', value: '12:30:00'},
  {label: '01:00 PM', value: '13:00:00'},
  {label: '01:30 PM', value: '13:30:00'},
  {label: '02:00 PM', value: '14:00:00'},
  {label: '02:30 PM', value: '14:30:00'},
  {label: '03:00 PM', value: '15:00:00'},
  {label: '03:30 PM', value: '15:30:00'},
  {label: '04:00 PM', value: '16:00:00'},
  {label: '04:30 PM', value: '16:30:00'},
  {label: '05:00 PM', value: '17:00:00'},
  {label: '05:30 PM', value: '17:30:00'},
  {label: '06:00 PM', value: '18:00:00'},
  {label: '06:30 PM', value: '18:30:00'},
  {label: '07:00 PM', value: '19:00:00'},
  {label: '07:30 PM', value: '19:30:00'},
  {label: '08:00 PM', value: '20:00:00'},
  {label: '08:30 PM', value: '20:30:00'},
  {label: '09:00 PM', value: '21:00:00'},
  {label: '09:30 PM', value: '21:30:00'},
  {label: '10:00 PM', value: '22:00:00'},
  {label: '10:30 PM', value: '22:30:00'},
  {label: '11:00 PM', value: '23:00:00'},
  {label: '11:30 PM', value: '23:30:00'},
];

const SCHEDULE_TIME = SCHEDULES.map((item) => {
  return item.label;
});

const createDays = () => {
  const output = [];

  for (let i = 0; i <= 7; i++) {
    const day = moment().add(i, 'days');
    const value = day.tz('Asia/Manila').format('YYYY-MM-DD');

    let label = '';
    if (i === 0) {
      label = 'Today';
    } else if (i === 1) {
      label = 'Tomorrow';
    } else {
      label = day.format('ddd MMM D');
    }

    output.push({
      label,
      value,
    });
  }
  return output;
};

const SCHEDULESB = createDays();

const SCHEDULE_DAYS = createDays().map((item) => {
  return item.label;
});

const ToktokDelivery = ({navigation, session, route}) => {
  const INITIAL_ORDER_DATA = {
    hash: '',
    consumerId: session.user.consumer.id,
    price: 0,
    discount: 0,
    distance: 0,
    duration: 0,
    directions: null,
    collectPaymentFrom: 'SENDER',
    isCashOnDelivery: false,
    cashOnDelivery: 0,
    isExpress: false,
    cargo: '',
    notes: '',
    promoCode: '',
    orderType: 'ASAP',
    scheduledDate: moment().format('YYYY-MM-DD').toString(),
    senderStop: {
      latitude: null,
      longitude: null,
      formattedAddress: '',
      name: `${session.user.person.firstName} ${session.user.person.lastName}`,
      mobile: session.user.username.replace('+63', ''),
      landmark: '',
      orderType: 'ASAP',
      scheduledFrom: null,
      scheduledTo: null,
    },
    recipientStop: [
      {
        latitude: null,
        longitude: null,
        formattedAddress: '',
        name: '',
        mobile: '',
        landmark: '',
        orderType: 'ASAP',
        scheduledFrom: null,
        scheduledTo: null,
      },
    ],
  };
  const alertHook = useAlert();
  const [orderData, setOrderData] = useState(INITIAL_ORDER_DATA);
  const [orderType, setOrderType] = useState('ASAP');
  const [scheduledAt, setScheduledAt] = useState(null);
  const [formattedScheduledAt, setFormattedScheduledAt] = useState('ASAP');
  const [scheduledDate, setScheduledDate] = useState('Today');
  const [scheduledTime, setScheduledTime] = useState('Anytime');

  const [getGoogleGeocodeReverse, {loading, error}] = useLazyQuery(GET_GOOGLE_GEOCODE_REVERSE, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log({data});
    },
    onError: (error) => console.log({error}),
  });

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['toktok', 'Delivery']} />,
  });

  const setUserLocation = route.params.setUserLocation;

  setUserLocation({location: 'Location'});

  const bottomSheetRef = useRef();

  const snapPoints = useMemo(() => [0, 130, 345], []);

  const onSenderConfirm = (value) => {
    setOrderData({
      ...orderData,
      senderStop: value,
    });
  };

  const onRecipientConfirm = (value) => {
    setOrderData({
      ...orderData,
      recipientStop: [value],
    });
  };

  const getLocationHash = async () => {
    console.log('FETCHING LOCATION');
    const currentLocation = await GeolocationUtility.getCurrentLocation();
    console.log({currentLocation});

    if (currentLocation) {
      console.log('GEOCODING');
      getGoogleGeocodeReverse({
        variables: {
          input: {
            coordinates: {
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            },
          },
        },
      });
    }
  };

  useEffect(() => {
    getLocationHash();
  }, []);

  return (
    <>
      <View style={styles.screenBox}>
        <Greeting />

        <WhiteButton
          label={`Pick Up ${formattedScheduledAt}`}
          prefixSet="Material"
          prefixName="access-time"
          suffixSet="Material"
          suffixName="arrow-forward"
          onPress={() => {
            bottomSheetRef.current.snapTo(1);
          }}
        />
        <View style={{marginTop: 20, borderWidth: 1, borderColor: COLOR, borderRadius: 5}}>
          <WhiteButton
            label={orderData.senderStop.formattedAddress ? orderData.senderStop.formattedAddress : 'Pick Up Location'}
            description={
              orderData.senderStop.formattedAddress
                ? `${orderData.senderStop.name} | +63${orderData.senderStop.mobile}`
                : null
            }
            prefixSet="MaterialCommunity"
            prefixName="circle-outline"
            borderless
            onPress={() => {
              navigation.push('StopDetails', {
                searchPlaceholder: 'Enter pick up location',
                stopData: orderData.senderStop,
                onStopConfirm: onSenderConfirm,
              });
            }}
            style={{paddingLeft: 10}}
          />
          <View
            style={{
              marginHorizontal: 10,
              borderColor: LIGHT,
              borderStyle: 'dashed',
              borderRadius: 1,
              borderWidth: 1,
              borderTopWidth: 0,
            }}
          />
          <WhiteButton
            label={
              orderData.recipientStop[0].formattedAddress
                ? orderData.recipientStop[0].formattedAddress
                : 'Drop Off Location'
            }
            description={
              orderData.recipientStop[0].formattedAddress
                ? `${orderData.recipientStop[0].name} | +63${orderData.recipientStop[0].mobile}`
                : null
            }
            prefixSet="MaterialCommunity"
            prefixName="circle-outline"
            borderless
            onPress={() => {
              navigation.push('StopDetails', {
                searchPlaceholder: 'Enter drop off location',
                stopData: orderData.recipientStop[0],
                onStopConfirm: onRecipientConfirm,
              });
            }}
            style={{paddingLeft: 10}}
          />
        </View>
        <View style={{flex: 1}} />
        <BlackButton
          label="Next"
          onPress={() => {
            if (!orderData.senderStop.formattedAddress && !orderData.recipientStop[0].formattedAddress) {
              alertHook({message: 'Please select a pick up and drop off location.'});
              return;
            }

            if (!orderData.senderStop.formattedAddress) {
              alertHook({message: 'Please select a pick up location.'});
              return;
            }

            if (!orderData.recipientStop[0].formattedAddress) {
              alertHook({message: 'Please select a drop off location.'});
              return;
            }

            navigation.push('DeliveryDetails', {orderData, setOrderData});
          }}
        />
        <View style={{height: 10}} />
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          handleComponent={() => (
            <View
              style={{
                height: 20,
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
                borderTopWidth: 3,
                borderRightWidth: 2,
                borderLeftWidth: 2,
                borderColor: ORANGE,
                marginHorizontal: -2,
              }}
            />
          )}
          enableContentPanningGesture={false}
          enableHandlePanningGesture={false}
          backdropComponent={BottomSheetBackdrop}>
          <BottomSheetView style={styles.contentContainer}>
            <Text>Pick Up Time</Text>
            <View style={{height: 10}} />
            <WhiteButton
              label="ASAP"
              prefixSet="Material"
              prefixName="timer"
              borderless
              onPress={() => {
                setOrderType('ASAP');
                setFormattedScheduledAt('ASAP');
                bottomSheetRef.current.snapTo(0);
              }}
            />
            <WhiteButton
              label="Scheduled"
              prefixSet="MaterialCommunity"
              prefixName="calendar-month"
              borderless
              onPress={() => {
                bottomSheetRef.current.snapTo(2);
              }}
            />
            <View style={{height: 150, flexDirection: 'row'}}>
              <ScrollPicker
                dataSource={SCHEDULE_DAYS}
                selectedIndex={0}
                renderItem={(data, index) => {
                  //
                }}
                onValueChange={(data, selectedIndex) => {
                  setScheduledDate(data);
                }}
                wrapperHeight={150}
                wrapperWidth={150}
                wrapperBackground={'#FFFFFF'}
                itemHeight={50}
                highlightColor={LIGHT}
                highlightBorderWidth={1}
                onPress={() => {}}
              />
              <ScrollPicker
                dataSource={SCHEDULE_TIME}
                selectedIndex={0}
                renderItem={(data, index) => {
                  return <Text style={{fontSize: 10}}>{data.label}</Text>;
                }}
                onValueChange={(data, selectedIndex) => {
                  console.log(data);
                  setScheduledTime(data);
                }}
                wrapperHeight={150}
                wrapperWidth={150}
                wrapperBackground={'#FFFFFF'}
                itemHeight={50}
                highlightColor={LIGHT}
                highlightBorderWidth={1}
                onPress={(x, y) => {
                  console.log({x});
                  console.log({y});
                }}
              />
            </View>
            <View style={{height: 10}} />

            <BlackButton
              label="Confirm"
              onPress={() => {
                const formattedDate = SCHEDULESB.find((date) => {
                  return date.label === scheduledDate;
                });

                const formattedTime = SCHEDULES.find((date) => {
                  return date.label === scheduledTime;
                });
                setFormattedScheduledAt(`${formattedDate.label} - ${formattedTime.label}`);
                setScheduledAt(`${formattedDate.value} ${formattedTime.value}`);
                bottomSheetRef.current.collapse();
              }}
            />
            <View style={{height: 10}} />
          </BottomSheetView>
        </BottomSheet>
      </View>
      {/* <Animated.View
        style={{
          height: 100,
          backgroundColor: 'red',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          // translateX: 100,
        }}
      /> */}
    </>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(ToktokDelivery);

const styles = StyleSheet.create({
  screenBox: {
    paddingHorizontal: 10,
    backgroundColor: 'white',
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 10,
    // alignItems: 'center',
    // backgroundColor: 'blue',
  },
});
