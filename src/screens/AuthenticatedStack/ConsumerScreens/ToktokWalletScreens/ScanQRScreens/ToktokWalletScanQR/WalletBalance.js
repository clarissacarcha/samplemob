import React from 'react'
import {View,Text,TouchableOpacity,Image} from 'react-native'
import {COLOR , FONT , FONT_SIZE} from '../../../../../../res/variables'
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
            <Text style={{marginLeft: 10, fontSize: FONT_SIZE.XL, fontFamily: FONT.BOLD}}>PHP {numberFormat(walletinfo.balance)}</Text>
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
                        backgroundColor: COLOR.YELLOW,
                        borderRadius: 5,
                    }}
                    onPress={()=>navigation.navigate("ToktokWalletPaymentOptions",{walletinfo: walletinfo})}
                >
                        <Text style={{color: COLOR.DARK,fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD}}>Cash In</Text>
                </TouchableOpacity>
                
            </View>
        </View>
    )
}

export default WalletBalance