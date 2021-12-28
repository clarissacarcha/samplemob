import React, {useCallback, useMemo, useRef, useState, useEffect} from 'react';
import {View, StyleSheet, Text, StatusBar, TouchableOpacity, TouchableHighlight, Image} from 'react-native';
import {useLazyQuery} from '@apollo/react-hooks';
import {connect} from 'react-redux';
import moment from 'moment-timezone';
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from '@gorhom/bottom-sheet';
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import {HeaderBack, HeaderTitle} from '../../../../../components';
import {throttle} from 'lodash';
import {useAlert} from '../../../../../hooks';
import {COLORS} from '../../../../../res/constants';
import {COLOR, FONT, FONT_SIZE, SIZE} from '../../../../../res/variables';
import {GeolocationUtility, PermissionUtility} from '../../../../../util';
import {GET_GOOGLE_GEOCODE_REVERSE} from '../../../../../graphql';

import {WhiteButton, BlackButton, ImageHeader, Shadow, VectorIcon, ICON_SET, YellowButton} from '../../../../../revamp';
import ToktokHeader from '../../../../../assets/toktok/images/ToktokHeader.png';

//SELF IMPORTS
import Greeting from './Greeting';
import SenderRecipientCard from './SenderRecipientCard';

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

const SCHEDULE_TIME = SCHEDULES.map(item => {
  return item.label;
});

const TIME_NOW = moment();

const AFTER_SCHEDULES = SCHEDULES.filter(({value}) => {
  const timeMoment = moment(value, 'HH:mm:ss');
  return timeMoment.isAfter(TIME_NOW);
});

const SCHEDULE_TIME_AFTER = AFTER_SCHEDULES.map(item => {
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

const SCHEDULE_DAYS = createDays().map(item => {
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
  const [formattedScheduledAt, setFormattedScheduledAt] = useState('ASAP');

  const [scheduledDate, setScheduledDate] = useState('Today');
  const [scheduledTime, setScheduledTime] = useState('Anytime');

  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
  const [scheduleTimeNow, setScheduleTimeNow] = useState(SCHEDULE_TIME_AFTER);

  const [userCoordinates, setUserCoordinates] = useState(null);

  const [getGoogleGeocodeReverse, {loading, error}] = useLazyQuery(GET_GOOGLE_GEOCODE_REVERSE, {
    fetchPolicy: 'network-only',
    onCompleted: data => {
      console.log({data});
    },
    onError: error => console.log({error}),
  });

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['toktok', 'Delivery']} />,
  });

  const setUserLocation = route.params.setUserLocation;

  setUserLocation({location: 'Location'});

  const bottomSheetRef = useRef();

  const snapPoints = useMemo(() => [0, 135, 350], []);

  const onSenderConfirm = value => {
    setOrderData({
      ...orderData,
      senderStop: value,
    });
  };

  const onRecipientConfirm = value => {
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
    // getLocationHash();
  }, []);

  const onAddDeliveryInformation = () => {
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
  };

  const useThrottle = (cb, delayDuration) => {
    const options = {leading: true, trailing: false}; // add custom lodash options
    const cbRef = useRef(cb);
    // use mutable ref to make useCallback/throttle not depend on `cb` dep
    useEffect(() => {
      cbRef.current = cb;
    });
    return useCallback(
      throttle((...args) => cbRef.current(...args), delayDuration, options),
      [delayDuration],
    );
  };

  const onPressThrottled = useThrottle(() => navigation.pop(), 1000);

  return (
    <>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <ImageHeader />

        <View style={{marginTop: -(220 - StatusBar.currentHeight)}} />
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={onPressThrottled}>
            <View
              style={{
                height: 50,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: SIZE.MARGIN,
                width: 105,
              }}>
              <View style={{height: 30, width: 25, justifyContent: 'center'}}>
                <VectorIcon iconSet={ICON_SET.Entypo} name="chevron-thin-left" color={COLOR.BLACK} size={20} />
              </View>

              <View style={{height: 20, justifyContent: 'center'}}>
                <Text style={{fontFamily: FONT.BOLD, fontSize: 15}}>Home</Text>
              </View>
            </View>
          </TouchableOpacity>
          <Image source={ToktokHeader} resizeMode="contain" style={{height: 25, flex: 1, alignSelf: 'center'}} />
          <View style={{width: 105}} />
        </View>

        <Shadow style={{marginHorizontal: SIZE.MARGIN, borderRadius: SIZE.BORDER_RADIUS}}>
          <TouchableHighlight
            onPress={() => {
              bottomSheetRef.current.snapTo(1);
            }}
            style={{
              borderRadius: SIZE.BORDER_RADIUS,
            }}
            underlayColor={COLOR.WHITE_UNDERLAY}>
            <View
              style={{
                height: 50,
                alignItems: 'center',
                backgroundColor: COLOR.WHITE,
                borderRadius: SIZE.BORDER_RADIUS,
                paddingHorizontal: 8,
                flexDirection: 'row',
              }}>
              <Text style={{fontFamily: FONT.BOLD, flex: 1}}>
                Pick Up Time:
                <Text style={{color: COLOR.ORANGE}}>{orderType === 'ASAP' ? ' ASAP' : ` ${formattedScheduledAt}`}</Text>
              </Text>
              <VectorIcon iconSet={ICON_SET.Entypo} name="chevron-thin-right" color={COLOR.BLACK} />
            </View>
          </TouchableHighlight>
        </Shadow>

        <View style={{height: 10}} />
        <SenderRecipientCard
          senderStop={orderData.senderStop}
          recipientStop={orderData.recipientStop}
          onSenderPress={() => {
            navigation.push('StopDetails', {
              searchPlaceholder: 'Enter pick up location',
              stopData: orderData.senderStop,
              onStopConfirm: onSenderConfirm,
            });
          }}
          onRecipientPress={() => {
            navigation.push('StopDetails', {
              searchPlaceholder: 'Enter drop off location',
              stopData: orderData.recipientStop[0],
              onStopConfirm: onRecipientConfirm,
            });
          }}
          setRecipientStop={() => {}}
          setSenderStop={onSenderConfirm}
          onLocationDetected={coordinates => {
            console.log({coordinates});
            // setUserCoordinates(coordinates);
          }}
        />

        <View style={{flex: 1}} />
        <View style={{backgroundColor: COLOR.LIGHT}}>
          <YellowButton
            label="Add Delivery Information"
            onPress={onAddDeliveryInformation}
            style={{margin: SIZE.MARGIN}}
          />
        </View>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        handleComponent={() => (
          <View
            style={{
              height: 16,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              borderTopWidth: 3,
              borderRightWidth: 2,
              borderLeftWidth: 2,
              borderColor: COLORS.ORANGE,
              marginHorizontal: -2,
            }}
          />
        )}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        backdropComponent={BottomSheetBackdrop}>
        <BottomSheetView style={styles.contentContainer}>
          <Text style={{fontFamily: FONT.BOLD}}>Select Pick Up Time</Text>
          <View style={{height: 2}} />
          <WhiteButton
            label="ASAP"
            borderless
            labelStyle={{fontFamily: FONT.REGULAR}}
            onPress={() => {
              setOrderType('ASAP');
              setFormattedScheduledAt('ASAP');
              bottomSheetRef.current.snapTo(0);

              setOrderData({
                ...orderData,
                orderType: 'ASAP',
                scheduledAt: 'null',
                senderStop: {
                  ...orderData.senderStop,
                  orderType: 'ASAP',
                  scheduledFrom: null,
                  scheduledTo: null,
                },
                recipientStop: [
                  {
                    ...orderData.recipientStop[0],
                    orderType: 'ASAP',
                    scheduledFrom: null,
                    scheduledTo: null,
                  },
                ],
              });
            }}
          />
          <View style={{borderBottomWidth: 1, borderColor: COLOR.LIGHT}} />
          <WhiteButton
            label="Scheduled"
            borderless
            labelStyle={{fontFamily: FONT.REGULAR}}
            onPress={() => {
              bottomSheetRef.current.snapTo(2);
            }}
          />
          <View style={{height: 150, flexDirection: 'row'}}>
            <ScrollPicker
              dataSource={SCHEDULE_DAYS}
              selectedIndex={0}
              // renderItem={(data, index) => {
              //   //
              // }}
              onValueChange={(data, selectedIndex) => {
                console.log(data);
                setScheduledDate(data);
                if (data === 'Today') {
                  setScheduleTimeNow(SCHEDULE_TIME_AFTER);
                  setSelectedTimeIndex(1);
                } else {
                  setScheduleTimeNow(SCHEDULE_TIME);
                  setSelectedTimeIndex(1);
                }
              }}
              wrapperHeight={150}
              wrapperWidth={150}
              wrapperBackground={'#FFFFFF'}
              itemHeight={50}
              highlightColor={COLOR.LIGHT}
              highlightBorderWidth={1}
              onPress={selectedDay => {
                console.log({selectedDay});
              }}
              activeItemTextStyle={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}
              itemTextStyle={{fontFamily: FONT.REGULAR, color: COLOR.MEDIUM}}
            />
            <ScrollPicker
              dataSource={scheduleTimeNow}
              selectedIndex={selectedTimeIndex}
              // renderItem={(data, index) => {
              //   return <Text style={{fontSize: 10}}>{data.label}</Text>;
              // }}
              onValueChange={(data, selectedIndex) => {
                console.log(data);
                setScheduledTime(data);
              }}
              wrapperHeight={150}
              wrapperWidth={150}
              wrapperBackground={'#FFFFFF'}
              itemHeight={50}
              highlightColor={COLORS.LIGHT}
              highlightBorderWidth={1}
              onPress={selectedTime => {
                console.log({selectedTime});
              }}
              activeItemTextStyle={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}
              itemTextStyle={{fontFamily: FONT.REGULAR, color: COLOR.MEDIUM}}
            />
          </View>
          <View style={{height: 10}} />

          <BlackButton
            label="Confirm"
            onPress={() => {
              if (orderType === 'SCHEDULED') {
                if (scheduledDate === 'Today') {
                  if (moment().isAfter(moment(scheduledTime, 'HH:mm AA'))) {
                    alertHook({message: 'Cannot schedule an ealier pick up time.'});
                    return;
                  }
                }
              }

              const formattedDate = SCHEDULESB.find(date => {
                return date.label === scheduledDate;
              });

              const formattedTime = SCHEDULES.find(date => {
                return date.label === scheduledTime;
              });

              setOrderType('SCHEDULED');
              setFormattedScheduledAt(`${formattedDate.label} - ${formattedTime.label}`);

              setOrderData({
                ...orderData,
                orderType: 'SCHEDULED',
                scheduledAt: `${formattedDate.value} ${formattedTime.value}`,
                senderStop: {
                  ...orderData.senderStop,
                  orderType: 'SCHEDULED',
                  scheduledFrom: `${formattedDate.value} ${formattedTime.value}`,
                  scheduledTo: `${formattedDate.value} ${formattedTime.value}`,
                },
                recipientStop: [
                  {
                    ...orderData.recipientStop[0],
                    orderType: 'SCHEDULED',
                    scheduledFrom: `${formattedDate.value} ${formattedTime.value}`,
                    scheduledTo: `${formattedDate.value} ${formattedTime.value}`,
                  },
                ],
              });

              bottomSheetRef.current.collapse();
            }}
          />
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(ToktokDelivery);

const styles = StyleSheet.create({
  screenBox: {
    backgroundColor: 'white',
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    // alignItems: 'center',
    // backgroundColor: 'blue',
  },
});
