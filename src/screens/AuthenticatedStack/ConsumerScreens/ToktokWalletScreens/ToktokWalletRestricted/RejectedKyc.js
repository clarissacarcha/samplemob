import React from 'react'
import {View,Text,StyleSheet,ImageBackground,Dimensions} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { HeaderImageBackground , HeaderTitle , Separator } from '../Components'
import { COLOR , FONT_SIZE , FONT, SIZE } from '../../../../../res/variables'
import { YellowButton , VectorIcon , ICON_SET } from '../../../../../revamp'

const {height,width} = Dimensions.get("window")


const RejectedKyc = ()=> {
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
                <Text style={styles.verifyWalletText}><Text style={{ ...styles.verifyWalletText , color: COLOR.YELLOW}}>toktok</Text><Text style={{...styles.verifyWalletText, color: COLOR.ORANGE}}>wallet</Text> application has been rejected.</Text>
                <Text style={styles.clickVerifyText}>Please check your email for further details or click "Verify Now" to try again.</Text>
                <View style={{marginTop: 40,justifyContent:'center'}}>
        
                        <ImageBackground 
                            resizeMode="stretch"
                            imageStyle={{borderRadius: SIZE.BORDER_RADIUS}}
                            source={require('../../../../../assets/toktokwallet-assets/unlock.png')}
                            style={{borderRadius: SIZE.BORDER_RADIUS, width: width - 80, height: 90,backgroundColor:"transparent",flexDirection:"row"}}
                        >
                            <View style={{flex:1,backgroundColor:"transparent",justifyContent:"center",alignItems:"flex-end",paddingRight: 20}}>
                                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}><Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M, color: COLOR.ORANGE}}>Secure</Text> your</Text>
                                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>toktokwallet</Text>
                            </View>
                        </ImageBackground>

                        <ImageBackground 
                            resizeMode="stretch"
                            imageStyle={{borderRadius: SIZE.BORDER_RADIUS}}
                            source={require('../../../../../assets/toktokwallet-assets/secure.png')}
                            style={{marginVertical: 10, borderRadius: SIZE.BORDER_RADIUS, width: width - 80, height: 90,backgroundColor:"transparent",flexDirection:"row"}}
                        >
                            <View style={{flex:1,backgroundColor:"transparent",justifyContent:"center",alignItems:"flex-end",paddingRight: 20}}>
                                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}><Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M, color: COLOR.ORANGE}}>Enjoy</Text> convenient</Text>
                                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>payment experience</Text>
                            </View>   
                        </ImageBackground>

                        <ImageBackground 
                            resizeMode="stretch"
                            imageStyle={{borderRadius: SIZE.BORDER_RADIUS}}
                            source={require('../../../../../assets/toktokwallet-assets/enjoy.png')}
                            style={{borderRadius: SIZE.BORDER_RADIUS, width: width - 80, height: 90,backgroundColor:"transparent",flexDirection:"row"}}
                        >
                            <View style={{flex:1,backgroundColor:"transparent",justifyContent:"center",alignItems:"flex-end",paddingRight: 20}}>
                                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}><Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M, color: COLOR.ORANGE}}>Unlock</Text> toktokwallet</Text>
                                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>features</Text>
                            </View>
                        </ImageBackground>
                    </View>
                </View>
            </View>

            <View style={{height: 70,padding: 16,justifyContent:'flex-end'}}>
                <YellowButton label="Verify now" onPress={()=> {
                    navigation.navigate("ToktokWalletVerification")
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
        fontSize: FONT_SIZE.S,
        textAlign:'center'
    },
})

export default RejectedKyc