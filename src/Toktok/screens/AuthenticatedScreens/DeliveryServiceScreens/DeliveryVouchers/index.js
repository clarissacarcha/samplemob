import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Modal,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {
  GET_SEARCH_VOUCHER,
  GET_VOUCHERS,
  POST_COLLECT_VOUCHER,
  TOKTOK_WALLET_VOUCHER_CLIENT,
} from '../../../../../graphql';
import {onError} from '../../../../../util/ErrorUtility';
import {useDebounce} from '../../../../../ToktokGo/helpers';
import {ThrottledOpacity} from '../../../../../components_section';
import {HeaderBack, HeaderTitle} from '../../../../../components';
import {MEDIUM} from '../../../../../res/constants';
import CONSTANTS from '../../../../../common/res/constants';

import {VoucherCard} from './Components';
import {SuccessVoucherClaimedModal} from '../../../../../SuperApp/screens/VoucherScreen/Components';
import NoVoucherIMG from '../../../../../assets/images/Promos/No-Voucher.png';
import NoFound from '../../../../../assets/images/empty-search.png';
import SearchICN from '../../../../../assets/images/SearchIcon.png';
import ClearICN from '../../../../../assets/icons/EraseTextInput.png';
import ModalImage from '../../../../../assets/toktokwallet-assets/error.png';

const decorWidth = Dimensions.get('window').width * 0.5;
const FULL_HEIGHT = Dimensions.get('window').height;

const Screen = ({navigation, route, session}) => {
  const [data, setData] = useState();
  const [viewSuccesVoucherClaimedModal, setViewSuccesVoucherClaimedModal] = useState(false);
  const [noVouchers, setNoVouchers] = useState();
  const [search, setSearch] = useState('');
  const [searchedDatas, setSearchedDatas] = useState([]);
  const [noResults, setNoResults] = useState(false);

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Vouchers']} />,
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

  const onPressActionButton = ({voucherId}) => {
    postCollectVoucher({
      variables: {
        input: {
          voucherId: voucherId,
        },
      },
    });
  };

  const handleGetData = () => {
    getVouchers({
      variables: {
        input: {
          service: 'DELIVERY',
        },
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      handleGetData();
    }, []),
  );

  const searchVoucher = () => {
    getSearchVoucher({
      variables: {
        input: {
          search: search,
        },
      },
    });
  };

  const debouncedRequest = useDebounce(value =>
    getSearchVoucher({
      variables: {
        input: {
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
    <View>
      <SuccessVoucherClaimedModal isVissible={viewSuccesVoucherClaimedModal} />
      <View style={styles.containerInput}>
        <Image source={SearchICN} resizeMode={'contain'} style={{width: 20, height: 20, marginLeft: 16}} />
        <TextInput
          onChangeText={value => onChange(value)}
          style={styles.input}
          placeholder={'Enter voucher code'}
          value={search}
          onSubmitEditing={searchVoucher}
          placeholderTextColor={MEDIUM}
        />
        {search ? (
          <ThrottledOpacity onPress={clearSearch}>
            <Image source={ClearICN} resizeMode={'contain'} style={{width: 15, height: 15, marginRight: 20}} />
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

      {noResults && !noVouchers && (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
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
                  loading={false}
                  setSelectedVoucher={route.params.setSelectedVoucher}
                />
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

export const DeliveryVouchers = connect(mapStateToProps, null)(Screen);

const styles = StyleSheet.create({
  screenBox: {
    paddingHorizontal: 16,
    backgroundColor: 'white',
    flex: 1,
  },
  noResultsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: FULL_HEIGHT * 0.15,
  },
  noResultsTitle: {
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.XL + 1,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    marginBottom: 8,
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
  input: {
    marginLeft: 12,
    color: CONSTANTS.COLOR.BLACK,
    width: '80%',
    paddingVertical: 12,
  },
});
