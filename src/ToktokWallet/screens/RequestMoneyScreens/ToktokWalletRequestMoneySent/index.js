import React , {useState} from 'react'
import { Image , View , Text , StyleSheet , Dimensions , FlatList ,ActivityIndicator , RefreshControl , TouchableOpacity } from 'react-native'
import { Separator , CheckIdleState , SwipeDownToRefresh , NoData } from "toktokwallet/components"
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { GET_REQUEST_MONEY_PENDING_SENT } from 'toktokwallet/graphql'
import { numberFormat } from 'toktokwallet/helper'
import { useQuery } from '@apollo/react-hooks'
import { SomethingWentWrong } from 'src/components'
import {VectorIcon , ICON_SET } from 'src/revamp'
import moment from 'moment'
import { useNavigation } from '@react-navigation/native'
import CONSTANTS from 'common/res/constants';

//SELF IMPORTS 
import Details from './Details'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS
const imageWidth = Dimensions.get('window').width - 200;

const RenderItem = ({item,index})=> {

    const [openModal,setOpenModal] = useState(false)
    const [info,SetInfo] = useState({})
    const navigation = useNavigation();

    const openRMDetails = ()=> {
        // SetInfo({
        //     ...item,
        //     amount: `PHP ${numberFormat(+item.amount)}`,
        //     refDate: moment(item.createdAt).format("MMM D, YYYY hh:mm a"),
        //     name: "Request Money",
        //     phrase: `Sent request money to ${person}`,
        // })
        // setOpenModal(true)

        return navigation.navigate("ToktokWalletRequestMoneyViewDetails" , {
            requestMoney: item,
            enableCancel: true,
        })
    }

    const person = `${item.destinationPerson.firstName} ${item.destinationPerson.lastName}`
    
    return (
        <>
        <Details
            visible={openModal}
            setVisible={setOpenModal}
            transaction={info}
        />
        <TouchableOpacity onPress={openRMDetails} style={[styles.card]}>
            <View>
                
            </View>
            <View style={styles.cardContent}>
                 <View style={{flex: 1,height:"100%",justifyContent:"flex-start"}}>
                    <Text style={{fontFamily:FONT.REGULAR,fontSize:FONT_SIZE.M}}>Request No: {item.referenceNumber}</Text>
                    <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>Sent request money to</Text>
                    <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>{person}</Text>
                </View>
                <View>
                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,color: COLOR.YELLOW}}>PHP {numberFormat(+item.amount)}</Text>
                    <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color:COLOR.DARK}}>{moment(item.createdAt).format("MMM D, YYYY hh:mm a")}</Text>
                    <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.S,color:COLOR.YELLOW}}>click to see details</Text>
                </View>
            </View>
              
        </TouchableOpacity>
        </>
    )
}



export const ToktokWalletRequestMoneySent = ()=> {

    const {data,error,loading,refetch} = useQuery(GET_REQUEST_MONEY_PENDING_SENT, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy:"network-only"
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
        <CheckIdleState>
            <Separator/>
            <SwipeDownToRefresh/>
            <FlatList
                ListHeaderComponent={() => {
                    if(data.getRequestMoneyPendingSent.length > 0) return null
                    if(loading) return null
                    return <NoData/>
                }}
                style={styles.container}
                showsVerticalScrollIndicator={false}
                data={data.getRequestMoneyPendingSent}
                keyExtractor={(item) => item.id}
                renderItem={({item,index})=> ( <RenderItem item={item} index={index}/>)}
                ItemSeparatorComponent={() => (
                    <View style={{borderBottomWidth: 1.5, marginHorizontal: SIZE.MARGIN, borderColor: COLOR.LIGHT}} />
                    )}
                refreshControl={<RefreshControl onRefresh={refetch} refreshing={loading} colors={[COLOR.YELLOW]} />}
            />

        </CheckIdleState>
    )
}


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    },
    card: {
        paddingVertical: 10,
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
