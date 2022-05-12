import React, {useState} from 'react';
import {Text, StyleSheet, Image, View, Modal, TouchableOpacity} from 'react-native';
import constants from '../../../../common/res/constants';
import Warning from '../../../../common/assets/globalert/Success.png';

export const FeedbackModal = ({showModal, showBookingReason, popTo, navigation, rateDriverDone}) => {
  return (
    <>
      <Modal animationType="fade" transparent={true} visible={showModal} style={StyleSheet.absoluteFill}>
        <View style={styles.transparent}>
          <View style={styles.card}>
            <View style={styles.containerFeedback}>
              <Image style={{height: 120, width: 135}} source={Warning} />
              <Text style={styles.FeedbackText}>Feedback Sent!</Text>
              <Text style={styles.feedbackMessage}>Thank you for riding with us.</Text>
              <Text style={styles.feedbackText}>Have a great day, ka-toktok!</Text>
            </View>
            <View style={styles.containerBtnFeedback}>
              <TouchableOpacity style={styles.btnOk} onPress={rateDriverDone}>
                <Text style={styles.btnTextOk}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    backgroundColor: constants.COLOR.WHITE,
    borderRadius: 10,
    paddingVertical: 30,
  },
  containerFeedback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  FeedbackText: {
    fontFamily: constants.FONT_FAMILY.BOLD,
    fontSize: constants.FONT_SIZE.XL + 3,
    color: constants.COLOR.ORANGE,
    paddingVertical: 20,
  },
  feedbackMessage: {
    marginBottom: 20,
    color: constants.COLOR.BLACK,
    fontFamily: constants.FONT_FAMILY.REGULAR,
    fontSize: constants.FONT_SIZE.M,
    lineHeight: constants.FONT_SIZE.L,
  },
  feedbackText: {
    marginTop: -17,
    color: constants.COLOR.BLACK,
    fontFamily: constants.FONT_FAMILY.REGULAR,
    fontSize: constants.FONT_SIZE.M,
    lineHeight: constants.FONT_SIZE.L,
  },
  containerBtnFeedback: {
    flexDirection: 'row',
    marginHorizontal: 10,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingTop: 20,
  },
  btnOk: {
    backgroundColor: constants.COLOR.ORANGE,
    borderRadius: 5,
    paddingHorizontal: '40%',
    alignItems: 'center',
    paddingVertical: 6,
  },
  btnTextOk: {
    fontFamily: constants.FONT_FAMILY.BOLD,
    fontSize: constants.FONT_SIZE.XL,
    color: constants.COLOR.WHITE,
  },
});
