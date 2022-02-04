import React from 'react'
import {View,StyleSheet,Text,ImageBackground,Dimensions,Image} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { YellowButton, VectorIcon , ICON_SET  } from 'src/revamp'
import CONSTANTS from 'common/res/constants'
const  { COLOR , FONT_SIZE , FONT_FAMILY: FONT , SIZE } = CONSTANTS

const {height,width} = Dimensions.get("window")

const ProceedButton = ({route})=> {
    const navigation = useNavigation()
    return (
        <YellowButton label="Verify Now" onPress={()=> {
            navigation.pop()
            navigation.navigate(route)
        }}/>
    )
}

const CustomerNoAccount = ()=> {

    return (
        <>
             <View style={styles.content}>
                <View style={{alignItems:"center",marginTop: 10,}}>
                    <Text style={styles.verifyWalletText}>Verify your <Text style={{...styles.verifyWalletText, color: COLOR.YELLOW}}>toktok</Text><Text style={{...styles.verifyWalletText, color: COLOR.ORANGE}}>wallet</Text></Text>
                    <Text style={styles.clickVerifyText}>Click the "Verify Now" button.</Text>
                    <View style={{marginTop: 20,justifyContent:'center',alignSelf:"center"}}>

                        <View style={{marginVertical: 10}}>
                            <Image resizeMode="contain" style={{height: 200, width: 200}} source={require('toktokwallet/assets/images/tokwa_features.png')}/>
                        </View>

                        <View style={{flexDirection:'row',marginVertical: 10}}>
                             <View style={{padding: 2,height: 15,width: 15,alignSelf:"center", borderRadius: 100, borderColor: COLOR.YELLOW, borderWidth: 1,marginRight: 10}}>
                                {/* <VectorIcon style={{alignSelf:"center"}} size={12} iconSet={ICON_SET.Feather} name="check"/> */}
                            </View>
                            <View style={{justifyContent:"center"}}>
                                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}><Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,color: COLOR.ORANGE}}>Secure</Text> your toktokwallet</Text>
                            </View>
                        </View>

                        <View style={{flexDirection:'row',marginVertical: 10}}>
                             <View style={{padding: 2,height: 15,width: 15,alignSelf:"center", borderRadius: 100, borderColor: COLOR.YELLOW, borderWidth: 1,marginRight: 10}}>
                                {/* <VectorIcon style={{alignSelf:"center"}} size={12} iconSet={ICON_SET.Feather} name="check"/> */}
                            </View>
                            <View style={{justifyContent:"center"}}>
                                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}><Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,color: COLOR.ORANGE}}>Enjoy</Text> convenient payment</Text>
                                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>experience</Text>
                            </View>
                        </View>

                        <View style={{flexDirection:'row',marginVertical: 10}}>
                             <View style={{padding: 2,height: 15,width: 15,alignSelf:"center", borderRadius: 100, borderColor: COLOR.YELLOW, borderWidth: 1,marginRight: 10}}>
                                {/* <VectorIcon style={{alignSelf:"center"}} size={12} iconSet={ICON_SET.Feather} name="check"/> */}
                            </View>
                            <View style={{justifyContent:"center"}}>
                                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}><Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,color: COLOR.ORANGE}}>Unlock</Text> toktokwallet features</Text>
                            </View>
                        </View>
        
                     
                    </View>
                </View>
            </View>

            <View style={{height: 120,padding: 16,justifyContent:'flex-end'}}>
               <ProceedButton route="ToktokWalletVerification" />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 16,
        paddingTop: 30,
    },
    verifyWalletText: {
        fontFamily: FONT.BOLD,
        fontSize: 16,
        textAlign:'center'
    },
    clickVerifyText: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.S,
        textAlign:'center'
    },
    listItem: {
        fontFamily: FONT.REGULAR,
        marginBottom: 5,
        fontSize: FONT_SIZE.S,
        textAlign:'left'
    },
    walletbackgroundimage: {
        flex: 1,
        resizeMode: "cover",
    },
})


export default CustomerNoAccount