import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableHighlight, Modal, ActivityIndicator} from 'react-native';
import {useMutation} from '@apollo/react-hooks';
import Toast from 'react-native-simple-toast';
import {
  HeaderBack,
  HeaderTitle,
  DeliveryStopCard,
  DeliveryLogsCard,
  DriverCard,
  AlertOverlay,
  OrderDetailsCard,
  DriverLocationCard,
  RiderRatingCard,
} from '../../../../components';
import {YellowIcon} from '../../../../components/ui';
import {COLOR, DARK, MEDIUM, LIGHT, ORANGE, APP_FLAVOR} from '../../../../res/constants';
import {PATCH_DELIVERY_CUSTOMER_CANCEL, PATCH_DELIVERY_DELETE, PATCH_DELIVERY_REBOOK} from '../../../../graphql';
import {onError} from '../../../../util/ErrorUtility';

import FAIcon from 'react-native-vector-icons/FontAwesome';
import {FlatList} from 'react-native-gesture-handler';

const StarRating = ({rating}) => {
  const starColor = index => {
    if (index <= rating) {
      return COLOR;
    } else {
      return LIGHT;
    }
  };

  return (
    <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', padding: 20}}>
      <FAIcon name="star" size={35} style={{marginRight: 15}} color={starColor(1)} />
      <FAIcon name="star" size={35} style={{marginRight: 15}} color={starColor(2)} />
      <FAIcon name="star" size={35} style={{marginRight: 15}} color={starColor(3)} />
      <FAIcon name="star" size={35} style={{marginRight: 15}} color={starColor(4)} />
      <FAIcon name="star" size={35} color={starColor(5)} />
    </View>
  );
};

const SelectedDelivery = ({navigation, route}) => {
  const {delivery, label} = route.params;

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Delivery', 'Details']} />,
  });

  // Create a delivery state from router.params.delivery
  const [getDelivery, setDelivery] = useState(delivery);
  const [loading, setLoading] = useState(false);

  // const [patchDeliveryCustomerCancel, {loading: loadingC}] = useMutation(PATCH_DELIVERY_CUSTOMER_CANCEL, {
  //   onError: onError,
  //   variables: {
  //     input: {
  //       deliveryId: getDelivery.id,
  //     },
  //   },
  //   onCompleted: ({patchDeliveryCustomerCancel}) => {
  //     setDelivery(patchDeliveryCustomerCancel);
  //     Toast.show('Order successfully cancelled');

  //   },
  // });

  const [patchDeliveryDelete, {loading: loadingD}] = useMutation(PATCH_DELIVERY_DELETE, {
    onError: onError,
    variables: {
      input: {
        deliveryId: getDelivery.id,
      },
    },
    onCompleted: ({patchDeliveryDelete}) => {
      Toast.show('Order successfully deleted');
      navigation.pop();
    },
  });

  // const [patchDeliveryRebook, {loading: loadingR}] = useMutation(PATCH_DELIVERY_REBOOK, {
  //   onError: onError,
  //   variables: {
  //     input: {
  //       deliveryId: getDelivery.id,
  //     },
  //   },
  //   onCompleted: ({patchDeliveryRebook}) => {
  //     Toast.show(patchDeliveryRebook);
  //   },
  // });

  // const onRebook = () => {
  // patchDeliveryRebook();
  // navigation.navigate('ConsumerMap', {rebookDelivery: delivery});
  // };

  const onCancelCallback = returnData => {
    setDelivery(returnData);

    Toast.show('Order successfully cancelled.');
  };

  const onCancelPress = () => {
    navigation.push('OrderCancellation', {
      deliveryId: getDelivery.id,
      onCancelCallback: onCancelCallback,
    });
  };

  // Syncrhonize all loading states
  // useEffect(() => {
  //   if (loadingC || loadingD) {
  //     setLoading(true);
  //   } else {
  //     setLoading(false);
  //   }
  // }, [loadingD]);

  const onDeliveryRated = rating => {
    setDelivery({
      ...getDelivery,
      ...rating,
    });
  };

  const isRateButtonShown = () => {
    if (getDelivery.status == 6) {
      if (APP_FLAVOR == 'C' && !getDelivery.driverRating) {
        return true;
      }

      if (APP_FLAVOR == 'D' && !getDelivery.consumerRating) {
        return true;
      }

      return false;
    }
    return false;
  };

  return (
    <View style={{flex: 1}}>
      <AlertOverlay visible={loading} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding: 20}}>
        {/*---------------------------------------- CANCEL ORDER BUTTON ----------------------------------------*/}
        {[1, 2, 3].includes(getDelivery.status) && (
          <TouchableHighlight
            onPress={onCancelPress}
            underlayColor={COLOR}
            style={{borderRadius: 10, marginBottom: 20}}>
            <View style={styles.submit}>
              <Text style={{color: COLOR, fontSize: 16}}>Cancel Order</Text>
            </View>
          </TouchableHighlight>
        )}

        {isRateButtonShown() && (
          <TouchableHighlight
            onPress={() => navigation.push('DeliveryRating', {delivery, setDelivery, onDeliveryRated})}
            underlayColor={COLOR}
            style={{borderRadius: 10, marginBottom: 20}}>
            <View style={styles.submit}>
              <Text style={{color: COLOR, fontSize: 16}}>Rate This Delivery</Text>
            </View>
          </TouchableHighlight>
        )}

        {/*---------------------------------------- DELIVERY TRACKING ----------------------------------------*/}
        {[2, 3, 4, 5].includes(getDelivery.status) && <DriverLocationCard driver={getDelivery.driver} />}

        {/*-------------------- DELETE/REBOOK BUTTON DETAILS --------------------*/}
        {getDelivery.status === 7 && (
          <View style={{flexDirection: 'row', marginBottom: 20}}>
            {/*-------------------- DELETE BUTTON --------------------*/}
            <TouchableHighlight
              onPress={patchDeliveryDelete}
              underlayColor={COLOR}
              style={{borderRadius: 10, flex: 1, marginRight: 10}}>
              <View style={styles.submit}>
                <Text style={{color: COLOR, fontSize: 16}}>Delete Order</Text>
              </View>
            </TouchableHighlight>

            {/*-------------------- REBOOK BUTTON --------------------*/}
            {/* <TouchableHighlight
              onPress={onRebook}
              underlayColor={COLOR}
              style={{borderRadius: 10, flex: 1, marginLeft: 10}}>
              <View style={styles.submit}>
                <Text style={{color: COLOR, fontSize: 16}}>Book a Copy</Text>
              </View>
            </TouchableHighlight> */}
          </View>
        )}

        {/*-------------------- DELIVERY ID --------------------*/}
        <View style={[styles.cardShadow, {marginBottom: 20}]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row'}}>
              <YellowIcon set="FontAwesome5" name="pen" size={14} darkIcon />

              <Text style={{marginLeft: 10, color: DARK, fontWeight: 'bold'}}>
                Delivery <Text style={{color: ORANGE}}>ID</Text>
              </Text>
            </View>
            <Text style={{color: DARK, fontWeight: 'bold'}}>{delivery.deliveryId}</Text>
          </View>
        </View>

        {/*-------------------- ORDER DETAILS --------------------*/}
        <OrderDetailsCard delivery={getDelivery} />

        {/*---------------------------------------- DELIVERY DETAILS ----------------------------------------*/}
        {/* <View style={styles.card}>
          <View style={styles.cardShadow}>
            <View style={styles.directionsBox}>
              <View style={styles.directionDetail}>
                <MCIcon name="map-marker-distance" size={16} color={'white'} style={styles.iconBox} />
                <Text style={{fontWeight: 'bold', marginLeft: 10}}>
                  {parseFloat(delivery.distance).toFixed(2)}
                  <Text style={{color: MEDIUM}}> km</Text>
                </Text>
              </View>
              <View style={styles.directionDetail}>
                <MCIcon name="timelapse" size={16} color={'white'} style={styles.iconBox} />
                <Text style={{fontWeight: 'bold', marginLeft: 10}}>
                  {parseFloat(delivery.duration).toFixed(0)}
                  <Text style={{color: MEDIUM}}> min</Text>
                </Text>
              </View>
              <View style={styles.directionDetail}>
                <Ionicon name="md-pricetag" size={16} color={'white'} style={styles.iconBox} />
                <Text style={{fontWeight: 'bold', marginLeft: 10}}>₱{delivery.price}</Text>
              </View>
            </View>
          </View>
        </View> */}

        {/*-------------------- SENDER DETAILS --------------------*/}
        <DeliveryStopCard stop={getDelivery.senderStop} index={0} />

        {/*-------------------- RECIPIENT DETAILS --------------------*/}
        <DeliveryStopCard stop={getDelivery.recipientStop} index={1} />

        {/*-------------------- DRIVER INFO --------------------*/}
        {getDelivery.driver && <DriverCard driver={getDelivery.driver} />}

        {/*-------------------- DELIVERY LOGS --------------------*/}
        <DeliveryLogsCard logs={getDelivery.logs} />

        {/*-------------------- RIDER RATING --------------------*/}
        <RiderRatingCard driverRating={getDelivery.driverRating} ratingFor="D" />

        {/*-------------------- CUSTOMER RATING --------------------*/}
        <RiderRatingCard driverRating={getDelivery.consumerRating} ratingFor="C" />
      </ScrollView>
    </View>
  );
};

export default SelectedDelivery;

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    marginBottom: 20,
  },
  cardShadow: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconBox: {
    backgroundColor: COLOR,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  directionsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  directionDetail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  submit: {
    flexDirection: 'row',
    backgroundColor: DARK,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transparent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
  },
  labelRow: {
    marginTop: 150,
    marginBottom: 20,
    height: 40,
    flexDirection: 'row',
  },
  labelBox: {
    flex: 1,
    backgroundColor: COLOR,
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
});
