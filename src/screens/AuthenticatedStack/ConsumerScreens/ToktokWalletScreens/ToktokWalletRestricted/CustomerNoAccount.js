import React from 'react'
import {View,StyleSheet,Text} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { YellowButton, VectorIcon , ICON_SET  } from '../../../../../revamp'
import { COLOR , FONT_SIZE , FONT , SIZE } from '../../../../../res/variables'


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
                    <View style={{marginTop: 20}}>
                        {/* <Text style={styles.listItem}><VectorIcon name="check" size={13} iconSet={ICON_SET.FontAwesome5}/> Create your toktokwallet</Text> */}
                        <Text style={styles.listItem}><VectorIcon name="check" size={13} iconSet={ICON_SET.FontAwesome5}/> Secure your account and payments</Text>
                        <Text style={styles.listItem}><VectorIcon name="check" size={13} iconSet={ICON_SET.FontAwesome5}/> Enjoy convenient payment experience</Text>
                        <Text style={styles.listItem}><VectorIcon name="check" size={13} iconSet={ICON_SET.FontAwesome5}/> Unlock toktokwallet features</Text>
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
        textAlign:'left'
    },
})


export default CustomerNoAccount