import React , {useState, useContext } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,TouchableHighlight,Animated,ActivityIndicator,ImageBackground,ScrollView,Image,Dimensions} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { COLOR, DARK, FONT_REGULAR, SIZES } from '../../../../../res/constants'
import {CheckWalletRestrictionContext} from './CheckWalletRestrictionProvider'

const {width,height} = Dimensions.get("window")


const WalletMethod = ({onPress , imageSource , label , imageSize})=> (
    <TouchableOpacity onPress={onPress} style={[styles.walletMethod]}>
        <View style={styles.methodItem}>
            <Image style={{height: imageSize.height,width: imageSize.width}} source={imageSource} resizeMode="contain" />
        </View>

        <Text style={styles.walletMethodText}>{label}</Text>
    </TouchableOpacity>
)


const WalletMethods = ({walletinfo})=> {

    const navigation = useNavigation()

    const [isVerificationModalVisible,setIsVerificationModalVisible] = useState(false)
    const [isSecureWithPINVisible,setIsSecureWithPINVisible] = useState(false)
    const [isWalletOnHoldVisible,setIsWalletOnHoldVisible] = useState(false)

    const {checkIfResctricted} = useContext(CheckWalletRestrictionContext)

    const onPress = (route , {checkifVerified})=> {
        if(!checkIfResctricted()){
            return navigation.navigate(route,{walletinfo})
        }

    }

    return (
        <>
        <View style={styles.walletMethodsContainer}>
            {/* <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                */}
                <WalletMethod label="Send" imageSize={{height: 26, width: (width / 4 )}} onPress={()=>onPress("ToktokWalletSendMoney" , {checkifVerified: true})} imageSource={require('../../../../../assets/icons/walletSend.png')}/>
                <WalletMethod label="Scan" imageSize={{height: 26, width: (width / 4 ) - 70}} onPress={()=>onPress("ToktokWalletScanQR", {checkifVerified: true})} imageSource={require('../../../../../assets/icons/walletScan.png')}/>
                <WalletMethod label="Cash In" imageSize={{height: 26, width: (width / 4 )}} onPress={()=>onPress("ToktokWalletPaymentOptions" , {checkifVerified: true})} imageSource={require('../../../../../assets/icons/methodCashin.png')}/>
                <WalletMethod label="Cash Out" imageSize={{height: 26, width: (width / 4 )}} onPress={()=>onPress("ToktokWalletCashOut", {checkifVerified: true})} imageSource={require('../../../../../assets/icons/walletTransfer.png')}/>
            {/* </ScrollView> */}
        </View>
         </>
    )
}

const styles = StyleSheet.create({
    walletMethodsContainer: {
       flexDirection: "row",
       height: 65,
       marginTop: 10,
       flexWrap: "nowrap",
       flex: 1,
       backgroundColor:"white",
       borderRadius: 10,
       position:"absolute",
       zIndex: 2,
       width:"95%",
       alignSelf:"center",
       justifyContent:"center",
    //    alignItems:"center",
       bottom: -30,
       shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    walletMethod: {
        flex: 1,
        padding:10,
        alignItems:"center",
    },
    methodItem: {
        width: (width / 4 ) - 30,
        justifyContent: "center",
        alignItems: "center",
    },
    walletMethodText: {
        alignSelf: "center",
        marginTop: 5,
        color: "gray",
        fontSize: SIZES.S,
        fontFamily: FONT_REGULAR
    }
})

export default WalletMethods