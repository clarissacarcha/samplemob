import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions, FlatList, ActivityIndicator} from 'react-native';

import {Header} from '../Components';
import constants from '../../../common/res/constants';
import {ThrottledOpacity} from '../../../components_section';

import ReferralIMG from '../../../assets/images/Promos/Referral.png';
import VoucherIMG from '../../../assets/images/Promos/Voucher.png';
import {connect} from 'react-redux';

const bannerWidth = Dimensions.get('window').width - 32;
const bannerHeight = Dimensions.get('window').height * 0.23;

const SuperAppPromosScreen = ({session, navigation}) => {
  return (
    <View style={styles.container}>
      <Header title={'Promos'} navigation={navigation} />
      <View style={styles.innerContainer}>
        <Text style={styles.headerText}>Explore</Text>
        <Text>New features you surely don't wanna miss.</Text>
        {!session.user.consumer.goReferralDriverUserId && (
          <View style={styles.bannerContainer}>
            <ThrottledOpacity
              onPress={() =>
                navigation.navigate('ReferralScreen', {
                  fromRegistration: false,
                })
              }>
              <Image
                source={ReferralIMG}
                resizeMode={'contain'}
                style={{
                  width: bannerWidth,
                  height: bannerHeight,
                  borderRadius: 10,
                }}
              />
            </ThrottledOpacity>
            <Text>Referral</Text>
          </View>
        )}
        <View style={styles.bannerContainer}>
          <ThrottledOpacity onPress={() => navigation.navigate('VoucherScreen')}>
            <Image
              source={VoucherIMG}
              resizeMode={'contain'}
              style={{
                width: bannerWidth,
                height: bannerHeight,
                borderRadius: 10,
              }}
            />
          </ThrottledOpacity>
          <Text>Vouchers</Text>
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
  },
  innerContainer: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  bannerContainer: {
    marginVertical: 8,
  },
});
