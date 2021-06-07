import React from 'react'
import {View,Text,StyleSheet} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { HeaderImageBackground , HeaderTitle , Separator } from '../Components'
import { COLOR , FONT_SIZE , FONT } from '../../../../../res/variables'
import { YellowButton , VectorIcon , ICON_SET } from '../../../../../revamp'


const PendingKyc = ()=> {
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
                    <View style={{marginTop: 20}}>
                        {/* <Text style={styles.listItem}><VectorIcon name="check" size={13} iconSet={ICON_SET.FontAwesome5}/> Create your toktokwallet</Text> */}
                        <Text style={styles.listItem}><VectorIcon name="check" size={13} iconSet={ICON_SET.FontAwesome5}/> Secure your account and payments</Text>
                        <Text style={styles.listItem}><VectorIcon name="check" size={13} iconSet={ICON_SET.FontAwesome5}/> Enjoy convenient payment experience</Text>
                        <Text style={styles.listItem}><VectorIcon name="check" size={13} iconSet={ICON_SET.FontAwesome5}/> Unlock toktokwallet features</Text>
                    </View>
                </View>
            </View>

            <View style={{height: 70,padding: 16,justifyContent:'flex-end'}}>
                <YellowButton label="Ok" onPress={()=> {
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
        padding: 10,
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

export default PendingKyc