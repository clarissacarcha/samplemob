import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, TouchableWithoutFeedback} from 'react-native';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {YellowButton} from 'src/revamp';
import {FlatList} from 'react-native';

import {moderateScale} from 'toktokwallet/helper';

import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;
export const ListModal = ({visible, setVisible, data, onChangeSelect}) => {
  return (
    <Modal
      style={{margin: 0}}
      visible={visible}
      onRequestClose={() => setVisible(false)}
      transparent={true}
      animationType="fade">
      <View style={styles.dateModalContent}>
        <View
          style={{
            backgroundColor: 'white',
            width: '80%',
            maxHeight: '70%',
            borderRadius: moderateScale(10),
            padding: moderateScale(10),
          }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            ItemSeparatorComponent={() => (
              <View style={{height: 1, backgroundColor: '#F4F4F4', marginHorizontal: moderateScale(20)}} />
            )}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => {
                  onChangeSelect({value: item.description, index});
                  setVisible(false);
                }}
                style={[styles.content]}>
                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  dateModalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  content: {
    padding: moderateScale(20),
    width: '100%',
  },
});
