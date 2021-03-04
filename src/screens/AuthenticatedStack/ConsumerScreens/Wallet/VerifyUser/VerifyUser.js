import React, { useRef , useEffect} from 'react'
import {StyleSheet,View,Text,Image,TouchableOpacity,ActivityIndicator,Animated} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE} from '../../../../../res/constants'
import {onError} from '../../../../../util/ErrorUtility'
import {HeaderBack, HeaderTitle} from '../../../../../components'

const VerifyUser = ({navigation})=> {
    navigation.setOptions({
        headerLeft: ()=> <HeaderBack/>,
        headerTitle: ()=> <HeaderTitle label={['',]}/>,
    })

    return (
        <View style={[styles.container]}>
                <View style={styles.content}>
                    <Image style={{height: 80,width: 80, alignSelf: "center",marginVertical: 30}} source={require('../../../../../assets/icons/ToktokLogo.png')} resizeMode="contain" />
                    <View style={{marginTop: 50}}>
                            <Text style={{fontSize: 20,fontWeight:"400"}}>Go cashless with <Text style={{color: COLOR}}>Toktok</Text><Text style={{color: ORANGE}}>Pay!</Text></Text>
                            <Text style={{fontSize: 14,marginTop: 10}}>Enjoy a secure and convenient payment experience</Text>
                    </View>
                </View>

                <View style={styles.proceedBtn}>
                     <TouchableOpacity onPress={()=>navigation.navigate("TokTokWalletVerifyUserSetup")} style={{height: "100%",width: "100%",backgroundColor: DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: COLOR}}>Get Started</Text>
                    </TouchableOpacity>
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "white"
    },
    content: {
        flex: 1,
    },
    proceedBtn: {
        height: 40,
        width: "100%",
    }
})

export default VerifyUser