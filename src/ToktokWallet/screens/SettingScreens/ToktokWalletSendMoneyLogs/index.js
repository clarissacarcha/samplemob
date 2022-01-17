import React from 'react'
import { View , Text , StyleSheet, RefreshControl } from 'react-native'
import {useLazyQuery , useQuery} from '@apollo/react-hooks'
import {TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_CASH_INS} from 'toktokwallet/graphql'
import {useSelector} from 'react-redux'
import {Separator, ModalPaginationLoading , CheckIdleState, SwipeDownToRefresh ,NoData} from 'toktokwallet/components'
import { HeaderBack , HeaderTitle} from 'src/revamp'
import CONSTANTS from 'common/res/constants'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { useAlert } from 'src/hooks'
import { SomethingWentWrong } from 'src/components'

export const ToktokWalletSendMoneyLogs = ({navigation,route})=> {


    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['Cash In','']}/>,
    })
    return (
        <CheckIdleState>
            <Separator />

            <View style={styles.container}>
                    <View style={styles.content}>

                     </View>
            </View>

        </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    header: {
        justifyContent: "center",
        alignItems: "center"
    },
    content: {
       padding: 16,
       flex: 1
    },
    filterType: {
        alignSelf: "flex-end",
        padding: 5, 
        paddingHorizontal: 15, 
        borderRadius: 10,
        borderWidth: 1,
        marginRight: 10
    },
    transactionLogsContainer: {
        marginVertical: 0
    },
    transaction: {
        paddingVertical: 10,
        borderBottomWidth: .2,
        borderColor:"silver",
        flexDirection: "row"
    },
    transactionIcon: {
        flexBasis: 50,
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: 5,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionAmount: {
        flexBasis: "auto",
        alignItems: "flex-end"
    }
})