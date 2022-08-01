import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ActivityIndicator, FlatList, RefreshControl, Dimensions} from 'react-native';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_MERCHANT_PAYMENTS} from 'toktokwallet/graphql';
import {useSelector} from 'react-redux';
import {Separator, CheckIdleState, SwipeDownToRefresh, NoData} from 'toktokwallet/components';
import {HeaderBack, HeaderTitle} from 'src/revamp';
import CONSTANTS from 'common/res/constants';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useAlert} from 'src/hooks';
import {SomethingWentWrong} from 'src/components';

//SELF IMPORT
import {LogItem} from './Components';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
const imageWidth = Dimensions.get('window').width - 200;

export const ToktokWalletMerchantPaymentLogs = ({navigation}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack color={COLOR.YELLOW} />,
    headerTitle: () => <HeaderTitle label={['QR Payment', '']} />,
  });

  const tokwaAccount = useSelector(state => state.toktokWallet);
  const [records, setRecords] = useState([]);
  const alert = useAlert();

  const [getMerchantPayments, {data, error, loading}] = useLazyQuery(GET_MERCHANT_PAYMENTS, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: error => {
      onErrorAlert({alert, error, navigation});
    },
    onCompleted: ({getMerchantPayments}) => {
      setRecords(getMerchantPayments);
    },
  });

  const Refetch = () => {
    getMerchantPayments();
  };

  useEffect(() => {
    getMerchantPayments();
  }, []);

  const renderSeparator = () => <View style={styles.separator} />;

  if (error) {
    return <SomethingWentWrong onRefetch={Refetch} />;
  }

  return (
    <CheckIdleState>
      <Separator />
      {
        <View style={styles.container}>
          <View style={styles.content}>
            <FlatList
              ListEmptyComponent={() => {
                if (records.length > 0) return null;
                if (loading) return null;
                return <NoData />;
              }}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={Refetch}
                  colors={[COLOR.YELLOW]}
                  tintColor={COLOR.YELLOW}
                />
              }
              showsVerticalScrollIndicator={false}
              data={records}
              keyExtractor={item => item.id}
              renderItem={({item, index}) => (
                <LogItem key={index} item={item} index={index} tokwaAccount={tokwaAccount} />
              )}
              ItemSeparatorComponent={renderSeparator}
              ListFooterComponent={() => {
                if (records.length == 0) return null;
                if (loading) return null;
                return <Separator />;
              }}
              contentContainerStyle={{flexGrow: 1}}
            />
          </View>
        </View>
      }
    </CheckIdleState>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  filterType: {
    alignSelf: 'flex-end',
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 10,
  },
  transactionLogsContainer: {
    marginVertical: 5,
  },
  transaction: {
    paddingVertical: 10,
    borderBottomWidth: 0.2,
    borderColor: 'silver',
    flexDirection: 'row',
  },
  transactionIcon: {
    flexBasis: 50,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 5,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionAmount: {
    flexBasis: 'auto',
    alignItems: 'flex-end',
  },
  separator: {
    backgroundColor: '#F4F4F4',
    height: 1,
  },
});
