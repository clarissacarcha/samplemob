import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import { COLOR, FONT } from '../../../../res/variables';
import {HeaderBack, HeaderTitle, HeaderRight} from '../../../Components';

export const ToktokMallCheckout = ({navigation}) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Checkout', '']} />,
    headerRight: () => <HeaderRight hidden={true} />
  });

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{flex: 1}}>

        <View style={{ height: 8, backgroundColor: '#F7F7FA'}} />
        <View style={{paddingVertical: 15, paddingHorizontal: 15}}>
          <View style={{flexDirection: 'row', paddingBottom: 15}}>
            <View style={{flex: 1}}>
              <Text style={{fontFamily: FONT.BOLD, fontSize: 14}}>Delivery Address</Text>
            </View>
            <TouchableOpacity onPress={() => {
              navigation.navigate("ToktokMallAddressesMenu")
            }} style={{flex: 1, flexDirection: 'row-reverse'}}>
              <Text style={{color: COLOR.ORANGE, fontSize: 14}}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={{paddingVertical: 15, paddingHorizontal: 8, backgroundColor: '#F8F8F8', borderRadius: 5}}>
            <Text style={{fontSize: 14}}>Cloud Panda PH</Text>
            <Text style={{fontSize: 13, color: "#9E9E9E"}}>09050000000</Text>
            <Text style={{fontSize: 13}}>10F Inoza Tower, 40th Street, Bonifacio Global City</Text>
          </View>
        </View>
        <View style={{ height: 8, backgroundColor: '#F7F7FA'}} />

      </View>
    </View>
  );
};
