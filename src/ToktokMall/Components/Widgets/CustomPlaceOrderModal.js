import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CustomIcon from '../Icons';
import {successIcon, errorIcon, warningIcon, questionIcon} from '../../assets';
import { FONT, FONT_SIZE } from '../../../res/variables';
const {width, height} = Dimensions.get('screen');

export const CustomPlaceOrderModal = () => {
  const dispatch = useDispatch();
  const {customPlaceOrderModal} = useSelector(state => state.toktokMall);

  const onConfirm = () => {
    dispatch({type: 'TOKTOK_MALL_CLOSE_PLACE_ORDER_MODAL'});
    customPlaceOrderModal?.onConfirmAction();
  };

  const onCancel = () => {
    dispatch({type: 'TOKTOK_MALL_CLOSE_PLACE_ORDER_MODAL'});
    customPlaceOrderModal?.onCancelAction();
  };

  return (
    <View style={styles.centeredView}>
      <View
        style={{flexGrow: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.25)'}}>
        <View
          style={{
            backgroundColor: 'white',
            width: '90%',
            paddingVertical: 20,
            paddingHorizontal: 20,
            borderRadius: 5,
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center', paddingVertical: 16}}>
            <Image source={successIcon} style={{width: 130, height: 120, resizeMode: 'stretch', overflow: 'hidden'}} />
            <Text style={{color: '#F6841F', fontSize: 22, textAlign: 'center', marginTop: 15}}>
              {customPlaceOrderModal.title}
            </Text>
            <Text style={{color: '#9E9E9E', fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M, flex: 0, paddingVertical: 10, paddingHorizontal: 10, textAlign: 'center'}}>
              {customPlaceOrderModal.message}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={onCancel}
              style={{
                flex: 1,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 15,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#F6841F',
              }}>
              <Text style={{fontSize: 13, color: '#F6841F'}}>Continue shopping</Text>
            </TouchableOpacity>
            <View style={{flex: 0.2}} />
            <TouchableOpacity
              onPress={onConfirm}
              style={{
                flex: 1,
                backgroundColor: '#F6841F',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 15,
                borderRadius: 5,
              }}>
              <Text style={{fontSize: 13, color: '#fff'}}>Go to My Orders</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 999,
    width: width,
    height: height,
    overflow: 'visible',
  }
});
