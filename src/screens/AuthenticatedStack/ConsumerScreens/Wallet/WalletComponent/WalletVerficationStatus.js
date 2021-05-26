import React from 'react'
import {View,Text,StyleSheet, Dimensions, Image , TouchableOpacity} from 'react-native'
import { COLOR, FONT_BOLD, FONT_LIGHT, FONT_MEDIUM, FONT_REGULAR, SIZES } from '../../../../../res/constants'
import {useNavigation} from '@react-navigation/native'

const {width,height} = Dimensions.get("window")

const WalletVerificationStatus = ({walletinfo})=> {

    const navigation = useNavigation()

    if(walletinfo.isVerified){
        return null
    }

    if(walletinfo.toktokWalletKYC && walletinfo.toktokWalletKYC.status == 0){
        return (
            <TouchableOpacity onPress={()=>navigation.navigate("ToktokWalletVerifySetup")} style={styles.container}>
                <View style={styles.content}>
                        <Image style={styles.iconImage} resizeMode="contain" source={require('../../../../../assets/icons/walletVerify.png')}/>
                        <View style={styles.description}>
                            <Text style={{fontFamily: FONT_BOLD,fontSize: SIZES.M,color:"white"}}>Verification is under review</Text>
                            <Text style={{fontFamily: FONT_REGULAR,fontSize: SIZES.S,color:"white"}}>Waiting for approval.</Text>
                        </View>
                </View>
             </TouchableOpacity>
        )
    }

    if(walletinfo.toktokWalletKYC && walletinfo.toktokWalletKYC.status == 2){
        return (
            <TouchableOpacity onPress={()=>navigation.navigate("ToktokWalletVerifySetup")} style={styles.container}>
                <View style={styles.content}>
                        <Image style={styles.iconImage} resizeMode="contain" source={require('../../../../../assets/icons/walletVerify.png')}/>
                        <View style={styles.description}>
                            <Text style={{fontFamily: FONT_BOLD,fontSize: SIZES.M,color:"white"}}>Verification of your toktokwallet Failed!</Text>
                            <Text style={{fontFamily: FONT_REGULAR,fontSize: SIZES.S,color:"white"}}>Please review your details and verify again</Text>
                            {
                                walletinfo.toktokWalletKYC.remarks != null && <Text style={{fontFamily: FONT_REGULAR,fontSize: 13,color:"white"}}>{walletinfo.toktokWalletKYC.remarks}</Text>
                            }
                            
                        </View>
                </View>
             </TouchableOpacity>
        )
    
    }

    return (
        <TouchableOpacity onPress={()=>navigation.navigate("ToktokWalletVerifySetup")} style={styles.container}>
            <View style={styles.content}>
                    <Image style={styles.iconImage} resizeMode="contain" source={require('../../../../../assets/icons/walletVerify.png')}/>
                    <View style={styles.description}>
                        <Text style={{fontFamily: FONT_BOLD,fontSize: SIZES.M,color:"white"}}>Verify your toktokwallet</Text>
                        <Text style={{fontFamily: FONT_REGULAR,fontSize: SIZES.S,color:"white"}}>Enjoy secure and convenient payment experience.</Text>
                    </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:"center",
        alignItems: "center",
        marginTop: 10,
    },
    content: {
        width:"100%",
        // height: 70,
        paddingVertical: 10,
        backgroundColor:"orange",
        // borderWidth: .5,
        // borderColor:"dimgray",
        borderRadius: 5,
        flexDirection:"row",
        padding: 10,
    },
    iconImage: {
        height: 30,
        width: 30,
        alignSelf:"center",
        marginRight: 10,
    },
    description: {
        flex: 1,
        justifyContent:"center",
        marginRight: 10,
    }
})

export default WalletVerificationStatus