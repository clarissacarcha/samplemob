import React from 'react'
import { Modal , StyleSheet , View , Text } from 'react-native'
import { numberFormat , MaskLeftZero } from 'toktokwallet/helper'
import {useNavigation} from '@react-navigation/native'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import {Receipt} from './Receipt'

const { SIZE , FONT_FAMILY: FONT , COLOR , FONT_SIZE } = CONSTANTS

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

const SuccessfulCashOutModal = ({visible, setVisible, cashoutLogParams, tokwaAccount, savedAccounts, note, activeAccount, screenLabel , accountName})=> {
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
        if(screenLabel){
            navigation.navigate("ToktokWalletFullyVerifiedApplication")
            navigation.replace("ToktokWalletFullyVerifiedApplication")
        } else {
            navigation.navigate("ToktokWalletHomePage")
            navigation.replace("ToktokWalletHomePage")
        }
    }

    const traceNumber = cashoutLogParams?.cashOutUbApiLog?.traceNumber ? cashoutLogParams?.cashOutUbApiLog?.traceNumber : null
    const remittanceId = cashoutLogParams?.cashOutUbApiLog?.remittanceId ?  cashoutLogParams?.cashOutUbApiLog?.remittanceId : null
    const type = cashoutLogParams?.cashOutUbApiLog?.type 
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
                savedAccounts={savedAccounts}
                activeAccount={activeAccount}
                accountName={accountName}
                cashoutLogParams={cashoutLogParams}
                setVisible={setVisible}
            >
                
                <View style={styles.recipientInfo}>
                     <TransactionInfo label="Bank" value={cashoutLogParams.bank?.name}/>
                     <TransactionInfo label="Account Name" value={cashoutLogParams.accountName}/>
                     <TransactionInfo label="Account Number" value={cashoutLogParams.accountNumber}/>
                    {
                        traceNumber && tokwaAccount.constants.UbFundTransferType == "api" &&
                        <TransactionInfo 
                            label="Trace Number"
                            value={traceNumber}
                        />
                    }

                    {
                        remittanceId && tokwaAccount.constants.UbFundTransferType == "api" &&
                        <TransactionInfo 
                            label="Remittance ID"
                            value={remittanceId}
                        />
                    }
                    
                     
                     <TransactionInfo label="Amount" value={`${tokwaAccount.wallet.currency.code} ${numberFormat(cashoutLogParams.amount)}`}/>
                     {
                        tokwaAccount.constants.UbFundTransferType == "api" &&
                        <>
                        <TransactionInfo label="Convenience Fee" value={`${tokwaAccount.wallet.currency.code} ${numberFormat(+cashoutLogParams.providerServiceFee + +cashoutLogParams.systemServiceFee)}`}/>
                        <TransactionInfo label="Total Amount" value={`${tokwaAccount.wallet.currency.code} ${numberFormat(+cashoutLogParams.providerServiceFee + +cashoutLogParams.systemServiceFee + +cashoutLogParams.amount)}`}/>
                        </>
                     }
                     { note != "" && <TransactionInfo label="Note" value={cashoutLogParams.note}/>}
                     <TransactionInfo label="Status" value={status}/>
            
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