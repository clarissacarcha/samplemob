import React, {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator, FlatList, RefreshControl, Image, StyleSheet} from 'react-native';
import {useQuery} from '@apollo/react-hooks';
import {connect} from 'react-redux';
import {COLOR, MEDIUM, FONT_FAMILY} from '../../../res/constants';
import {BookingInfoCard, DeliveryCard} from '../../../components';
import {GET_DELIVERIES} from '../../../graphql';
import NoData from '../../../assets/images/NoData.png';

const Ongoing = ({navigation, session}) => {
  const {data, loading, error, refetch} = useQuery(GET_DELIVERIES, {
    fetchPolicy: 'network-only',
    variables: {
      filter: {
        tokDriverId: '1',
        statusIn: [2, 3, 4, 5],
      },
    },
    onError: e => {
      console.log(e);
    },
    onCompleted: data => {
      console.log(JSON.stringify(data, null, 4));
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

  if (data.getDeliveries.length === 0) {
    return (
      <View style={styles.center}>
        <Image source={NoData} style={styles.image} resizeMode={'contain'} />
        <Text style={styles.text}>No Record</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data.getDeliveries}
        keyExtractor={item => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} colors={[COLOR]} tintColor={COLOR} />}
        renderItem={({item, index}) => (
          <DeliveryCard
            delivery={item}
            onPress={() => navigation.push('SelectedDriverDelivery', {delivery: item, label: ['Ongoing', 'Delivery']})}
            lastItem={data.getDeliveries.length == index + 1 ? true : false}
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
)(Ongoing);

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
    height: 100,
  },
  text: {
    color: MEDIUM,
    marginTop: 20,
    fontFamily: FONT_FAMILY,
    fontWeight: 'bold',
  },
});
