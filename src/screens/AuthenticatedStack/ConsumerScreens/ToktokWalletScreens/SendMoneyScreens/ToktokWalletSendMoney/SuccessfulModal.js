import React from 'react'
import { Modal , StyleSheet , View , Text} from 'react-native'
import { FONT_REGULAR , FONT_MEDIUM, FONT_BOLD, FONT_LIGHT, SIZES, FONTS, COLORS} from '../../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import { numberFormat } from '../../../../../../helper'
import {useNavigation} from '@react-navigation/native'
import moment from 'moment'
import Receipt from '../../Components/Receipt'
import { BlackButton } from '../../../../../../revamp'

const RecipientInfo = ({label,value})=> (
    <View style={styles.recipientInfoView}>
        <View style={{flex: 1,justifyContent:"center",alignItems:"flex-start"}}>
            <Text style={{fontFamily: FONTS.REGULAR,color:COLORS.DARK,fontSize: SIZES.M}}>{label}</Text>
        </View>
        <View style={{flex: 1,justifyContent:"center",alignItems:"flex-end"}}>
            <Text style={{fontFamily: FONTS.BOLD,fontSize:SIZES.M,color: COLORS.DARK}}>{value}</Text>
        </View>
    </View>
)
const SuccessfulModal = ({successModalVisible , amount , recipient , walletinfoParams})=> {
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
                refNo={walletinfoParams.referenceNumber}
                refDate={walletinfoParams.createdAt}
                onPress={Proceed}
            >
                  <View style={styles.recipientInfo}>
                        <RecipientInfo label="Payment Method" value="toktokwallet"/>
                        <RecipientInfo label="Recipient" value={recipient.name}/>
                        <RecipientInfo label="Fund Transfered" value={`PHP ${numberFormat(amount)}`}/>
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