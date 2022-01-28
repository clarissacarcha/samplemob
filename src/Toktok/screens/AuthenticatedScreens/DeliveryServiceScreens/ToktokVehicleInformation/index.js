import React, {useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import {connect} from 'react-redux';
import {HeaderBack, HeaderTitle, AlertOverlay} from 'src/components';
import {YellowButton} from 'src/revamp';
import CONSTANTS from 'common/res/constants';
import {GET_DELIVERY_PRICE_AND_DIRECTIONS} from '../../../../../graphql';
import {onErrorAlert} from '../../../../../util/ErrorUtility';
import {useAlert} from '../../../../../hooks';

import {VehicleType} from './components/';

const Screen = ({navigation, route, session}) => {
  const {vehicleTypesData, orderData, setOrderData} = route.params;
  const [selectedVehicleType, setSelectedVehicleType] = useState({id: null});

  const AlertHook = useAlert();

  const [getDeliveryPriceAndDirections, {loading}] = useLazyQuery(GET_DELIVERY_PRICE_AND_DIRECTIONS, {
    fetchPolicy: 'no-cache',
    onError: error => {
      onErrorAlert({alert: AlertHook, error});
    },
    onCompleted: data => {
      // console.log(JSON.stringify({data}, null, 4));
      // console.log({data: data.getDeliveryPriceAndDirections.pricing});
      onVehicleSelected({
        quotation: data.getDeliveryPriceAndDirections,
      });
    },
  });

  // console.log(JSON.stringify({orderData}, null, 4));

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Select', 'Vehicle']} />,
  });

  const onVehicleSelected = ({quotation}) => {
    const updatedOrderData = {
      ...orderData,
      vehicleTypeId: selectedVehicleType.id,
    };

    navigation.push('DeliveryDetails', {
      orderData: updatedOrderData,
      setOrderData,
      quotation,
    });
  };

  const onSubmit = () => {
    getDeliveryPriceAndDirections({
      variables: {
        input: {
          consumerId: session.user.consumer.id,
          vehicleTypeId: selectedVehicleType.id,
          promoCode: '',
          isExpress: false,
          isCashOnDelivery: false,

          origin: {
            latitude: orderData.senderStop.latitude,
            longitude: orderData.senderStop.longitude,
          },
          destinations: [
            {
              latitude: orderData.recipientStop[0].latitude,
              longitude: orderData.recipientStop[0].longitude,
            },
          ],
        },
      },
    });
  };

  return (
    <View style={styles.screen}>
      <AlertOverlay visible={loading} />
      <View style={styles.screenBody}>
        <FlatList
          data={vehicleTypesData}
          renderItem={({item, index}) => (
            <VehicleType
              item={item}
              index={index}
              data={vehicleTypesData}
              selectedVehicleType={selectedVehicleType}
              setSelectedVehicleType={setSelectedVehicleType}
            />
          )}
          ItemSeparatorComponent={() => <View style={{height: CONSTANTS.MARGIN.M}} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {selectedVehicleType.id ? (
        <View style={styles.buttonBox}>
          <YellowButton label="Select Vehicle" onPress={onSubmit} style={{margin: CONSTANTS.MARGIN.M}} />
        </View>
      ) : (
        <View style={styles.buttonBox}>
          <YellowButton
            label="Select Vehicle"
            onPress={() => {}}
            style={{margin: CONSTANTS.MARGIN.M, backgroundColor: CONSTANTS.COLOR.MEDIUM}}
          />
        </View>
      )}
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

export const ToktokVehicleInformation = connect(mapStateToProps, null)(Screen);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  screenBody: {
    flex: 1,
  },
  buttonBox: {
    backgroundColor: '#F7F7FA',
  },
});
