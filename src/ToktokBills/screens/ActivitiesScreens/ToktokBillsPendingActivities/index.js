import React, {useState, useRef, useEffect, useMemo} from 'react';
import {
  FlatList,
  Image,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  RefreshControl,
} from 'react-native';
import {LoadingIndicator, ActivityCard, SomethingWentWrong, EmptyList} from 'toktokbills/components';
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';
import {useScrollToTop} from '@react-navigation/native';

//HELPER
import {moderateScale, numberFormat} from 'toktokbills/helper';
import moment from 'moment';

//IMAGES
import {wallet_icon} from 'src/ToktokLoad/assets/icons';
import {empty_activities} from 'src/ToktokLoad/assets/images';

//GRAPHQL & HOOKS
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_TRANSACTIONS_BY_STATUS} from 'toktokbills/graphql/model';

const {width, height} = Dimensions.get('window');

const ListEmptyComponent = () => {
  return (
    <View style={styles.container}>
      <EmptyList imageSrc={empty_activities} label="No Activities" message="You have no activities at the moment." />
    </View>
  );
};
export const ToktokBillsPendingActivities = ({navigation}) => {
  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const listRef = useRef(null);

  useScrollToTop(listRef); // scroll to top

  const [getTransactionsByStatus, {loading, error}] = useLazyQuery(GET_TRANSACTIONS_BY_STATUS, {
    fetchPolicy: 'network-only',
    variables: {
      input: {
        type: 1,
        status: 2,
      },
    },
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: () => {
      changeStates();
    },
    onCompleted: ({getTransactionsByStatus}) => {
      setTransactions(getTransactionsByStatus);
      changeStates();
    },
  });

  useEffect(() => {
    getTransactionsByStatus();
  }, []);

  const changeStates = () => {
    setRefreshing(false);
    setIsMounted(true);
  };

  const onPressActivityCard = item => {
    navigation.navigate('ToktokBillsActivityDetails', {activityDetails: item});
  };

  const onRefresh = () => {
    setRefreshing(true);
    getTransactionsByStatus();
  };

  const PendingActivities = useMemo(() => {
    return (
      <FlatList
        data={transactions}
        renderItem={({item, index}) => (
          <ActivityCard
            item={item}
            onPress={() => onPressActivityCard(item)}
            isLastItem={transactions.length - 1 == index}
          />
        )}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(val, index) => index.toString()}
        contentContainerStyle={{...styles.flatlistContainer, ...(transactions.length == 0 ? {flexGrow: 1} : {})}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLOR.YELLOW]}
            tintColor={COLOR.YELLOW}
          />
        }
        ListEmptyComponent={ListEmptyComponent}
        ref={listRef}
      />
    );
  }, [transactions, refreshing]);

  if ((loading && transactions.length == 0) || !isMounted) {
    return (
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={onRefresh} error={error} />
      </View>
    );
  }

  return <View style={styles.container}>{PendingActivities}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatlistContainer: {
    padding: moderateScale(16),
    backgroundColor: '#fff',
  },
  shadow: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabContainer: {
    marginBottom: moderateScale(16),
    borderRadius: moderateScale(5),
  },
  tokwaButtonTextWrapper: {
    flexDirection: 'row',
  },
  toktokText: {
    color: COLOR.YELLOW,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
  },
  walletText: {
    color: COLOR.ORANGE,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
  },
  detailOneContainer: {
    padding: moderateScale(16),
    backgroundColor: '#FBFAE3',
  },
  subText: {
    color: '#525252',
    fontSize: FONT_SIZE.S,
  },
  detailTwoContainer: {
    padding: moderateScale(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkIcon: {
    width: moderateScale(40),
    height: moderateScale(20),
    resizeMode: 'contain',
  },
  divider: {
    backgroundColor: '#F8F8F8',
    height: 2,
    marginHorizontal: moderateScale(16),
  },
  detailThreeContainer: {
    padding: moderateScale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walletIcon: {
    width: moderateScale(20),
    height: moderateScale(20),
    resizeMode: 'contain',
  },
  totalAmount: {
    color: COLOR.ORANGE,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.BOLD,
  },
});
