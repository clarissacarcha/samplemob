import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, FlatList, Dimensions, Image, RefreshControl } from 'react-native';
import { moderateScale, getStatusbarHeight } from 'toktokbills/helper';
import { useIsFocused } from '@react-navigation/native';

//SELF IMPORTS
import { BillerType } from "./Components";
import { HeaderBack, HeaderTitle, Separator, LoadingIndicator, Header } from 'toktokbills/components';
import { SomethingWentWrong } from 'toktokbills/components';

//GRAPHQL & HOOKS
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql';
import { GET_BILLS_TRANSACTIONS } from 'toktokbills/graphql/model';
import { useAccount } from 'toktokwallet/hooks';

//IMAGE, FONT & COLOR
import CONSTANTS from 'common/res/constants';
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE}  = CONSTANTS;
const { width, height } = Dimensions.get("window");

export const FailedActivities = ({navigation,route})=> {
 
  const isFocused = useIsFocused();
  const [records, setRecords] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [getBillsTransactions, {data, error, loading, refetch}] = useLazyQuery(GET_BILLS_TRANSACTIONS, {
    fetchPolicy: "network-only",
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    variables: {
      input: {
        type: 1
      }
    },
    onError: (error) => {
      onErrorAlert({ alert, error })
    },
    onCompleted: ({ getTransactions })=> {
      setRecords(getTransactions)
    }
  })

  useEffect(() => {
    getBillsTransactions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
  }
 
  const display = () => {
    if(loading && records.length === 0){
      return(
        <View style={styles.container}>
          <LoadingIndicator isLoading={true} isFlex />
        </View>
      )
    }
    if(error){
      return (
        <View style={styles.container}>
          <SomethingWentWrong onRefetch={onRefresh} error={error} />
        </View>
      )
    }
    return (
      <FlatList
      style={{flex: 1}}
      showsVerticalScrollIndicator={false}
      data={records}
      keyExtractor={(item)=>item.name}
      renderItem={({item,index})=><BillerType item={item} index={index}/>}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    />
    )
  }

  return (
    <View style={styles.container}>
      { display() }
    </View>
  )
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor:"white",
  },
})

