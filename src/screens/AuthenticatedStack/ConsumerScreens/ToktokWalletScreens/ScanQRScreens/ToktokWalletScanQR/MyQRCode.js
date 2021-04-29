import React from 'react'
import {Modal,View,Text,StyleSheet,Dimensions} from 'react-native'
import { BlackButton, YellowButton } from '../../../../../../revamp'
import QRCode from 'react-native-qrcode-svg'
import {useSelector} from 'react-redux'

const {width,height} = Dimensions.get("window")

const MyQRCode = ({visible,setVisible})=> {

    const session = useSelector(state=>state.session)

    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={()=>setVisible(false)}
            style={styles.container}
            animationType="fade"
        >
            <View style={styles.content}>
                    <View style={styles.qrContainer}>
                        <View style={styles.qrContainer}>
                            <View style={{flex: 1,justifyContent:"center",alignItems:"center"}}>
                                     <QRCode
                                        value={session.user.userId} //Give value when there's no session as it will throw an error if value is empty.
                                        size={width * 0.7}
                                        color="black"
                                        backgroundColor="transparent"
                                        // onPress={() => alert('Pressed')}
                                    />
                            </View>
                            <View style={{height: 70,padding: 10,justifyContent:"flex-end"}}>
                                <YellowButton label="Close" onPress={()=>setVisible(false)}/>
                            </View>
                        </View>
                    </View>
            </View>

        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        backgroundColor:"rgba(0,0,0,0.5)",
        flex: 1,
        justifyContent:'center',
        alignItems:'center'
    },
    qrContainer: {
        width: width * 0.9,
        height: height * 0.6,
        backgroundColor:"white",
        borderRadius: 5,
    }
})

export default MyQRCode