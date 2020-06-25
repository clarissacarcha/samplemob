import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableHighlight, Modal, ActivityIndicator} from 'react-native';
import {useMutation} from '@apollo/react-hooks';
import {
  HeaderBack,
  HeaderTitle,
  DeliveryStopCard,
  DeliveryLogsCard,
  DriverCard,
  AlertOverlay,
  OrderDetailsCard,
} from '../../../../components';
import {COLOR, DARK, MEDIUM, LIGHT, ORANGE, APP_FLAVOR} from '../../../../res/constants';
import {PATCH_DELIVERY_CUSTOMER_CANCEL, PATCH_DELIVERY_DELETE, PATCH_DELIVERY_REBOOK} from '../../../../graphql';
import Toast from 'react-native-simple-toast';

const SelectedDelivery = ({navigation, route}) => {
  const {delivery, label} = route.params;

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Delivery', 'Details']} />,
  });

  // Create a delivery state from router.params.delivery
  const [getDelivery, setDelivery] = useState(delivery);
  const [loading, setLoading] = useState(false);

  const [patchDeliveryCustomerCancel, {loading: loadingC}] = useMutation(PATCH_DELIVERY_CUSTOMER_CANCEL, {
    variables: {
      input: {
        deliveryId: getDelivery.id,
      },
    },
    onCompleted: ({patchDeliveryCustomerCancel}) => {
      Toast.show('Order successfully cancelled');
      setDelivery(patchDeliveryCustomerCancel);
    },
    onError: ({graphQLErrors, networkError}) => {
      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      }
      if (graphQLErrors) {
        Alert.alert('', graphQLErrors[0].message);
      }
    },
  });

  const [patchDeliveryDelete, {loading: loadingD}] = useMutation(PATCH_DELIVERY_DELETE, {
    variables: {
      input: {
        deliveryId: getDelivery.id,
      },
    },
    onCompleted: ({patchDeliveryDelete}) => {
      Toast.show('Order successfully deleted');
      navigation.pop();
    },
    onError: ({graphQLErrors, networkError}) => {
      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      }
      if (graphQLErrors) {
        Alert.alert('', graphQLErrors[0].message);
      }
    },
  });

  const [patchDeliveryRebook, {loading: loadingR}] = useMutation(PATCH_DELIVERY_REBOOK, {
    variables: {
      input: {
        deliveryId: getDelivery.id,
      },
    },
    onCompleted: ({patchDeliveryRebook}) => {
      Toast.show(patchDeliveryRebook);
    },
    onError: ({graphQLErrors, networkError}) => {
      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      }
      if (graphQLErrors) {
        Alert.alert('', graphQLErrors[0].message);
      }
    },
  });

  const onRebook = () => {
    // patchDeliveryRebook();
    // navigation.navigate('ConsumerMap', {rebookDelivery: delivery});
  };

  // Syncrhonize all loading states
  useEffect(() => {
    if (loadingC || loadingD) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [loadingC, loadingD, loadingR]);

  return (
    <View style={{flex: 1}}>
      {/* <Modal animationType="fade" transparent={true} visible={loading} style={StyleSheet.absoluteFill}>
        <View style={styles.transparent}>
          <View style={styles.labelRow}>
            <View style={styles.labelBox}>
              <Text style={{fontWeight: 'bold'}}>Processing...</Text>
              <ActivityIndicator color={DARK} />
            </View>
          </View>
        </View>
      </Modal> */}

      <AlertOverlay visible={loading} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding: 20}}>
        {/*---------------------------------------- CANCEL ORDER BUTTON ----------------------------------------*/}
        {[1, 2, 3].includes(getDelivery.status) && (
          <TouchableHighlight
            onPress={patchDeliveryCustomerCancel}
            underlayColor={COLOR}
            style={{borderRadius: 10, marginBottom: 20}}>
            <View style={styles.submit}>
              <Text style={{color: COLOR, fontSize: 16}}>Cancel Order</Text>
            </View>
          </TouchableHighlight>
        )}

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
