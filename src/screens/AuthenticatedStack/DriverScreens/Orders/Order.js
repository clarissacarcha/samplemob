import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {COLOR, COLOR_UNDERLAY, DARK, LIGHT, MAP_DELTA, MEDIUM, ORANGE} from '../../../../res/constants';
import {DeliveryCard, DriverGoOnlineButton, SomethingWentWrong} from '../../../../components';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import React, {useEffect, useState} from 'react';
import {useLazyQuery} from '@apollo/react-hooks';

import {BlackButton} from '../../../../components/ui';
import DropDownPicker from 'react-native-dropdown-picker';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import {GET_DELIVERIES_AVAILABLE} from '../../../../graphql';
import GoOnline from '../../../../assets/images/GoOnline.png';
import InputScrollView from 'react-native-input-scroll-view';
import LocationRequest from '../../../../assets/images/LocationRequest.png';
import NoData from '../../../../assets/images/NoData.png';
import {connect} from 'react-redux';
import {currentLocation} from '../../../../helper';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';

const imageWidth = Dimensions.get('window').width - 200;
const largeImageWidth = Dimensions.get('window').width - 40;
const INITIAL_LOCATION = {latitude: null, longitude: null};

// Region for Philippine Map
const INITIAL_REGION = {
  latitude: 11.22309004847093,
  latitudeDelta: 19.887065883877668,
  longitude: 121.97818368673325,
  longitudeDelta: 10.145791545510278,
};

const createDays = () => {
  const output = [
    {
      label: 'All',
      value: 'AllValue',
    },
  ];

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
  // console.log(JSON.stringify(output, null, 4));
  return output;
};

const OrderTabHeader = ({label, setIsSearching, isOnline}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.outer}>
        {label[0]}
        <Text style={styles.inner}> {label[1]}</Text>
      </Text>

      <DriverGoOnlineButton />
      {!isOnline && <View style={{width: 20}} />}
      {isOnline && (
        <TouchableOpacity onPress={() => setIsSearching(true)} style={{height: '100%', justifyContent: 'center'}}>
          <FAIcon name="search" color={COLOR} style={{marginHorizontal: 20}} size={20} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const SearchOverlay = ({visible, setIsSearching, onSearchPress, searchFilter, setSearchFilter}) => {
  const daySchedules = createDays();

  const navigation = useNavigation();
  const [orderDate, setOrderDate] = useState(searchFilter.orderDate == null ? 'AllValue' : searchFilter.orderDate);
  const [senderName, setSenderName] = useState(searchFilter.senderName);
  const [recipientName, setRecipientName] = useState(searchFilter.recipientName);
  const [locationFilter, setLocationFilter] = useState(searchFilter.location);

  const onClear = () => {
    setSearchFilter({
      orderDate: null,
      senderName: '',
      recipientName: '',
      location: '',
    });

    onSearchPress({
      filter: {
        orderDate: null,
        senderName: '',
        recipientName: '',
        location: '',
      },
    });

    setIsSearching(false);
  };

  const onCancel = () => {
    setIsSearching(false);
  };

  const onSearch = () => {
    setSearchFilter({
      orderDate: orderDate == 'AllValue' ? null : orderDate,
      senderName,
      recipientName,
      location: locationFilter,
    });

    onSearchPress({
      filter: {
        orderDate: orderDate == 'AllValue' ? null : orderDate,
        senderName,
        recipientName,
        location: locationFilter,
      },
    });

    setIsSearching(false);
  };

  const onSelectLocationCallback = (value) => {
    setLocationFilter(value);
    setIsSearching(true);
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.transparent}>
          <InputScrollView showsVerticalScrollIndicator={false} keyboardOffset={20}>
            <View
              style={{
                marginHorizontal: 20,
                marginVertical: 70,
                backgroundColor: 'white',
                flex: 1,
                borderRadius: 10,
                padding: 20,
              }}>
              <Text style={[styles.label, {marginTop: 0}]}>Delivery day</Text>
              <DropDownPicker
                defaultValue={orderDate}
                items={daySchedules}
                containerStyle={styles.pickerContainerStyle}
                style={styles.pickerStyle}
                dropDownStyle={styles.pickerDropDown}
                arrowColor={COLOR}
                labelStyle={{justifyContent: 'flex-start'}}
                itemStyle={{marginLeft: 10}}
                activeItemStyle={{alignItems: 'flex-start'}}
                // zIndex={1000}
                dropDownMaxHeight={350}
                isVisible={false}
                // onOpen={() => {
                //   onOpenPicker({day: true});
                // }}
                onChangeItem={({value}) => {
                  // setVisibility(INITIAL_VISIBILITY);
                  // setScheduledDay(value);
                  setOrderDate(value);
                }}
              />

              <Text style={styles.label}>Sender's name</Text>
              <TextInput
                value={senderName}
                onChangeText={(value) => {
                  setSenderName(value);
                }}
                style={styles.input}
                placeholder="Sender's name"
                placeholderTextColor={LIGHT}
                returnKeyType="next"
              />

              <Text style={styles.label}>Recipient's name</Text>
              <TextInput
                value={recipientName}
                onChangeText={(value) => {
                  setRecipientName(value);
                }}
                style={styles.input}
                placeholder="Recipient's name"
                placeholderTextColor={LIGHT}
                returnKeyType="next"
              />
              <Text style={styles.label}>Location</Text>
              <TouchableHighlight
                onPress={() => {
                  navigation.navigate('SearchLocationFilter', {
                    setLocationFilter,
                    onSelectLocationCallback,
                    setIsSearching,
                  });
                  setIsSearching(false);
                }}
                underlayColor={COLOR_UNDERLAY}
                style={{borderRadius: 10}}>
                <View style={[styles.input, {justifyContent: 'center'}]}>
                  <Text>{locationFilter === '' ? 'Search Location' : locationFilter}</Text>
                </View>
              </TouchableHighlight>

              <View style={{height: 20}} />

              <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                <BlackButton onPress={onClear} label="Clear" containerStyle={{margin: 0, flex: 1}} />
                <View style={{width: 20}} />
                <BlackButton onPress={onCancel} label="Cancel" containerStyle={{margin: 0, flex: 1}} />
                <View style={{width: 20}} />

                <BlackButton onPress={onSearch} label="Search" containerStyle={{margin: 0, flex: 1}} />
              </View>
            </View>
          </InputScrollView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const AvailableOrders = ({navigation, session, constants}) => {
  const [showMapView, setShowMapView] = useState(false);
  const [location, setLocation] = useState(INITIAL_LOCATION);
  const [noGPS, setNoGPS] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFilter, setSearchFilter] = useState({
    orderDate: null,
    senderName: '',
    recipientName: '',
    location: '',
  });

  const [getDeliveriesAvailable, {data = {getDeliveriesAvailable: []}, loading, error}] = useLazyQuery(
    GET_DELIVERIES_AVAILABLE,
    {
      fetchPolicy: 'no-cache',
    },
  );

  const getLocation = async () => {
    try {
      console.log('FETCHING...');
      setManualLoading(true);
      setNoGPS(false);
      const detectedLocation = await currentLocation({
        showsReverseGeocode: false,
      });

      if (detectedLocation) {
        getDeliveriesAvailable({
          variables: {
            filter: {
              latitude: detectedLocation.latitude,
              longitude: detectedLocation.longitude,
              orderDate: searchFilter.orderDate,
              senderName: searchFilter.senderName,
              recipientName: searchFilter.recipientName,
            },
          },
        });
        setLocation(detectedLocation);
        setManualLoading(false);
      } else {
        setNoGPS(true);
        setManualLoading(false);
      }
    } catch (e) {
      setManualLoading(false);

      setLocation(INITIAL_LOCATION);
    }
  };

  const onSearchPress = async ({filter}) => {
    console.log('FETCHING FROM SEARCH...');

    setManualLoading(true);
    setNoGPS(false);
    const detectedLocation = await currentLocation({
      showsReverseGeocode: false,
    });

    if (detectedLocation) {
      getDeliveriesAvailable({
        variables: {
          filter: {
            latitude: detectedLocation.latitude,
            longitude: detectedLocation.longitude,
            orderDate: filter.orderDate,
            senderName: filter.senderName,
            recipientName: filter.recipientName,
            location: filter.location,
          },
        },
      });
      setManualLoading(false);
    } else {
      setNoGPS(true);
      setManualLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  // useFocusEffect(() => {
  //   // refetch();
  // }, []);

  if (!session.user.driver.isOnline) {
    return (
      <>
        <OrderTabHeader
          label={['Available', 'Orders']}
          setIsSearching={setIsSearching}
          isOnline={session.user.driver.isOnline}
        />
        <View style={styles.center}>
          <Image source={GoOnline} style={styles.imageLarge} resizeMode={'contain'} />

          <Text style={{fontFamily: 'Rubik-Medium', color: MEDIUM, marginTop: 20}}>
            To view and accept orders, Go Online.
          </Text>
        </View>
      </>
    );
  }

  if (loading || manualLoading) {
    return (
      <>
        <OrderTabHeader
          label={['Available', 'Orders']}
          setIsSearching={setIsSearching}
          isOnline={session.user.driver.isOnline}
        />
        <View style={styles.center}>
          <ActivityIndicator size={24} color={COLOR} />
        </View>
      </>
    );
  }

  if (error) {
    return (
      <>
        <OrderTabHeader label={['Available', 'Orders']} setIsSearching={setIsSearching} isOnline={false} />
        <SomethingWentWrong />
      </>
    );
  }

  if (noGPS) {
    return (
      <>
        <OrderTabHeader label={['Available', 'Orders']} setIsSearching={setIsSearching} isOnline={false} />
        <View style={styles.center}>
          <Image source={LocationRequest} style={styles.imageLarge} resizeMode={'contain'} />

          <Text style={{fontFamily: 'Rubik-Medium', color: MEDIUM, marginTop: 20}}>
            Ka-toktok, please turn on your GPS/Location Service.
          </Text>
          <Text
            style={{
              fontFamily: 'Rubik-Medium',
              color: MEDIUM,
            }}>
            {"You can find it under your phone's Settings > Location"}
          </Text>
          <TouchableHighlight onPress={getLocation} underlayColor={COLOR} style={styles.submitBox}>
            <View style={styles.submit}>
              <Text style={{color: COLOR, fontSize: 20}}>Retry</Text>
            </View>
          </TouchableHighlight>
        </View>
      </>
    );
  }

  if (data.getDeliveriesAvailable.length === 0) {
    return (
      <>
        <OrderTabHeader
          label={['Available', 'Orders']}
          setIsSearching={setIsSearching}
          isOnline={session.user.driver.isOnline}
        />
        <SearchOverlay
          visible={isSearching}
          setIsSearching={setIsSearching}
          onSearchPress={onSearchPress}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
        />
        <View style={styles.center}>
          <View>
            <Image source={NoData} style={styles.image} resizeMode={'contain'} />
            <BlackButton onPress={getLocation} label="Refresh" containerStyle={{margin: 20}} />
          </View>
        </View>
      </>
    );
  }

  if (showMapView) {
    const initialRegion =
      location.latitude == null
        ? INITIAL_REGION
        : {
            ...location,
            ...MAP_DELTA,
          };

    // console.log(JSON.stringify(data.getDeliveriesAvailable, null, 4));

    const deliveryMarkers = data.getDeliveriesAvailable.map((delivery) => {
      return (
        <>
          <Marker
            onPress={() =>
              navigation.push('SelectedDriverDelivery', {delivery: delivery, label: ['Delivery', 'Details']})
            }
            coordinate={{
              latitude: delivery.senderStop.latitude,
              longitude: delivery.senderStop.longitude,
            }}>
            <FA5Icon name="map-pin" size={24} color={'green'} />
          </Marker>
          <Marker
            onPress={() =>
              navigation.push('SelectedDriverDelivery', {delivery: delivery, label: ['Delivery', 'Details']})
            }
            coordinate={{
              latitude: delivery.recipientStop.latitude,
              longitude: delivery.recipientStop.longitude,
            }}>
            <FA5Icon name="map-pin" size={24} color={'red'} />
          </Marker>
        </>
      );
    });

    return (
      <View style={{flex: 1}}>
        <OrderTabHeader
          label={['Available', 'Orders']}
          setIsSearching={setIsSearching}
          isOnline={session.user.driver.isOnline}
        />
        <SearchOverlay
          visible={isSearching}
          setIsSearching={setIsSearching}
          onSearchPress={onSearchPress}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
        />
        <View style={{flex: 1}}>
          <MapView provider={PROVIDER_GOOGLE} style={StyleSheet.absoluteFill} initialRegion={initialRegion}>
            <Marker
              coordinate={{
                latitude: initialRegion.latitude,
                longitude: initialRegion.longitude,
              }}>
              <FontistoIcon name="motorcycle" size={24} color={COLOR} />
            </Marker>
            {deliveryMarkers}
          </MapView>
          <View style={{flex: 1}}>
            <TouchableHighlight
              underlayColor={COLOR_UNDERLAY}
              onPress={() => {
                setShowMapView(!showMapView);
              }}
              style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                borderRadius: 25,
              }}>
              <View
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 25,
                  backgroundColor: DARK,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {showMapView ? (
                  <FA5Icon name="list" size={24} color={COLOR} />
                ) : (
                  <FA5Icon name="map" size={24} color={COLOR} />
                )}
              </View>
            </TouchableHighlight>

            <View
              style={{
                position: 'absolute',
                top: 20,
                left: 20,
                borderRadius: 10,
                backgroundColor: LIGHT,
                padding: 10,
              }}>
              <View style={{flexDirection: 'row'}}>
                <FA5Icon name="map-pin" size={16} color={'green'} style={{marginRight: 10}} />
                <Text>Sender</Text>
              </View>
              <View style={{height: 10}} />
              <View style={{flexDirection: 'row'}}>
                <FA5Icon name="map-pin" size={16} color={'red'} style={{marginRight: 10}} />
                <Text>Recipient</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <OrderTabHeader
        label={['Available', 'Orders']}
        setIsSearching={setIsSearching}
        isOnline={session.user.driver.isOnline}
      />
      <SearchOverlay
        visible={isSearching}
        setIsSearching={setIsSearching}
        onSearchPress={onSearchPress}
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data.getDeliveriesAvailable}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getLocation} colors={[COLOR]} tintColor={COLOR} />
        }
        renderItem={({item, index}) => (
          <DeliveryCard
            delivery={item}
            onPress={() => navigation.push('SelectedDriverDelivery', {delivery: item, label: ['Delivery', 'Details']})}
            lastItem={data.getDeliveriesAvailable.length == index + 1 ? true : false}
          />
        )}
      />
      <View style={{flex: 1}}>
        <TouchableHighlight
          underlayColor={COLOR_UNDERLAY}
          onPress={() => {
            setShowMapView(!showMapView);
          }}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            borderRadius: 25,
          }}>
          <View
            style={{
              height: 50,
              width: 50,
              borderRadius: 25,
              backgroundColor: DARK,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {showMapView ? (
              <FA5Icon name="list" size={24} color={COLOR} />
            ) : (
              <FA5Icon name="map" size={24} color={COLOR} />
            )}
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
  constants: state.constants,
});

export default connect(mapStateToProps, null)(AvailableOrders);

const styles = StyleSheet.create({
  transparent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: imageWidth,
    width: imageWidth,
  },
  imageLarge: {
    height: largeImageWidth,
    width: largeImageWidth,
  },
  text: {
    color: MEDIUM,
    marginTop: 20,
    fontFamily: 'Rubik-Medium',
  },
  outer: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Rubik-Medium',
    color: DARK,
  },
  inner: {
    color: ORANGE,
  },
  header: {
    paddingLeft: 14,
    flexDirection: 'row',
    height: 50,
    width: '100%',
    alignItems: 'center',

    backgroundColor: 'white',
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitBox: {
    marginVertical: 20,
    borderRadius: 10,
    marginRight: 20,
  },
  submit: {
    backgroundColor: DARK,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainerStyle: {
    height: 50,
  },
  pickerStyle: {
    backgroundColor: 'white',
    borderColor: MEDIUM,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  pickerDropDown: {
    backgroundColor: 'white',
    width: '100%',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: MEDIUM,
  },
  label: {
    marginTop: 20,
    marginBottom: 5,
    fontSize: 14,
    color: DARK,
    fontFamily: 'Rubik-Medium',
  },
  input: {
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 10,
    paddingLeft: 20,
    height: 50,
    color: DARK,
  },
});
