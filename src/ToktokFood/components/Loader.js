import React from 'react';
import {View, Modal, StyleSheet, Image, Text} from 'react-native';
import {COLOR, FONT} from 'res/variables';

import {scale, moderateScale} from 'toktokfood/helper/scale';
import {ordering} from 'toktokfood/assets/images';
import LoadingIndicator from './LoadingIndicator';

const Loader = ({visibility = false, message = '', hasImage = true, loadingIndicator = false}) => {
  return (
    <Modal
      visible={visibility}
      style={styles.container}
      transparent={true}
      animationType="fade"
      presentationStyle="overFullScreen">
      <View style={styles.content}>
        <View style={[styles.proto, styles.shadow]}>
          { hasImage && <Image style={[styles.icon, styles.paddingBottom]} source={ordering} resizeMode="contain" /> }
          { loadingIndicator && <LoadingIndicator style={styles.paddingBottom} isLoading={true} /> }
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
  },
  paddingBottom: {
    marginBottom: moderateScale(20)
  }
});
