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
} from 'react-native';
import {useQuery} from '@apollo/react-hooks';
import {connect} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {COLOR, MEDIUM, FONT_FAMILY, DARK, ORANGE} from '../../../../res/constants';
import {DeliveryCard, DriverGoOnlineButton, SomethingWentWrong} from '../../../../components';
import {GET_ORDERS} from '../../../../graphql';
import {currentLocation} from '../../../../helper';

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
  // const onNotificationOpened = ({notification}) => {
  //   type = notification.payload.additionalData.type;

  //   const legend = {
  //     ANNOUNCEMENT: 'Announcements',
  //   };

  //   setTimeout(() => {
  //     navigation.push(legend[type]);
  //   }, 10);
  // };

  // useEffect(() => {
  //   OneSignal.addEventListener('opened', onNotificationOpened);
  // }, []);

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

  const getLocation = async () => {
    try {
      const detectedLocation = await currentLocation({
        showsReverseGeocode: false,
      });

      setLocation(detectedLocation);
    } catch (e) {
      setLocation(INITIAL_LOCATION);
    }
  };

  const {data, loading, error, refetch} = useQuery(GET_ORDERS, {
    fetchPolicy: 'network-only',
    variables: {
      filter: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    },
  });

  useEffect(() => {
    getLocation();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', function() {
      return true;
    });
    return () => {
      backHandler.remove();
    };
  }, []);

  useFocusEffect(() => {
    refetch();
  }, []);

  if (loading) {
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
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} colors={[COLOR]} tintColor={COLOR} />}
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
