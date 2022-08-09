import React from 'react';
import {View, Dimensions, TouchableOpacity, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';

import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;
const {height, width} = Dimensions.get('window');

export const CustomBottomSheet = ({visible, setVisible, children}) => {
  return (
    <View>
      <Modal style={{margin: 0}} pointerEvents="box-none" isVisible={visible} hasBackdrop={true}>
        <TouchableOpacity activeOpacity={1} onPress={() => setVisible(false)} style={styles.container}>
          <TouchableWithoutFeedback>
            <View style={styles.content}>{children}</View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  content: {
    width: width + 5,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopWidth: 3,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderColor: COLOR.ORANGE,
    marginHorizontal: -2,
    backgroundColor: 'white',
    minHeight: height / 3,
  },
});
