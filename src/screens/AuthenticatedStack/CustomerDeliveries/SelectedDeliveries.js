import React, {useState} from 'react';
import {View, FlatList, RefreshControl, Text, StyleSheet, Image, ActivityIndicator} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {connect} from 'react-redux';
import {HeaderBack, HeaderTitle, DeliveryCard} from '../../../components';
import {useQuery} from '@apollo/react-hooks';
import {GET_DELIVERIES} from '../../../graphql';
import {COLOR, DARK, MEDIUM, LIGHT} from '../../../res/constants';

import NoData from '../../../assets/images/NoData.png';

const SelectedDeliveries = ({navigation, route, session}) => {
  const {headerTitleLabel, status} = route.params;

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={headerTitleLabel} />,
  });

  const {data, loading, error, refetch} = useQuery(GET_DELIVERIES, {
    variables: {
      filter: {
        tokConsumerId: session.user.consumer.id,
        status,
      },
    },
    fetchPolicy: 'network-only',
  });

  useFocusEffect(() => {
    refetch();
  }, [session.user.id]);

  const onPress = delivery => navigation.push('SelectedDelivery', {delivery});

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={24} color={COLOR} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Something Went Wrong</Text>
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
    <View style={{flex: 1}}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data.getDeliveries}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <DeliveryCard
            delivery={item}
            onPress={() => onPress(item)}
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
)(SelectedDeliveries);

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 100,
  },
});
