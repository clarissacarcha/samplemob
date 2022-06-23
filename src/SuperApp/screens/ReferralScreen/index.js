import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  ImageBackground,
  ImagePickerIOS,
  StatusBar,
} from 'react-native';

import CONSTANTS from '../../../common/res/constants';
import TokIcon from '../../../assets/images/Promos/ToktokAppIcon.png';
import voucherPaperDesign from '../../../assets/toktokgo/voucher-paper-design.png';
import VoucherIMG from '../../../assets/images/Promos/VoucherImage.png';
import ArrowLeftIcon from '../../../assets/icons/arrow-left-icon.png';

import {ThrottledOpacity} from '../../../components_section';

import ReferralBG from '../../../assets/images/Promos/ReferralBG.png';

const decorHeight = Dimensions.get('window').height * 0.15;

export const ReferralScreen = ({navigation}) => {
  return (
    <ImageBackground source={ReferralBG} style={styles.container}>
      <ThrottledOpacity style={styles.backButton} onPress={() => navigation.pop()}>
        <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
      </ThrottledOpacity>

      <View style={styles.innerContainer}>
        <Image source={TokIcon} resizeMode={'contain'} style={{height: decorHeight}} />
        <Text
          style={{marginTop: 42, fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD, fontSize: CONSTANTS.FONT_SIZE.XL + 7}}>
          Welcome ka-toktok!
        </Text>
        <Text style={{textAlign: 'center', marginTop: 12}}>Did a driver refer you? Enter Driver ID</Text>
        <Text style={{textAlign: 'center', marginBottom: 28}}> below to claim New User Voucher!</Text>

        <View style={styles.card}>
          <Image source={voucherPaperDesign} resizeMode={'contain'} style={styles.floatingImage} />
          <View style={styles.voucherText}>
            <Text style={styles.voucherName}>NEW USER VOUCHER</Text>
            <Text style={styles.voucherAmount}>₱10,000.00</Text>
          </View>
          <Image source={VoucherIMG} resizeMode={'contain'} style={styles.voucherImage} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Driver ID" />
        </View>

        <ThrottledOpacity style={styles.button}>
          <Text style={styles.buttonText}>Claim Now</Text>
        </ThrottledOpacity>

        <Text style={{marginTop: 24}}>Congratulations for signing up. Enjoy voucher worth</Text>
        <Text>
          ₱10,000 for <Text style={{color: CONSTANTS.COLOR.YELLOW}}>toktok</Text>
          <Text style={{color: CONSTANTS.COLOR.ORANGE}}>go</Text> ride. Let's go ka-toktok!
        </Text>
      </View>

      <Text style={styles.footer}>Toktok Terms and Conditions Apply</Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  innerContainer: {
    marginTop: StatusBar.currentHeight + 50,
    alignItems: 'center',
  },
  card: {
    borderRadius: 5,
    height: decorHeight,
    marginHorizontal: 42,
    backgroundColor: CONSTANTS.COLOR.WHITE,
    flexDirection: 'row',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  floatingImage: {
    height: decorHeight,
    position: 'absolute',
    left: -20,
  },
  voucherText: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 20,
  },
  voucherName: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
  },
  voucherAmount: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    color: CONSTANTS.COLOR.ORANGE,
  },
  voucherImage: {
    marginRight: 18,
    width: decorHeight,
    height: decorHeight,
  },
  iconDimensions: {
    width: 10,
    height: 15,
  },
  backButton: {
    position: 'absolute',
    top: StatusBar.currentHeight + 23,
    left: 16,
    padding: 6,
  },
  inputContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 5,
    alignSelf: 'stretch',
    marginHorizontal: 82,
    marginVertical: 20,
  },
  input: {
    marginHorizontal: 12,
    color: CONSTANTS.COLOR.BLACK,
    alignSelf: 'stretch',
  },
  button: {
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 11,
    marginHorizontal: 82,
    borderRadius: 5,
  },
  buttonText: {
    textAlignL: 'center',
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    color: CONSTANTS.COLOR.WHITE,
    fontSize: CONSTANTS.FONT_SIZE.L,
  },
  footer: {
    textAlign: 'center',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 24,
    color: CONSTANTS.COLOR.ALMOST_BLACK,
  },
});
