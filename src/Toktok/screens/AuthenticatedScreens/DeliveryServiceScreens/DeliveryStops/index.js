import React, {useCallback, useMemo, useRef, useState, useEffect, useLayoutEffect} from 'react';
import {View, StyleSheet, Text, StatusBar, TouchableOpacity, TouchableHighlight, Image, FlatList} from 'react-native';
import {PREF_GET_SAVED_ADDRESSES, TOKTOK_ADDRESS_CLIENT} from '../../../../../graphql';
import {onError} from '../../../../../util/ErrorUtility';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
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
import {useFocusEffect} from '@react-navigation/native';
import {GET_GOOGLE_GEOCODE_REVERSE, GET_VEHICLE_TYPES, GET_DELIVERY_RECENT_RECIPIENTS} from '../../../../../graphql';

import {WhiteButton, BlackButton, ImageHeader, Shadow, VectorIcon, ICON_SET, YellowButton} from '../../../../../revamp';
import ToktokHeader from '../../../../../assets/toktok/images/ToktokHeader.png';

//SELF IMPORTS
import Greeting from './Greeting';
import SenderRecipientCard from './SenderRecipientCard';
import SavedAddresses from '../Components/SavedAddresses';
import RecentDelivery from '../Components/RecentDelivery';

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
  let rebookDeliveryData = {};
  let scheduledDateFromRebook = null;
  if (route.params?.delivery) {
    rebookDeliveryData = route.params?.delivery;
    const date = moment(rebookDeliveryData.senderStop.scheduledFrom, 'MM/DD/YYYY - HH:mm A');
    scheduledDateFromRebook = date.isValid() ? date : moment();
  }
  const INITIAL_ORDER_DATA = {
    hash: '',
    consumerId: session.user.consumer.id,
    price: 0,
    discount: 0,
    distance: 0,
    duration: 0,
    directions: null,
    collectPaymentFrom: rebookDeliveryData.collectPaymentFrom === 'S' ? 'SENDER' : 'RECIPIENT',
    isCashOnDelivery: rebookDeliveryData.cashOnDelivery > 0 ? true : false,
    cashOnDelivery: rebookDeliveryData.cashOnDelivery ? rebookDeliveryData.cashOnDelivery : 0,
    isExpress: rebookDeliveryData.expressFee > 0 ? true : false,
    cargo: rebookDeliveryData.cargo ? rebookDeliveryData.cargo : '',
    notes: rebookDeliveryData.notes ? rebookDeliveryData.notes : '',
    promoCode: '',
    orderType: rebookDeliveryData.senderStop?.orderType === 1 ? 'ASAP' : 'SCHEDULED',
    scheduledDate:
      rebookDeliveryData.senderStop?.orderType === 1
        ? moment().format('YYYY-MM-DD').toString()
        : moment(rebookDeliveryData.senderStop?.scheduledFrom, 'MM/DD/YYYY - HH:mm a')
            .format('YYYY-MM-DD HH:mm:ss')
            .toString(),
    senderStop: rebookDeliveryData.senderStop?.name
      ? {
          latitude: rebookDeliveryData.senderStop.latitude,
          longitude: rebookDeliveryData.senderStop.longitude,
          formattedAddress: rebookDeliveryData.senderStop.formattedAddress,
          name: rebookDeliveryData.senderStop?.name,
          mobile: rebookDeliveryData.senderStop?.mobile.replace('+63', ''),
          landmark: rebookDeliveryData.senderStop.landmark,
          orderType: rebookDeliveryData.senderStop?.orderType === 1 ? 'ASAP' : 'SCHEDULED',
          scheduledFrom:
            rebookDeliveryData.senderStop?.orderType === 1
              ? null
              : `${scheduledDateFromRebook.format('YYYY-MM-DD HH:mm:ss')}`,
          scheduledTo:
            rebookDeliveryData.senderStop?.orderType === 1
              ? null
              : `${scheduledDateFromRebook.format('YYYY-MM-DD HH:mm:ss')}`,
        }
      : {
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
      rebookDeliveryData.recipientStop?.name
        ? {
            latitude: rebookDeliveryData.recipientStop.latitude,
            longitude: rebookDeliveryData.recipientStop.longitude,
            formattedAddress: rebookDeliveryData.recipientStop.formattedAddress,
            name: rebookDeliveryData.recipientStop?.name,
            mobile: rebookDeliveryData.recipientStop?.mobile.replace('+63', ''),
            landmark: rebookDeliveryData.recipientStop.landmark,
            orderType: rebookDeliveryData.recipientStop?.orderType === 1 ? 'ASAP' : 'SCHEDULED',
            scheduledFrom:
              rebookDeliveryData.recipientStop?.orderType === 1
                ? null
                : `${scheduledDateFromRebook.format('YYYY-MM-DD HH:mm:ss')}`,
            scheduledTo:
              rebookDeliveryData.recipientStop?.orderType === 1
                ? null
                : `${scheduledDateFromRebook.format('YYYY-MM-DD HH:mm:ss')}`,
          }
        : {
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
    vehicleType: rebookDeliveryData.vehicleType?.name ? rebookDeliveryData.vehicleType : null,
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
  const [savedAddresses, setSavedAddresses] = useState([]);

  useLayoutEffect(() => {
    if (rebookDeliveryData.senderStop) {
      const scheduledDate = moment(rebookDeliveryData.senderStop.scheduledFrom, 'MM/DD/YYYY - HH:mm A');
      if (rebookDeliveryData.senderStop?.orderType === 1) {
        return;
      }
      if (scheduledDate.isAfter(moment()) || !rebookDeliveryData.senderStop.scheduledFrom) {
        setOrderType('SCHEDULED');
        let dateToShow = null;
        if (moment(scheduledDate).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
          dateToShow = 'Today';
        } else if (moment(scheduledDate).format('YYYY-MM-DD') === moment().add(1, 'day').format('YYYY-MM-DD')) {
          dateToShow = 'Tomorrow';
        } else {
          dateToShow = scheduledDate.format('ddd MMM D');
        }

        const time = scheduledDate.format('HH:mm A') === '23:59 PM' ? 'Anytime' : scheduledDate.format('HH:mm A');
        setFormattedScheduledAt(`${dateToShow} - ${time}`);
      }
      if (scheduledDate.isBefore(moment()) || !scheduledDate.isValid()) {
        alertHook({message: 'Scheduled date and time has passed, please input new schedule.'});
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
      }
    }
  }, []);

  const [getGoogleGeocodeReverse, {loading, error: getGoogleError}] = useLazyQuery(GET_GOOGLE_GEOCODE_REVERSE, {
    fetchPolicy: 'network-only',
    onCompleted: data => {
      console.log({data});
    },
    onError: error => console.log({error}),
  });

  const {data: vehicleTypesData} = useQuery(GET_VEHICLE_TYPES, {
    fetchPolicy: 'network-only',
    onCompleted: data => {
      console.log({data});
    },
    onError: error => console.log({error}),
  });

  const [getDeliveryRecentRecipients, {data: GDRRdata, loading: GDRRLoading}] = useLazyQuery(
    GET_DELIVERY_RECENT_RECIPIENTS,
    {
      fetchPolicy: 'network-only',
    },
  );

  const [prefGetSavedAddresses, {loading: PGSALoading}] = useLazyQuery(PREF_GET_SAVED_ADDRESSES, {
    client: TOKTOK_ADDRESS_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: res => {
      setSavedAddresses(res.prefGetSavedAddresses);
    },
    onError: onError,
  });

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['toktok', 'Delivery']} />,
  });

  const bottomSheetRef = useRef();

  const snapPoints = useMemo(() => [0, 135, 350], []);

  const onSenderConfirm = value => {
    console.log('ON SENDER CONFIRM');
    console.log(JSON.stringify(value, null, 4));
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

  useFocusEffect(
    useCallback(() => {
      prefGetSavedAddresses();
      getDeliveryRecentRecipients();
    }, []),
  );

  useEffect(() => {
    if (route.params.formattedAddressFromSearch) {
      setOrderData({
        ...orderData,
        senderStop: {
          ...orderData.senderStop,
          ...route.params.formattedAddressFromSearch,
        },
      });
    }
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

    navigation.push('ToktokVehicleInformation', {
      orderData,
      setOrderData,
      vehicleTypesData: vehicleTypesData.getVehicleTypes,
    });
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

  const onSelectSavedAddress = item => {
    const stopData = {
      ...orderData,
      recipientStop: [
        {
          ...orderData.recipientStop[0],
          formattedAddress: item.place.formattedAddress,
          latitude: item.place.location.latitude,
          longitude: item.place.location.longitude,
          name: item.contactDetails.fullname ? item.contactDetails.fullname : '',
          mobile: item.contactDetails.mobile_no ? item.contactDetails.mobile_no : '',
        },
      ],
    };

    navigation.push('StopDetails', {
      searchPlaceholder: 'Enter drop off location',
      stopData: stopData.recipientStop[0],
      onStopConfirm: onRecipientConfirm,
    });
  };

  const onSelectRecentDelivery = item => {
    const stopData = {
      ...orderData,

      recipientStop: [
        {
          ...orderData.recipientStop[0],
          formattedAddress: item.hashedPlace.place.formattedAddress,
          latitude: item.hashedPlace.place.location.latitude,
          longitude: item.hashedPlace.place.location.longitude,
        },
      ],
    };

    navigation.push('StopDetails', {
      searchPlaceholder: 'Enter drop off location',
      stopData: stopData.recipientStop[0],
      onStopConfirm: onRecipientConfirm,
    });
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
          hasAddressFromSearch={route.params.formattedAddressFromSearch ? true : false}
          hasAddressFromRebook={rebookDeliveryData.senderStop ? true : false}
        />
        <FlatList
          data={[]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => {
            return (
              <>
                <SavedAddresses
                  navigation={navigation}
                  data={savedAddresses}
                  onSelectSavedAddress={onSelectSavedAddress}
                  prefGetSavedAddresses={prefGetSavedAddresses}
                />

                {GDRRdata?.getDeliveryRecentRecipients.length > 0 && (
                  <RecentDelivery
                    data={GDRRdata}
                    onSelectRecentDelivery={onSelectRecentDelivery}
                    navigation={navigation}
                  />
                )}
              </>
            );
          }}
        />

        <View style={{flex: 1}} />
        <View style={{backgroundColor: COLOR.LIGHT}}>
          <YellowButton label="Select Vehicle" onPress={onAddDeliveryInformation} style={{margin: SIZE.MARGIN}} />
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

export const DeliveryStops = connect(mapStateToProps, null)(ToktokDelivery);

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
