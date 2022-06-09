import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, FlatList, RefreshControl, Image, StyleSheet, Dimensions} from 'react-native';
import {useQuery} from '@apollo/react-hooks';
import {connect} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {COLOR, MEDIUM} from '../../../res/constants';
import {ActivitiesCard} from '../../components';
import {GET_DELIVERIES, TOKTOK_GO_GRAPHQL_CLIENT} from '../../../graphql';
import NoData from '../../../assets/images/NoTransactions.png';
import CONSTANTS from '../../../common/res/constants';
import {GET_TRIPS_CONSUMER} from '../../graphql';
import {SomethingWentWrong} from 'src/components';
import {onErrorAppSync} from '../../util';

const imageWidth = Dimensions.get('window').width - 200;

const CancelledActivities = ({navigation, session}) => {
  const {data, loading, error, refetch} = useQuery(GET_TRIPS_CONSUMER, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        tag: 'CANCELLED',
      },
    },
    onError: onErrorAppSync,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

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
        <Text style={styles.headerText}>No Bookings</Text>
        <Text>You don’t have bookings yet.</Text>
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

export default connect(mapStateToProps, null)(CancelledActivities);

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
  headerText: {
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.XL + 1,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    marginBottom: 8,
  },
});
