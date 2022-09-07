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
const SuccessfulModal = ({successModalVisible , amount , recipient , walletinfoParams , note})=> {
    const navigation = useNavigation()


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
                refNo={MaskLeftZero(walletinfoParams.id)}
                refDate={walletinfoParams.createdAt}
                onPress={Proceed}
            >
                  <View style={styles.recipientInfo}>
                        {/* <RecipientInfo label="Payment Method" value="toktokwallet"/> */}
                        <RecipientInfo label="Recipient Name" value={recipient.name}/>
                        <RecipientInfo label="Recipient Mobile No." value={recipient.mobileNo}/>
                        <RecipientInfo label="Amount" value={`PHP ${numberFormat(amount)}`}/>
                        <RecipientInfo label="Note" value={note}/>
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