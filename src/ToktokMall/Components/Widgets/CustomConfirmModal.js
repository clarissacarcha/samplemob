import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CustomIcon from '../Icons';
import {successIcon, errorIcon, warningIcon, questionIcon} from '../../assets';
const {width, height} = Dimensions.get('window');

export const CustomConfirmModal = () => {
  const dispatch = useDispatch();
  const {customConfirmModal} = useSelector(state => state.toktokMall);

  const onConfirm = () => {
    dispatch({type: 'TOKTOK_MALL_CLOSE_CONFIRM_MODAL'});
    customConfirmModal.onConfirmAction();
  };

  const onCancel = () => {
    dispatch({type: 'TOKTOK_MALL_CLOSE_CONFIRM_MODAL'});
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
          <View style={{flexDirection: 'row', paddingHorizontal: 0}}>
            <TouchableOpacity
              onPress={onCancel}
              style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
              <CustomIcon.EvIcon name="close" size={24} color="#F6841F" />
            </TouchableOpacity>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16}}>
            <Image source={warningIcon} style={{width: 130, height: 120, resizeMode: 'stretch', overflow: 'hidden'}} />
            <Text style={{color: '#F6841F', fontSize: 22, textAlign: 'center', marginTop: 15}}>
              {customConfirmModal.message}
            </Text>
          </View>
          <View style={{paddingVertical: 8}} />
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={onCancel}
              style={{
                flex: 1,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 8,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#F6841F',
              }}>
              <Text style={{fontSize: 13, color: '#F6841F'}}>Cancel</Text>
            </TouchableOpacity>
            <View style={{flex: 0.2}} />
            <TouchableOpacity
              onPress={onConfirm}
              style={{
                flex: 1,
                backgroundColor: '#F6841F',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 8,
                borderRadius: 5,
              }}>
              <Text style={{fontSize: 13, color: '#fff'}}>Confirm</Text>
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
