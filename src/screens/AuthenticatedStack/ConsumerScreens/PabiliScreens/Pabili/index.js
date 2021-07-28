import React, {useCallback, useMemo, useRef, useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Text,
  useWindowDimensions,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  StyleSheet,
  StatusBar,
  ImageBackground,
} from 'react-native';
import ContentLoader from 'react-native-easy-content-loader';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import moment from 'moment';
import {COLORS, FONTS, NUMBERS, SIZES, MEDIUM} from '../../../../../res/constants';
import {FONT, COLOR, SIZE, FONT_SIZE} from '../../../../../res/variables';
import {WhiteButton, BlackButton, VectorIcon, ICON_SET, Shadow, ImageHeader} from '../../../../../revamp';
import {useAlert} from '../../../../../hooks';
import {throttle} from 'lodash';
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from '@gorhom/bottom-sheet';
import ScrollPicker from 'react-native-wheel-scrollview-picker';

import SMIcon from '../../../../../assets/toktok/dummy/SM.png';
import ToktokHeader from '../../../../../assets/toktok/images/ToktokHeader.png';

//SELF IMPORTS
import PabiliPartners from './PabiliPartners';
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

const SCHEDULE_TIME = SCHEDULES.map((item) => {
  return item.label;
});

const TIME_NOW = moment();

const AFTER_SCHEDULES = SCHEDULES.filter(({value}) => {
  const timeMoment = moment(value, 'HH:mm:ss');
  return timeMoment.isAfter(TIME_NOW);
});

const SCHEDULE_TIME_AFTER = AFTER_SCHEDULES.map((item) => {
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

const Pabili = ({navigation, session, route}) => {
  const INITIAL_ORDER_DATA = {
    hash: '',
    consumerId: session.user.consumer.id,
    price: 0,
    discount: 0,
    distance: 0,
    duration: 0,
    directions: null,
    collectPaymentFrom: 'RECIPIENT',
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
  const [orderData, setOrderData] = useState(INITIAL_ORDER_DATA);

  const AlertHook = useAlert();

  const onSenderConfirm = (value) => {
    setOrderData({
      ...orderData,
      senderStop: value,
    });

    navigation.pop();
    navigation.push('PabiliDetails', {
      orderData: {
        ...orderData,
        senderStop: value,
      },
      setOrderData,
    });
  };

  const onRecipientConfirm = (value) => {
    setOrderData({
      ...orderData,
      recipientStop: [value],
    });
    navigation.pop();
  };

  const onSenderPress = () => {
    navigation.push('PabiliSearchAddress', {
      searchPlaceholder: 'Enter pick up location',
      stopData: orderData.senderStop,
      onStopConfirm: onSenderConfirm,
    });
  };

  const onRecipientPress = () => {
    navigation.push('PabiliSearchAddress', {
      searchPlaceholder: 'Enter drop off location',
      stopData: orderData.recipientStop[0],
      onStopConfirm: onRecipientConfirm,
    });
  };

  const setRecipientStop = (value) => {
    setOrderData({
      ...orderData,
      recipientStop: value,
    });
  };

  const [orderType, setOrderType] = useState('ASAP');
  const [formattedScheduledAt, setFormattedScheduledAt] = useState('ASAP');
  const [scheduledDate, setScheduledDate] = useState('Today');
  const [scheduledTime, setScheduledTime] = useState('Anytime');

  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
  const [scheduleTimeNow, setScheduleTimeNow] = useState(SCHEDULE_TIME_AFTER);

  const [userCoordinates, setUserCoordinates] = useState(null);

  const bottomSheetRef = useRef();
  const storesBottomSheetRef = useRef();

  const snapPoints = useMemo(() => [0, 130, 345], []);
  const storesSnapPoints = useMemo(() => [0, 400], []);

  const onNearbySelect = ({value, nav, storeData}) => {
    console.log('NEARBY SELECTED');
    console.log({value});

    setOrderData({
      ...orderData,
      senderStop: {
        ...orderData.senderStop,
        name: storeData.name,
        formattedAddress: storeData.vicinity,
        latitude: value.location.latitude,
        longitude: value.location.longitude,
      },
    });

    nav.pop();
    nav.push('PabiliDetails', {
      orderData: {
        ...orderData,
        senderStop: {
          ...orderData.senderStop,
          name: storeData.name,
          formattedAddress: storeData.vicinity,
          latitude: value.location.latitude,
          longitude: value.location.longitude,
        },
      },
      setOrderData,
    });
  };

  const pushToNearbyStores = ({label, plural, placeType, coordinates}) => {
    navigation.push('NearbyStores', {label, plural, placeType, coordinates, onNearbySelect});
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
      {/* <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent /> */}
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
                paddingHorizontal: 20,
                width: 105,
              }}>
              <View style={{height: 30, width: 25, justifyContent: 'center'}}>
                <VectorIcon iconSet={ICON_SET.Entypo} name="chevron-thin-left" color={COLORS.DARK} size={20} />
              </View>

              <View style={{height: 20, justifyContent: 'center'}}>
                <Text style={{fontFamily: FONT.BOLD, fontSize: 15}}>Home</Text>
              </View>
            </View>
          </TouchableOpacity>
          <Image source={ToktokHeader} resizeMode="contain" style={{height: 25, flex: 1, alignSelf: 'center'}} />
          <View style={{width: 105}} />
        </View>

        <Shadow style={{marginHorizontal: NUMBERS.MARGIN_HORIZONTAL, borderRadius: NUMBERS.BORDER_RADIUS}}>
          {/* <View style={{height: 50, backgroundColor: 'white', borderRadius: NUMBERS.BORDER_RADIUS}} /> */}
          <TouchableHighlight
            onPress={() => {
              bottomSheetRef.current.snapTo(1);
            }}
            style={{
              borderRadius: NUMBERS.BORDER_RADIUS,
            }}
            underlayColor={COLORS.LIGHT_YELLOW}>
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
          onSenderPress={onSenderPress}
          onRecipientPress={onRecipientPress}
          setRecipientStop={setRecipientStop}
          onLocationDetected={(coordinates) => {
            setUserCoordinates(coordinates);
          }}
          routeParams={route.params}
        />
        <View style={{height: 20}} />
        {userCoordinates && (
          <Shadow style={{marginHorizontal: NUMBERS.MARGIN_HORIZONTAL, borderRadius: NUMBERS.BORDER_RADIUS}}>
            {/* <View style={{height: 50, backgroundColor: 'white', borderRadius: NUMBERS.BORDER_RADIUS}} /> */}
            <TouchableHighlight
              onPress={() => {
                storesBottomSheetRef.current.snapTo(1);
              }}
              style={{
                borderRadius: NUMBERS.BORDER_RADIUS,
              }}
              underlayColor={COLORS.LIGHT_YELLOW}>
              <View
                style={{
                  height: 50,
                  alignItems: 'center',
                  backgroundColor: 'white',
                  borderRadius: NUMBERS.BORDER_RADIUS,
                  paddingHorizontal: 8,
                  flexDirection: 'row',
                }}>
                <Text style={{fontFamily: FONT.BOLD, flex: 1}}>What's near me?</Text>
                <VectorIcon iconSet={ICON_SET.Entypo} name="chevron-thin-right" color={COLOR.BLACK} />
              </View>
            </TouchableHighlight>
          </Shadow>
        )}
        <View style={{height: 10, backgroundColor: COLOR.LIGHT, marginTop: 20, marginBottom: 10}} />

        <PabiliPartners orderData={orderData} setOrderData={setOrderData} />
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
              highlightColor={COLORS.LIGHT}
              highlightBorderWidth={1}
              onPress={() => {}}
              activeItemTextStyle={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}
              itemTextStyle={{fontFamily: FONT.REGULAR, color: COLOR.MEDIUM}}
            />
            <ScrollPicker
              dataSource={scheduleTimeNow}
              selectedIndex={selectedTimeIndex}
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
              onPress={(x, y) => {
                console.log({x});
                console.log({y});
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
                    AlertHook({message: 'Cannot schedule an ealier pick up time.'});
                    return;
                  }
                }
              }

              const formattedDate = SCHEDULESB.find((date) => {
                return date.label === scheduledDate;
              });

              const formattedTime = SCHEDULES.find((date) => {
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
          <View style={{height: 10}} />
        </BottomSheetView>
      </BottomSheet>
      <BottomSheet
        ref={storesBottomSheetRef}
        index={0}
        snapPoints={storesSnapPoints}
        handleComponent={() => (
          <View
            style={{
              height: 25,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
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
          <Text style={{fontFamily: FONT.BOLD}}>Select Establishment Type</Text>
          <View style={{height: 10}} />
          <WhiteButton
            label="Bakery"
            borderless
            labelStyle={{color: COLOR.BLACK, fontFamily: FONT.REGULAR}}
            onPress={() => {
              storesBottomSheetRef.current.snapTo(0);
              pushToNearbyStores({
                label: 'Bakery',
                plural: 'Bakeries',
                placeType: 'bakery',
                coordinates: userCoordinates,
              });
            }}
          />
          <View style={{borderBottomWidth: 1, borderBottomColor: COLOR.LIGHT}} />
          <WhiteButton
            label="Cafe"
            borderless
            labelStyle={{color: COLOR.BLACK, fontFamily: FONT.REGULAR}}
            onPress={() => {
              storesBottomSheetRef.current.snapTo(0);
              pushToNearbyStores({
                label: 'Cafe',
                plural: 'Cafes',
                placeType: 'cafe',
                coordinates: userCoordinates,
              });
            }}
          />
          <View style={{borderBottomWidth: 1, borderBottomColor: COLOR.LIGHT}} />
          <WhiteButton
            label="Convenience Store"
            borderless
            labelStyle={{color: COLOR.BLACK, fontFamily: FONT.REGULAR}}
            onPress={() => {
              storesBottomSheetRef.current.snapTo(0);
              pushToNearbyStores({
                label: 'Convenience Store',
                plural: 'Convenience Stores',
                placeType: 'convenience_store',
                coordinates: userCoordinates,
              });
            }}
          />
          <View style={{borderBottomWidth: 1, borderBottomColor: COLOR.LIGHT}} />
          <WhiteButton
            label="Hardware Store"
            borderless
            labelStyle={{color: COLOR.BLACK, fontFamily: FONT.REGULAR}}
            onPress={() => {
              pushToNearbyStores({
                label: 'Hardware Store',
                plural: 'Hardware Stores',
                placeType: 'hardware_store',
                coordinates: userCoordinates,
              });
            }}
          />
          <View style={{borderBottomWidth: 1, borderBottomColor: COLOR.LIGHT}} />
          <WhiteButton
            label="Pharmacy"
            borderless
            labelStyle={{color: COLOR.BLACK, fontFamily: FONT.REGULAR}}
            onPress={() => {
              storesBottomSheetRef.current.snapTo(0);
              pushToNearbyStores({
                label: 'Pharmacy',
                plural: 'Pharmacies',
                placeType: 'pharmacy',
                coordinates: userCoordinates,
              });
            }}
          />
          <View style={{borderBottomWidth: 1, borderBottomColor: COLOR.LIGHT}} />
          <WhiteButton
            label="Restaurant"
            borderless
            labelStyle={{color: COLOR.BLACK, fontFamily: FONT.REGULAR}}
            onPress={() => {
              storesBottomSheetRef.current.snapTo(0);
              pushToNearbyStores({
                label: 'Restaurant',
                plural: 'Restaurants',
                placeType: 'restaurant',
                coordinates: userCoordinates,
              });
            }}
          />
          <View style={{borderBottomWidth: 1, borderBottomColor: COLOR.LIGHT}} />
          <WhiteButton
            label="Supermarket"
            borderless
            labelStyle={{color: COLOR.BLACK, fontFamily: FONT.REGULAR}}
            onPress={() => {
              storesBottomSheetRef.current.snapTo(0);
              pushToNearbyStores({
                label: 'Supermarket',
                plural: 'Supermarkets',
                placeType: 'supermarket',
                coordinates: userCoordinates,
              });
            }}
          />

          <View style={{height: 10}} />
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(Pabili);

const styles = StyleSheet.create({
  label: {
    // fontSize: 14,
    // fontFamily: FONTS.REGULAR,
  },
  menuIcon: {
    height: 50,
    width: 50,
    resizeMode: 'contain',
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
});
