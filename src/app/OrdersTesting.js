import React from 'react';
import {View, FlatList, StyleSheet, ScrollView} from 'react-native';

import DeliveryCardTesting from './DeliveryCardTesting';

const OrdersTesting = ({navigation}) => {
  const data = {
    id: '28',
    deliveryId: 'D1EIACS08M',
    tokConsumerId: '1',
    tokDriverId: '1',
    distance: '13.09',
    duration: '22',
    price: '139',
    expressFee: '0',
    comRate: 0,
    cashOnDelivery: null,
    collectPaymentFrom: 'S',
    cargo: 'Document',
    notes: null,
    status: 2,
    createdAt: 'Sep 16 2020 - 10:46 am',
    senderStop: {
      name: 'Juan dela Cruz',
      mobile: '+639667688262',
      landmark: null,
      formattedAddress: 'Mogpog - Balanacan Port Rd, Mogpog, Marinduque, Philippines',
      latitude: 13.5236030637247,
      longitude: 121.8645135127008,
      orderType: 1,
      scheduledFrom: null,
      scheduledTo: null,
    },
    recipientStop: {
      name: 'Pedro dela Cruz',
      mobile: '+639151234567',
      landmark: null,
      formattedAddress: 'Marinduque, Philippines',
      latitude: 13.4767171,
      longitude: 121.9032192,
      orderType: 1,
      scheduledFrom: null,
      scheduledTo: null,
    },
    logs: [
      {
        status: 1,
        image: null,
        createdAt: 'Sep 16 2020 - 10:46 am',
      },
      {
        status: 2,
        image: null,
        createdAt: 'Sep 16 2020 - 12:13 pm',
      },
      {
        status: 2,
        image: null,
        createdAt: 'Sep 16 2020 - 1:03 pm',
      },
      {
        status: 2,
        image: null,
        createdAt: 'Sep 16 2020 - 1:35 pm',
      },
    ],
    driver: {
      id: '1',
      user: {
        username: '+639151234567',
        person: {
          firstName: 'Toktok',
          lastName: 'Rider',
          avatar: 'https://s3.us-east-1.amazonaws.com/margel/1EIAS1RS62APXTNSDE7WARV1JALDUVM.jpg',
          avatarThumbnail: 'https://s3.us-east-1.amazonaws.com/margel/thumbnail/1EIAS1RS62APXTNSDE7WARV1JALDUVM.jpg',
        },
      },
    },
    driverRating: null,
    consumerRating: null,
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <DeliveryCardTesting delivery={data} onPress={() => {}} lastItem={false} />
        <DeliveryCardTesting delivery={data} onPress={() => {}} lastItem={true} />
      </ScrollView>
    </View>
  );
};

export default OrdersTesting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
