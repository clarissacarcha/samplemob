import React from 'react'
import { Modal , StyleSheet , View , Text} from 'react-native'
import { numberFormat , MaskLeftZero } from 'toktokwallet/helper'
import {useNavigation} from '@react-navigation/native'
import {Receipt} from 'toktokwallet/components'
import moment from 'moment';
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE} = CONSTANTS

const TransactionInfo = ({label,value})=> (
    <View style={styles.recipientInfoView}>
        <View style={{flex: 1,justifyContent:"center",alignItems:"flex-start"}}>
            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{label}</Text>
        </View>
        <View style={{flex: 1,justifyContent:"center",alignItems:"flex-end"}}>
            <Text style={{fontFamily: FONT.BOLD,fontSize:FONT_SIZE.M,textAlign:"right"}}>{value}</Text>
        </View>
    </View>
)
const SuccessfulModal = ({
    successModalVisible , 
    transactionInfo ,
    merchant ,
    branch ,
    terminal,
    note,
    tokwaAccount,
    amount,
    serviceFee
})=> {
    const navigation = useNavigation()

    const { transaction } = transactionInfo
    const Proceed = ()=>  {
        //navigation.pop(3)
        navigation.navigate("ToktokWalletHomePage")
        navigation.replace("ToktokWalletHomePage")
    }


    return (
        <Modal
            animationType="fade"
            visible={successModalVisible}
            onRequestClose={Proceed}
        >
            <Receipt
                // refNo={walletinfoParams.referenceNumber}
                refNo={transaction.refNo}
                refDate={transaction.createdAt}
                onPress={Proceed}
            >
                  <View style={styles.recipientInfo}>
                        <TransactionInfo label="Merchant/Branch" value={`${merchant.merchantName} ${branch.branchName} (${terminal.terminalName})`}/>
                        <TransactionInfo label="Account Name" value={`${tokwaAccount.person.firstName} ${tokwaAccount.person.lastName}`}/>
                        <TransactionInfo label="Account Number" value={tokwaAccount.mobileNumber}/>
                        <TransactionInfo label="Amount" value={`₱${numberFormat(amount)}`}/>
                        <TransactionInfo label="Service Fee" value={`₱${numberFormat(serviceFee)}`}/>
                        <TransactionInfo label="Total Amount" value={`₱${numberFormat(+amount + +serviceFee)}`}/>
                        { note != "" && <TransactionInfo label="Note" value={note}/>}
                </View>
            </Receipt>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "white",
        justifyContent: "center"
    },
    content: {
        flex: 1,
    },
    buttons: {
        // flexDirection: "row"
    },
    recipientInfo: {
        marginTop: 40,
    },
    recipientInfoView: {
        width:"100%",
        // borderBottomWidth: .2,
        borderColor:"silver",
        flexDirection:"row",
        paddingVertical: 7
    }
})

export default React.memo(SuccessfulModal)