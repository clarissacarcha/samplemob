import React, {useState, useRef} from 'react';
import {Text, StyleSheet, ScrollView, View, Modal, TouchableOpacity, TextInput} from 'react-native';
import CONSTANTS from '../../../common/res/constants';
import {SheetManager} from 'react-native-actions-sheet';
import {ThrottledOpacity} from '../../../components_section';
export const ReasonCancelModal = ({isVisible, setVisible, finalizeCancel}) => {
  const dropDownRef = useRef(null);
  const scrollViewRef = useRef();
  const [selectedReason, setSelectedReason] = useState(null);
  const [typedReason, setTypedReason] = useState('');
  const [data, setData] = useState([
    {
      label: 'Driver took too long to arrive',
      value: '0',
    },
    {
      label: 'Found a cheaper option/Found another ride',
      value: '1',
    },
    {
      label: 'Changed my mind',
      value: '2',
    },
    {
      label: 'Want to change address',
      value: '3',
    },
    {
      label: 'Wrong address/Wrong pin/Wrong pick-up point',
      value: '4',
    },
    {
      label: 'Forgot to input promo code',
      value: '5',
    },
    {
      label: 'Driver is too far from pick-up point, not willing to wait',
      value: '6',
    },
    {
      label: "Driver doesn't accept cash/toktokwallet/e-mobile wallet",
      value: '7           ',
    },
    {
      label: 'Driver is asking for additional charge',
      value: '8',
    },
    {
      label: 'Driver asked to cancel',
      value: '9',
    },
    {
      label: 'The actual driver is different from the app',
      value: '10',
    },
    {
      label: 'Different unit arrived',
      value: '11',
    },
    {
      label: "Driver is not vaccinated/Doesn't follow safety protocols",
      value: '12',
    },
    {
      label: 'Driver is rude/inapprorpiate behavior',
      value: '13',
    },
    {
      label: 'The payment method I chose has a problem',
      value: '14',
    },
    {
      label: 'Chose the wrong service',
      value: '15',
    },
    {
      label: 'Chose the wrong vehicle',
      value: '16',
    },
    {
      label: 'Driver no-show',
      value: '17',
    },
    {
      label: 'Other, please state: ',
      value: '18',
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
          <ScrollView style={styles.scrollview} ref={scrollViewRef}>
            {data.map((text, key) => {
              return (
                <View style={styles.radioButtonContainer} key={key}>
                  <ThrottledOpacity
                    delay={500}
                    onPress={() => {
                      setSelectedReason(text);
                      if (selectedReason?.value == '18') scrollViewRef.current.scrollToEnd({animated: true});
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
                      if (selectedReason?.value == '18') scrollViewRef.current.scrollToEnd({animated: true});
                    }}>
                    <Text style={styles.radioButtonText}>{text.label}</Text>
                  </ThrottledOpacity>
                </View>
              );
            })}
          </ScrollView>
          {selectedReason?.value == '18' && (
            <View style={styles.containerTextInput}>
              <TextInput
                ref={dropDownRef}
                value={typedReason}
                placeholder="Enter your reason"
                keyboardType="default"
                onChangeText={value => setTypedReason(value)}
                style={styles.Input}
                numberOfLines={5}
                maxLength={320}
                multiline
              />
              {/* <View style={{alignItems: 'flex-end'}}>
                <Text style={styles.textInputLength}>{typedReason.length}/320</Text>
              </View> */}
            </View>
          )}
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              paddingHorizontal: 25,

              position: 'absolute',
              bottom: 0,
              paddingVertical: 0,
              paddingBottom: 25,
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
                margin: 10,
              }}>
              <Text
                style={{
                  fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
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
                  fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
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
    paddingTop: 30,
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
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
  },
  scrollview: {
    maxHeight: '75%',
    color: 'red',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 23,
    paddingTop: 20,
    marginRight: 10,
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
    backgroundColor: CONSTANTS.COLOR.MEDIUM_DARK,
    borderRadius: 5,
    width: '85%',
    marginHorizontal: 23,
    marginTop: 20,
  },
  Input: {
    height: 69,
    textAlignVertical: 'top',
    borderColor: CONSTANTS.COLOR.MEDIUM_DARK,
    borderWidth: 1,
    fontSize: 11,
    padding: 8,
    backgroundColor: CONSTANTS.COLOR.MEDIUM_DARK,
    borderRadius: 5,
    width: '100%',
  },
  containerTextInput: {
    marginTop: -30,
    marginHorizontal: 16,
    backgroundColor: CONSTANTS.COLOR.MEDIUM_DARK,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.MEDIUM_DARK,
  },
  textInputLength: {
    marginRight: 15,
    marginBottom: 10,
    color: '#9E9E9E',
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    fontSize: CONSTANTS.FONT_SIZE.S,
  },
});
