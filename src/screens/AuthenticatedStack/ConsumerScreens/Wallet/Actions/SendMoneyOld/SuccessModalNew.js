import React from 'react'
import { Modal , StyleSheet , View , Text , TouchableOpacity , Image} from 'react-native'
import { COLOR, FONT_REGULAR , DARK, FONT_MEDIUM, FONT_BOLD} from '../../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import { numberFormat } from '../../../../../../helper'
import {useNavigation} from '@react-navigation/native'

const SuccessfulModal = ({successModalVisible , amount , recipient , walletinfoParams})=> {
    const navigation = useNavigation()

    const ModalContent = ()=> (
        <View style={styles.modalcontent}>
            <View style={styles.recipientInfo}>
                    <Text style={styles.recipientInfoText}>Successfully sent to</Text>
                    <Image source={require('../../../../../../assets/images/user-icon.png')} style={{height: 70,width: 70,marginVertical: 10}}/>
                    <Text style={styles.recipientInfoText}>{recipient.name}</Text>
                    <Text style={{...styles.recipientInfoText,fontSize: 20,marginTop: 10}}>{'\u20B1'} {numberFormat(amount)}</Text>
            </View>

            <View style={styles.amountInfo}>
                <Text>{JSON.stringify(walletinfoParams)}</Text>
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
                <View style={styles.title}>
                    <Text style={{fontFamily: FONT_BOLD,color:"white",fontSize: 20}}>Send Money</Text>
                </View>
                <View style={styles.content}>
                        <ModalContent />
                </View>
                {/* <View style={styles.buttons}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            paddingVertical: 10,
                            justifyContent: "center",
                            alignItems:"center",
                            backgroundColor: DARK, 
                            borderRadius: 10,
                        }}
                        onPress={Proceed}
                    >   
                             <Text style={{fontFamily: FONT_REGULAR,fontSize: 12,color:COLOR}}>OK</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 20,
        backgroundColor: "white",
        justifyContent: "center"
    },
    content: {
        flex: 1,
        backgroundColor:"#FCB91A",
        padding: 10
    },
    title: {
        paddingVertical: 10,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor: "#ff8214"
    },
    modalcontent: {
        justifyContent: "flex-start",
        alignItems:"center",
        flex: 1,
        backgroundColor:"white",
        borderRadius: 10,
        padding: 20
    },
    buttons: {
        flexDirection: "row"
    },
    recipientInfo: {
        justifyContent: 'center',
        alignItems:'center',
        marginTop: 20,
    },
    recipientInfoText: {
        fontFamily: FONT_MEDIUM,
        fontSize: 16,
        color:"gray"
    },
    amountInfo: {
        paddingVertical: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor:"silver",
        width:"100%",
        marginVertical: 20
    }
})

export default React.memo(SuccessfulModal)