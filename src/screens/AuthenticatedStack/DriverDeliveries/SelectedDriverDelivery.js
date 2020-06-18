import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableHighlight, Modal, ActivityIndicator} from 'react-native';
import {ReactNativeFile} from 'apollo-upload-client';
import {useMutation} from '@apollo/react-hooks';
import {HeaderBack, HeaderTitle, DeliveryStopCard, DeliveryLogsCard} from '../../../components';
import {COLOR, DARK, MEDIUM, LIGHT, ORANGE} from '../../../res/constants';
import {CLIENT, PATCH_DELIVERY_INCREMENT_STATUS} from '../../../graphql';

import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';

const SelectedDriverDelivery = ({navigation, route}) => {
  const {delivery, label} = route.params;

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={label} />,
  });

  // Create a delivery state from router.params.delivery
  const [getDelivery, setDelivery] = useState(delivery);
  const [tempImage, setTempImage] = useState(null);

  const [patchDeliveryIncrementStatus, {loading: PDISLoading}] = useMutation(PATCH_DELIVERY_INCREMENT_STATUS, {
    onError: error => {
      alert(error);
    },
    onCompleted: res => setDelivery(res.patchDeliveryIncrementStatus),
    onError: ({graphQLErrors, networkError}) => {
      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      }
      if (graphQLErrors) {
        Alert.alert('', graphQLErrors[0].message);
      }
    },
  });

  const status = [
    'Cancelled',
    'Order Placed',
    'Delivery Scheduled',
    'On My Way To Pick Up The Item',
    'I Have Picked Up The Item',
    'On My Way To Deliver The Item',
    'I Have Delivered The Item',
  ];

  const onStatusUpdateWithImage = fileUri => {
    try {
      const rnFile = new ReactNativeFile({
        uri: fileUri,
        name: 'document.jpg',
        type: 'image/jpeg',
      });
      patchDeliveryIncrementStatus({
        variables: {
          input: {
            deliveryId: getDelivery.id,
            file: rnFile,
          },
        },
      });
    } catch (error) {
      alert(error);
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

  return (
    <View style={{flex: 1}}>
      <Modal animationType="fade" transparent={true} visible={PDISLoading} style={StyleSheet.absoluteFill}>
        <View style={styles.transparent}>
          <View style={styles.labelRow}>
            <View style={styles.labelBox}>
              <Text style={{fontWeight: 'bold'}}>Processing...</Text>
              <ActivityIndicator color={DARK} />
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding: 20}}>
        {/*---------------------------------------- UPDATE STATUS BUTTON ----------------------------------------*/}
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

        {/*---------------------------------------- DELIVERY DETAILS ----------------------------------------*/}
        <View style={styles.card}>
          <View style={styles.cardShadow}>
            <View style={styles.directionsBox}>
              {/*-------------------- DISTANCE --------------------*/}
              <View style={styles.directionDetail}>
                <MCIcon name="map-marker-distance" size={16} color={'white'} style={styles.iconBox} />
                <Text style={{fontWeight: 'bold', marginLeft: 10}}>
                  {parseFloat(delivery.distance).toFixed(2)}
                  <Text style={{color: MEDIUM}}> km</Text>
                </Text>
              </View>
              {/*-------------------- DURATION --------------------*/}
              <View style={styles.directionDetail}>
                <MCIcon name="timelapse" size={16} color={'white'} style={styles.iconBox} />
                <Text style={{fontWeight: 'bold', marginLeft: 10}}>
                  {parseFloat(delivery.duration).toFixed(0)}
                  <Text style={{color: MEDIUM}}> min</Text>
                </Text>
              </View>
              {/*-------------------- PRICE --------------------*/}
              <View style={styles.directionDetail}>
                <Ionicon name="md-pricetag" size={16} color={'white'} style={styles.iconBox} />
                <Text style={{fontWeight: 'bold', marginLeft: 10}}>₱{delivery.price}</Text>
              </View>
            </View>
          </View>
        </View>

        {/*-------------------- SENDER DETAILS --------------------*/}
        <DeliveryStopCard stop={getDelivery.senderStop} index={0} />

        {/*-------------------- RECIPIENT DETAILS --------------------*/}
        <DeliveryStopCard stop={getDelivery.recipientStop} index={1} />

        {/*-------------------- DELIVERY LOGS --------------------*/}
        <DeliveryLogsCard logs={getDelivery.logs} />
      </ScrollView>
    </View>
  );
};

export default SelectedDriverDelivery;

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
