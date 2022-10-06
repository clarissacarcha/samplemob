import React, {useEffect} from 'react';
import {View, FlatList, RefreshControl, Text, StyleSheet, Image, ActivityIndicator, ScrollView} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {connect, useDispatch, useSelector} from 'react-redux';
import {HeaderBack, DeliveryCard, HeaderTitle, SomethingWentWrong} from '../../../../components';
// import {DeliveryCard} from '../../../../_toktok/components';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import {GET_DELIVERIES, GET_DELIVERY_BY_DELIVERY_ID} from '../../../../graphql';
import {COLOR} from '../../../../res/variables';

import NoData from '../../../../assets/images/NoData.png';

const SelectedDeliveries = ({navigation, route, session}) => {
  const {headerTitleLabel, status} = route.params;

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={headerTitleLabel} />,
  });

  const dispatch = useDispatch();
  const toktokDelivery = useSelector(state => state.toktokDelivery);

  const {data, loading, error, refetch} = useQuery(GET_DELIVERIES, {
    variables: {
      filter: {
        tokConsumerId: session.user.consumer.id,
        status,
      },
    },
    fetchPolicy: 'network-only',
  });

  const [getDeliveryByDeliveryId] = useLazyQuery(GET_DELIVERY_BY_DELIVERY_ID, {
    fetchPolicy: 'network-only',
    onCompleted: response => {
      dispatch({type: 'SET_TOKTOK_DELIVERY_INITIAL_STATE'});
      navigation.push('SelectedDelivery', {delivery: response.getDeliveryByDeliveryId});
    },
    onError: err => {
      console.log(err);
    },
  });

  // useFocusEffect(() => {
  //   refetch();
  // }, [session.user.id]);
  const fetchSelectedDeliveryIfFromNotificationWithDeliveryId = () => {
    if (toktokDelivery.notificationDeliveryId) {
      getDeliveryByDeliveryId({
        variables: {
          filter: {
            deliveryId: toktokDelivery.notificationDeliveryId,
          },
        },
      });
    }
  };

  useEffect(() => {
    fetchSelectedDeliveryIfFromNotificationWithDeliveryId();
  }, []);

  const onPress = delivery => navigation.push('SelectedDelivery', {delivery});

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={COLOR.YELLOW} />
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
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data.getDeliveries}
        keyExtractor={item => item.id}
        // ItemSeparatorComponent={() => <View style={{borderBottomWidth: 8, borderColor: COLOR.LIGHT}} />}
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

export default connect(mapStateToProps, null)(SelectedDeliveries);

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
