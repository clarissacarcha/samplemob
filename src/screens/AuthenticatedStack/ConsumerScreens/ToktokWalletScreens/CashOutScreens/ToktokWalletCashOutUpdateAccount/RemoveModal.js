import React from 'react'
import {Modal,View,Text,StyleSheet,Dimensions , Image,TouchableOpacity} from 'react-native'
import { FONT, FONT_SIZE, SIZE, COLOR } from '../../../../../../res/variables'
import { YellowButton } from '../../../../../../revamp'

const {width,height} = Dimensions.get("window")

const RemoveModal = ({visible,setVisible,bankAccount,removeAccount})=> {


    return (
        <>
            <Modal
                visible={visible}
                transparent={true}
                onRequestClose={()=>setVisible(false)}
                style={styles.container}
            >

                <View style={styles.modalBody}>
                    <View style={styles.content}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M, textAlign:"center",marginVertical: 10,marginHorizontal: 20}}>Removed this bank account?</Text>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M, textAlign:"center",marginHorizontal: 5}}>Account Number: {bankAccount.accountNumber}</Text>
                        {/* <View style={{flex: 1,justifyContent:"flex-end",width: "50%"}}>
                                <YellowButton label="Continue" onPress={Redirect}/>
                        </View> */}

                    <View style={{flex: 1,height: SIZE.FORM_HEIGHT,flexDirection:"row",alignItems:"flex-end"}}>
                                <TouchableOpacity 
                                        style={{
                                            flex: 1,
                                            paddingVertical: 2,
                                            height: SIZE.FORM_HEIGHT,
                                            justifyContent:"center",
                                            alignItems:"center",
                                            // backgroundColor:"lightgray"
                                        }}
                                        onPress={()=>setVisible(false)}
                                    >
                                        <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,color: COLOR.DARK}}>Cancel</Text>
                                </TouchableOpacity>
                                <View style={{flex: 1}}>
                                 <YellowButton label="Continue" onPress={()=> {
                                     setVisible(false)
                                     removeAccount()
                                 }}/>
                                </View>
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
    modalBody: {
        flex: 1,
        backgroundColor:"rgba(34, 34, 34, 0.25)",
        justifyContent:'center',
        alignItems:'center'
    },
    content: {
        width: width * 0.8,
        height: 180,
        backgroundColor:"white",
        borderRadius: SIZE.BORDER_RADIUS,
        padding: 16,
        alignItems:'center'
    }
})

export default RemoveModal