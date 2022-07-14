import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions, FlatList, ActivityIndicator} from 'react-native';

import {Header} from '../Components';
import constants from '../../../common/res/constants';
import {ThrottledOpacity} from '../../../components_section';

import ReferralIMG from '../../../assets/images/Promos/Referral.png';
import VoucherIMG from '../../../assets/images/Promos/Voucher.png';
import {connect} from 'react-redux';

const bannerWidth = Dimensions.get('window').width - 32;
const bannerHeight = Dimensions.get('window').height * 0.22;

const SuperAppPromosScreen = ({session, navigation}) => {
  const onPressReferral = () => {
    if (!session.user.consumer.goReferralDriverCode) {
      navigation.push('ReferralScreen', {
        fromRegistration: false,
      });
    } else {
      navigation.push('ReferralExistScreen');
    }
  };

  return (
    <View style={styles.container}>
      <Header title={'Promos'} navigation={navigation} />
      <View style={styles.innerContainer}>
        <Text style={styles.headerText}>Explore</Text>
        <Text>New features you surely don't wanna miss.</Text>
        <View style={styles.bannerContainer}>
          <ThrottledOpacity onPress={onPressReferral}>
            <Image
              source={ReferralIMG}
              resizeMode={'cover'}
              style={{
                width: bannerWidth,
                height: bannerHeight,
                borderRadius: 10,
              }}
            />
          </ThrottledOpacity>
          <Text style={styles.textContainer}>Referral</Text>
        </View>
        <View style={styles.bannerContainer}>
          <ThrottledOpacity onPress={() => navigation.navigate('VoucherScreen')}>
            <Image
              source={VoucherIMG}
              resizeMode={'cover'}
              style={{
                width: bannerWidth,
                height: bannerHeight,
                borderRadius: 10,
              }}
            />
          </ThrottledOpacity>
          <Text style={styles.textContainer}>Vouchers</Text>
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(SuperAppPromosScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: constants.FONT_SIZE.L,
    fontFamily: constants.FONT_FAMILY.SEMI_BOLD,
    marginVertical: 10,
  },
  innerContainer: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  bannerContainer: {
    marginVertical: 8,
    paddingVertical: 10,
  },
  textContainer: {
    paddingVertical: 10,
  },
});
