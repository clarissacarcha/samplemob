import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, FlatList, Dimensions, Image, RefreshControl } from 'react-native';
import { moderateScale, getStatusbarHeight } from 'toktokbills/helper';
import { useIsFocused } from '@react-navigation/native';

//SELF IMPORTS
import { NotificationItem } from "./Components";
import { HeaderBack, HeaderTitle, Separator, LoadingIndicator, Header, EmptyList } from 'toktokbills/components';
import { SomethingWentWrong } from 'toktokbills/components';

//GRAPHQL & HOOKS
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql';
import { GET_BILL_TYPES } from 'toktokbills/graphql/model';
import { useAccount } from 'toktokwallet/hooks';
import { GET_NOTIFICATIONS_BY_CLASSIFICATION } from 'toktokwallet/graphql'
import { useSelector } from 'react-redux';

//IMAGE, FONT & COLOR
import CONSTANTS from 'common/res/constants';
import { empty_notifications } from 'toktokbills/assets/images';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE}  = CONSTANTS;
const { width, height } = Dimensions.get("window");

export const ToktokBillsNotifications = ({navigation,route})=> {
 
  const { user } = useSelector((state) => state.session);
  const isFocused = useIsFocused();
  const [records, setRecords] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [getNotificationsByClassification, { error, loading}] = useLazyQuery(GET_NOTIFICATIONS_BY_CLASSIFICATION , {
    fetchPolicy:"network-only",
    variables: {
      input: {
        userId: user.id,
        classification: "toktokbills"
      }
    },
    onError: (error) => {
      setRefreshing(false);
      setRecords([]);
    },
    onCompleted: ({ getNotificationsByClassification }) => {
      setRecords(getNotificationsByClassification);
      setRefreshing(false);
    }
  })

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    getNotificationsByClassification();
  }

  const ListEmptyComponent = () => {
    if(refreshing) return null
    return(
      <View style={styles.container}>
        <EmptyList
          imageSrc={empty_notifications}
          label={"No Notifications"}
          message={"We’ll notify you when something arrives."}
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
        contentContainerStyle={styles.flatlistContainer}
        showsVerticalScrollIndicator={false}
        data={records}
        keyExtractor={(item)=>item.name}
        renderItem={({item,index})=><NotificationItem item={item} index={index}/>}
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
      <Header label="Notifications" onBack={() => { navigation.navigate("ToktokBillsHome") }} />
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
    flexGrow: 1
  }
})
