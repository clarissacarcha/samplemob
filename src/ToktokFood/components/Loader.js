import React from 'react';
import {View, Modal, StyleSheet, Image, Text} from 'react-native';
import {COLOR, FONT} from 'res/variables';

import {verticalScale, scale, moderateScale} from 'toktokfood/helper/scale';
import {ordering} from 'toktokfood/assets/images';

const Loader = ({visibility = false, message = ''}) => {
  return (
    <Modal
      visible={visibility}
      style={styles.container}
      transparent={true}
      animationType="fade"
      presentationStyle="overFullScreen">
      <View style={styles.content}>
        <View style={[styles.proto, styles.shadow]}>
          <Image style={styles.icon} source={ordering} resizeMode="contain" />
          <Text style={styles.messageContent}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(241, 241, 241, 0.85)',
  },
  proto: {
    width: '80%',
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFFF',
    paddingVertical: scale(15),
    height: verticalScale(250),
  },
  shadow: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    width: scale(164),
    height: scale(164),
  },
  messageContent: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: COLOR.ORANGE,
    fontFamily: FONT.NORMAL,
    marginTop: moderateScale(20),
  },
});
