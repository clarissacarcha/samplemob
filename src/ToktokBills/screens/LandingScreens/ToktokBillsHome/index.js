import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, FlatList, Dimensions, Image, RefreshControl } from 'react-native';
import { moderateScale, getStatusbarHeight } from 'toktokbills/helper';
import { useIsFocused } from '@react-navigation/native';

//SELF IMPORTS
import { BillerType } from "./Components";
import { Separator, LoadingIndicator, Header } from 'toktokbills/components';
import { SomethingWentWrong } from 'toktokbills/components';
// import { HeaderBack, HeaderTitle } from 'src/components';

//GRAPHQL & HOOKS
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql';
import { GET_BILL_TYPES } from 'toktokbills/graphql/model';
import { useAccount } from 'toktokwallet/hooks';

//IMAGE, FONT & COLOR
import CONSTANTS from 'common/res/constants';
const { COLOR , FONT_FAMILY: FONT , FONT_SIZE}  = CONSTANTS;
const { width, height } = Dimensions.get("window");

export const ToktokBillsHome = ({navigation,route})=> {
 
  const isFocused = useIsFocused();
  const [billTypes, setBillTypes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [getBillTypes, {loading, error, refetch}] = useLazyQuery(GET_BILL_TYPES, {
    fetchPolicy: "cache-and-network",
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: () => {
      setRefreshing(false);
      setBillTypes([]);
    },
    onCompleted: ({ getBillTypes }) => {
      setRefreshing(false);
      setBillTypes(getBillTypes);
    }
  })

  useEffect(() => {
    getBillTypes();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
  }

  const display = () => {
    if(loading && billTypes.length === 0){
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
      <>
        <Text style={styles.title}>Select Biller Type</Text>
        <FlatList
          contentContainerStyle={styles.flatlistContainer}
          showsVerticalScrollIndicator={false}
          numColumns={3}
          data={billTypes}
          keyExtractor={(item)=>item.name}
          renderItem={({item,index})=><BillerType item={item} index={index}/>}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      </>
      
    )
  }
  
  return (
    <View style={styles.container}>
      <Header label="toktokbills" />
      { display() }
    </View>
  )
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor:"white",
  },
  flatlistContainer: {
    paddingHorizontal: width * .03,
    paddingBottom: width * .035,
    flexGrow: 1
  },
  title: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
    paddingHorizontal: width * .05,
    paddingVertical: width * .05,
  }
})
