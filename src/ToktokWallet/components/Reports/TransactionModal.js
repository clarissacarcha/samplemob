import React from 'react';
import {View, Text, Modal, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {YellowButton} from 'src/revamp';
import {OrangeButton} from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';
import {moderateScale} from 'toktokwallet/helper';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
const {width} = Dimensions.get('window');

export const TransactionModal = ({visible, setVisible, children}) => {
  const closeModal = () => setVisible(false);

  return (
    <Modal
      animationType="fade"
      visible={visible}
      onRequestClose={closeModal}
      transparent={true}
      style={styles.container}>
      <View style={styles.content}>
        <View style={styles.modalSize}>
          {children}
          <View style={styles.button}>
            <YellowButton label="OK" onPress={closeModal} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
  },
  button: {
    width: '50%',
    alignSelf: 'center',
    marginTop: moderateScale(25),
  },
  modalSize: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingVertical: moderateScale(30),
    paddingHorizontal: moderateScale(25),
    maxHeight: '50%',
  },
});
