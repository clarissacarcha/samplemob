import React from 'react'
import { Modal , StyleSheet , View , Text} from 'react-native'
import { numberFormat , MaskLeftZero } from 'toktokwallet/helper'
import {useNavigation} from '@react-navigation/native'
import {Receipt} from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE} = CONSTANTS

const RecipientInfo = ({label,value})=> (
    <View style={styles.recipientInfoView}>
        <View style={{flex: 1,justifyContent:"center",alignItems:"flex-start"}}>
            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{label}</Text>
        </View>
        <View style={{flex: 1,justifyContent:"center",alignItems:"flex-end"}}>
            <Text style={{fontFamily: FONT.BOLD,fontSize:FONT_SIZE.M}}>{value}</Text>
        </View>
    </View>
)
export const SuccessfulModal = ({visible , requestMoney , walletinfoParams})=> {
    const navigation = useNavigation()
    const person = `${requestMoney.destinationPerson.firstName} ${requestMoney.destinationPerson.lastName}`

    const Proceed = ()=>  {
        //navigation.pop(3)
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
                // refNo={walletinfoParams.referenceNumber}
                refNo={MaskLeftZero(walletinfoParams.id)}
                refDate={walletinfoParams.createdAt}
                onPress={Proceed}
                // btnLabel=""
            >
                  <View style={styles.recipientInfo}>
                    <RecipientInfo label="Requester Name" value={person}/>
                    <RecipientInfo label="Mobile No." value={requestMoney.destinationAccount.mobileNumber}/>
                    <RecipientInfo label="Request Amount" value={`PHP ${numberFormat(requestMoney.amount)}`}/>
                    <RecipientInfo label="Sent Amount" value={`PHP ${numberFormat(walletinfoParams.amount)}`}/>
                    { requestMoney.sourceRemarks && <RecipientInfo label="Note" value={requestMoney.sourceRemarks}/> }
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
