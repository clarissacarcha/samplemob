import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableHighlight} from 'react-native';
import {useMutation} from '@apollo/react-hooks';
import Toast from 'react-native-simple-toast';
import {throttle} from 'lodash';
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
} from '../../../../../components';
import {useAlert} from '../../../../../hooks/useAlert';
import {OnDeliveryStatusChangeSubscriber, OnDeliveryAcceptedSubscriber} from '../../../../../components/subscribers';
import {YellowIcon} from '../../../../../components/ui';
import {YellowButton} from '../../../../../revamp/buttons/YellowButton';
import {DARK, ORANGE, APP_FLAVOR} from '../../../../../res/constants';
import {FONT, FONT_SIZE} from '../../../../../res/variables';
import {PATCH_DELIVERY_DELETE} from '../../../../../graphql';
import {onError} from '../../../../../util/ErrorUtility';

/*----------------------------*/

import {COLOR} from '../../../../../res/variables';

// Sections
import {
  CashOnDeliveryPabiliSection,
  LandmarkSection,
  PaymentMethodSection,
  SenderRecipientSection,
  StatusSection,
  SenderRecipientRow,
} from './Sections';

const SelectedDelivery = ({navigation, route}) => {
  const {delivery, label} = route.params;

  const Notify = useAlert();

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Delivery', 'Details']} />,
  });

  // Create a delivery state from router.params.delivery
  const [getDelivery, setDelivery] = useState(delivery);

  const [patchDeliveryDelete, {loading: loadingDelete}] = useMutation(PATCH_DELIVERY_DELETE, {
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

  const onRateDeliveryButtonClick = throttle(
    () => navigation.push('DeliveryRating', {delivery, setDelivery, onDeliveryRated}),
    2000,
    {leading: true, trailing: false},
  );

  return (
    <View style={{flex: 1}}>
      <AlertOverlay visible={loadingDelete} />
      <OnDeliveryStatusChangeSubscriber
        delivery={getDelivery}
        onFeedReceived={({feed}) => {
          Notify({message: feed.message});
          setDelivery(feed.delivery);
        }}
      />
      <OnDeliveryAcceptedSubscriber
        delivery={getDelivery}
        onFeedReceived={({feed}) => {
          Notify({message: feed.message});
          setDelivery(feed.delivery);
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding: 16}}>
        {/*---------------------------------------- CANCEL ORDER BUTTON ----------------------------------------*/}
        {[1, 2].includes(getDelivery.status) && (
          <>
            <YellowButton onPress={onCancelPress} label="Cancel Order" style={{marginBottom: 8}} />
            <View style={{height: 8, backgroundColor: COLOR.LIGHT}} />
          </>
        )}

        {/*-------------------- RATE DELIVIERY BUTTON --------------------*/}
        {isRateButtonShown() && (
          <>
            <YellowButton onPress={onRateDeliveryButtonClick} label="Rate This Delivery" style={{marginBottom: 8}} />
            <View style={{height: 8, backgroundColor: COLOR.LIGHT}} />
          </>
        )}

        {/*---------------------------------------- DELIVERY TRACKING ----------------------------------------*/}
        {[2, 3, 4, 5].includes(getDelivery.status) && <DriverLocationCard driver={getDelivery.driver} />}

        {/* <StatusSection delivery={delivery} />
        <SenderRecipientSection delivery={delivery} />
        <LandmarkSection delivery={delivery} />
        <PaymentMethodSection delivery={delivery} />
        <CashOnDeliveryPabiliSection delivery={delivery} /> */}

        {/*-------------------- DELETE/REBOOK BUTTON DETAILS --------------------*/}
        {getDelivery.status === 7 && (
          <View style={{flexDirection: 'row', marginBottom: 16}}>
            {/*-------------------- DELETE BUTTON --------------------*/}
            <TouchableHighlight
              onPress={patchDeliveryDelete}
              underlayColor={COLOR.YELLOW}
              style={{borderRadius: 10, flex: 1, marginRight: 10}}>
              <View style={styles.submit}>
                <Text style={{color: COLOR.YELLOW, fontSize: 16}}>Delete Order</Text>
              </View>
            </TouchableHighlight>
          </View>
        )}

        {/*-------------------- DELIVERY ID --------------------*/}
        <View style={[styles.cardShadow, {marginBottom: 16}]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <YellowIcon set="FontAwesome5" name="pen" size={14} darkIcon />

              <Text style={{marginLeft: 10, color: DARK, fontFamily: FONT.BOLD}}>
                Delivery <Text style={{color: ORANGE}}>ID</Text>
              </Text>
            </View>
            <Text style={{color: DARK, fontFamily: FONT.BOLD}}>{delivery.deliveryId}</Text>
          </View>
        </View>

        {/*-------------------- ORDER DETAILS --------------------*/}
        <OrderDetailsCard delivery={getDelivery} />

        {/*-------------------- SENDER DETAILS --------------------*/}
        <DeliveryStopCard stop={getDelivery.senderStop} index={0} delivery={getDelivery} />

        {/*-------------------- RECIPIENT DETAILS --------------------*/}
        <DeliveryStopCard stop={getDelivery.recipientStop} index={1} delivery={getDelivery} />

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
  cardShadow: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submit: {
    flexDirection: 'row',
    backgroundColor: DARK,
    height: 50,
    borderRadius: 5,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
