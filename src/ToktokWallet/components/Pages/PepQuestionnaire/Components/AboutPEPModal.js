import React from 'react';
import {View, Text, StyleSheet, Modal, Dimensions, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {moderateScale} from 'toktokwallet/helper';

import {OrangeButton} from 'toktokwallet/components';

import CONSTANTS from 'common/res/constants';
const {FONT_FAMILY: FONT, FONT_SIZE, SIZE, COLOR} = CONSTANTS;
const {height, width} = Dimensions.get('screen');

export const AboutPEPModal = ({visible, setVisible, title, onPress}) => {
  const onPressClose = () => {
    setVisible(false);
  };

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onPressClose} style={styles.container}>
      <View style={styles.modalBody}>
        <View style={styles.content}>
          <Text style={{textAlign: 'center'}}>
            A “Politically Exposed Person” or PEP is a current or former senior official in the executive, legislative,
            administrative, military or judicial branch of a foreign government, elected or not; a senior official of a
            major foreign political party; a senior executive of a foreign government-owned commercial enterprise,
            and/or being a corporation, business or other entity formed by or for the benefit of any such individual; an
            immediate family member of such individual (including spouse, parents, siblings, children, and spouse’s
            parents or siblings); and any individual publicly known to be a close personal or professional associate.{' '}
          </Text>
          <OrangeButton onPress={onPressClose} label="OK" buttonStyle={styles.buttonStyle} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalBody: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: SIZE.BORDER_RADIUS,
    padding: moderateScale(25),
    alignItems: 'center',
  },
  buttonStyle: {
    width: '100%',
    marginTop: moderateScale(20),
  },
});
