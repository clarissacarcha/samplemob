import React, {useContext, useState} from 'react';
import {Modal, StyleSheet, View, Dimensions, Text, TouchableOpacity} from 'react-native';
import {moderateScale} from 'toktokwallet/helper';
import {CustomAmountInput} from 'toktokwallet/components';
import {VerifyContext} from '../../../VerifyContextProvider';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

const {width} = Dimensions.get('window');

export const EnterAmountModal = ({
  visible,
  setVisible,
  onPressGenerateQr,
  onPressNo = () => {},
  title = 'Add to Favorites',
  message = 'Would you like to add this Biller to your Favorites?',
}) => {
  const {setAmount, amount, getAccountQrCodes} = useContext(VerifyContext);
  const [tempAmount, setTempAmount] = useState(amount);

  const handleGenerateQR = () => {
    onPressGenerateQr(tempAmount);
    setAmount(tempAmount);
    getAccountQrCodes();
  };

  return (
    <>
      <Modal visible={visible} onRequestClose={() => setVisible(false)} style={styles.container} transparent={true}>
        <View style={styles.content}>
          <View style={styles.closePrompt}>
            <View style={{paddingBottom: moderateScale(20)}}>
              <Text style={styles.title}>Enter Amount</Text>
              <CustomAmountInput
                value={tempAmount}
                onChangeText={val => {
                  setTempAmount(val);
                }}
              />
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                  onPressNo();
                }}
                style={styles.noBtn}>
                <Text style={styles.textNo}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                  handleGenerateQR();
                }}
                style={styles.yesContainer}>
                <Text style={styles.textYes}>Generate QR</Text>
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
  },
  actions: {
    flexDirection: 'row',
    height: 40,
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
    width: moderateScale(130),
    height: moderateScale(130),
    resizeMode: 'contain',
  },
  title: {
    fontFamily: FONT.SEMI_BOLD,
    fontSize: FONT_SIZE.M,
    color: '#525252',
  },
  message: {
    fontSize: FONT_SIZE.M,
    textAlign: 'center',
    paddingVertical: moderateScale(15),
    marginBottom: moderateScale(10),
  },
  textNo: {
    fontFamily: FONT.SEMI_BOLD,
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
    fontFamily: FONT.SEMI_BOLD,
    fontSize: FONT_SIZE.L,
    color: 'white',
  },
});
