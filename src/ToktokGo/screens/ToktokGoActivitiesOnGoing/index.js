import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, FlatList, RefreshControl, Image, StyleSheet, Dimensions} from 'react-native';
import {useQuery} from '@apollo/react-hooks';
import {connect} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {COLOR, MEDIUM} from '../../../res/constants';
import {ActivitiesCard,SomethingWentWrong} from '../../components';
import {GET_DELIVERIES, TOKTOK_GO_GRAPHQL_CLIENT} from '../../../graphql';
import NoData from '../../../assets/images/NoData.png';
import DummyData from '../../components/DummyData';
import {GET_TRIPS_CONSUMER} from '../../graphql';

const imageWidth = Dimensions.get('window').width - 200;

const OnGoingActivities = ({navigation, session}) => {
  const {data, loading, error, refetch} = useQuery(GET_TRIPS_CONSUMER, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        consumerUserId: session.user.id,
        tag: 'ONGOING',
      },
    },
    onError: error => console.log('error', error),
  });

  useFocusEffect(() => {
    // refetch();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size={24} color={COLOR} />
      </View>
    );
  }

  if (error) {
    return <SomethingWentWrong />;
  }

  if (data.getTripsConsumer.length === 0) {
    return (
      <View style={styles.center}>
        <Image source={NoData} style={styles.image} resizeMode={'contain'} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data.getTripsConsumer}
        keyExtractor={item => item.id}
        refreshControl={<RefreshControl colors={[COLOR]} tintColor={COLOR} />}
        renderItem={({item, index}) => (
          <ActivitiesCard
            booking={item}
            onPress={() => navigation.push('SelectedBookingDetails', {booking: item})}
            lastItem={data.getTripsConsumer.length == index + 1 ? true : false}
          />
        )}
      />
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(OnGoingActivities);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
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
    fontFamily: 'Rubik-Medium',
  },
});
