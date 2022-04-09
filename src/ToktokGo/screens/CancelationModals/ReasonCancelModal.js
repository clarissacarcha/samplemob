import React, {useState, useRef} from 'react';
import {Text, StyleSheet, ScrollView, View, Modal, TouchableOpacity, TextInput} from 'react-native';
import CONSTANTS from '../../../common/res/constants';
import WarningIMG from '../../../assets/images/warning.png';

export const ReasonCancelModal = ({}) => {
  const dropDownRef = useRef(null);
  const [selectedReason, setSelectedReason] = useState();
  const [data, setData] = useState([
    {
      label: 'Passenger no show',
      value: '0',
    },
    {
      label: 'Passenger rude',
      value: '1',
    },
    {
      label: 'Passenger is with a pets',
      value: '2',
    },
    {
      label: 'Others',
      value: '4',
    },
  ]);

  return (
    <Modal animationType="fade" transparent={true} visible={false} style={StyleSheet.absoluteFill}>
      <View style={styles.transparent}>
        <View style={styles.card}>
          <View style={styles.containerHeader}>
            <View style={styles.titleHeader}>
              <Text style={styles.headerText}>Reason for cancelling</Text>
            </View>
          </View>
          <ScrollView style={styles.scrollview}>
            {data.map((text, key) => {
              return (
                <View style={styles.radioButtonContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedReason(text.value);
                    }}
                    style={styles.radioButton}>
                    <View style={text.value == selectedReason ? styles.radioButtonIcon : styles.radioButtonIcon1} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedReason(text.value);
                    }}>
                    <Text style={styles.radioButtonText}>{text.label}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
          {selectedReason == '4' && (
            <TextInput
              ref={dropDownRef}
              // value={description}
              placeholder="Enter your reason"
              keyboardType="default"
              // onChangeText={(value) => setDescription(value)}
              style={styles.Input}
              numberOfLines={5}
              multiline
            />
          )}
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              paddingHorizontal: 25,
              paddingTop: 20,
            }}>
            <TouchableOpacity
              onPress={() => setShowReason(!showReason)}
              style={{
                flex: 1,
                paddingVertical: 10,
                marginRight: 24,
                alignItems: 'center',
                borderRadius: 5,
                backgroundColor: CONSTANTS.COLOR.WHITE,
                borderWidth: 1,
                borderColor: CONSTANTS.COLOR.ORANGE,
              }}>
              <Text
                style={{
                  fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
                  fontSize: CONSTANTS.FONT_SIZE.XL,
                  color: CONSTANTS.COLOR.ORANGE,
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => succefullCancel()}
              style={{
                flex: 1,
                paddingVertical: 10,
                alignItems: 'center',
                borderRadius: 5,
                backgroundColor: CONSTANTS.COLOR.ORANGE,
                borderWidth: 1,
                borderColor: CONSTANTS.COLOR.ORANGE,
              }}>
              <Text
                style={{
                  fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
                  fontSize: CONSTANTS.FONT_SIZE.XL,
                  color: CONSTANTS.COLOR.WHITE,
                }}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  transparent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 30,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: CONSTANTS.COLOR.WHITE,
    borderRadius: 10,
    paddingVertical: 30,
  },
  containerHeader: {
    justifyContent: 'flex-start',
    borderBottomColor: '#DFDFDF',
    borderBottomWidth: 2,
  },
  titleHeader: {
    // paddingTop: 10,
    paddingLeft: 20,
    paddingBottom: 20,
  },
  headerText: {
    color: '#F6841F',
    fontSize: CONSTANTS.FONT_SIZE.XL,
    lineHeight: 20,
    fontWeight: '600',
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
  },
  scrollview: {
    maxHeight: '75%',
    color: 'red',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 23,
    paddingTop: 20,
  },
  radioButton: {
    height: 16,
    width: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F9B71A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButton1: {
    height: 16,
    width: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonIcon: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#F9B71A',
  },
  radioButtonText: {
    fontSize: 13,
    marginLeft: 16,
    lineHeight: 15,
    fontWeight: '400',
  },
  Input: {
    height: 69,
    textAlignVertical: 'top',
    borderColor: '#EAEAEA',
    borderWidth: 1,
    marginVertical: 10,
    fontSize: 11,
    padding: 8,
    backgroundColor: '#F8F8F8',
    borderRadius: 5,
    width: '85%',
    marginHorizontal: 23,
    marginTop: 20,
  },
});
