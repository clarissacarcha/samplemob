import React from 'react'
import { View , Text , StyleSheet , TouchableOpacity , Image } from 'react-native'
import { numberFormat , MaskLeftZero } from 'toktokwallet/helper';
import moment from 'moment'
import CONSTANTS from 'common/res/constants'

const { COLOR, FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS


export const TransactionLog = ()=> {

    return (
        <>
            <View>

            </View>
        </>
    )

}

const styles = StyleSheet.create({
    transactionLogsContainer: {
        marginVertical: 10
    },
    transaction: {
        paddingVertical: 12,
        // marginVertical: 5,
        flexDirection: "row",
    },
    transactionIcon: {
        flexBasis: 50,
        alignSelf: "center"
    },
    transactionDetails: {
        flex: 1,
    },
    transactionAmount: {
        flexBasis: "auto",
        alignItems: "flex-end"
    },
    divider: {
        height: 1,
        width: "100%",
        backgroundColor: COLOR.LIGHT,
    }
})
