import React from 'react'
import { Modal , StyleSheet , View , Text } from 'react-native'
import { FONT_REGULAR , FONT_MEDIUM, FONT_BOLD, FONT_LIGHT, SIZES} from '../../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import { numberFormat } from '../../../../../../helper'
import {useNavigation} from '@react-navigation/native'
import moment from 'moment'
import {Receipt} from '../../Components'
import { COLOR } from '../../../../../../res/variables'
import { useSelector } from 'react-redux'


const TransactionInfo = ({label,value})=> (
    <>
    <View style={styles.transactionInfoView}>
        <View style={{flex: 1,justifyContent:"center",alignItems:"flex-start"}}>
            <Text style={{fontFamily: FONT_REGULAR,color:"dimgray",fontSize: SIZES.M}}>{label}</Text>
        </View>
        <View style={{flex: 1,justifyContent:"center",alignItems:"flex-end"}}>
            <Text style={{fontFamily: FONT_MEDIUM,fontSize:SIZES.M}}>{value}</Text>
        </View>
    </View>
    <View style={styles.divider}/>
    </>
)

const SuccessfulModal = ({successModalVisible , amount , cashInLogParams})=> {
    const navigation = useNavigation()
    const tokwaAccount = useSelector(state=>state.toktokWallet)

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

    const ModalContent = ()=> (
        <View style={{justifyContent: "center",alignItems:"center",flex: 1}}>
                <View style={{height: 80,width: 80,borderRadius: 100, backgroundColor: "#FCB91A",justifyContent: "center", alignItems: "center",marginBottom: 20}}>
                            <FIcon5 name="check" color="white" size={40}/>
                            {/* <Image style={{height: 40,width: 40,alignSelf: "center"}} source={require('../../../../../../assets/images/paypanda.png')}/> */}
                </View>
                <Text style={{fontFamily: FONT_BOLD, fontSize: SIZES.XL,marginTop: 15,}}>Transaction Completed</Text>
                <Text style={{fontFamily: FONT_MEDIUM, fontSize: SIZES.M,marginVertical: 2,marginTop: 5}}>Ref. No. {cashInLogParams.referenceNumber}</Text>
                <Text style={{fontFamily: FONT_LIGHT,fontSize: SIZES.S}}>{moment(cashInLogParams.createdAt).tz('Asia/Manila').format('MMM DD YYYY h:mm a')}</Text>
                <View style={styles.transactionInfo}>
                     <TransactionInfo label="Cash in Method" value="PayPanda"/>
                     <TransactionInfo label="PayPanda Ref. No." value={cashInLogParams.paypandaReferenceNumber}/>
                     <TransactionInfo label="PayPanda Status" value={status}/>
                     <TransactionInfo label="Account Name" value={`${tokwaAccount.person.firstName} ${tokwaAccount.person.lastName}`}/>
                     <TransactionInfo label="Account Number" value={tokwaAccount.mobileNumber}/>
                     <TransactionInfo label="Amount" value={`PHP ${numberFormat(cashInLogParams.amount)}`}/>
                </View>
        </View>
    )

    const Proceed = ()=>  {
        // navigation.pop(4)
        navigation.navigate("ToktokWalletHomePage")
        navigation.replace("ToktokWalletHomePage")
    }


    return (
        <Modal
            animationType="fade"
            visible={successModalVisible}
            onRequestClose={Proceed}
        >

            {/* <View style={styles.container}>
                <View style={styles.content}>
                        <ModalContent />
                </View>
                <View style={styles.buttons}>
                    <BlackButton label="Ok" onPress={Proceed}/>
                </View>
            </View> */}
            <Receipt
                refNo={cashInLogParams.referenceNumber}
                onPress={Proceed}
            >
                <View style={styles.transactionInfo}>
                     <TransactionInfo label="Cash in Method" value="PayPanda"/>
                     <TransactionInfo label="PayPanda Ref. No." value={cashInLogParams.paypandaReferenceNumber}/>
                     <TransactionInfo label="PayPanda Status" value={status}/>
                     <TransactionInfo label="Amount" value={`PHP ${numberFormat(cashInLogParams.amount)}`}/>
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