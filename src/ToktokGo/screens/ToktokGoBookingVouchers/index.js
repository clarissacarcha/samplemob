import React, {useState, useEffect, useCallback} from 'react';
import {Text, View, FlatList, Dimensions, StyleSheet, ScrollView, Image, ActivityIndicator, Alert} from 'react-native';
import Data from '../../components/BookingDummyData';
import CONSTANTS from '../../../common/res/constants';
import {Header} from '../../components';
import {useLazyQuery, useMutation, useQuery} from '@apollo/react-hooks';
import {useFocusEffect} from '@react-navigation/native';
import {
  GET_SEARCH_VOUCHER,
  GET_VOUCHERS,
  POST_COLLECT_VOUCHER,
  TOKTOK_WALLET_VOUCHER_CLIENT,
  GET_ENTERPRISE_VOUCHER,
} from '../../../graphql';
import moment from 'moment';
import {VoucherCard} from './Components/VoucherCard';
import {TextInput} from 'react-native-gesture-handler';
import {throttle} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import NoVouchers from '../../../assets/toktokgo/no-vouchers.png';
import NoFound from '../../../assets/images/empty-search.png';
import {onError} from '../../../util/ErrorUtility';
import {SuccessVoucherClaimedModal} from '../../../SuperApp/screens/VoucherScreen/Components';
import SearchICN from '../../../assets/images/SearchIcon.png';
import XICN from '../../../assets/icons/EraseTextInput.png';
import {ThrottledOpacity} from '../../../components_section';
import {useDebounce} from '../../helpers';
import {ProcessingModal} from './Components/ProcessingModal';

const decorWidth = Dimensions.get('window').width * 0.5;
const FULL_HEIGHT = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const ToktokGoBookingVouchers = ({navigation, route}) => {
  const {details} = useSelector(state => state.toktokGo);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [viewSuccesVoucherClaimedModal, setViewSuccesVoucherClaimedModal] = useState(false);
  const [search, setSearch] = useState('');
  const [searchedDatas, setSearchedDatas] = useState([]);
  const [noVouchers, setNoVouchers] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [processingVisible, setProcessingVisible] = useState(false);
  const [fromVoucherDetails, setFromVoucherDetails] = useState(true);
  const [errorBorder, setErrorBorder] = useState(false);
  const [errorInputMessage, setErrorInputMessage] = useState('This is a required field');

  const [getVouchers, {loading, error: getVouchersError, refetch}] = useLazyQuery(GET_VOUCHERS, {
    client: TOKTOK_WALLET_VOUCHER_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      if (response.getVouchers.length > 0) {
        var toClaimExpiring = [];
        var toUseExpiring = [];
        var toClaim = [];
        var toUse = [];
        var allVouchers = [];
        response.getVouchers.map(item => {
          if (item.voucherWallet || !item.collectable) {
            item.endAt ? toUseExpiring.unshift(item) : toUse.push(item);
          } else {
            item.endAt ? toClaimExpiring.unshift(item) : toClaim.push(item);
          }
        });
        toUseExpiring.sort((a, b) => moment(a.endAt).format('YYYYMMDD') - moment(b.endAt).format('YYYYMMDD'));
        toClaimExpiring.sort((a, b) => moment(a.endAt).format('YYYYMMDD') - moment(b.endAt).format('YYYYMMDD'));
        toUse = toUse.concat(toUseExpiring);
        toClaim = toClaim.concat(toClaimExpiring);
        allVouchers = toUse.concat(toClaim);
        setData(allVouchers);
      } else {
        setNoVouchers(true);
      }
    },
    onError: onError,
  });

  const [postCollectVoucher, {loading: PCVLoading}] = useMutation(POST_COLLECT_VOUCHER, {
    client: TOKTOK_WALLET_VOUCHER_CLIENT,
    onCompleted: response => {
      setViewSuccesVoucherClaimedModal(true);
      setTimeout(() => {
        setViewSuccesVoucherClaimedModal(false);
      }, 1000);
      refetch();
      handleGetData();
    },
    onError: onError,
  });

  const [getSearchVoucher, {loading: GSVLoading}] = useLazyQuery(GET_SEARCH_VOUCHER, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_VOUCHER_CLIENT,
    onCompleted: response => {
      if (response.getSearchVoucher.length > 0) {
        setSearchedDatas(response.getSearchVoucher);
        setNoResults(false);
      } else {
        setNoResults(true);
      }
    },
    onError: null,
  });

  const [getEnterpriseVoucher] = useLazyQuery(GET_ENTERPRISE_VOUCHER, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_VOUCHER_CLIENT,
    onCompleted: response => {
      onApply(response.getEnterpriseVoucher);
      setProcessingVisible(false);
    },
    onError: error => {
      const {graphQLErrors, networkError} = error;

      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      } else if (graphQLErrors.length > 0) {
        graphQLErrors.map(({message, locations, path, code, errorFields}) => {
          if (code === 'INTERNAL_SERVER_ERROR') {
            Alert.alert('', 'Something went wrong.');
          } else if (code === 'USER_INPUT_ERROR') {
            Alert.alert('', message);
          } else if (code === 'BAD_USER_INPUT') {
            errorFields.map(({message}) => {
              setErrorBorder(true);
              setErrorInputMessage(message);
              setProcessingVisible(false);
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

  const searchVoucher = () => {
    getSearchVoucher({
      variables: {
        input: {
          type: 'promo',
          search: search,
          service: 'GO',
        },
      },
    });
  };

  const handleGetData = () => {
    getVouchers({
      variables: {
        input: {
          service: 'GO',
        },
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      handleGetData();
    }, []),
  );

  useEffect(() => {
    if (search === '' || search === null) {
      setSearchedDatas([]);
    }
  }, [search]);

  const onApply = throttle(
    item => {
      dispatch({
        type: 'SET_TOKTOKGO_BOOKING_DETAILS',
        payload: {...details, voucher: item},
      });
      navigation.pop();
    },
    1000,
    {trailing: false},
  );

  const debouncedRequest = useDebounce(value =>
    getSearchVoucher({
      variables: {
        input: {
          // type: 'promo',
          search: value,
          service: 'GO',
        },
      },
    }),
  );

  const onChange = value => {
    setSearch(value);
    setErrorBorder(false);
    setErrorInputMessage('');
    // debouncedRequest(value);
    // if (!value) {
    //   setNoResults(false);
    // }
  };

  const clearSearch = () => {
    setErrorBorder(false);
    setErrorInputMessage('');
    setSearch('');
    setNoResults(false);
  };

  const useFunction = () => {
    if (search == '') {
      setErrorBorder(true);
      setErrorInputMessage('This is a required field');
    } else {
      setProcessingVisible(true);
      getEnterpriseVoucher({
        variables: {
          input: {
            service: 'GO',
            code: search,
            minSpend: route.params.details.rate.tripFare.amount,
          },
        },
      });
    }
  };

  if (loading) {
    // <ActivityIndicator color={CONSTANTS.COLOR.ORANGE} />;
  }

  if (data.length === 0) {
    <View style={{flex: 1, backgroundColor: CONSTANTS.COLOR.WHITE}}>
      <Header navigation={navigation} title={'Vouchers'} />
      {/* ========= ENTER VOUCHER CODE FOR NEXT RELEASE */}
      {/* <View style={styles.enterVoucherGroup}>
        <TextInput style={styles.enterVoucherInput} placeholder={'Enter voucher code'} />
        <TouchableOpacity>
          <Text style={styles.enterVoucherApply}>Apply</Text>
        </TouchableOpacity>
      </View> */}
      <View style={styles.containerInput}>
        {/* <Image source={SearchICN} resizeMode={'contain'} style={{width: 20, height: 20, marginLeft: 16}} /> */}
        <TextInput
          //   ref={inputRef}
          onChangeText={value => setSearch(value)}
          style={styles.input}
          placeholder={'Enter voucher code'}
          value={search}
          onSubmitEditing={searchVoucher}
          placeholderTextColor={'gray'}
        />
        {search ? (
          <ThrottledOpacity onPress={() => setSearch('')}>
            <Image source={XICN} resizeMode={'contain'} style={{width: 15, height: 15, marginRight: 20}} />
          </ThrottledOpacity>
        ) : null}
      </View>
      <Image source={NoVouchers} resizeMode={'contain'} />
    </View>;
  }

  return (
    <View style={{flex: 1, backgroundColor: CONSTANTS.COLOR.WHITE}}>
      <Header navigation={navigation} title={'Vouchers'} />
      <SuccessVoucherClaimedModal isVissible={viewSuccesVoucherClaimedModal} />
      <ProcessingModal visible={processingVisible} />
      <FlatList
        ListHeaderComponent={
          <ScrollView>
            {/* ========= ENTER VOUCHER CODE FOR NEXT RELEASE */}
            {/* <View style={styles.enterVoucherGroup}>
        <TextInput style={styles.enterVoucherInput} placeholder={'Enter voucher code'} />
        <TouchableOpacity>
          <Text style={styles.enterVoucherApply}>Apply</Text>
        </TouchableOpacity>
      </View> */}
            <View style={errorBorder == true ? styles.containerInputError : styles.containerInput}>
              {/* <Image source={SearchICN} resizeMode={'contain'} style={{width: 20, height: 20, marginLeft: 16}} /> */}
              <TextInput
                //   ref={inputRef}
                onChangeText={value => onChange(value)}
                style={styles.input}
                placeholder={'Enter voucher code'}
                value={search}
                onSubmitEditing={searchVoucher}
                placeholderTextColor={'gray'}
              />
              {search ? (
                <ThrottledOpacity onPress={clearSearch}>
                  <Image source={XICN} resizeMode={'contain'} style={{width: 15, height: 15, marginRight: 20}} />
                </ThrottledOpacity>
              ) : null}
            </View>
            <View style={{position: 'absolute', right: 13, top: 40}}>
              <ThrottledOpacity onPress={useFunction}>
                <Text style={{color: CONSTANTS.COLOR.ORANGE}}>Use</Text>
              </ThrottledOpacity>
            </View>
            {errorBorder == true ? (
              <View style={{position: 'absolute', left: 15, top: 80}}>
                <Text style={{color: CONSTANTS.COLOR.RED, fontSize: CONSTANTS.FONT_SIZE.S}}>{errorInputMessage}</Text>
              </View>
            ) : null}

            {noVouchers && (
              <View style={styles.noResultsContainer}>
                <Image source={NoVouchers} resizeMode={'contain'} style={styles.noResultsIMG} />
                <Text style={styles.noResultsTitle}>No Vouchers</Text>
                <Text>We are preparing the best deals for you.</Text>
                <Text>Stay tuned!</Text>
              </View>
            )}

            {noResults && (
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={NoFound} resizeMode={'contain'} style={{width: decorWidth, height: decorWidth}} />
                <Text style={styles.noResultsTitle}>No Results Found</Text>
                <Text>Try to search something similar.</Text>
              </View>
            )}
            {!noResults && !noVouchers && (
              <View style={{marginTop: 11}}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={searchedDatas.length === 0 ? data : searchedDatas}
                  keyExtractor={item => item.id}
                  renderItem={({item, index}) => {
                    const lastItem = index == data.length - 1 ? true : false;
                    return (
                      <View style={{marginVertical: 8}}>
                        <VoucherCard
                          details={details}
                          data={item}
                          navigation={navigation}
                          onPressActionButton={onApply}
                          postCollectVoucher={postCollectVoucher}
                          loading={PCVLoading}
                          setProcessingVisible={setProcessingVisible}
                          fromVoucherDetails={fromVoucherDetails}
                        />
                      </View>
                    );
                  }}
                />
              </View>
            )}
          </ScrollView>
        }
      />
    </View>
  );
};

export default ToktokGoBookingVouchers;

const styles = StyleSheet.create({
  enterVoucherGroup: {
    flexDirection: 'row',
    marginHorizontal: 16,
    alignItems: 'center',
    marginVertical: 24,
  },
  enterVoucherInput: {
    flex: 1,
    backgroundColor: CONSTANTS.COLOR.MEDIUM_DARK,
    paddingLeft: 16,
    marginRight: 16,
    borderRadius: 5,
  },
  enterVoucherApply: {
    color: CONSTANTS.COLOR.ORANGE,
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    fontSize: CONSTANTS.FONT_SIZE.M,
  },
  containerInput: {
    marginTop: 24,
    marginBottom: 12,
    // marginHorizontal: 16,
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    width: windowWidth * 0.85,
    marginLeft: 16,
  },
  containerInputError: {
    marginTop: 24,
    marginBottom: 12,
    // marginHorizontal: 16,
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    width: windowWidth * 0.85,
    marginLeft: 16,
    borderColor: CONSTANTS.COLOR.RED,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 5,
    color: CONSTANTS.COLOR.BLACK,
  },
  noResultsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: FULL_HEIGHT * 0.15,
  },
  noResultsIMG: {
    width: decorWidth,
    height: decorWidth,
    marginBottom: 24,
  },
  noResultsTitle: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.XL + 1,
    marginBottom: 8,
  },
});
