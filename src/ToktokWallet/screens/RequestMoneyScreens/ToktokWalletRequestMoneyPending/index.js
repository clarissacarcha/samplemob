import React from "react"
import { View, Text , Image , StyleSheet , FlatList , ActivityIndicator , Dimensions , RefreshControl , TouchableOpacity} from 'react-native'
import { Separator , CheckIdleState , SwipeDownToRefresh , NoData} from "toktokwallet/components"
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { GET_REQUEST_MONEY_PENDING_RECEIVED } from 'toktokwallet/graphql'
import { numberFormat } from 'toktokwallet/helper'
import { useQuery } from '@apollo/react-hooks'
import { SomethingWentWrong } from 'src/components'
import {VectorIcon , ICON_SET } from 'src/revamp'
import moment from 'moment'
import { useNavigation } from '@react-navigation/native'
import CONSTANTS from 'common/res/constants';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS
const imageWidth = Dimensions.get('window').width - 200;

const RenderItem = ({item,index , onPress})=> {

    const openRMDetails = ()=>{
        onPress(item)
    }

    const person = `${item.destinationPerson.firstName} ${item.destinationPerson.lastName}`
    
    return (
        <TouchableOpacity onPress={openRMDetails} style={[styles.card]}>
            <View style={styles.cardContent}>
                 <View style={{flex: 1,height:"100%"}}>
                    <Text style={{fontFamily:FONT.REGULAR,fontSize:FONT_SIZE.M}}>Request No: {item.referenceNumber}</Text>
                    <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>Receive request money from</Text>
                    <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>{person}</Text>
                </View>
                <View>
                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,color: COLOR.YELLOW}}>PHP {numberFormat(+item.amount)}</Text>
                    <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color:COLOR.DARK}}>{moment(item.createdAt).format("MMM D, YYYY hh:mm a")}</Text>
                    <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.S,color:COLOR.YELLOW}}>click to see details</Text>
                </View>
            </View>
              
        </TouchableOpacity>
    )
}


export const ToktokWalletRequestMoneyPending = ({navigation,route})=> {

    const {data,error,loading,refetch} = useQuery(GET_REQUEST_MONEY_PENDING_RECEIVED, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy:"network-only"
    })

    const openRMDetails = (item)=> {
        return navigation.navigate("ToktokWalletRequestMoneyViewDetails" , {
            requestMoney: item
        })
    }
    
    if(loading){
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size={24} color={COLOR.YELLOW} />
                </View>
    }

    if(error){
        return <SomethingWentWrong />
    }



    return (
        <CheckIdleState>
            <Separator/>
            <FlatList
                ListHeaderComponent={() => {
                    if(data.getRequestMoneyPendingReceived.length > 0) return null
                    if(loading) return null
                    return <NoData/>
                }}
                style={styles.container}
                showsVerticalScrollIndicator={false}
                data={data.getRequestMoneyPendingReceived}
                keyExtractor={(item) => item.id}
                renderItem={({item,index})=> ( <RenderItem item={item} index={index} onPress={openRMDetails}/>)}
                ItemSeparatorComponent={() => (
                    <View style={{borderBottomWidth: 1.5, marginHorizontal: SIZE.MARGIN, borderColor: COLOR.LIGHT}} />
                    )}
                refreshControl={<RefreshControl onRefresh={refetch} refreshing={loading} colors={[COLOR.YELLOW]} />}
            />
        </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
    },
    card: {
        paddingVertical: 20,
        justifyContent:"center",
        paddingHorizontal: 16,
    },
    cardContent: {
        flexDirection:"row"
    },
    image: {
        height: imageWidth,
        width: imageWidth,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})