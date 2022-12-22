import React, {useEffect, useState} from 'react';
import {View, FlatList, Text, StyleSheet, Image, ActivityIndicator} from 'react-native';
import {connect, useDispatch, useSelector} from 'react-redux';
import {HeaderBack, DeliveryCard, HeaderTitle, SomethingWentWrong} from '../../../../components';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import {GET_DELIVERIES, GET_DELIVERY_BY_DELIVERY_ID} from '../../../../graphql';
import {COLOR} from '../../../../res/variables';
import InfoIcon from '../../../../assets/icons/InfoIcon.png';
import NoData from '../../../../assets/images/NoData.png';
import CONSTANTS from '../../../../common/res/constants';
import Carousel from 'react-native-snap-carousel';

const SelectedDeliveries = ({navigation, route, session, constants}) => {
  const {headerTitleLabel, status} = route.params;
  const [carouselMessages, setCarouselMessages] = useState([]);
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
    getCarouselData();
  }, []);

  const getCarouselData = () => {
    const customerCarouselMessage = constants.customerDeliveryCarousel;
    const parsedCarouselMessages = customerCarouselMessage ? JSON.parse(customerCarouselMessage) : [];
    setCarouselMessages(parsedCarouselMessages);
  };

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
      {status === 1 && carouselMessages.length > 0 && (
        <View
          style={{
            backgroundColor: CONSTANTS.COLOR.LIGHT_YELLOW,
            paddingHorizontal: 16,
            paddingTop: 16,
            flexDirection: 'row',
          }}>
          <Image
            source={InfoIcon}
            resizeMode={'contain'}
            style={{height: 13, width: 13, marginRight: 8, marginTop: 4}}
          />
          <Carousel
            loop={true}
            autoplay={true}
            autoplayInterval={10000}
            data={carouselMessages}
            itemHeight={50}
            sliderHeight={50}
            vertical={true}
            scrollEnabled={false}
            lockScrollWhileSnapping={true}
            renderItem={({item}) => (
              <Text
                style={{
                  color: CONSTANTS.COLOR.ORANGE,
                  fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
                  fontSize: CONSTANTS.FONT_SIZE.M,
                  marginRight: 8,
                }}>
                {item}
              </Text>
            )}></Carousel>
        </View>
      )}
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
  constants: state.constants,
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
