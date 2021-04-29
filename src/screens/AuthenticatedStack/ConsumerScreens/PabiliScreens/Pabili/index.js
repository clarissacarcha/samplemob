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
} from 'react-native';
import ContentLoader from 'react-native-easy-content-loader';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import moment from 'moment';
import {COLOR, COLORS, FONTS, NUMBERS, SIZES} from '../../../../../res/constants';
import {WhiteButton, BlackButton, ORANGE, VectorIcon, Shadow, ICON_SET} from '../../../../../revamp';

import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from '@gorhom/bottom-sheet';
import ScrollPicker from 'react-native-wheel-scrollview-picker';

import SMIcon from '../../../../../assets/toktok/dummy/SM.png';

//SELF IMPORTS
import SenderRecipientCard from './SenderRecipientCard';
import DeliveryScheduleFormButton from './DeliveryScheduleFormButton';
import NearbyStores from './NearbyStores';

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

const Pabili = ({navigation, session}) => {
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
  const [orderData, setOrderData] = useState(INITIAL_ORDER_DATA);

  const onSenderConfirm = (value, nav) => {
    setOrderData({
      ...orderData,
      senderStop: value,
    });

    nav.pop();
    nav.push('PabiliDetails', {
      orderData: {
        ...orderData,
        senderStop: value,
      },
      setOrderData,
    });
  };

  const onRecipientConfirm = (value, nav) => {
    setOrderData({
      ...orderData,
      recipientStop: [value],
    });
    nav.pop();
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
  const [scheduledAt, setScheduledAt] = useState(null);
  const [formattedScheduledAt, setFormattedScheduledAt] = useState('ASAP');
  const [scheduledDate, setScheduledDate] = useState('Today');
  const [scheduledTime, setScheduledTime] = useState('Anytime');
  const [userCoordinates, setUserCoordinates] = useState(null);

  const bottomSheetRef = useRef();
  const storesBottomSheetRef = useRef();

  const snapPoints = useMemo(() => [0, 130, 345], []);
  const storesSnapPoints = useMemo(() => [0, 440], []);

  const pushToNearbyStores = ({label, placeType}) => {
    navigation.push('NearbyStores', {label, placeType});
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{backgroundColor: COLORS.YELLOW, height: 220}} />

        <View style={{height: 20, marginTop: -150}} />
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
                justifyContent: 'center',
                backgroundColor: 'white',
                borderRadius: NUMBERS.BORDER_RADIUS,
                paddingHorizontal: 20,
              }}>
              <Text>Pick Up Time: ASAP </Text>
            </View>
          </TouchableHighlight>
        </Shadow>

        {/* <DeliveryScheduleFormButton /> */}
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
        />
        <View style={{height: 20}} />
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
                justifyContent: 'center',
                backgroundColor: 'white',
                borderRadius: NUMBERS.BORDER_RADIUS,
                paddingHorizontal: 20,
              }}>
              <Text>Nearby Stores</Text>
            </View>
          </TouchableHighlight>
        </Shadow>
        {/* <NearbyStores userCoordinates={userCoordinates} /> */}

        {/* <Text>{JSON.stringify(orderData.recipientStop, null, 4)}</Text> */}
        {/* <Shadow style={{marginHorizontal: NUMBERS.MARGIN_HORIZONTAL, borderRadius: NUMBERS.BORDER_RADIUS}}>
          <View
            style={{
              flexDirection: 'row',
              height: 140,
              borderRadius: NUMBERS.BORDER_RADIUS,
              backgroundColor: 'white',
            }}>
            <View style={{width: 50, alignItems: 'center', paddingVertical: 20}}>
              <VectorIcon iconSet={ICON_SET.FontAwesome5} name="map-pin" color={COLORS.YELLOW} size={22} />
              <View
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  marginVertical: 5,
                }}>
                <View style={{height: 4, width: 4, backgroundColor: COLORS.LIGHT, borderRadius: 4, marginBottom: 4}} />
                <View style={{height: 4, width: 4, backgroundColor: COLORS.LIGHT, borderRadius: 4, marginBottom: 4}} />
                <View style={{height: 4, width: 4, backgroundColor: COLORS.LIGHT, borderRadius: 4, marginBottom: 4}} />
                <View style={{height: 4, width: 4, backgroundColor: COLORS.LIGHT, borderRadius: 4, marginBottom: 4}} />
                <View style={{height: 4, width: 4, backgroundColor: COLORS.LIGHT, borderRadius: 4, marginBottom: 4}} />
                <View style={{height: 4, width: 4, backgroundColor: COLORS.LIGHT, borderRadius: 4, marginBottom: 4}} />
                <View style={{height: 4, width: 4, backgroundColor: COLORS.LIGHT, borderRadius: 4, marginBottom: 4}} />
                <View style={{height: 4, width: 4, backgroundColor: COLORS.LIGHT, borderRadius: 4, marginBottom: 4}} />
              </View>
              <VectorIcon iconSet={ICON_SET.FontAwesome5} name="map-marker-alt" color={COLORS.ORANGE} size={22} />
            </View>
            <View style={{flex: 1, justifyContent: 'center', marginRight: 10}}>
              <TouchableHighlight
                onPress={() => {}}
                style={{borderRadius: NUMBERS.BORDER_RADIUS, paddingHorizontal: 10, marginLeft: -10}}
                underlayColor={COLORS.TRANSPARENT_YELLOW}>
                <View style={{height: 50, justifyContent: 'center'}}>
                  {orderData.senderStop.formattedAddress ? (
                    <>
                      {' '}
                      <Text>Alvir Marquez</Text>
                      <Text numberOfLines={1}>10F Inoza Tower, 40th Street, Bonifacio Global City</Text>
                    </>
                  ) : (
                    <Text style={{color: COLORS.MEDIUM}}>Where should we start off from?</Text>
                  )}
                </View>
              </TouchableHighlight>
              <View
                style={{borderBottomWidth: 1, borderColor: COLORS.TRANSPARENT_GRAY, marginVertical: 10, marginLeft: -5}}
              />
              <TouchableHighlight
                onPress={searchRecipientAddress}
                style={{borderRadius: NUMBERS.BORDER_RADIUS, paddingHorizontal: 10, marginLeft: -10}}
                underlayColor={COLORS.TRANSPARENT_YELLOW}>
                <View style={{height: 50, justifyContent: 'center'}}>
                  <View style={{marginHorizontal: -10}}>
                    <ContentLoader
                      active
                      pRows={2}
                      pWidth={['40%', '100%']}
                      title={false}
                      primaryColor="rgba(256,186,28,0.2)"
                      secondaryColor="rgba(256,186,28,0.4)"
                    />
                  </View>
                  <Text>Juan dela Cruz</Text>
                  <Text numberOfLines={1}>10F Inoza Tower, 40th Street, Bonifacio Global City</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </Shadow> */}
        {/* <View
          style={{
            height: 100,
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <MenuIcon label={'SM Supermalls'} icon={SMIcon} onPress={() => {}} />
          <MenuIcon label={'SM Supermalls'} icon={SMIcon} onPress={() => {}} />
          <MenuIcon label={'SM Supermalls'} icon={SMIcon} onPress={() => {}} />
          <MenuIcon label={'SM Supermalls'} icon={SMIcon} onPress={() => {}} />
        </View> */}
        {/* <View style={{height: 250, justifyContent: 'space-evenly', paddingHorizontal: 20}}>
          <WhiteButton onPress={() => {}} />
          <WhiteButton onPress={() => {}} />
          <TouchableHighlight onPress={() => {}} style={{borderRadius: 10}} underlayColor={COLORS.TRANSPARENT_YELLOW}>
            <View style={{height: 50, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text>Hello</Text>
              <TouchableHighlight
                onPress={() => console.log('PRESS')}
                style={{borderRadius: 10, height: 50, width: 50, justifyContent: 'center', alignItems: 'center'}}
                underlayColor={COLORS.TRANSPARENT_YELLOW}>
                <VectorIcon iconSet={ICON_SET.Material} name="gps-fixed" color={COLORS.DARK} size={20} />
              </TouchableHighlight>
            </View>
          </TouchableHighlight>
        </View> */}
        {/* <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
          renderTabBar={renderTabBar}
          render
        /> */}
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
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
              highlightColor={COLORS.LIGHT}
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
              highlightColor={COLORS.LIGHT}
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
          <Text>Nearby Stores</Text>
          <View style={{height: 10}} />
          <WhiteButton
            label="Bakery"
            borderless
            onPress={() => {
              pushToNearbyStores({
                label: 'Bakery',
                placeType: 'bakery',
              });
            }}
          />
          <WhiteButton
            label="Cafe"
            borderless
            onPress={() => {
              pushToNearbyStores({
                label: 'Cafe',
                placeType: 'cafe',
              });
            }}
          />
          <WhiteButton
            label="Convenience Store"
            borderless
            onPress={() => {
              pushToNearbyStores({
                label: 'Convenience Store',
                placeType: 'convenience_store',
              });
            }}
          />
          <WhiteButton
            label="Drugstore"
            borderless
            onPress={() => {
              pushToNearbyStores({
                label: 'Drugstore',
                placeType: 'drugstore',
              });
            }}
          />
          <WhiteButton
            label="Hardware Store"
            borderless
            onPress={() => {
              pushToNearbyStores({
                label: 'Hardware Store',
                placeType: 'hardware_store',
              });
            }}
          />
          <WhiteButton
            label="Restaurant"
            borderless
            onPress={() => {
              pushToNearbyStores({
                label: 'Restaurant',
                placeType: 'restaurant',
              });
            }}
          />
          <WhiteButton
            label="Shopping Mall"
            borderless
            onPress={() => {
              pushToNearbyStores({
                label: 'Shopping Mall',
                placeType: 'shopping_mall',
              });
            }}
          />
          <WhiteButton
            label="Supermarket"
            borderless
            onPress={() => {
              pushToNearbyStores({
                label: 'Supermarket',
                placeType: 'supermarket',
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
  menuBox: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  menuButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.REGULAR,
  },
  menuIconBox: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.TRANSPARENT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  menuIcon: {
    height: 50,
    width: 50,
    resizeMode: 'contain',
  },
  contentContainer: {
    paddingHorizontal: 10,
  },
});

// const MenuIcon = ({label, icon, onPress}) => {
//   return (
//     <TouchableOpacity style={styles.menuButton} onPress={onPress}>
//       <View style={styles.menuIconBox}>
//         <Image style={styles.menuIcon} source={icon} />
//       </View>
//       <Text style={styles.label}>{label}</Text>
//     </TouchableOpacity>
//   );
// };

// const NEARBY_DATA = [
//   {label: 'One'},
//   {label: 'Two'},
//   {label: 'Three'},
//   {label: 'Four'},
//   {label: 'Five'},
//   {label: 'Six'},
//   {label: 'Seven'},
//   {label: 'Eight'},
//   {label: 'Nine'},
//   {label: 'Ten'},
// ];

// const renderNearBy = ({item, index}) => {
//   return (
//     <TouchableHighlight
//       onPress={() => {}}
//       style={{
//         height: 50,
//         justifyContent: 'center',
//         marginHorizontal: 10,
//         borderRadius: 5,
//         paddingHorizontal: 10,
//         borderBottomWidth: 1,
//         borderColor: COLORS.TRANSPARENT_GRAY,
//       }}
//       underlayColor={COLORS.TRANSPARENT_YELLOW}>
//       <View>
//         <Text style={{fontFamily: FONTS.REGULAR}}>{item.label}</Text>
//       </View>
//     </TouchableHighlight>
//   );
// };

// const FirstRoute = () => (
//   <View style={{flex: 1, backgroundColor: COLORS.WHITE}}>
//     <FlatList data={NEARBY_DATA} renderItem={renderNearBy} showsVerticalScrollIndicator={false} />
//   </View>
// );

// const SecondRoute = () => (
//   <View style={{flex: 1, backgroundColor: COLORS.WHITE}}>
//     <FlatList data={NEARBY_DATA} renderItem={renderNearBy} showsVerticalScrollIndicator={false} />
//   </View>
// );
// const ThirdRoute = () => (
//   <View style={{flex: 1, backgroundColor: COLORS.WHITE}}>
//     <FlatList data={NEARBY_DATA} renderItem={renderNearBy} showsVerticalScrollIndicator={false} />
//   </View>
// );

// const layout = useWindowDimensions();

// const [index, setIndex] = React.useState(0);
// const [routes] = React.useState([
//   {key: 'first', title: 'All'},
//   {key: 'second', title: 'Grocery'},
//   {key: 'third', title: 'Pharmacy'},
// ]);

// const renderScene = SceneMap({
//   first: FirstRoute,
//   second: SecondRoute,
//   third: ThirdRoute,
// });

// const renderTabBar = (props) => (
//   <TabBar
//     {...props}
//     indicatorStyle={{backgroundColor: COLORS.YELLOW}}
//     style={{backgroundColor: 'white'}}
//     renderLabel={({route, focused, color}) => (
//       <Text style={{fontFamily: FONTS.REGULAR, fontSize: SIZES.M}}>{route.title} (10)</Text>
//     )}
//   />
// );
