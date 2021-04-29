import React from 'react'
import {Modal,View,Text,StyleSheet,Dimensions,Image,TouchableOpacity} from 'react-native'
import { COLOR, DARK, FONT_MEDIUM, FONT_REGULAR } from '../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import {useNavigation} from '@react-navigation/native'

const {width,height} = Dimensions.get("window")

const ActionButton = ({onPress,label, textStyle, btnStyle})=> {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.actionBtn,{...btnStyle}]}>
                <Text style={[{...textStyle},{fontFamily: FONT_REGULAR,fontSize: 12}]}>{label}</Text>
        </TouchableOpacity>
    )
}

const VerificationMessageModal = ({isVisible,setIsVisible})=> {

    const navigation = useNavigation()

    const verifyUser = ()=> {
        setIsVisible(false)
        return navigation.navigate("ToktokWalletVerifySetup")
    }

    return (
        <Modal
            style={styles.container}
            visible={isVisible}
            onRequestClose={()=>{
                setIsVisible(false)
            }}
            transparent={true}
        >

            <View style={styles.content}>
                    <View style={styles.message}>
                         
                         <View style={{flexDirection:"column"}}>
                                <Image style={{height: 100,width:100, alignSelf:"center"}} resizeMode="contain" source={require('../../../../../assets/images/toktokwallet.png')} />
                                <View style={{justifyContent:"center"}}>
                                    <Text style={{fontFamily: FONT_MEDIUM,fontSize: 16}}>Verify Your Wallet</Text>
                                    <Text style={{fontFamily:FONT_REGULAR,fontSize:12}}></Text>
                                    <View>
                                        <Text style={{fontFamily: FONT_REGULAR,marginBottom: 1}}><FIcon5 color="orange" name="check" /> Secure your account</Text>
                                        <Text style={{fontFamily: FONT_REGULAR,marginBottom: 15}}><FIcon5 color="orange" name="check" /> Unlock Walllet features</Text>
                                    </View>
                                </View>
                          </View>


                          <View style={styles.actionButtons}>

                          <ActionButton onPress={()=>setIsVisible(false)} label={'Do it later'} textStyle={{color: "gray"}} btnStyle={{  borderWidth: 1, borderColor: "gray" }}/>
                          <ActionButton onPress={verifyUser} label={'Verify Now'} textStyle={{color: COLOR}} btnStyle={{backgroundColor: DARK}}/>
  
                          </View>
                    </View>
                  
            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:"center",
        alignItems:'center'
    },
    content: {
        flex: 1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"rgba(0,0,0,0.6)",
    },
    message: {
        width: width * 0.8,
        paddingVertical: 20,
        backgroundColor: "white",
        borderRadius: 5,
        justifyContent:"flex-start",
        alignItems:"center",
        paddingRight: 15,
    },
    actionButtons: {
        flexDirection:"row",
        paddingHorizontal: 10,
        paddingBottom:10,
        marginTop: 15,
    },
    actionBtn: {
        flex: 1,
        marginHorizontal: 5,
        justifyContent:"center",
        alignItems:"center",
        height: 35,
        borderRadius: 10
    }
})

export default VerificationMessageModal