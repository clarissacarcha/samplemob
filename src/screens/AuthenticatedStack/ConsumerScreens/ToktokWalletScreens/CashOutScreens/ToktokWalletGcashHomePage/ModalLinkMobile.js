import React from 'react'
import {View,Text,StyleSheet,Modal,Dimensions,TouchableOpacity} from 'react-native'
import { COLOR, FONT, SIZE } from '../../../../../../res/variables'
import { YellowButton } from '../../../../../../revamp'
import {useNavigation} from '@react-navigation/native'
import { FONT_SIZE } from '../../../../../../res/constants'

const {height,width} = Dimensions.get("screen")

const ModalLinkMobile = ({visible,setVisible,mobile,provider})=> {

    const navigation = useNavigation()

    const openLinkPage = ()=> {
        setVisible(false)
        return navigation.navigate("ToktokWalletGcashLinkAccount", {mobile,provider})
    }

    return (
        <>
        <Modal
            style={styles.container}
            transparent={true}
            visible={visible}
            onRequestClose={()=>setVisible(false)}
        >

            <View style={styles.modalContent}>
                <View style={styles.modalBody}>
                    <View style={{flex: 1,justifyContent:"center",alignItems:"center"}}>
                            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L, textAlign:"center"}}>Link this GCash number to your toktokwallet account?</Text>
                    </View>
                    <View style={{height: SIZE.FORM_HEIGHT,justifyContent:"flex-end",flexDirection:"row"}}>
                            {/* <YellowButton onPress={openLinkPage} label="Link"/> */}
                        <TouchableOpacity 
                                style={{
                                    flex: 1,
                                    paddingVertical: 2,
                                    height: SIZE.FORM_HEIGHT,
                                    justifyContent:"center",
                                    alignItems:"center"
                                }}
                                onPress={()=>setVisible(false)}
                            >
                                <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,color: COLOR.DARK}}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                                style={{
                                    flex: 1,
                                    paddingVertical: 2,
                                    height: SIZE.FORM_HEIGHT,
                                    justifyContent:"center",
                                    alignItems:"center"
                                }}
                                onPress={openLinkPage}
                            >
                                <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,color: COLOR.ORANGE}}>Link Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            
        </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalContent: {
        flex: 1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"rgba(34, 34, 34, 0.5)"
    },
    modalBody: {
        height: 150,
        width: width * 0.9,
        backgroundColor: "white",
        borderRadius: SIZE.BORDER_RADIUS,
        padding: 16,
    }
})

export default ModalLinkMobile