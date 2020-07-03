import React, {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator, FlatList, RefreshControl, Image, StyleSheet, Dimensions} from 'react-native';
import {useQuery} from '@apollo/react-hooks';
import {connect} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {COLOR, MEDIUM, FONT_FAMILY} from '../../../../res/constants';
import {DeliveryCard, SomethingWentWrong} from '../../../../components';
import {GET_DELIVERIES} from '../../../../graphql';
import NoData from '../../../../assets/images/NoData.png';

const imageWidth = Dimensions.get('window').width - 200;

const CancelledDeliveries = ({navigation, session}) => {
  const {data, loading, error, refetch} = useQuery(GET_DELIVERIES, {
    fetchPolicy: 'network-only',
    variables: {
      filter: {
        tokDriverId: session.user.driver.id,
        statusIn: [7],
      },
    },
    onError: e => {
      console.log(e);
    },
  });

  useFocusEffect(() => {
    refetch();
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

  if (data.getDeliveries.length === 0) {
    return (
      <View style={styles.center}>
        <Image source={NoData} style={styles.image} resizeMode={'contain'} />
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
)(CancelledDeliveries);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
