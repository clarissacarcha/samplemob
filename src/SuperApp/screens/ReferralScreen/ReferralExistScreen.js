import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import ReferralBG from '../../../assets/images/Promos/ReferralBG.png';
import CONSTANTS from '../../../common/res/constants';
import {ThrottledOpacity} from '../../../components_section';
import TokIcon from '../../../assets/images/Promos/ToktokAppIcon.png';
import voucherPaperDesign from '../../../assets/toktokgo/voucher-paper-design.png';
import VoucherIMG from '../../../assets/images/Promos/VoucherImage.png';
import ArrowLeftIcon from '../../../assets/icons/arrow-left-icon.png';
import {connect} from 'react-redux';

const decorHeight = Dimensions.get('window').height * 0.15;

const ReferralExistScreen = ({navigation, session}) => {
  return (
    <ImageBackground source={ReferralBG} style={styles.container}>
      <ThrottledOpacity style={styles.backButton} onPress={() => navigation.pop()}>
        <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
      </ThrottledOpacity>

      <View style={styles.innerContainer}>
        <Image source={TokIcon} resizeMode={'contain'} style={{height: decorHeight}} />
        <Image source={VoucherIMG} resizeMode={'contain'} style={styles.voucherImage} />

        <View style={styles.inputContainer}>
          <Text style={styles.referralCode}>{session.user.consumer.goReferralDriverCode}</Text>
        </View>
        <Text style={styles.refCodeText}>Referral Code</Text>
        <Text style={styles.congratsText}>
          Congratulations for signing up. Thank you for using Driver’s Referral Code. Let's go ka-toktok!
        </Text>
      </View>
    </ImageBackground>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(ReferralExistScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  innerContainer: {
    marginTop: StatusBar.currentHeight + 50,
    alignItems: 'center',
  },
  referralCode: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.XL + 7,
    color: CONSTANTS.COLOR.ORANGE,
  },
  refCodeText: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.M,
    color: CONSTANTS.COLOR.ALMOST_BLACK,
    marginTop: 8,
  },
  congratsText: {
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    fontSize: CONSTANTS.FONT_SIZE.M,
    color: CONSTANTS.COLOR.BLACK,
    marginTop: 24,
    marginHorizontal: 60,
    textAlign: 'center',
  },
  voucherImage: {
    height: decorHeight + 47,
    marginVertical: 33,
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
    marginHorizontal: 82,
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 12,
  },
});
