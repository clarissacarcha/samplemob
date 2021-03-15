import React from 'react'
import { Modal , StyleSheet , View , Text , TouchableOpacity} from 'react-native'
import { COLOR, FONT_REGULAR , DARK, FONT_MEDIUM, FONT_BOLD} from '../../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'

const MessageModal = ({msgModalVisible, setMsgModalVisible, modalMessage})=> {
    let title = modalMessage == "Wallet not found" ? "Recipient can't receive yet" : "This Person Doesn't Have Toktok"
    let message = modalMessage == "Wallet not found"? 'Tell your recipient to activate their Toktok Wallet first' : 'Tell them to download and install Toktok App'

    const ModalContent = ()=> (
        <View style={{justifyContent: "center",alignItems:"center",flex: 1}}>
                <View style={{height: 80,width: 80,borderRadius: 100, backgroundColor: "red",justifyContent: "center", alignItems: "center",marginBottom: 20}}>
                            <FIcon5 name="times" color="white" size={40}/>
                </View>
                <Text style={{fontFamily: FONT_BOLD, fontSize: 18,marginVertical: 10,}}>{title}</Text>
                <Text style={{fontFamily: FONT_MEDIUM,fontSize: 12, color:"gray"}}>{message}</Text>
        </View>
    )


    return (
        <Modal
            animationType="fade"
            visible={msgModalVisible}
            onRequestClose={()=>setMsgModalVisible(false)}
        >

            <View style={styles.container}>
                <View style={styles.content}>
                        <ModalContent />
                </View>
                <View style={styles.buttons}>

                    <TouchableOpacity
                        style={{
                            flex: 1,
                            marginRight: 5,
                            paddingVertical: 10,
                            justifyContent: "center",
                            alignItems:"center",
                            borderRadius: 10,
                            borderColor: "gray",
                            borderWidth: 1,
                        }}
                        onPress={()=>setMsgModalVisible(false)}
                    >   
                             <Text style={{fontFamily: FONT_REGULAR,fontSize: 12,color:"gray"}}>CLOSE</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            marginLeft: 5,
                            paddingVertical: 10,
                            justifyContent: "center",
                            alignItems:"center",
                            backgroundColor: DARK, 
                            borderRadius: 10,
                        }}
                        onPress={()=>setMsgModalVisible(false)}
                    >   
                             <Text style={{fontFamily: FONT_REGULAR,fontSize: 12,color:COLOR}}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "white",
        justifyContent: "center"
    },
    content: {
        flex: 1,
    },
    buttons: {
        flexDirection: "row"
    }
})

export default MessageModal