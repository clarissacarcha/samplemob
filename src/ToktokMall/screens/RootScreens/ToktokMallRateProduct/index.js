import React from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import {HeaderBack, HeaderTitle, HeaderRight} from '../../../Components';
import {Item} from './Components';

export const ToktokMallRateProduct = ({data = sample, route}) => {
  const navigation = useNavigation();
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Rate Product']} />,
    headerRight: () => <HeaderRight hidden={true} />,
  });

  return (
    <FlatList
      data={data}
      renderItem={({item}) => <Item {...item} />}
      ListFooterComponent={
        <View style={{backgroundColor: "#FFF"}}>
          <TouchableOpacity
          style={{
            backgroundColor: '#F6841F',
            alignItems: 'center',
            alignSelf: 'center',
            width: 180,
            paddingVertical: 10,
            borderRadius: 5,
            marginTop: 60,
            marginBottom: 40
          }}
          onPress={() => {
            route.params.openModal();
            navigation.goBack();
          }}>
          <Text style={{color: '#FFF', fontSize: 18, fontWeight: '100'}}>Submit</Text>
        </TouchableOpacity>
        </View>
      }
    />
  );
};

const sample = [
  {
    label: 'Improved Copper Mask 2.0 White or Bronze',
    originalPrice: 380,
    price: 190,
    variation: 'Black',
    qty: 1,
    image: '',
  },
  {
    label: 'Improved Copper Mask 2.0 White or Bronze',
    originalPrice: 380,
    price: 190,
    variation: 'Black',
    qty: 1,
    image: '',
  },
];
