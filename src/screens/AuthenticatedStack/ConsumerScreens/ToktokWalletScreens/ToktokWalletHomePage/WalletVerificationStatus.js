import React from 'react'
import {View,Text,StyleSheet, Dimensions, Image , TouchableOpacity} from 'react-native'
import { FONTS, SIZES } from '../../../../../res/constants'
import {useNavigation} from '@react-navigation/native'
import {Separator} from '../Components'

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
                            <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M,color:"white"}}>Verification is under review</Text>
                            <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.S,color:"white"}}>Waiting for approval.</Text>
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
                            <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M,color:"white"}}>Verification of your toktokwallet Failed!</Text>
                            <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.S,color:"white"}}>Please review your details and verify again</Text>
                            {
                                walletinfo.toktokWalletKYC.remarks != null && <Text style={{fontFamily: FONTS.REGULAR,fontSize: 13,color:"white"}}>{walletinfo.toktokWalletKYC.remarks}</Text>
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
                        <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M,color:"white"}}>Verify your toktokwallet</Text>
                        <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.S,color:"white"}}>Enjoy secure and convenient payment experience.</Text>
                    </View>
            </View>
            <Separator />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent:"center",
        alignItems: "center",
        // marginBottom:8,
    },
    content: {
        width:"100%",
        // height: 70,
        paddingVertical: 10,
        backgroundColor:"orange",
        // borderWidth: .5,
        // borderColor:"dimgray",
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