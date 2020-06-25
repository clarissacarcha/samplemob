import React, {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator, FlatList, RefreshControl, Image, StyleSheet, Dimensions} from 'react-native';
import {useQuery} from '@apollo/react-hooks';
import {connect} from 'react-redux';
import {COLOR, MEDIUM, FONT_FAMILY} from '../../../../res/constants';
import {DeliveryCard, HeaderBack, HeaderTitle} from '../../../../components';
import {GET_ORDERS} from '../../../../graphql';
import NoData from '../../../../assets/images/NoData.png';
import {currentLocation} from '../../../../helper';

const imageWidth = Dimensions.get('window').width - 200;

const Order = ({navigation, session}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Available', 'Orders']} />,
  });

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
      <View style={styles.center}>
        <ActivityIndicator size={24} color={COLOR} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Something went wrong...</Text>
      </View>
    );
  }

  if (data.getNearestOrderAvailable.length === 0) {
    return (
      <View style={styles.center}>
        <Image source={NoData} style={styles.image} resizeMode={'contain'} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
});
