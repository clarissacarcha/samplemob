import React from 'react'
import { Modal , StyleSheet , View , Text } from 'react-native'
import { numberFormat , MaskLeftZero } from 'toktokwallet/helper'
import {useNavigation} from '@react-navigation/native'
import {Receipt} from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'

const { FONT_FAMILY: FONT , FONT_SIZE , SIZE , COLOR } = CONSTANTS

const TransactionInfo = ({label,value})=> (
    <View style={styles.transactionInfoView}>
        <View style={{flex: 1,justifyContent:"center",alignItems:"flex-start"}}>
            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{label}</Text>
        </View>
        <View style={{flex: 1,justifyContent:"center",alignItems:"flex-end"}}>
            <Text style={{fontFamily: FONT.BOLD,fontSize:FONT_SIZE.M,textAlign:"right"}}>{value}</Text>
        </View>
    </View>
)

const SuccessfulCashOutModal = ({visible , cashoutLogParams,tokwaAccount})=> {
    const navigation = useNavigation()

    let status
    switch(cashoutLogParams.status){
        case "0":
            status = "Pending"
            break
        case "1":
            status = "Successful"
            break
        case "2":
            status = "Pending"
            break
        default:
            status = "Rejected"
            break
    }


    const Proceed = ()=>  {
        // navigation.pop(3)
        navigation.navigate("ToktokWalletHomePage")
        navigation.replace("ToktokWalletHomePage")
    }

    const cashOutRefNo = cashoutLogParams.referenceNumber ? cashoutLogParams.referenceNumber : MaskLeftZero(cashoutLogParams.id)

    return (
        <Modal
            animationType="fade"
            visible={visible}
            onRequestClose={Proceed}
        >
            <Receipt
                refNo={cashOutRefNo}
                refDate={cashoutLogParams.createdAt}
                onPress={Proceed}
            >
                
                <View style={styles.recipientInfo}>
                     <TransactionInfo label="Bank" value="BDO"/>
                     <TransactionInfo label="Account Name" value={cashoutLogParams.accountName}/>
                     <TransactionInfo label="Account Number" value={cashoutLogParams.accountNumber}/>
                     <TransactionInfo label="Status" value={status}/>
                     <TransactionInfo label="Amount" value={`${tokwaAccount.wallet.currency.code} ${numberFormat(cashoutLogParams.amount)}`}/>
                </View>            
            </Receipt>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:10,
        backgroundColor: "white",
        justifyContent: "center"
    },
    content: {
        flex: 1,
    },
    recipientInfo: {
        marginTop: 40,
    },
    buttons: {
        // flexDirection: "row"
    },
    transactionInfo: {
        marginTop: 40,
    },
    transactionInfoView: {
        width:"100%",
        // borderBottomWidth: .3,
        borderColor:"silver",
        flexDirection:"row",
        paddingVertical: 7
    }
})

export default SuccessfulCashOutModal