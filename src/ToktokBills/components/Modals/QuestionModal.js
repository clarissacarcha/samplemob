import React from 'react';
import {Modal, StyleSheet, View, StatusBar, Dimensions, Text, TouchableOpacity, Image} from 'react-native';
import {moderateScale} from 'toktokload/helper';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;

const {width, height} = Dimensions.get('window');

//ICONS
const TOKBILLS_QUESTION_ICON = require('../../../ToktokBills/assets/icons/question.png');

export const AddFaveModal = ({
  visible,
  setVisible,
  onPressYes,
  onPressNo,
  title = 'Add to Favorites',
  message = 'Would you like to add this Biller to your Favorites?',
}) => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={visible ? 'rgba(0,0,0, 0.7)' : 'transparent'} />
      <Modal visible={visible} onRequestClose={() => setVisible(false)} style={styles.container} transparent={true}>
        <View style={styles.content}>
          <View style={styles.closePrompt}>
            <Image source={TOKBILLS_QUESTION_ICON} style={styles.largeIcon} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                  onPressNo();
                }}
                style={styles.noBtn}>
                <Text style={styles.textNo}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                  onPressYes();
                }}
                style={styles.yesContainer}>
                <Text style={styles.textYes}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  closePrompt: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(30),
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    height: 50,
  },
  noBtn: {
    borderRadius: 5,
    marginRight: 10,
    height: '100%',
    borderColor: COLOR.ORANGE,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeIcon: {
    width: moderateScale(160),
    height: moderateScale(160),
    resizeMode: 'contain',
  },
  title: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.XL,
    textAlign: 'center',
    marginTop: 10,
    marginHorizontal: moderateScale(20),
    color: '#FFBF00',
  },
  message: {
    fontSize: FONT_SIZE.M,
    textAlign: 'center',
    paddingVertical: moderateScale(15),
    marginBottom: moderateScale(10),
  },
  textNo: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
    color: COLOR.ORANGE,
  },
  yesContainer: {
    borderRadius: 5,
    marginLeft: 10,
    height: '100%',
    backgroundColor: COLOR.ORANGE,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textYes: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
    color: 'white',
  },
});
