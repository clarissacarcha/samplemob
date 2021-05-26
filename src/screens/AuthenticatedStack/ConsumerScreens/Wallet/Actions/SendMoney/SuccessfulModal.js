import React from 'react'
import { Modal , StyleSheet , View , Text , TouchableOpacity} from 'react-native'
import { COLOR, FONT_REGULAR , DARK, FONT_MEDIUM, FONT_BOLD, FONT_LIGHT, SIZES} from '../../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import { numberFormat } from '../../../../../../helper'
import {useNavigation} from '@react-navigation/native'
import moment from 'moment'
import { BlackButton } from '../../../../../../revamp'

const RecipientInfo = ({label,value})=> (
    <View style={styles.recipientInfoView}>
        <View style={{flex: 1,justifyContent:"center",alignItems:"flex-start"}}>
            <Text style={{fontFamily: FONT_REGULAR,color:"dimgray",fontSize: SIZES.M}}>{label}</Text>
        </View>
        <View style={{flex: 1,justifyContent:"center",alignItems:"flex-end"}}>
            <Text style={{fontFamily: FONT_MEDIUM,fontSize:SIZES.M}}>{value}</Text>
        </View>
    </View>
)
const SuccessfulModal = ({successModalVisible , amount , recipient , walletinfoParams})=> {
    const navigation = useNavigation()

    const ModalContent = ()=> (
        <View style={{justifyContent: "flex-start",alignItems:"center",flex: 1,marginTop: 30}}>
                <View style={{height: 100,width: 100,borderRadius: 100, backgroundColor: "#FCB91A",justifyContent: "center", alignItems: "center",marginBottom: 20}}>
                            <FIcon5 name="check" color="white" size={50}/>
                </View>
                <Text style={{fontFamily: FONT_BOLD, fontSize: 18,marginTop: 15}}>Transaction Completed</Text>
                <Text style={{fontFamily: FONT_MEDIUM, fontSize: SIZES.M,marginVertical: 2,marginTop: 5}}>Ref. No. {walletinfoParams.referenceNumber}</Text>
                <Text style={{fontFamily: FONT_LIGHT,fontSize: SIZES.S}}>{moment(walletinfoParams.createdAt).tz('Asia/Manila').format('MMM DD YYYY h:mm a')}</Text>

                <View style={styles.recipientInfo}>
                        <RecipientInfo label="Payment Method" value="toktokwallet"/>
                        <RecipientInfo label="Recipient" value={recipient.name}/>
                        <RecipientInfo label="Fund Transfered" value={`${'\u20b1'} ${numberFormat(amount)}`}/>
                </View>
        </View>
    )

    const Proceed = ()=>  {
        navigation.pop(3)
        navigation.replace("ToktokWalletHomePage")
    }


    return (
        <Modal
            animationType="fade"
            visible={successModalVisible}
            onRequestClose={Proceed}
        >

            <View style={styles.container}>
                <View style={styles.content}>
                        <ModalContent />
                </View>
                <View style={styles.buttons}>
                    <BlackButton label="OK" onPress={Proceed}/>
                </View>
            </View>
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