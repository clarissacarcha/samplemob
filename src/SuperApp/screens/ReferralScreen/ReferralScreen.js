import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  ImageBackground,
  StatusBar,
  KeyboardAvoidingView,
  Alert,
  BackHandler,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CONSTANTS from '../../../common/res/constants';
import {ThrottledOpacity} from '../../../components_section';
import {SuccessVoucherClaimedModal} from './Components';

import ReferralBG from '../../../assets/images/Promos/ReferralBG.png';
import TokIcon from '../../../assets/images/Promos/ToktokAppIcon.png';
import voucherPaperDesign from '../../../assets/toktokgo/voucher-paper-design.png';
import VoucherIMG from '../../../assets/images/Promos/VoucherImage.png';
import ArrowLeftIcon from '../../../assets/icons/arrow-left-icon.png';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {
  AUTH_CLIENT,
  GET_USER_SESSION,
  PATCH_GO_REFERRAL_USER_ID,
  TOKTOK_WALLET_VOUCHER_CLIENT,
  POST_COLLECT_VOUCHER,
} from '../../../graphql';
import {onError} from '../../../util/ErrorUtility';
import {AlertOverlay} from '../../../components';
import {connect} from 'react-redux';

const decorHeight = Dimensions.get('window').height * 0.15;

const ReferralScreen = ({navigation, route, constants, session, createSession}) => {
  const {fromRegistration} = route.params;
  const [viewSuccesVoucherClaimedModal, setViewSuccesVoucherClaimedModal] = useState(false);
  const [isValidDriverId, setIsValidDriverId] = useState(false);
  const [invalidReferralCodeText, setInvalidReferralCodeText] = useState('');
  const [refCode, setRefCode] = useState('');

  const [postCollectVoucher, {loading: PCVLoading}] = useMutation(POST_COLLECT_VOUCHER, {
    client: TOKTOK_WALLET_VOUCHER_CLIENT,
    onCompleted: () => {
      const storedUserId = session.user.id;
      setViewSuccesVoucherClaimedModal(true);
      if (storedUserId) {
        getUserSession({
          variables: {
            input: {
              userId: storedUserId,
            },
          },
        });
      } else {
        navigation.replace('UnauthenticatedStack');
      }
      setTimeout(() => {
        setViewSuccesVoucherClaimedModal(false);
        setRefCode('');
        if (fromRegistration) {
          navigation.replace('RootDrawer', {
            screen: 'AuthenticatedStack',
            params: {
              screen: 'ConsumerLanding',
            },
          });
        } else {
          navigation.pop();
        }
      }, 1500);
    },
    onError: onError,
  });

  const [patchGoReferralUserId, {loading}] = useMutation(PATCH_GO_REFERRAL_USER_ID, {
    onCompleted: () => {
      postCollectVoucher({
        variables: {
          input: {
            voucherId: parseInt(constants.toktokGo10K),
          },
        },
      });
    },
    onError: error => {
      const {graphQLErrors, networkError} = error;
      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      } else if (graphQLErrors.length > 0) {
        graphQLErrors.map(({message, locations, path, errorType}) => {
          setIsValidDriverId(true);
          setInvalidReferralCodeText(message);
        });
      }
    },
  });

  const [getUserSession] = useLazyQuery(GET_USER_SESSION, {
    client: AUTH_CLIENT,
    fetchPolicy: 'network-only',
    onError: error => {
      const {graphQLErrors, networkError} = error;
      console.log(error);
      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      } else if (graphQLErrors.length > 0) {
        graphQLErrors.map(({message, locations, path, code}) => {
          if (message === 'Session expired. Please log in again.') {
            Alert.alert('', message);
            AsyncStorage.removeItem('accessToken');
            destroySession();
            navigation.replace('UnauthenticatedStack');
          } else if (code === 'INTERNAL_SERVER_ERROR') {
            Alert.alert('', 'Something went wrong.');
          } else if (code === 'USER_INPUT_ERROR') {
            Alert.alert('', message);
          } else if (code === 'BAD_USER_INPUT') {
            Alert.alert('', message);
          } else if (code === 'AUTHENTICATION_ERROR') {
            navigation.push('UnauthenticatedStack', {
              screen: 'AccountBlocked',
            });
          } else {
            console.log('ELSE ERROR:', error);
            Alert.alert('', 'Something went wrong...');
          }
        });
      }
    },
    onCompleted: ({getUserSession}) => {
      try {
        createSession(getUserSession);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const onPress = () => {
    patchGoReferralUserId({
      variables: {
        input: {
          goReferralDriverUserId: refCode,
        },
      },
    });
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
      if (fromRegistration) {
        navigation.replace('RootDrawer', {
          screen: 'AuthenticatedStack',
          params: {
            screen: 'ConsumerLanding',
          },
        });
      }
      return true;
    });
    return () => {
      backHandler.remove();
    };
  }, []);

  const onBackPress = () => {
    if (fromRegistration) {
      navigation.replace('RootDrawer', {
        screen: 'AuthenticatedStack',
        params: {
          screen: 'ConsumerLanding',
        },
      });
    } else {
      navigation.pop();
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={{flex: 1}} extraScrollHeight={40}>
      <ImageBackground source={ReferralBG} style={styles.container}>
        <AlertOverlay visible={loading || PCVLoading} />
        <SuccessVoucherClaimedModal isVissible={viewSuccesVoucherClaimedModal} />
        <ThrottledOpacity style={styles.backButton} onPress={onBackPress}>
          <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
        </ThrottledOpacity>

        {fromRegistration && (
          <ThrottledOpacity style={styles.skipButton} onPress={onBackPress}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </ThrottledOpacity>
        )}

        <View style={styles.innerContainer}>
          <Image source={TokIcon} resizeMode={'contain'} style={{height: decorHeight}} />
          <Text
            style={{
              marginTop: 42,
              fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
              fontSize: CONSTANTS.FONT_SIZE.XL + 7,
            }}>
            Welcome ka-toktok!
          </Text>
          <Text style={{textAlign: 'center', marginTop: 12}}>Did a driver refer you? Enter Referral Code</Text>
          <Text style={{textAlign: 'center', marginBottom: 28}}> below to claim New User Voucher!</Text>

          <View style={styles.card}>
            <Image source={voucherPaperDesign} resizeMode={'contain'} style={styles.floatingImage} />
            <View style={styles.voucherText}>
              <Text style={styles.voucherName}>NEW USER VOUCHER</Text>
              <Text style={styles.voucherAmount}>₱10,000.00</Text>
            </View>
            <Image source={VoucherIMG} resizeMode={'contain'} style={styles.voucherImage} />
          </View>

          <View style={[styles.inputContainer, isValidDriverId && styles.inputContainerError]}>
            <TextInput
              style={styles.input}
              placeholder="Referral Code"
              value={refCode}
              onChangeText={text => {
                setRefCode(text), setIsValidDriverId(false);
              }}
            />
          </View>
          {isValidDriverId && (
            <View style={{alignSelf: 'stretch', marginHorizontal: 82}}>
              <Text style={{color: CONSTANTS.COLOR.RED, fontSize: CONSTANTS.FONT_SIZE.S}}>
                {invalidReferralCodeText}
              </Text>
            </View>
          )}

          <ThrottledOpacity style={styles.button} onPress={onPress} disabled={!refCode && true}>
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
    </KeyboardAwareScrollView>
  );
};

const mapStateToProps = state => ({
  session: state.session,
  constants: state.constants,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
  destroySession: () => dispatch({type: 'DESTROY_SESSION'}),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReferralScreen);

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
    fontSize: CONSTANTS.FONT_SIZE.XL + 3,
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
  skipButton: {
    position: 'absolute',
    top: StatusBar.currentHeight + 23,
    right: 16,
    padding: 6,
    flexDirection: 'row',
  },
  skipButtonText: {
    color: CONSTANTS.COLOR.ORANGE,
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    fontSize: CONSTANTS.FONT_SIZE.M,
  },
  inputContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 5,
    alignSelf: 'stretch',
    marginHorizontal: 82,
    marginTop: 20,
  },
  inputContainerError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  input: {
    marginHorizontal: 12,
    color: CONSTANTS.COLOR.BLACK,
    alignSelf: 'stretch',
    paddingVertical: 12,
  },
  button: {
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 11,
    marginTop: 20,
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
