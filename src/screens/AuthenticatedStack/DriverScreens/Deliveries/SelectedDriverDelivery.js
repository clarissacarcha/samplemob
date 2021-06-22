import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  Modal,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import {ReactNativeFile} from 'apollo-upload-client';
import {useMutation, useSubscription} from '@apollo/react-hooks';
import {connect} from 'react-redux';
import {throttle} from 'lodash';
import Toast from 'react-native-simple-toast';
import SwipeButton from 'rn-swipe-button';
import {SIZES, FONT_MEDIUM, COLORS, BUTTON_HEIGHT, NUMBERS} from '../../../../res/constants';

import {useAlert} from '../../../../hooks/useAlert';
import {OnDeliveryAcceptedSubscriber} from '../../../../components/subscribers';

import {
  HeaderBack,
  HeaderTitle,
  DeliveryStopCard,
  DeliveryLogsCard,
  OrderDetailsCard,
  RiderRatingCard,
} from '../../../../components';
import {YellowIcon} from '../../../../components/ui';
import {COLOR, DARK, MEDIUM, LIGHT, ORANGE, APP_FLAVOR, COLOR_UNDERLAY} from '../../../../res/constants';
import {
  PATCH_DELIVERY_INCREMENT_STATUS,
  PATCH_DELIVERY_ACCEPTED,
  PATCH_DELIVERY_DRIVER_CANCEL,
} from '../../../../graphql';
import {onError} from '../../../../util/ErrorUtility';
import {CaptchaOverlay} from '../../../../components/overlays/CaptchaOverlay';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import Ionicon from 'react-native-vector-icons/Ionicons';

const thumbIconComponentRight = () => (
  <View style={{...NUMBERS.SHADOW}}>
    <FIcon5 name="chevron-right" size={15} />
  </View>
);

const thumbIconComponentLeft = () => (
  <View style={{...NUMBERS.SHADOW}}>
    <FIcon5 name="chevron-left" size={15} />
  </View>
);

const AcceptSwipeButton = ({onSwipe}) => {
  const swipeDirection = Math.floor(Math.random() * 2) + 1;

  return (
    <SwipeButton
      title={`Swipe ${swipeDirection === 1 ? 'Right' : 'Left'} to Accept`}
      onSwipeFail={(e) => console.log({FAIL: e})}
      onSwipeSuccess={onSwipe}
      containerStyles={styles.swipeContainer}
      enableReverseSwipe={swipeDirection === 1 ? false : true}
      width={'100%'}
      swipeSuccessThreshold={100}
      titleStyles={{
        fontSize: SIZES.M,
        fontFamily: FONT_MEDIUM,
        paddingLeft: 20,
      }}
      titleColor={COLORS.MEDIUM}
      railBackgroundColor={COLORS.LIGHT}
      railBorderColor={'transparent'}
      railStyles={{
        backgroundColor: COLORS.YELLOW,
        borderWidth: 0,
        // ...NUMBERS.SHADOW,
      }}
      thumbIconBackgroundColor="white"
      thumbIconBorderColor={COLORS.LIGHT}
      thumbIconStyles={{
        borderColor: 'yellow',
      }}
      height={BUTTON_HEIGHT}
      thumbIconComponent={swipeDirection === 1 ? thumbIconComponentRight : thumbIconComponentLeft}
      resetAfterSuccessAnimDelay={0}
      resetAfterSuccessAnimDuration={0}
      shouldResetAfterSuccess={true}
    />
  );
};

const SelectedDriverDelivery = ({navigation, route, session}) => {
  const {delivery, label, refreshList} = route.params;

  const [captchaVisible, setCaptchaVisible] = useState(false);

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
    // setCaptchaVisible(false);
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

  const onStatusUpdateThrottled = throttle(
    () => {
      if ([3, 5].includes(getDelivery.status)) {
        const labelValue = getDelivery.status === 3 ? ['Item', 'Picked Up'] : ['Item', 'Delivered'];
        navigation.push('ItemCamera', {
          label: labelValue,
          setTempImage,
          onStatusUpdateWithImage,
        });
        return;
      }

      patchDeliveryIncrementStatus({
        variables: {
          input: {
            deliveryId: getDelivery.id,
          },
        },
      });
    },
    2000,
    {
      trailing: false,
    },
  );

  const onStatusUpdate = () => {
    if ([3, 5].includes(getDelivery.status)) {
      const labelValue = getDelivery.status === 3 ? ['Item', 'Picked Up'] : ['Item', 'Delivered'];
      navigation.push('ItemCamera', {label: labelValue, setTempImage, onStatusUpdateWithImage});
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
      {/*-------------------- SUBSCRIBERS --------------------*/}
      <OnDeliveryAcceptedSubscriber
        delivery={getDelivery}
        onFeedReceived={({feed}) => {
          if (session.user.driver.id != feed.delivery.tokDriverId) {
            setCaptchaVisible(false);
            // Notify({message: 'Delivery accepted by other rider.'});
            Alert.alert('', 'Delivery accepted by other rider.', [
              {
                title: 'OK',
                onPress: () => {
                  refreshList();
                  navigation.pop();
                },
              },
            ]);
          }
        }}
      />
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
      {/*-------------------- PIN Overlay--------------------*/}
      <CaptchaOverlay visible={captchaVisible} onSuccess={onAccept} onCancel={() => setCaptchaVisible(false)} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding: 20}}>
        {/*-------------------- UPDATE STATUS BUTTON --------------------*/}
        {[2, 3, 4, 5].includes(getDelivery.status) && (
          <TouchableHighlight
            onPress={onStatusUpdateThrottled}
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
          // <TouchableHighlight
          //   onPress={() => setCaptchaVisible(true)}
          //   underlayColor={COLOR}
          //   style={{borderRadius: 10, marginBottom: 20}}>
          //   <View style={styles.submit}>
          //     <Text style={{color: COLOR, fontSize: 16}}>Accept Order</Text>
          //   </View>
          // </TouchableHighlight>
          <AcceptSwipeButton onSwipe={onAccept} />
        )}

        {/*-------------------- Display 3 Digit Pin --------------------*/}
        {/* {getDelivery.status === 1 && (
          <TouchableHighlight onPress={onAccept} underlayColor={COLOR} style={{borderRadius: 10, marginBottom: 20}}>
            <View style={styles.submit}>
              <Text style={{color: COLOR, fontSize: 16}}>Accept Order</Text>
            </View>
          </TouchableHighlight>
        )} */}

        {/*-------------------- DELIVERY ID --------------------*/}
        <View style={[styles.cardShadow, {marginBottom: 20}]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
        <DeliveryStopCard stop={getDelivery.senderStop} index={0} status={getDelivery.status} delivery={delivery} />

        {/*-------------------- RECIPIENT DETAILS --------------------*/}
        <DeliveryStopCard stop={getDelivery.recipientStop} index={1} status={getDelivery.status} delivery={delivery} />

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
  swipeContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
});
