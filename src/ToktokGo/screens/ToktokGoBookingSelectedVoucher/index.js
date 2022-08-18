import React, {useState, useCallback} from 'react';
import {StyleSheet, Text, View, Image, Dimensions, ActivityIndicator} from 'react-native';
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

const FULL_HEIGHT = Dimensions.get('window').height;
const FULL_WIDTH = Dimensions.get('window').width;

const ToktokGoBookingSelectedVoucher = ({navigation, route}) => {
  const {id, onPress} = route.params;
  const [data, setData] = useState({});
  const [viewSuccesVoucherClaimedModal, setViewSuccesVoucherClaimedModal] = useState(false);

  const [getVoucher, {loading: GVLoading}] = useLazyQuery(GET_VOUCHER, {
    client: TOKTOK_WALLET_VOUCHER_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      setData(response.getVoucher);
    },
    onError: onError,
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

  const [postCollectVoucher, {loading: PCVLoading}] = useMutation(POST_COLLECT_VOUCHER, {
    client: TOKTOK_WALLET_VOUCHER_CLIENT,
    onCompleted: () => {
      setViewSuccesVoucherClaimedModal(true);
      setTimeout(() => {
        setViewSuccesVoucherClaimedModal(false);
      }, 1000);
      getDataVoucher();
    },
    onError: onError,
  });

  const onPressSelected = () => {
    if (data?.collectable && !data.voucherWallet) {
      postCollectVoucher({
        variables: {
          input: {
            voucherId: data.id,
          },
        },
      });
    } else {
      navigation.pop();
      onPress();
    }
  };

  return (
    <View style={styles.outerContainer}>
      <AlertOverlay visible={PCVLoading} />
      <SuccessVoucherClaimedModal isVissible={viewSuccesVoucherClaimedModal} />
      <Header title={data.name} navigation={navigation} />
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
