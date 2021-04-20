import React , {useState} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,TouchableHighlight,Animated,ActivityIndicator,ImageBackground,ScrollView,Image,Dimensions} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { COLOR, DARK, FONT_REGULAR } from '../../../../../res/constants'
import VerificationMessageModal from '../Notification/VerificationMessageModal'
import SecurewithPIN from '../Notification/SecurewithPIN'
import WalletHoldMessageModal from '../Notification/WalletHoldMessageModal'

const {width,height} = Dimensions.get("window")


const WalletMethod = ({onPress , imageSource , label , imageSize})=> (
    <View style={[styles.walletMethod]}>
        <TouchableOpacity onPress={onPress} style={styles.methodItem}>
            <Image style={{height: imageSize.height,width: imageSize.width}} source={imageSource} resizeMode="contain" />
        </TouchableOpacity>

        <Text style={styles.walletMethodText}>{label}</Text>
    </View>
)


const WalletMethods = ({walletinfo})=> {

    const navigation = useNavigation()

    const [isVerificationModalVisible,setIsVerificationModalVisible] = useState(false)
    const [isSecureWithPINVisible,setIsSecureWithPINVisible] = useState(false)
    const [isWalletOnHoldVisible,setIsWalletOnHoldVisible] = useState(false)

    const onPress = (route , {checkifVerified})=> {
        if(checkifVerified){
            // checking if wallet is verified
            if(!walletinfo.isVerified){
                return setIsVerificationModalVisible(true)
            }

            // checking if pin is set
            if(!walletinfo.pincode || walletinfo.pincode == null){
                return setIsSecureWithPINVisible(true)
            }

            // checking if wallet is on hold
            if(walletinfo.isHold){
                return setIsWalletOnHoldVisible(true)
            } 
            

            return navigation.navigate(route,{walletinfo})
        }

    }

    return (
        <>
        <VerificationMessageModal isVisible={isVerificationModalVisible} setIsVisible={setIsVerificationModalVisible}/>
        <SecurewithPIN isVisible={isSecureWithPINVisible} setIsVisible={setIsSecureWithPINVisible} walletinfo={walletinfo}/>
        <WalletHoldMessageModal isVisible={isWalletOnHoldVisible} setIsVisible={setIsWalletOnHoldVisible} />
        <View style={styles.walletMethodsContainer}>
            {/* <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                */}
                <WalletMethod label="Send" imageSize={{height: 26, width: 26}} onPress={()=>onPress("TokTokWalletActionsSend" , {checkifVerified: true})} imageSource={require('../../../../../assets/icons/walletSend.png')}/>
                <WalletMethod label="Scan" imageSize={{height: 25, width: 23}} onPress={()=>onPress("TokTokWalletActionsScantoPay", {checkifVerified: true})} imageSource={require('../../../../../assets/icons/walletScan.png')}/>
                <WalletMethod label="Cash in" imageSize={{height: 26, width: 26}} onPress={()=>onPress("TokTokWalletCashIn" , {checkifVerified: true})} imageSource={require('../../../../../assets/icons/methodCashin.png')}/>
                <WalletMethod label="Cash out" imageSize={{height: 26, width: 26}} onPress={()=>onPress("TokTokWalletCashout", {checkifVerified: true})} imageSource={require('../../../../../assets/icons/walletTransfer.png')}/>
            {/* </ScrollView> */}
        </View>
         </>
    )
}

const styles = StyleSheet.create({
    walletMethodsContainer: {
        flexDirection: "row",
        height: 120,
        marginTop: 10,
        flexWrap: "nowrap",
        flex: 1,
       // paddingHorizontal: 5,
    },
    walletMethod: {
        flex: 1,
        padding:10,
        // height: 65,
        // width: 65,
        // marginRight: 10,
         alignItems:"center"
    },
    methodItem: {
        // flex: 1,
        height: 65,
        // width: 65,
        width: (width / 4 ) - 30,
        borderColor: "silver",
        borderWidth:0.5,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    walletMethodText: {
        alignSelf: "center",
        marginTop: 10,
        color: "gray",
        fontSize: 12,
        fontFamily: FONT_REGULAR
    }
})

export default WalletMethods