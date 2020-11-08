import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableHighlight, Modal, ActivityIndicator, Alert} from 'react-native';
import {ReactNativeFile} from 'apollo-upload-client';
import {useMutation} from '@apollo/react-hooks';
import {
  HeaderBack,
  HeaderTitle,
  DeliveryStopCard,
  DeliveryLogsCard,
  OrderDetailsCard,
  RiderRatingCard,
} from '../../../../components';
import {YellowIcon} from '../../../../components/ui';
import {COLOR, DARK, MEDIUM, LIGHT, ORANGE, APP_FLAVOR} from '../../../../res/constants';
import {
  CLIENT,
  PATCH_DELIVERY_INCREMENT_STATUS,
  PATCH_DELIVERY_ACCEPTED,
  PATCH_DELIVERY_DRIVER_CANCEL,
} from '../../../../graphql';
import {onError} from '../../../../util/ErrorUtility';

import Toast from 'react-native-simple-toast';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';

const SelectedDriverDelivery = ({navigation, route, session}) => {
  const {delivery, label} = route.params;

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={label} />,
  });

  // Create a delivery state from router.params.delivery
  const [getDelivery, setDelivery] = useState(delivery);
  const [tempImage, setTempImage] = useState(null);

  const [patchDeliveryIncrementStatus, {loading: PDISLoading}] = useMutation(PATCH_DELIVERY_INCREMENT_STATUS, {
    onError: onError,
    onCompleted: (res) => setDelivery(res.patchDeliveryIncrementStatus),
  });

  const [patchDeliveryAccepted, {loading: PDALoading}] = useMutation(PATCH_DELIVERY_ACCEPTED, {
    onError: onError,
    onCompleted: ({patchDeliveryAccepted}) => {
      setDelivery(patchDeliveryAccepted);

      Toast.show('Order successfully accepted.');
    },
  });

  const [patchDeliveryDriverCancel, {loading: PDDCLoading}] = useMutation(PATCH_DELIVERY_DRIVER_CANCEL, {
    onError: onError,
    onCompleted: ({patchDeliveryDriverCancel}) => {
      setDelivery(patchDeliveryDriverCancel);

      Toast.show('Order successfully cancelled.');
    },
  });

  const status = [
    'Cancelled',
    'Order Placed',
    'Scheduled for Delivery',
    'On My Way To Pick Up The Item',
    'I Have Picked Up The Item',
    'On My Way To Deliver The Item',
    'I Have Delivered The Item',
  ];

  const onAccept = () => {
    patchDeliveryAccepted({
      variables: {
        input: {
          deliveryId: getDelivery.id,
          driverId: session.user.driver.id,
          userId: session.user.id,
        },
      },
    });
  };

  // const onCancel = () => {
  //   patchDeliveryDriverCancel({
  //     variables: {
  //       input: {
  //         deliveryId: getDelivery.id,
  //       },
  //     },
  //   });
  // };

  const onCancelCallback = (returnData) => {
    setDelivery(returnData);

    Toast.show('Order successfully cancelled.');
  };

  const onCancelPress = () => {
    navigation.push('OrderCancellation', {
      deliveryId: getDelivery.id,
      onCancelCallback: onCancelCallback,
    });
  };

  const onStatusUpdateWithImage = (fileUri) => {
    try {
      const rnFile = new ReactNativeFile({
        uri: fileUri,
        name: 'document.jpg',
        type: 'image/jpeg',
      });
      patchDeliveryIncrementStatus({
        variables: {
          input: {
            userId: session.user.id,
            deliveryId: getDelivery.id,
            file: rnFile,
          },
        },
      });
    } catch (error) {
      Alert.alert('', error);
    }
  };

  const onStatusUpdate = () => {
    if ([3, 5].includes(getDelivery.status)) {
      const label = getDelivery.status === 3 ? ['Item', 'Picked Up'] : ['Item', 'Delivered'];
      navigation.push('ItemCamera', {label, setTempImage, onStatusUpdateWithImage});
      return;
    }

    patchDeliveryIncrementStatus({
      variables: {
        input: {
          deliveryId: getDelivery.id,
        },
      },
    });
  };

  const onDeliveryRated = (rating) => {
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
      {/*-------------------- LOADING OVERLAY--------------------*/}
      <Modal
        animationType="fade"
        transparent={true}
        visible={PDISLoading || PDALoading || PDDCLoading}
        style={StyleSheet.absoluteFill}>
        <View style={styles.transparent}>
          <View style={styles.labelRow}>
            <View style={styles.labelBox}>
              <Text style={{fontFamily: 'Rubik-Medium'}}>Processing...</Text>
              <ActivityIndicator color={DARK} />
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding: 20}}>
        {/*-------------------- UPDATE STATUS BUTTON --------------------*/}
        {[2, 3, 4, 5].includes(getDelivery.status) && (
          <TouchableHighlight
            onPress={onStatusUpdate}
            underlayColor={COLOR}
            style={{borderRadius: 10, marginBottom: 20}}>
            <View style={styles.submit}>
              <Text style={{color: COLOR, fontSize: 16}}>{status[getDelivery.status + 1]}</Text>
              {[3, 5].includes(getDelivery.status) && (
                <Ionicon name="ios-camera" size={40} color={COLOR} style={{position: 'absolute', right: 20}} />
              )}
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

        {getDelivery.status === 1 && (
          <TouchableHighlight onPress={onAccept} underlayColor={COLOR} style={{borderRadius: 10, marginBottom: 20}}>
            <View style={styles.submit}>
              <Text style={{color: COLOR, fontSize: 16}}>Accept Order</Text>
              {[3, 5].includes(getDelivery.status) && (
                <Ionicon name="ios-camera" size={40} color={COLOR} style={{position: 'absolute', right: 20}} />
              )}
            </View>
          </TouchableHighlight>
        )}

        {/*-------------------- DELIVERY ID --------------------*/}
        <View style={[styles.cardShadow, {marginBottom: 20}]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row'}}>
              <YellowIcon set="FontAwesome5" name="pen" size={14} darkIcon />

              <Text style={{marginLeft: 10, color: DARK, fontFamily: 'Rubik-Medium'}}>
                Delivery <Text style={{color: ORANGE}}>ID</Text>
              </Text>
            </View>
            <Text style={{color: DARK, fontFamily: 'Rubik-Medium'}}>{delivery.deliveryId}</Text>
          </View>
        </View>

        {/*-------------------- ORDER DETAILS --------------------*/}
        <OrderDetailsCard delivery={getDelivery} />

        {/*-------------------- SENDER DETAILS --------------------*/}
        <DeliveryStopCard stop={getDelivery.senderStop} index={0} />

        {/*-------------------- RECIPIENT DETAILS --------------------*/}
        <DeliveryStopCard stop={getDelivery.recipientStop} index={1} />

        {/*-------------------- DELIVERY LOGS --------------------*/}
        {getDelivery.status !== 1 && <DeliveryLogsCard logs={getDelivery.logs} />}

        {/*-------------------- RIDER RATING --------------------*/}
        <RiderRatingCard driverRating={getDelivery.driverRating} ratingFor="D" />

        {/*-------------------- CUSTOMER RATING --------------------*/}
        <RiderRatingCard driverRating={getDelivery.consumerRating} ratingFor="C" />

        {/*-------------------- CANCEL ORDER --------------------*/}
        {[2, 3].includes(getDelivery.status) && (
          <TouchableHighlight onPress={onCancelPress} underlayColor={COLOR} style={{borderRadius: 10, marginTop: 20}}>
            <View style={styles.submit}>
              <Text style={{color: COLOR, fontSize: 16}}>Cancel Order</Text>
            </View>
          </TouchableHighlight>
        )}
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(SelectedDriverDelivery);

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
