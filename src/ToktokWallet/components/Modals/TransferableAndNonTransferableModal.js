import React from 'react';
import {Modal, StyleSheet, View, StatusBar, Dimensions, Text, TouchableOpacity, Image} from 'react-native';
import {moderateScale, currencyCode, numberFormat} from 'toktokwallet/helper';
import {OrangeButton} from 'toktokwallet/components';
import {useAccount} from 'toktokwallet/hooks';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;

const {width, height} = Dimensions.get('window');

export const TransferableAndNonTransferableModal = ({visible, setVisible}) => {
  const {tokwaAccount} = useAccount();

  return (
    <>
      <Modal visible={visible} onRequestClose={() => setVisible(false)} style={styles.container} transparent={true}>
        <View style={styles.content}>
          <View style={styles.closePrompt}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontFamily: FONT.BOLD}}>Transferrable Amount</Text>
              <Text style={{fontFamily: FONT.BOLD}}>
                {currencyCode}
                {numberFormat(tokwaAccount.wallet.transferableBalance)}
              </Text>
            </View>
            <Text style={{color: '#525252', marginTop: moderateScale(5)}}>
              Cash Ins via online banks, debit card, OTC bank, OTC non-bank and JC Wallet can be transferred to other
              toktokwallet users’ accounts and/or bank accounts.
            </Text>
            <View style={{height: 1, backgroundColor: '#F4F4F4', marginVertical: moderateScale(16)}} />
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontFamily: FONT.BOLD}}>Non-Transferrable Amount</Text>
              <Text style={{fontFamily: FONT.BOLD}}>
                {currencyCode}
                {numberFormat(tokwaAccount.wallet.creditCardBalance)}
              </Text>
            </View>
            <Text style={{color: '#525252', marginTop: moderateScale(5)}}>
              Cash Ins via credit card, or foreign debit card cannot be transferred to any toktokwallet users’ accounts
              and/or bank accounts. This toktokwallet balance can only be used as payments for goods and services.
            </Text>
            <View style={{marginTop: moderateScale(20)}}>
              <OrangeButton
                label="OK"
                onPress={() => {
                  setVisible(false);
                }}
              />
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
    // flexDirection: 'row',
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
