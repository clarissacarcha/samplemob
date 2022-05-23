import React, {useState, useRef} from 'react';
import {Text, StyleSheet, ScrollView, View, Modal, TouchableOpacity, TextInput} from 'react-native';
import CONSTANTS from '../../../common/res/constants';
import {SheetManager} from 'react-native-actions-sheet';
import {ThrottledOpacity} from '../../../components_section';
export const ReasonCancelModal = ({isVisible, setVisible, finalizeCancel}) => {
  const dropDownRef = useRef(null);
  const [selectedReason, setSelectedReason] = useState(null);
  const [typedReason, setTypedReason] = useState('');
  const [data, setData] = useState([
    {
      label: 'Waited too long',
      value: '0',
    },
    {
      label: 'Driver asked to cancel',
      value: '1',
    },
    {
      label: 'Driver is rude',
      value: '2',
    },
    {
      label: 'Others',
      value: '4',
    },
  ]);

  const confirm = () => {
    setVisible(!isVisible);
    if (selectedReason == 4) {
      finalizeCancel(typedReason);
    } else {
      finalizeCancel(selectedReason.label);
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible} style={StyleSheet.absoluteFill}>
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
                <View style={styles.radioButtonContainer} key={key}>
                  <ThrottledOpacity
                    delay={500}
                    onPress={() => {
                      setSelectedReason(text);
                    }}
                    style={styles.radioButton}>
                    <View
                      style={text.value == selectedReason?.value ? styles.radioButtonIcon : styles.radioButtonIcon1}
                    />
                  </ThrottledOpacity>
                  <ThrottledOpacity
                    delay={500}
                    onPress={() => {
                      setSelectedReason(text);
                    }}>
                    <Text style={styles.radioButtonText}>{text.label}</Text>
                  </ThrottledOpacity>
                </View>
              );
            })}
          </ScrollView>
          {selectedReason?.value == '4' && (
            <TextInput
              ref={dropDownRef}
              value={typedReason}
              placeholder="Enter your reason"
              keyboardType="default"
              onChangeText={value => setTypedReason(value)}
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
            <ThrottledOpacity
              delay={500}
              onPress={() => setVisible(!isVisible)}
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
            </ThrottledOpacity>
            <ThrottledOpacity
              delay={500}
              disabled={selectedReason ? false : true}
              onPress={() => confirm()}
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
            </ThrottledOpacity>
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
