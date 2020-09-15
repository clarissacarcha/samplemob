import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Image,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  BackHandler,
  Linking,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
// import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useQuery, useLazyQuery} from '@apollo/react-hooks';
import {connect} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';
import InputScrollView from 'react-native-input-scroll-view';
import {COLOR, MEDIUM, FONT_FAMILY, DARK, ORANGE, LIGHT} from '../../../../res/constants';
import {DeliveryCard, DriverGoOnlineButton, SomethingWentWrong} from '../../../../components';
import {BlackButton} from '../../../../components/ui';
import {GET_DELIVERIES_AVAILABLE} from '../../../../graphql';
import {currentLocation} from '../../../../helper';

import LocationRequest from '../../../../assets/images/LocationRequest.png';
import NoData from '../../../../assets/images/NoData.png';
import GoOnline from '../../../../assets/images/GoOnline.png';

import FAIcon from 'react-native-vector-icons/FontAwesome';

const imageWidth = Dimensions.get('window').width - 200;
const largeImageWidth = Dimensions.get('window').width - 40;
const INITIAL_LOCATION = {latitude: null, longitude: null};

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

  const [orderDate, setOrderDate] = useState(searchFilter.orderDate == null ? 'AllValue' : searchFilter.orderDate);
  const [senderName, setSenderName] = useState(searchFilter.senderName);
  const [recipientName, setRecipientName] = useState(searchFilter.recipientName);

  const onClear = () => {
    setSearchFilter({
      orderDate: null,
      senderName: '',
      recipientName: '',
    });

    onSearchPress({
      filter: {
        orderDate: null,
        senderName: '',
        recipientName: '',
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
    });

    onSearchPress({
      filter: {
        orderDate: orderDate == 'AllValue' ? null : orderDate,
        senderName,
        recipientName,
      },
    });

    setIsSearching(false);
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
                onChangeText={value => {
                  setSenderName(value);
                }}
                style={styles.input}
                placeholder="Sender's name"
                placeholderTextColor={LIGHT}
                returnKeyType="next"
              />

              <Text style={styles.label}>Recipeint's name</Text>
              <TextInput
                value={recipientName}
                onChangeText={value => {
                  setRecipientName(value);
                }}
                style={styles.input}
                placeholder="Recipeint's name"
                placeholderTextColor={LIGHT}
                returnKeyType="next"
              />
              <View style={{height: 100}} />
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

          <Text style={{fontWeight: 'bold', color: MEDIUM, marginTop: 20}}>To view and accept orders, Go Online.</Text>
        </View>
      </>
    );
  }
  const [location, setLocation] = useState(INITIAL_LOCATION);
  const [noGPS, setNoGPS] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFilter, setSearchFilter] = useState({
    orderDate: null,
    senderName: '',
    recipientName: '',
  });

  const [getDeliveriesAvailable, {data = {getDeliveriesAvailable: []}, loading, error}] = useLazyQuery(
    GET_DELIVERIES_AVAILABLE,
    {
      fetchPolicy: 'network-only',
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
        // setLocation(detectedLocation);
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
          },
        },
      });
      setManualLoading(false);
    } else {
      setNoGPS(true);
      setManualLoading(false);
    }
  };

  const retryFromNoGPS = async () => {
    // try {
    //   setNoGPS(false);
    //   const detectedLocation = await currentLocation({
    //     showsReverseGeocode: false,
    //   });
    //   if (detectedLocation) {
    //     setLocation(detectedLocation);
    //     refetch();
    //   } else {
    //     setNoGPS(true);
    //   }
    // } catch (e) {
    //   setLocation(INITIAL_LOCATION);
    // }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useFocusEffect(() => {
    // refetch();
  }, []);

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

          <Text style={{fontWeight: 'bold', color: MEDIUM, marginTop: 20}}>
            Ka-toktok, please turn on your GPS/Location Service.
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              color: MEDIUM,
            }}>{`You can find it under your phone's Settings > Location`}</Text>
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
          <Image source={NoData} style={styles.image} resizeMode={'contain'} />
        </View>
      </>
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
        keyExtractor={item => item.id}
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
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
  constants: state.constants,
});

export default connect(
  mapStateToProps,
  null,
)(AvailableOrders);

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
    fontFamily: FONT_FAMILY,
    fontWeight: 'bold',
  },
  outer: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
