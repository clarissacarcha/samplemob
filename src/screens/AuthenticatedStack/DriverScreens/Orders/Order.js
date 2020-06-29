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
} from 'react-native';
import {useQuery} from '@apollo/react-hooks';
import {connect} from 'react-redux';
import {COLOR, MEDIUM, FONT_FAMILY, DARK, ORANGE} from '../../../../res/constants';
import {DeliveryCard} from '../../../../components';
import {GET_ORDERS} from '../../../../graphql';
import NoData from '../../../../assets/images/NoData.png';
import {currentLocation} from '../../../../helper';

import FAIcon from 'react-native-vector-icons/FontAwesome';

import BackgroundTimer from 'react-native-background-timer';

BackgroundTimer.runBackgroundTimer(() => {
  console.log('BACKGROUND');
}, 3000);

const imageWidth = Dimensions.get('window').width - 200;

const OrderTabHeader = ({label, onGoOnlineOffline}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.outer}>
        {label[0]}
        <Text style={styles.inner}> {label[1]}</Text>
      </Text>

      <TouchableHighlight onPress={onGoOnlineOffline} underlayColor={COLOR} style={styles.submitBox}>
        <View style={styles.submit}>
          <Text style={{color: COLOR, fontSize: 16, fontWeight: 'bold'}}>Go Online</Text>
        </View>
      </TouchableHighlight>

      {/* <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 20}}>
        <Text style={{fontSize: 18, color: DARK, marginRight: 10, fontWeight: 'bold'}}>(0/2)</Text>
        <FAIcon
          name="question-circle"
          size={20}
          color={MEDIUM}
          onPress={() =>
            Alert.alert(
              'Maximum Ongoing Deliveries',
              'The maximum order of ongoing deliveries you can have at any point in time.',
            )
          }
        />
      </View> */}
    </View>
  );
};

const Order = ({navigation, session}) => {
  const INITIAL_LOCATION = {latitude: null, longitude: null};

  const [location, setLocation] = useState(INITIAL_LOCATION);

  const getLocation = async () => {
    try {
      setLocation(await currentLocation(false));
    } catch (e) {
      console.warn(e);
      setLocation(INITIAL_LOCATION);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const onGoOnlineOffline = () => {
    //
  };

  const {data, loading, error, refetch} = useQuery(GET_ORDERS, {
    fetchPolicy: 'network-only',
    variables: {
      filter: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    },
    onError: e => {
      console.log(e);
    },
  });

  if (loading) {
    return (
      <>
        <OrderTabHeader label={['', 'Orders']} onGoOnlineOffline={onGoOnlineOffline} />
        <View style={styles.center}>
          <ActivityIndicator size={24} color={COLOR} />
        </View>
      </>
    );
  }

  if (error) {
    return (
      <>
        <OrderTabHeader label={['', 'Orders']} onGoOnlineOffline={onGoOnlineOffline} />
        <View style={styles.center}>
          <Text>Something went wrong...</Text>
        </View>
      </>
    );
  }

  if (data.getNearestOrderAvailable.length === 0) {
    return (
      <>
        <OrderTabHeader label={['', 'Orders']} onGoOnlineOffline={onGoOnlineOffline} />
        <View style={styles.center}>
          <Image source={NoData} style={styles.image} resizeMode={'contain'} />
        </View>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <OrderTabHeader label={['', 'Orders']} onGoOnlineOffline={onGoOnlineOffline} />
      <FlatList
        data={data.getNearestOrderAvailable}
        keyExtractor={item => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} colors={[COLOR]} tintColor={COLOR} />}
        renderItem={({item, index}) => (
          <DeliveryCard
            delivery={item}
            onPress={() => navigation.push('SelectedDriverDelivery', {delivery: item, label: ['View', 'Order']})}
            lastItem={data.getNearestOrderAvailable.length == index + 1 ? true : false}
          />
        )}
      />
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
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
