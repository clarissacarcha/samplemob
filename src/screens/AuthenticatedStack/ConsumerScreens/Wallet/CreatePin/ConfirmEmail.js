import React, { useState ,useRef } from 'react'
import {View,Text,StyleSheet,TouchableHighlight,TouchableOpacity,TextInput,Modal,Image} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE, FONT_MEDIUM, FONT_REGULAR} from '../../../../../res/constants'
import {useNavigation} from '@react-navigation/native'
import {HeaderBack, HeaderTitle} from '../../../../../components'

const SuccessModal = ({modalVisible,closeModal})=> {
    const navigation = useNavigation()

    return (
        <Modal
             visible={modalVisible}
             onRequestClose={closeModal}
        >
             <View style={styles.container}>
                 <View style={[styles.content]}>
                     <View style={{
                         justifyContent: "center",
                         alignItems: "center",
                         height: 150,
                         width: 150,
                         backgroundColor: "#FEEABA",
                         borderRadius: 100,
                         marginVertical: 40,
                     }}>
                         <Image style={{height: 100,width: 100}} source={require('../../../../../assets/icons/walletVerify.png')}/>
                     </View>
                     <Text style={{fontSize: 20,fontFamily: FONT_MEDIUM}}>Toktok PIN Set Up Successfully</Text>
                     <Text style={{color: "#212529",marginTop:5,fontFamily: FONT_REGULAR}}>Your ToktokPay Wallet is now safe!</Text>
                 </View>
      
                 <TouchableOpacity
                     onPress={()=>navigation.navigate("TokTokWallet")}
                     style={{alignItems: "center",height: 40,backgroundColor: DARK,margin: 20,justifyContent: "center",borderRadius: 10,}}
                 >
                         <Text style={{color: COLOR,fontSize: 12,fontFamily: FONT_MEDIUM}}>Done</Text>
                 </TouchableOpacity>
            </View>
     
        </Modal>
     )
}


const ConfirmEmail = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack/>,
        headerTitle: ()=> <HeaderTitle label={['Set up a PIN','']}/>,
    })

    const {pinCode} = route.params
    const [modalVisible,setModalVisible] = useState(false)

    const closeModal = ()=> setModalVisible(!modalVisible)

    const CompleteSetup = ()=> {
        setModalVisible(!modalVisible)
    }

    return (
        <>
        <SuccessModal modalVisible={modalVisible} closeModal={closeModal}/>
       <View style={styles.container}>
            <View style={styles.content}>
                <Text style={{fontSize: 14,fontFamily: FONT_MEDIUM,marginTop: 20,}}>Confirm Your Email Address</Text>
                <View style={{alignSelf: "flex-start",width: "100%",marginTop: 20,}}>
                    <Text style={{fontSize: 12,fontFamily: FONT_MEDIUM}}>Email Address</Text>    
                    <TextInput 
                        placeholder="Email"
                        style={styles.input} 
                    /> 
                    <Text style={{fontSize: 12,fontFamily: FONT_REGULAR}}>This Email address will be used to regain access to ToktokPay if you experience issues logging in.</Text>
                </View>
            </View>
 
            <TouchableOpacity
                onPress={CompleteSetup}
                style={{alignItems: "center",height: 40,backgroundColor: DARK,margin: 20,justifyContent: "center",borderRadius: 10,}}
            >
                    <Text style={{color: COLOR,fontSize: 12,fontFamily: FONT_MEDIUM}}>Submit</Text>
            </TouchableOpacity>
       </View>
       </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    content: {
        alignItems: "center",
        padding: 20,
        flex: 1,
    },
    input: {
        borderWidth: 0.5,
        borderColor: "silver",
        padding: 5,
        marginVertical:10,
        borderRadius: 5,
        fontSize: 12,
        fontFamily: FONT_REGULAR
    },
})

export default ConfirmEmail