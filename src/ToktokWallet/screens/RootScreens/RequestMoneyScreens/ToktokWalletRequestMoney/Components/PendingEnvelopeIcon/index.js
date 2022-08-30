import React , {useCallback} from 'react'
import { View , Text , TouchableOpacity , StyleSheet } from 'react-native'
import { VectorIcon, ICON_SET } from 'src/revamp'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { GET_REQUEST_MONEY_PENDING_RECEIVED_COUNT } from 'toktokwallet/graphql'
import { useQuery } from '@apollo/react-hooks'
import { useThrottle } from 'src/hooks'
import { useFocusEffect } from '@react-navigation/native'
import CONSTANTS from 'common/res/constants'
const { COLOR , FONT_FAMILY: FONT , SIZE , FONT_SIZE , MARGIN } = CONSTANTS

const EnvelopeIcon = ({count = 0 , onPress})=> {

    const onPressThrottled = useThrottle(onPress , 2000)

    return (
        <View style={{flex: 1,alignItems:"flex-end",paddingVertical: MARGIN.M}}>
        <TouchableOpacity hitSlop={{top: 20,bottom: 20,left: 20,right: 20}} onPress={onPressThrottled}>
            {
                count > 0 &&
                <View style={styles.pendingRequestCount}>
                    <Text style={styles.pendingRequestCountText}>
                        {count}
                    </Text>
                </View>
            }
            <VectorIcon color={"black"} iconSet={ICON_SET.FontAwesome} name="envelope" size={20}/>
        </TouchableOpacity>
    </View>
    )
}

export const PendingEnvelopeIcon = ({navigation})=> {

    const openPendingHistory = ()=> {
        navigation.navigate("ToktokWalletRequestMoneyPending")
    }

    useFocusEffect(useCallback(()=>{
        refetch()
    },[]))
    const {data ,error ,loading,refetch} = useQuery(GET_REQUEST_MONEY_PENDING_RECEIVED_COUNT , {
        fetchPolicy:"network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    })

    if(loading || error){
        return <EnvelopeIcon onPress={openPendingHistory}/>
    }

    const dataNotViewedPending = data.getRequestMoneyPendingReceived.filter((request)=> request.isViewed == 0)

    return <EnvelopeIcon count={dataNotViewedPending.length} onPress={openPendingHistory}/>
}

const styles = StyleSheet.create({
    pendingRequestCount: {
        borderRadius: 7, 
        height: 14,
        width: 14,
        backgroundColor:COLOR.RED,
        position:"absolute",
        top: -5,
        right: -2,
        justifyContent:"center",
        alignItems:"center",
        zIndex:1
    },
    pendingRequestCountText: {
        color: "white",
        fontSize: FONT_SIZE.XS,
        fontFamily:FONT.REGULAR
    }
})