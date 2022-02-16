import React from 'react'
import { Modal , StyleSheet , View , Text } from 'react-native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import { numberFormat } from 'toktokwallet/helper'
import {useNavigation} from '@react-navigation/native'
import moment from 'moment'
import {Receipt} from 'toktokwallet/components'
import { useSelector } from 'react-redux'
import CONSTANTS from 'common/res/constants'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_WALLET } from 'toktokwallet/graphql'
import { useLazyQuery } from '@apollo/react-hooks'
import { useAlert } from 'src/hooks'
import { onErrorAlert} from 'src/util/ErrorUtility'
import { useAccount } from 'toktokwallet/hooks'

const {COLOR , FONT_FAMILY: FONT, FONT_SIZE , SIZE } = CONSTANTS


const TransactionInfo = ({label,value})=> (
    <>
    <View style={styles.transactionInfoView}>
        <View style={{flex: 1,justifyContent:"center",alignItems:"flex-start"}}>
            <Text style={{fontFamily: FONT.REGULAR,color:"dimgray",fontSize: FONT_SIZE.M}}>{label}</Text>
        </View>
        <View style={{flex: 1,justifyContent:"center",alignItems:"flex-end"}}>
            <Text style={{fontFamily: FONT.BOLD,fontSize:FONT_SIZE.M}}>{value}</Text>
        </View>
    </View>
    <View style={styles.divider}/>
    </>
)

const SuccessfulModal = ({successModalVisible , amount , cashInLogParams , onCashIn , paymentMethod })=> {
    const navigation = useNavigation()
    const {tokwaAccount,refreshWallet} = useAccount();
    const alert = useAlert();

    let status
    switch (cashInLogParams.status) {
        case "P":
            status = "Pending"
            break;
        case "S":
            status ="Successful"
            break;
        case "F":
            status = "Failed"
            break
        default:
            status = "Cancelled"
            break;
    }

    const [getWallet] = useLazyQuery(GET_WALLET, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy: "network-only",
        onError: (error) => onErrorAlert({alert,error}),
        onCompleted: ({getWallet})=> {
            refreshWallet();
            onCashIn({
                balance: getWallet.balance
            })
            return navigation.pop(4)
        }
    })


    const Proceed = ()=>  {
        // navigation.pop(4)
        if(onCashIn){
            getWallet() 
        }else{
            navigation.navigate("ToktokWalletHomePage")
            navigation.replace("ToktokWalletHomePage")
        }
       
    }


    const BottomComponent = ()=> {

        const bottomText = "Please make sure that you have carefully reviewed the amount to " +
        "cash in. A copy of the complete cash in details and instruction will " +
        "be sent to your email for fast and secured transaction.";
        
        return (
            <View style={{flex:1,justifyContent:"center",alignItems:"center",paddingHorizontal: 16}}>
                <Text style={{fontFamily: FONT.REGULAR , fontSize: FONT_SIZE.S}}>{bottomText}</Text>
            </View>
        )
    }


    return (
        <Modal
            animationType="fade"
            visible={successModalVisible}
            onRequestClose={Proceed}
        >
            <Receipt
                refNo={cashInLogParams.referenceNumber}
                onPress={Proceed}
                BottomComponent={BottomComponent}
             >
                <View style={styles.transactionInfo}>
                     <TransactionInfo label="Cash in Method" value={paymentMethod ? paymentMethod : "PayPanda"}/>
                     <TransactionInfo label={paymentMethod ? "Transaction No." : "PayPanda Ref. No."} value={cashInLogParams.paypandaReferenceNumber}/>
                     <TransactionInfo label={paymentMethod ? "Status" : "PayPanda Status"} value={status}/>
                     <TransactionInfo label="Amount to Pay" value={`PHP ${numberFormat(+cashInLogParams.amount + +cashInLogParams.providerServiceFee)}`}/>
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
        // flexDirection: "row",
    },
    transactionInfo: {
        marginTop: 40,
    },
    transactionInfoView: {
        width:"100%",
        flexDirection:"row",
        paddingVertical: 12
    },
    divider: {
        height: 1,
        width:"100%",
        backgroundColor: COLOR.LIGHT
    }
})

export default SuccessfulModal