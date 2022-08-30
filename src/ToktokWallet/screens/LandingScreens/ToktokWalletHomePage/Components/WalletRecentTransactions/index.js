import React, {useMemo, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import CONSTANTS from 'common/res/constants';
import {useNavigation} from '@react-navigation/native';
import {TransactionLog, NoData, OrangeButton} from 'toktokwallet/components';
import {VectorIcon, ICON_SET} from 'src/revamp';
import {useAccount} from 'toktokwallet/hooks';
import {moderateScale} from 'toktokwallet/helper';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

const WalletRecentTransactions = () => {
  const navigation = useNavigation();
  const {checkIfTpinIsSet, tokwaAccount} = useAccount();
  const [transactions, setTransactions] = useState(null);

  const TopUpNow = () => {
    const tpinIsSet = checkIfTpinIsSet();
    if (!tpinIsSet) {
      return;
    }

    return navigation.navigate('ToktokWalletPaymentOptions');
  };

  useEffect(() => {
    if (tokwaAccount?.wallet?.transactions) {
      setTransactions(tokwaAccount?.wallet?.transactions);
    }
  }, [tokwaAccount]);

  const CashInNow = () => (
    <>
      <NoData />
      <View style={styles.cashInNow}>
        <OrangeButton label="Cash In Now" onPress={TopUpNow} />
      </View>
    </>
  );

  const LoadingScreen = () => (
    <View style={{...styles.container, ...styles.center}}>
      <ActivityIndicator size={24} color={COLOR.YELLOW} />
    </View>
  );

  const RecentRecords = useMemo(() => {
    return (
      <>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, alignItems: 'flex-start'}}>
            <Text style={styles.title}>Recent Transactions</Text>
          </View>
          {transactions?.length > 5 && (
            <TouchableOpacity
              onPress={() => navigation.navigate('ToktokWalletTransactions')}
              style={styles.seeAllContainer}>
              <Text style={styles.seeAllText}>See All</Text>
              <VectorIcon
                iconSet={ICON_SET.FontAwesome5}
                name="chevron-right"
                size={11}
                color={COLOR.ORANGE}
                style={{
                  alignSelf: 'center',
                  marginLeft: 10,
                }}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.transactions}>
          {transactions?.slice(0, 5).map((item, index) => (
            <TransactionLog
              key={`recentLog${index}`}
              transaction={item}
              index={index}
              data={transactions?.slice(0, 5)}
            />
          ))}
        </View>
      </>
    );
  }, [navigation, transactions]);

  if (transactions == null) {
    return <LoadingScreen />;
  }
  return <View style={styles.container}>{transactions?.length === 0 ? <CashInNow /> : RecentRecords}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    padding: moderateScale(16),
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.M,
    color: '#212529',
    fontFamily: FONT.BOLD,
  },
  transactions: {
    flex: 1,
    backgroundColor: 'white',
  },
  cashInNow: {
    marginHorizontal: moderateScale(45),
    marginTop: moderateScale(20),
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  seeAllContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  seeAllText: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
    color: '#FF8A48',
  },
});

export default WalletRecentTransactions;
