import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CustomIcon from '../Icons';
const {width, height} = Dimensions.get('screen');

export const CustomMessageModal = () => {
  const dispatch = useDispatch();
  const {customMessageModal} = useSelector(state => state.toktokMall);

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
              onPress={() => {
                dispatch({type: 'TOKTOK_MALL_CLOSE_MESSAGE_MODAL'});
              }}
              style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
              <CustomIcon.EvIcon name="close" size={24} color="#F6841F" />
            </TouchableOpacity>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16}}>
            <Text
              style={{
                fontSize: 22,
                textAlign: "center",
                marginVertical: 10,
                width: 250
              }}>
              {customMessageModal.title[0]}
              <Text
                style={{
                  color: '#F6841F',
                  fontSize: 22,
                  textAlign: 'center',
                  marginTop: 15,
                }}>
                {customMessageModal.title[1]}
              </Text>
            </Text>
            <Text
              style={{
                // color: '#F6841F',
                fontSize: 17,
                textAlign: 'center',
                marginVertical: 15,
              }}>
              {customMessageModal.message}
            </Text>

            <TouchableOpacity
              onPress={customMessageModal.action?.onPress}
              style={{
                borderColor: '#F6841F',
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 15,
                paddingVertical: 15,
                paddingHorizontal: 30,
                borderRadius: 5,
              }}>
              <Text style={{fontSize: 16, color: '#F6841F'}}>{customMessageModal.action?.title}</Text>
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
  },
});
