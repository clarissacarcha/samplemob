import React from 'react'
import {View,Text,StyleSheet,ImageBackground,Dimensions,Image} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { HeaderImageBackground , HeaderTitle , Separator } from 'toktokwallet/components'
import { YellowButton , VectorIcon , ICON_SET } from 'src/revamp'
import CONSTANTS from 'common/res/constants'

const  { COLOR , FONT_SIZE , FONT_FAMILY: FONT } = CONSTANTS


const {height,width} = Dimensions.get("window")

const PendingKYC = ()=> {
    const navigation = useNavigation()

    navigation.setOptions({
        headerShown:false,
    })
    return (
        <>
        <View style={styles.container}>
             <View style={styles.headings}>
                <HeaderImageBackground>
                        <HeaderTitle isLogo={true} />
                </HeaderImageBackground>
            </View>
            <Separator/>
            <View style={styles.content}>
                <View style={{alignItems:"center",marginTop: 10,}}>
                    <Text style={styles.verifyWalletText}>We are evaluating your application.</Text>
                    <Text style={styles.clickVerifyText}>Your toktokwallet verification is ongoing. Please wait for your account to be approved.</Text>
                    <View style={{marginTop: 20,justifyContent:'center'}}>

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
                                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}><Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,color: COLOR.ORANGE}}>Unlock</Text> wallet features</Text>
                            </View>
                        </View>
       
                    </View>
                </View>
            </View>

            <View style={{height: 70,padding: 16,justifyContent:'flex-end'}}>
                <YellowButton label="OK" onPress={()=> {
                    navigation.pop()
                }}/>
            </View>
        
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    },
    headings: {
        height: 92,
        backgroundColor:"black"
    },  
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
        marginTop: 5,
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.S,
        textAlign:'center'
    },
    listItem: {
        fontFamily: FONT.REGULAR,
        marginBottom: 5,
        fontSize: FONT_SIZE.S
    },
})

export default PendingKYC
