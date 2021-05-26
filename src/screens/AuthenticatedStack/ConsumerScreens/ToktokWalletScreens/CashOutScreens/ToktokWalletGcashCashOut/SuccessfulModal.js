import React from 'react'
import { Modal , StyleSheet , View , Text , TouchableOpacity} from 'react-native'
import { COLOR, FONT_REGULAR , DARK, FONT_MEDIUM, FONT_BOLD, FONT_LIGHT, SIZES} from '../../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import { numberFormat } from '../../../../../../helper'
import {useNavigation} from '@react-navigation/native'
import moment from 'moment'
import { BlackButton } from '../../../../../../revamp'
import Receipt from '../../Components/Receipt'

const TransactionInfo = ({label,value})=> (
    <View style={styles.transactionInfoView}>
        <View style={{flex: 1,justifyContent:"center",alignItems:"flex-start"}}>
            <Text style={{fontFamily: FONT_REGULAR,color:"dimgray",fontSize: SIZES.M}}>{label}</Text>
        </View>
        <View style={{flex: 1,justifyContent:"center",alignItems:"flex-end"}}>
            <Text style={{fontFamily: FONT_MEDIUM,fontSize:SIZES.M}}>{value}</Text>
        </View>
    </View>
)

const SuccessfulModal = ({successModalVisible , amount , cashoutLogParams})=> {
    const navigation = useNavigation()

    let status
    switch(cashoutLogParams.status){
        case 0:
            status = "Pending"
            break
        case 1:
            status = "Successful"
        default:
            status = "Rejected"
            break
    }

    const ModalContent = ()=> (
        <View style={{justifyContent: "flex-start",alignItems:"center",flex: 1,marginTop: 30}}>
                <View style={{height: 80,width: 80,borderRadius: 100, backgroundColor: "#FCB91A",justifyContent: "center", alignItems: "center",marginBottom: 20}}>
                            <FIcon5 name="check" color="white" size={40}/>
                </View>
                <Text style={{fontFamily: FONT_BOLD, fontSize: SIZES.XL,marginTop: 15,}}>Transaction Completed</Text>
                <Text style={{fontFamily: FONT_MEDIUM, fontSize: SIZES.M,marginVertical: 2,marginTop: 5}}>Ref. No. {cashoutLogParams.referenceNumber}</Text>
                <Text style={{fontFamily: FONT_LIGHT,fontSize: SIZES.S}}>{moment(cashoutLogParams.createdAt).tz('Asia/Manila').format('MMM DD YYYY h:mm a')}</Text>
                <View style={styles.transactionInfo}>
                     <TransactionInfo label="Cash out method" value="GCash"/>
                     <TransactionInfo label="Status" value={status}/>
                     <TransactionInfo label="Amount" value={`PHP ${numberFormat(cashoutLogParams.totalAmount)}`}/>
                </View>
        </View>
    )

    const Proceed = ()=>  {
        // navigation.pop(3)
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
                refNo={cashoutLogParams.referenceNumber}
                onPress={Proceed}
            >
                <ModalContent />
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

export default React.memo(SuccessfulModal)