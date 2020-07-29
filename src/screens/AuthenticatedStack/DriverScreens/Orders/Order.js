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
  Alert,
  BackHandler,
  Linking,
} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useQuery, useLazyQuery} from '@apollo/react-hooks';
import {connect} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {COLOR, MEDIUM, FONT_FAMILY, DARK, ORANGE} from '../../../../res/constants';
import {DeliveryCard, DriverGoOnlineButton, SomethingWentWrong} from '../../../../components';
import {GET_ORDERS} from '../../../../graphql';
import {currentLocation} from '../../../../helper';

import LocationRequest from '../../../../assets/images/LocationRequest.png';
import NoData from '../../../../assets/images/NoData.png';
import GoOnline from '../../../../assets/images/GoOnline.png';

const imageWidth = Dimensions.get('window').width - 200;
const largeImageWidth = Dimensions.get('window').width - 40;
const INITIAL_LOCATION = {latitude: null, longitude: null};

const OrderTabHeader = ({label}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.outer}>
        {label[0]}
        <Text style={styles.inner}> {label[1]}</Text>
      </Text>

      <DriverGoOnlineButton />
    </View>
  );
};

const Order = ({navigation, session, constants}) => {
  if (!session.user.driver.isOnline) {
    return (
      <>
        <OrderTabHeader label={['Available', 'Orders']} />
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

  // const {data, loading, error, refetch} = useQuery(GET_ORDERS, {
  //   fetchPolicy: 'network-only',
  //   variables: {
  //     filter: {
  //       latitude: location.latitude,
  //       longitude: location.longitude,
  //     },
  //   },
  // });

  const [getOrders, {data = {getNearestOrderAvailable: []}, loading, error}] = useLazyQuery(GET_ORDERS, {
    fetchPolicy: 'network-only',
  });

  const getLocation = async () => {
    try {
      console.log('FETCHING...');
      setManualLoading(true);
      setNoGPS(false);
      const detectedLocation = await currentLocation({
        showsReverseGeocode: false,
      });

      if (detectedLocation) {
        getOrders({
          variables: {
            filter: {
              latitude: detectedLocation.latitude,
              longitude: detectedLocation.longitude,
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
        <OrderTabHeader label={['Available', 'Orders']} />
        <View style={styles.center}>
          <ActivityIndicator size={24} color={COLOR} />
        </View>
      </>
    );
  }

  if (error) {
    return (
      <>
        <OrderTabHeader label={['Available', 'Orders']} />
        <SomethingWentWrong />
      </>
    );
  }

  if (noGPS) {
    return (
      <>
        <OrderTabHeader label={['Available', 'Orders']} />
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

  if (data.getNearestOrderAvailable.length === 0) {
    return (
      <>
        <OrderTabHeader label={['Available', 'Orders']} />
        <View style={styles.center}>
          <Image source={NoData} style={styles.image} resizeMode={'contain'} />
        </View>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <OrderTabHeader label={['Available', 'Orders']} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data.getNearestOrderAvailable}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getLocation} colors={[COLOR]} tintColor={COLOR} />
        }
        renderItem={({item, index}) => (
          <DeliveryCard
            delivery={item}
            onPress={() => navigation.push('SelectedDriverDelivery', {delivery: item, label: ['Delivery', 'Details']})}
            lastItem={data.getNearestOrderAvailable.length == index + 1 ? true : false}
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
)(Order);

const styles = StyleSheet.create({
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
});
