import React from 'react'
import { Modal , StyleSheet , View , Text , TouchableOpacity} from 'react-native'
import { COLOR, FONT_REGULAR , DARK, FONT_MEDIUM, FONT_BOLD} from '../../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import { numberFormat } from '../../../../../../helper'
import {useNavigation} from '@react-navigation/native'

const SuccessfulModal = ({successModalVisible , amount})=> {
    const navigation = useNavigation()

    const ModalContent = ()=> (
        <View style={{justifyContent: "center",alignItems:"center",flex: 1}}>
                <View style={{height: 80,width: 80,borderRadius: 100, backgroundColor: "#FCB91A",justifyContent: "center", alignItems: "center",marginBottom: 20}}>
                            <FIcon5 name="check" color="white" size={40}/>
                </View>
                <Text style={{fontFamily: FONT_BOLD, fontSize: 18,marginVertical: 10,}}>Transaction Completed</Text>
                <Text style={{fontFamily: FONT_MEDIUM,fontSize: 12, color:"gray"}}>{'\u20B1'} {numberFormat(amount)}</Text>
        </View>
    )

    const Proceed = ()=>  {
        navigation.pop(2)
        navigation.replace("TokTokWallet")
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

export default React.memo(SuccessfulModal)