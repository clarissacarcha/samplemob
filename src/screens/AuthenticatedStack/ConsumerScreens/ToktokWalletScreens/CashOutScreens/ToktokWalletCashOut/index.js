import React , {useState, useEffect} from 'react'
import {View,StyleSheet,Text,TouchableOpacity,Image,Dimensions, ImageBackground} from 'react-native'
import FIcon from 'react-native-vector-icons/Feather';
import { COLORS, FONTS, SIZES } from '../../../../../../res/constants';
import { numberFormat } from '../../../../../../helper';
import { 
    HeaderImageBackground,
    HeaderTitle,
    Separator
} from '../../Components'

//SELF IMPORTS
import GCash from "./GCash"

const {height,width} = Dimensions.get("window")

const ToktokWalletCashOut = ({navigation,route})=> {

    navigation.setOptions({
       headerShown: false
    })
    
    const walletinfo = route.params.walletinfo
  

    return (
     <>
      <View style={styles.container}>
            <View style={styles.headings}>
                <HeaderImageBackground>
                    <HeaderTitle label="Cash Out"/>
                    <View style={styles.walletBalance}>
                                <Text style={{fontSize: 24,fontFamily: FONTS.BOLD}}>PHP {numberFormat(walletinfo.balance ? walletinfo.balance : 0)}</Text>
                                <Text style={{fontSize: SIZES.M,fontFamily: FONTS.REGULAR,color: COLORS.DARK}}>Available Balance</Text>
                    </View>
                </HeaderImageBackground>
            </View>

            <View style={styles.cashoutoptions}>
                    <Text style={{fontSize: SIZES.M,fontFamily: FONTS.BOLD}}>Choose cash-out method</Text>
            </View>
            <Separator/>
            <View style={styles.transferOptions}>
                    <GCash walletinfo={walletinfo}/>
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
        height: 190,
        backgroundColor:"black"
    },  
    walletBalance: {
        flex: 1,
        justifyContent:"center",
        alignItems:'center'
    },
    cashoutoptions: {
        padding: 16,
    },
    transferDetails: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor:"#F4F4F4",
        justifyContent:"center",
        alignItems:"center"
    },
    transferOptions: {
        flex: 1,
        paddingHorizontal: 16,
    },
})

export default ToktokWalletCashOut