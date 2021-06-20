import React from 'react'
import { Modal , StyleSheet , View , Text } from 'react-native'
import { SIZES, FONTS, COLORS} from '../../../../../../res/constants'
import { numberFormat } from '../../../../../../helper'
import {useNavigation} from '@react-navigation/native'
import {Receipt} from './Receipt'
import { MaskLeftZero } from '../../../../../../util/HelperUtility'

const TransactionInfo = ({label,value})=> (
    <View style={styles.transactionInfoView}>
        <View style={{flex: 1,justifyContent:"center",alignItems:"flex-start"}}>
            <Text style={{fontFamily: FONTS.REGULAR,color:COLORS.DARK,fontSize: SIZES.M}}>{label}</Text>
        </View>
        <View style={{flex: 1,justifyContent:"center",alignItems:"flex-end"}}>
            <Text style={{fontFamily: FONTS.BOLD,fontSize:SIZES.M,color: COLORS.DARK,textAlign:"right"}}>{value}</Text>
        </View>
    </View>
)

const SuccessfulCashOutModal = ({visible , cashoutLogParams, tokwaAccount})=> {
    const navigation = useNavigation()

    console.log(JSON.stringify(cashoutLogParams))

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
    
    return (
        <Modal
            animationType="fade"
            visible={visible}
            onRequestClose={Proceed}
        >
            <Receipt
                refNo={MaskLeftZero(cashoutLogParams.id)}
                refDate={cashoutLogParams.createdAt}
                onPress={Proceed}
            >
                
                <View style={styles.recipientInfo}>
                     <TransactionInfo label="Bank" value={cashoutLogParams.bank}/>
                     <TransactionInfo label="Account Name" value={cashoutLogParams.accountName}/>
                     <TransactionInfo label="Account Number" value={cashoutLogParams.accountNumber}/>
                     <TransactionInfo label="Status" value={status}/>
                     <TransactionInfo label="Amount" value={`${tokwaAccount.wallet.currency.code} ${numberFormat(cashoutLogParams.amount)}`}/>
                     <TransactionInfo label="Note" value={cashoutLogParams.note}/>
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