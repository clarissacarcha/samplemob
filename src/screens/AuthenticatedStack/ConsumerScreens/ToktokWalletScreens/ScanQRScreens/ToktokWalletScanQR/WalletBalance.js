import React from 'react'
import {View,Text,TouchableOpacity,Image} from 'react-native'
import { COLOR, FONT_MEDIUM, SIZES , DARK, FONTS, COLORS } from '../../../../../../res/constants'
import {numberFormat} from '../../../../../../helper'

const WalletBalance = ({navigation,walletinfo})=> {

    return(
        <View style={{
            height:65,
            backgroundColor: "white",
            padding: 20,
            flexDirection: "row",
            alignItems: 'center',

        }}>


            <Image style={{width: 50,height: 25}} resizeMode="contain" source={require('../../../../../../assets/icons/walletMoney.png')} />
            <Text style={{marginLeft: 10, fontSize: SIZES.XL, fontFamily: FONTS.BOLD}}>PHP {numberFormat(walletinfo.balance)}</Text>
            <View style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "flex-end",
            }}>
                <TouchableOpacity
                    style={{
                        height: 35,
                        justifyContent:"center",
                        alignItems:"center",
                        paddingHorizontal: 15,
                        backgroundColor: COLORS.YELLOW,
                        borderRadius: 5,
                    }}
                    onPress={()=>navigation.navigate("ToktokWalletPaymentOptions",{walletinfo: walletinfo})}
                >
                        <Text style={{color: COLORS.DARK,fontSize: SIZES.M,fontFamily: FONTS.BOLD}}>Cash In</Text>
                </TouchableOpacity>
                
            </View>
        </View>
    )
}

export default WalletBalance