import React, {useState, useEffect} from 'react';
import {Text, View, FlatList, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import Data from '../../components/BookingDummyData';
import CONSTANTS from '../../../common/res/constants';
import {Header} from '../../components';
import {useQuery} from '@apollo/react-hooks';
import {GET_VOUCHERS} from '../../graphql';
import {TOKTOK_GO_GRAPHQL_CLIENT} from '../../../graphql';
import {VoucherCard} from './Components/VoucherCard';
import {TextInput} from 'react-native-gesture-handler';
import {throttle} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import NoVouchers from '../../../assets/toktokgo/no-vouchers.png';

const ToktokGoBookingVouchers = ({navigation}) => {
  const {details} = useSelector(state => state.toktokGo);
  const dispatch = useDispatch();

  const {data = {getVouchers: {}}, loading} = useQuery(GET_VOUCHERS, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onError: error => console.log('error', error),
  });

  const onApply = throttle(
    item => {
      dispatch({
        type: 'SET_TOKTOKGO_BOOKING_DETAILS',
        payload: {...details, voucher: item},
      });
      navigation.pop();
    },
    1000,
    {trailing: false},
  );

  return (
    <View style={{flex: 1, backgroundColor: CONSTANTS.COLOR.WHITE}}>
      <Header navigation={navigation} title={'Vouchers'} />
      <View style={styles.enterVoucherGroup}>
        <TextInput style={styles.enterVoucherInput} placeholder={'Enter voucher code'} />
        <TouchableOpacity>
          <Text style={styles.enterVoucherApply}>Apply</Text>
        </TouchableOpacity>
      </View>
      {data.getVouchers.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data.getVouchers}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => {
            const lastItem = index == data.getVouchers.length - 1 ? true : false;
            return (
              <View style={{marginHorizontal: 16}}>
                <VoucherCard item={item} onApply={() => onApply(item)} lastItem={lastItem} />
              </View>
            );
          }}
        />
      ) : (
        <ScrollView>
          <Image source={NoVouchers} />
        </ScrollView>
      )}
    </View>
  );
};

export default ToktokGoBookingVouchers;

const styles = StyleSheet.create({
  enterVoucherGroup: {
    flexDirection: 'row',
    marginHorizontal: 16,
    alignItems: 'center',
    marginVertical: 24,
  },
  enterVoucherInput: {
    flex: 1,
    backgroundColor: CONSTANTS.COLOR.MEDIUM_DARK,
    paddingLeft: 16,
    marginRight: 16,
    borderRadius: 5,
  },
  enterVoucherApply: {
    color: CONSTANTS.COLOR.ORANGE,
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    fontSize: CONSTANTS.FONT_SIZE.M,
  },
});
