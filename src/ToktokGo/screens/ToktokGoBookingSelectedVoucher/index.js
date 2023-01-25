import React, {useState, useCallback} from 'react';
import {StyleSheet, Text, View, Image, Dimensions, ActivityIndicator, ScrollView, Alert} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {onError} from '../../../util/ErrorUtility';
import CONSTANTS from '../../../common/res/constants';
import {ThrottledOpacity} from '../../../components_section';
import {SuccessVoucherClaimedModal} from '../../../SuperApp/screens/VoucherScreen/Components';
import {Header} from '../../components';
import {AlertOverlay} from '../../../SuperApp/screens/Components';
import {TOKTOK_WALLET_VOUCHER_CLIENT, GET_VOUCHER, POST_COLLECT_VOUCHER} from '../../../graphql';
import GraphicsIMG from '../../../assets/images/Promos/toktokgo_voucher.png';
import {ProcessingModal} from './Components/ProcessingModal';
import {useToktokAlert} from '../../../hooks';

const FULL_HEIGHT = Dimensions.get('window').height;
const FULL_WIDTH = Dimensions.get('window').width;

const ToktokGoBookingSelectedVoucher = ({navigation, route}) => {
  const {
    id,
    onPress,
    isApplicable,
    isApplicableDailyLimit,
    isApplicableMinSpent,
    setFromVoucherDetails,
    onPressActionButton,
  } = route.params;
  const [data, setData] = useState({});
  const [viewSuccesVoucherClaimedModal, setViewSuccesVoucherClaimedModal] = useState(false);
  const [processingVisible, setProcessingVisible] = useState(false);
  const toktokAlert = useToktokAlert();

  const [getVoucher, {loading: GVLoading}] = useLazyQuery(GET_VOUCHER, {
    client: TOKTOK_WALLET_VOUCHER_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      console.log(response.getVoucher);
      setData(response.getVoucher);
    },
    onError: error => {
      const {graphQLErrors, networkError} = error;

  if (networkError) {
    Alert.alert('', 'Network error occurred. Please check your internet connection.');
  } else if (graphQLErrors.length > 0) {
    console.log(graphQLErrors);
    graphQLErrors.map(({message, locations, path, code}) => {
      if (code === 'INTERNAL_SERVER_ERROR') {
        Alert.alert('', 'Something went wrong.');
      } else if (code === 'USER_INPUT_ERROR') {
        Alert.alert('', message);
      } else if (code === 'BAD_USER_INPUT') {
        // Alert.alert('', message);
        toktokAlert({
          title: 'Voucher Not Active',
          message: 'Sorry but this voucher is no longer availabe. You may try another voucher.',
          imageType: 'failed',
          onPressSingleButton: () => {
            handleGetData();
          },
        });
      } else if (code === 'AUTHENTICATION_ERROR') {
        // Do Nothing. Error handling should be done on the scren
      } else {
        console.log('ELSE ERROR:', error);
        Alert.alert('', 'Something went wrong...');
      }
    });
  }
    },
  });

  const getDataVoucher = () => {
    getVoucher({
      variables: {
        input: {
          id: id,
        },
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      getDataVoucher();
    }, []),
  );

  const handleGetData = () => {
    navigation.pop()
  }

  const [postCollectVoucher, {loading: PCVLoading}] = useMutation(POST_COLLECT_VOUCHER, {
    client: TOKTOK_WALLET_VOUCHER_CLIENT,
    onCompleted: () => {
      setViewSuccesVoucherClaimedModal(true);
      setTimeout(() => {
        setViewSuccesVoucherClaimedModal(false);
      }, 1000);
      getDataVoucher();
    },
    onError: error => {
      const {graphQLErrors, networkError} = error;

      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
        setProcessingVisible(false);
      } else if (graphQLErrors.length > 0) {
        console.log(graphQLErrors);
        graphQLErrors.map(({message, locations, path, code, errorFields, errorType}) => {
          if (code === 'INTERNAL_SERVER_ERROR') {
            Alert.alert('', 'Something went wrong.');
            setProcessingVisible(false);
          } else if (code === 'USER_INPUT_ERROR') {
            Alert.alert('', message);
            setProcessingVisible(false);
          } else if (code === 'BAD_USER_INPUT') {
            if (errorType == 'VOUCHER_DISABLED') {
             toktokAlert({
                title: 'Voucher Not Active',
                message: 'Sorry but this voucher is no longer availabe. You may try another voucher.',
                imageType: 'failed',
                onPressSingleButton: () => {
                  handleGetData();
                },
              });
            }
            else if (errorType == 'VOUCHER_LIFETIME_MAX_COUNT_HIT') {
              toktokAlert({
                title: 'Voucher Reached Limit',
                message: 'Sorry but this voucher reached the maximum redemption limit. You may try another voucher.',
                imageType: 'failed',
              });
            } else if (errorType == 'VOUCHER_DAILY_MAX_COUNT_HIT') {
              toktokAlert({
                title: 'Voucher Reached Limit',
                message:
                  'Sorry but this voucher reached the maximum redemption limit today. You may try another voucher.',
                imageType: 'failed',
              });
            }else if(errorType === 'VOUCHER_EXPIRED'){
              toktokAlert({
                title: 'Voucher Expired',
                message: 'Sorry but this voucher has expired. You may try another voucher.',
                imageType: 'failed',
                onPressSingleButton: () => {
                  handleGetData();
                },
              });
            }
            // errorFields.map(({message}) => {
            //   setErrorBorder(true);
            //   setErrorInputMessage(message);
            //   setProcessingVisible(false);
            // });
          } else if (code === 'AUTHENTICATION_ERROR') {
            // Do Nothing. Error handling should be done on the scren
          } else {
            console.log('ELSE ERROR:', error);
            Alert.alert('', 'Something went wrong...');
            setProcessingVisible(false);
          }
        });
      }
    },
  });

  const onPressSelected = () => {
    // setProcessingVisible(true);
    if (data?.collectable && !data.voucherWallet) {
      postCollectVoucher({
        variables: {
          input: {
            voucherId: data.id,
          },
        },
      });
    } else {
      setFromVoucherDetails(true);
      navigation.pop();
      onPressActionButton(data);
      setProcessingVisible(false);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <AlertOverlay visible={PCVLoading} />
      <SuccessVoucherClaimedModal isVissible={viewSuccesVoucherClaimedModal} />
      <ProcessingModal visible={processingVisible} />
      <Header title={data.name} navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Image
            source={GraphicsIMG}
            resizeMode={'contain'}
            style={{height: FULL_HEIGHT * 0.17, width: FULL_WIDTH - 32}}
          />
          <Text style={{marginVertical: 16}}>{data.description}</Text>

          <Text style={{fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD}}>Promo Terms and Conditions</Text>
          <Text style={{marginVertical: 16}}>{data.policies}</Text>
        </View>
      </ScrollView>
      {isApplicable == true || isApplicableDailyLimit == true || isApplicableMinSpent == true ? null : (
        <View>
          {!isApplicable && (
            <View style={styles.buttonContainer}>
              {GVLoading ? (
                <ActivityIndicator color={CONSTANTS.COLOR.ORANGE} style={{paddingVertical: 16}} />
              ) : data?.collectable && !data?.voucherWallet ? (
                <ThrottledOpacity style={styles.claimButtonWrapper} onPress={onPressSelected}>
                  <Text style={styles.claimText}>Claim</Text>
                </ThrottledOpacity>
              ) : (
                <ThrottledOpacity style={styles.useButtonWrapper} onPress={onPressSelected}>
                  <Text style={styles.useText}>Use</Text>
                </ThrottledOpacity>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default ToktokGoBookingSelectedVoucher;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 80,
  },
  buttonContainer: {
    position: 'absolute',
    zIndex: 999,
    bottom: 0,
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    backgroundColor: 'white',
    paddingTop: 16,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
    shadowOpacity: 0.2,
    elevation: 5,
    borderTopColor: '#F8F8F8',
    borderTopWidth: 2,
  },
  useButtonWrapper: {
    backgroundColor: CONSTANTS.COLOR.WHITE,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 5,
    marginBottom: 16,
    paddingVertical: 11,
    alignItems: 'center',
  },
  useText: {
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    color: CONSTANTS.COLOR.ORANGE,
  },
  claimButtonWrapper: {
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 5,
    marginBottom: 16,
    paddingVertical: 11,
    alignItems: 'center',
  },
  claimText: {
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    color: CONSTANTS.COLOR.WHITE,
  },
  TandC: {
    color: CONSTANTS.COLOR.ALMOST_BLACK,
    fontSize: CONSTANTS.FONT_SIZE.S,
  },
});
