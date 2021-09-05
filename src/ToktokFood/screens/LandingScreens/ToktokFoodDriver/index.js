import React, { useEffect, useState, useRef } from 'react';
import {View, StyleSheet} from 'react-native';

// Components
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import {DriverAnimationView, DriverDetailsView} from './components';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';

// Utils
import {moderateScale} from 'toktokfood/helper/scale';

import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_ORDER_TRANSACTION_BY_REF_NUM} from 'toktokfood/graphql/toktokfood';
import {useSelector} from 'react-redux';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
  bgImage: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
};

const ToktokFoodDriver = ({ route }) => {

  const referenceNum = route.params ? route.params.referenceNum : ''
  const [transaction, setTransaction] = useState({});
  const getTransactionEvery5Seconds = useRef(null);


  // data fetching for transaction
  const [getOrderTransactionByRefNum, {data, error, loading }] = useLazyQuery(GET_ORDER_TRANSACTION_BY_REF_NUM, {
    variables: {
      input: {
        refNum: referenceNum
      }
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({ getTransactionByRefNum }) => {
      setTransaction(getTransactionByRefNum)
    }
  });

  useEffect(() => {
    getOrderTransactionByRefNum()
  }, [])

  // useEffect(() => {
  //   getTransactionEvery5Seconds.current = setInterval(() => 
  //     getOrderTransactionByRefNum()
  //   , 5000);
  //   return () => { clearInterval(getTransactionEvery5Seconds.current) }
  // }, [])

  return (
    <View style={{flex: 1, backgroundColor: '#FFFF'}}>
      <HeaderImageBackground customSize={CUSTOM_HEADER}>
        <HeaderTitle title="Place Order" />
      </HeaderImageBackground>
      { ((loading && Object.entries(transaction).length == 0) || Object.entries(transaction).length == 0 || error) ? (
          <LoadingIndicator isFlex isLoading={true} />
        ) : (
          <>
            <DriverAnimationView status={1} transaction={transaction} />
            <View style={styles.driverWrapper}>
              <DriverDetailsView status={1} transaction={transaction} />
            </View>
          </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  driverWrapper: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
});

export default ToktokFoodDriver;
