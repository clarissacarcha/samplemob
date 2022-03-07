import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, FlatList, Dimensions, Image, RefreshControl } from 'react-native';
import { moderateScale, getStatusbarHeight } from 'toktokbills/helper';
import { useIsFocused } from '@react-navigation/native';

//SELF IMPORTS
import { ActivityItem } from "./Components";
import { HeaderBack, HeaderTitle, Separator, LoadingIndicator, EmptyList } from 'toktokbills/components';
import { SomethingWentWrong } from 'toktokbills/components';

//GRAPHQL & HOOKS
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql';
import { GET_TRANSACTIONS_BY_STATUS } from 'toktokbills/graphql/model';
import { useAccount } from 'toktokwallet/hooks';

//IMAGE, FONT & COLOR
import CONSTANTS from 'common/res/constants';
import { empty_activities } from 'toktokbills/assets/images';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE}  = CONSTANTS;
const { width, height } = Dimensions.get("window");

export const SuccessActivities = ({navigation,route})=> {
 
  const isFocused = useIsFocused();
  const [records, setRecords] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [getTransactionsByStatus, {data, error, loading}] = useLazyQuery(GET_TRANSACTIONS_BY_STATUS, {
    fetchPolicy: "network-only",
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    variables: {
      input: {
        type: 1,
        status: 1
      }
    },
    onError: (error) => {
      setRefreshing(false);
      setRecords([]);
    },
    onCompleted: ({ getTransactionsByStatus })=> {
      setRecords(getTransactionsByStatus);
      setRefreshing(false);
    }
  })

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    getTransactionsByStatus();
  }

  const ListEmptyComponent = () => {
    if(refreshing) return null
    return(
      <View style={styles.container}>
        <EmptyList
          imageSrc={empty_activities}
          label={"No Activities"}
          message={"You have no activities as of the moment."}
          containerStyle={{ marginBottom: moderateScale(50) }}
        />
      </View>
    )
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
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        data={records}
        keyExtractor={(item)=>item.name}
        renderItem={({item,index})=><ActivityItem item={item} index={index}/>}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={ListEmptyComponent}
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

