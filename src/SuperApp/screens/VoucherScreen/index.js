import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  FlatList,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import CONSTANTS from '../../../common/res/constants';
import {ThrottledOpacity} from '../../../components_section';
import {SuccessVoucherClaimedModal, VoucherCard} from './Components';
import {Header} from '../Components';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {TOKTOK_WALLET_VOUCHER_CLIENT, POST_COLLECT_VOUCHER, GET_VOUCHERS, GET_SEARCH_VOUCHER} from '../../../graphql';
import {useFocusEffect} from '@react-navigation/native';
import {AlertOverlay} from '../Components';
import {useDebounce} from '../../../ToktokGo/helpers';
import moment from 'moment';

import SearchICN from '../../../assets/images/SearchIcon.png';
import XICN from '../../../assets/icons/EraseTextInput.png';
import CarIMG from '../../../assets/images/Promos/Car.png';
import EmptyIMG from '../../../assets/images/empty-search.png';
import NoVoucherIMG from '../../../assets/images/Promos/No-Voucher.png';
import NoFound from '../../../assets/images/empty-search.png';
import {onError} from '../../../util/ErrorUtility';

const decorWidth = Dimensions.get('window').width * 0.5;
const FULL_HEIGHT = Dimensions.get('window').height;

export const VoucherScreen = ({navigation}) => {
  const inputRef = useRef();
  const [data, setData] = useState([]);
  const [viewSuccesVoucherClaimedModal, setViewSuccesVoucherClaimedModal] = useState(false);
  const [search, setSearch] = useState('');
  const [searchedDatas, setSearchedDatas] = useState([]);
  const [noVouchers, setNoVouchers] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const onPressActionButton = ({voucherId}) => {
    postCollectVoucher({
      variables: {
        input: {
          voucherId: voucherId,
        },
      },
    });
  };

  const [postCollectVoucher, {loading: PCVLoading}] = useMutation(POST_COLLECT_VOUCHER, {
    client: TOKTOK_WALLET_VOUCHER_CLIENT,
    onCompleted: () => {
      setViewSuccesVoucherClaimedModal(true);
      setTimeout(() => {
        setViewSuccesVoucherClaimedModal(false);
      }, 1000);
      refetch();
      handleGetData();
    },
    onError: onError,
  });

  const [getVouchers, {loading: getVouchersLoading, error: getVouchersError, refetch}] = useLazyQuery(GET_VOUCHERS, {
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
          if (item.voucherWallet || !item.promoVoucher.collectable) {
            item.promoVoucher.endAt ? toUseExpiring.unshift(item) : toUse.push(item);
          } else {
            item.promoVoucher.endAt ? toClaimExpiring.unshift(item) : toClaim.push(item);
          }
        });
        toUseExpiring.sort(
          (a, b) => moment(a.promoVoucher.endAt).format('YYYYMMDD') - moment(b.promoVoucher.endAt).format('YYYYMMDD'),
        );
        toClaimExpiring.sort(
          (a, b) => moment(a.promoVoucher.endAt).format('YYYYMMDD') - moment(b.promoVoucher.endAt).format('YYYYMMDD'),
        );
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

  const searchVoucher = () => {
    getSearchVoucher({
      variables: {
        input: {
          type: 'promo',
          search: search,
        },
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      handleGetData();
    }, []),
  );

  const handleGetData = () => {
    getVouchers({
      variables: {
        input: {
          type: 'promo',
        },
      },
    });
  };

  useEffect(() => {
    if (search === '' || search === null) {
      setSearchedDatas([]);
    }
  }, [search]);

  const debouncedRequest = useDebounce(value =>
    getSearchVoucher({
      variables: {
        input: {
          type: 'promo',
          search: value,
        },
      },
    }),
  );

  const onChange = value => {
    setSearch(value);
    debouncedRequest(value);
    if (!value) {
      setNoResults(false);
    }
  };

  const clearSearch = () => {
    setSearch('');
    setNoResults(false);
  };

  return (
    <View style={styles.container}>
      <AlertOverlay visible={PCVLoading} />
      <Header title={'Voucher'} navigation={navigation} />
      <SuccessVoucherClaimedModal isVissible={viewSuccesVoucherClaimedModal} />
      <View style={styles.containerInput}>
        <Image source={SearchICN} resizeMode={'contain'} style={{width: 20, height: 20, marginLeft: 16}} />
        <TextInput
          onChangeText={value => onChange(value)}
          style={styles.input}
          placeholder={'Enter voucher code'}
          value={search}
          onSubmitEditing={searchVoucher}
        />
        {search ? (
          <ThrottledOpacity onPress={clearSearch}>
            <Image source={XICN} resizeMode={'contain'} style={{width: 15, height: 15, marginRight: 20}} />
          </ThrottledOpacity>
        ) : null}
      </View>

      {noVouchers && (
        <View style={styles.noResultsContainer}>
          <Image source={NoVoucherIMG} resizeMode={'contain'} style={styles.noResultsIMG} />
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

      {!getVouchersLoading && !noResults && !noVouchers && (
        <FlatList
          style={{marginTop: 24}}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              onRefresh={handleGetData}
              refreshing={getVouchersLoading}
              colors={[CONSTANTS.COLOR.ORANGE]}
            />
          }
          data={searchedDatas.length === 0 ? data : searchedDatas}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => {
            //   const lastItem = index == data.vehicleTypeRates.length - 1 ? true : false;
            return (
              <View style={{marginVertical: 8}}>
                <VoucherCard
                  data={item}
                  navigation={navigation}
                  onPressActionButton={onPressActionButton}
                  loading={PCVLoading}
                />
              </View>
            );
          }}
        />
      )}
    </View>
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
  input: {
    marginLeft: 12,
    color: CONSTANTS.COLOR.BLACK,
    width: '80%',
    paddingVertical: 12,
  },
  containerInput: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
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
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.XL + 1,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    marginBottom: 8,
  },
});
