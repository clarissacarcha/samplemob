import React from 'react'
import {View,Text,StyleSheet} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { HeaderImageBackground , HeaderTitle , Separator } from '../Components'
import { COLOR , FONT_SIZE , FONT } from '../../../../../res/variables'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import { YellowButton } from '../../../../../revamp'

const ProceedButton = ({route})=> {
    const navigation = useNavigation()
    return (
        <YellowButton label="Verify Now" onPress={()=> {
            navigation.pop()
            navigation.navigate(route)
        }}/>
    )
}

// const LinkButton = ()=> {
//     const navigation = useNavigation()

//     return (
        
//     )
// }


const NoAccount = ()=> {
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
                    <Text style={styles.verifyWalletText}>Verify your <Text style={{color: COLOR.YELLOW}}>toktok</Text><Text style={{color: COLOR.ORANGE}}>wallet</Text></Text>
                    <Text style={styles.clickVerifyText}>Click the "Verify Now" button.</Text>
                    <View style={{marginTop: 20}}>
                        <Text style={styles.listItem}><FIcon5 color="orange" name="check" />  Create your toktokwallet</Text>
                        <Text style={styles.listItem}><FIcon5 color="orange" name="check" />  Secure your account and payments</Text>
                        <Text style={styles.listItem}><FIcon5 color="orange" name="check" />  Enjoy convenient payment experience</Text>
                        <Text style={styles.listItem}><FIcon5 color="orange" name="check" />  Unlock toktokwallet features</Text>
                    </View>
                </View>
            </View>

            <View style={{height: 70,padding: 16,justifyContent:'flex-end'}}>
               <ProceedButton route="ToktokWalletVerification" />
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
    },
    clickVerifyText: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.S
    },
    listItem: {
        fontFamily: FONT.REGULAR,
        marginBottom: 5,
        fontSize: FONT_SIZE.S
    },
})

export default NoAccount