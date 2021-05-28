import React from 'react'
import {View,Text,StyleSheet} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { HeaderImageBackground , HeaderTitle , Separator } from '../Components'
import { COLOR , FONT_SIZE , FONT } from '../../../../../res/variables'
import { YellowButton , VectorIcon , ICON_SET } from '../../../../../revamp'


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
                <View style={{alignItems:"center"}}>
                <Text style={styles.verifyWalletText}><Text style={{ ...styles.verifyWalletText , color: COLOR.YELLOW}}>toktok</Text><Text style={{...styles.verifyWalletText, color: COLOR.ORANGE}}>wallet</Text> Application has been rejected!</Text>
                <Text style={styles.clickVerifyText}>Click verify now to try again.</Text>
                    
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
        padding: 10,
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
        textAlign:'center'
    },
})

export default RejectedKyc