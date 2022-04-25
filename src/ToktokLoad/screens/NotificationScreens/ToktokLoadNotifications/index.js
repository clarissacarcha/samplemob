import React from 'react'
import { View , Text , StyleSheet, ActivityIndicator ,FlatList , RefreshControl } from 'react-native'
import { GET_NOTIFICATIONS_BY_CLASSIFICATION } from 'toktokwallet/graphql'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { useAlert } from 'src/hooks'
import { SomethingWentWrong } from 'src/components'
import { useQuery } from '@apollo/react-hooks'
import { useSelector } from 'react-redux'
import { EmptyList} from 'toktokload/components'
import CONSTANTS from 'common/res/constants';
import { empty_notifications } from "src/ToktokLoad/assets/images";

//SELF IMPORTS
import { Notification } from './Components'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS

export const ToktokLoadNotifications = ({navigation,route})=> {

  const session = useSelector(state=> state.session)

  const {data, error, loading, refetch} = useQuery(GET_NOTIFICATIONS_BY_CLASSIFICATION , {
    fetchPolicy:"network-only",
    variables: {
      input: {
        userId: session.user.id,
        classification: "toktokload"
      }
    },
  })

  if(loading){
    return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size={24} color={COLOR.YELLOW} />
            </View>
  }

  if(error){
    return <SomethingWentWrong />
  }

  return (
      <FlatList
        ListEmptyComponent={() => {
          return (
            <EmptyList
              imageSrc={empty_notifications}
              label="No Notifications"
              message="We’ll notify you when something arrives."
            />
          )
        }}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "white" }}
        showsVerticalScrollIndicator={false}
        data={data.getNotificationsByClassification}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={()=><View style={styles.separator}/>}
        renderItem={({item, index}) => <Notification item={item} index={index}/>}
        refreshControl={<RefreshControl onRefresh={refetch} refreshing={loading} colors={[COLOR.YELLOW]} />}
      />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"white",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  separator: {
    height: 2,
    backgroundColor: COLOR.LIGHT,
  },
})