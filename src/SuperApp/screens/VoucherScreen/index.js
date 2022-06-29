import React, {useState, useCallback, useEffect} from 'react';
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
} from 'react-native';

import CONSTANTS from '../../../common/res/constants';
import {ThrottledOpacity} from '../../../components_section';
import {SuccessVoucherClaimedModal, VoucherCard} from './Components';
import {Header} from '../Components';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {TOKTOK_WALLET_VOUCHER_CLIENT, POST_COLLECT_VOUCHER, GET_VOUCHERS, GET_SEARCH_VOUCHER} from '../../../graphql';
import {useFocusEffect} from '@react-navigation/native';

import SearchICN from '../../../assets/images/SearchIcon.png';
import XICN from '../../../assets/icons/EraseTextInput.png';
import CarIMG from '../../../assets/images/Promos/Car.png';
import EmptyIMG from '../../../assets/images/empty-search.png';
import NoVoucherIMG from '../../../assets/images/Promos/No-Voucher.png';
import {onError} from '../../../util/ErrorUtility';

const decorWidth = Dimensions.get('window').width * 0.5;
const FULL_HEIGHT = Dimensions.get('window').height;

export const VoucherScreen = ({navigation}) => {
  const [data, setData] = useState([]);
  const [viewSuccesVoucherClaimedModal, setViewSuccesVoucherClaimedModal] = useState(false);
  const [search, setSearch] = useState('');
  const [searchedDatas, setSearchedDatas] = useState([]);

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
    },
    onError: onError,
  });

  const [getVouchers, {loading: getVouchersLoading, error: getVouchersError}] = useLazyQuery(GET_VOUCHERS, {
    client: TOKTOK_WALLET_VOUCHER_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      setData(response.getVouchers);
    },
  });

  const [getSearchVoucher, {loading: GSVLoading}] = useLazyQuery(GET_SEARCH_VOUCHER, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_VOUCHER_CLIENT,
    onCompleted: response => {
      setSearchedDatas(response.getSearchVoucher);
    },
    onError: onError,
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
      getVouchers({
        variables: {
          input: {
            type: 'promo',
          },
        },
      });
    }, []),
  );

  useEffect(() => {
    if (search === '' || search === null) {
      setSearchedDatas([]);
    }
  }, [search]);

  return (
    <View style={styles.container}>
      <Header title={'Voucher'} navigation={navigation} />
      <SuccessVoucherClaimedModal isVissible={viewSuccesVoucherClaimedModal} />
      <View style={styles.containerInput}>
        <Image source={SearchICN} resizeMode={'contain'} style={{width: 20, height: 20, marginLeft: 16}} />
        <TextInput
          //   ref={inputRef}
          onChangeText={value => setSearch(value)}
          style={styles.input}
          placeholder={'Find the best discount for you!'}
          value={search}
          onSubmitEditing={searchVoucher}
        />
        {search ? (
          <ThrottledOpacity onPress={() => setSearch('')}>
            <Image source={XICN} resizeMode={'contain'} style={{width: 15, height: 15, marginRight: 20}} />
          </ThrottledOpacity>
        ) : null}
      </View>

      {false && (
        <View style={styles.noResultsContainer}>
          <Image source={EmptyIMG} resizeMode={'contain'} style={styles.noResultsIMG} />
          <Text style={styles.noResultsTitle}>No Results Found</Text>
          <Text>Try to search something similar.</Text>
        </View>
      )}

      {false && (
        <View style={styles.noResultsContainer}>
          <Image source={NoVoucherIMG} resizeMode={'contain'} style={styles.noResultsIMG} />
          <Text style={styles.noResultsTitle}>No Vouchers</Text>
          <Text>We are preparing the best deals for you. Stay tuned!</Text>
          <Text>Stay tuned!</Text>
        </View>
      )}

      {getVouchersLoading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator color={CONSTANTS.COLOR.ORANGE} />
        </View>
      ) : (
        <FlatList
          style={{marginTop: 24}}
          showsVerticalScrollIndicator={false}
          data={searchedDatas.length === 0 ? data : searchedDatas}
          // keyExtractor={item => item.id}
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
    marginBottom: 8,
  },
});
