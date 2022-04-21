import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CustomIcon from '../Icons';
import {successIcon, errorIcon, warningIcon, questionIcon} from '../../assets';
const {width, height} = Dimensions.get('screen');

export const Modal = () => {
  const dispatch = useDispatch();
  const {modal} = useSelector(state => state.toktokMall);

  const onConfirm = () => {
    dispatch({type: 'TOKTOK_MALL_CLOSE_MODAL_2'});
    modal.onConfirm();
  };
  const getIconByType = () => {
      const {type} = modal
    if(type == "Success") return successIcon
    else if(type == "Error") return errorIcon
    else if(type == "Warning") return warningIcon
    else if(type == "Question") return questionIcon
  }
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
          <View style={{justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16}}>
            <Image source={getIconByType()} style={{width: 130, height: 120, resizeMode: 'stretch', overflow: 'hidden'}} />
            <Text style={{color: '#F6841F', fontSize: 22, textAlign: 'center', marginTop: 15}}>
              {modal.title}
            </Text>
            <Text style={{fontSize: 13, textAlign: 'center', marginTop: 15}}>{modal.message}</Text>
          </View>
          <View style={{paddingVertical: 8}} />
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
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
