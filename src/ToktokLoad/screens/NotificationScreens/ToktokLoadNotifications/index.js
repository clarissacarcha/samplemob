import React from 'react'
import { View , Text , StyleSheet, ActivityIndicator ,FlatList , RefreshControl } from 'react-native'
import {GET_NOTIFICATIONS_BY_CLASSIFICATION } from 'toktokwallet/graphql'
import { SomethingWentWrong } from 'src/components'
import { useQuery } from '@apollo/react-hooks'
import { useSelector } from 'react-redux'
import { NoData} from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants';

//SELF IMPORTS
import {
    Notification
} from './Components'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS

export const ToktokLoadNotifications = ({navigation,route})=> {

    const session = useSelector(state=> state.session)

    const  {data,error,loading,refetch} = useQuery(GET_NOTIFICATIONS_BY_CLASSIFICATION , {
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
        <View style={styles.container}>
                     <FlatList
                        ListHeaderComponent={() => {
                            if(data?.getNotificationsByClassification.length > 0) return null
                            if(error) return null
                            return (
                                <NoData
                                   title="No Notifications"
                                   label="We’ll notify you when something arrives."
                                   type="notification"
                                />
                             )
                        }}
                        showsVerticalScrollIndicator={false}
                        data={data.getNotificationsByClassification}
                        keyExtractor={(item) => item.id}
                        ItemSeparatorComponent={()=><View style={styles.separator}/>}
                        renderItem={({item, index}) => <Notification item={item} index={index}/>}
                        refreshControl={<RefreshControl onRefresh={refetch} refreshing={loading} colors={[COLOR.YELLOW]} />}
                    />
        </View>
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