import React from 'react'
import {View,Text,StyleSheet,Image} from 'react-native'
import { numberFormat } from 'toktokwallet/helper'
import {useSelector} from 'react-redux'
import tokwaLogo from 'toktokwallet/assets/images/tokwa.png'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

export const MerchantPayment = ({data})=>{
    const { tokwaAccount , note , amount  , merchant , branch , terminal } = data

    return(
       <View style={styles.container}>


        <View style={styles.merchantInfo}>
            <View style={styles.merchantLogoView}>
                {
                    merchant.logo
                    ?< Image source={{uri: merchant.logo}} style={styles.merchantLogo} resizeMode="contain"/>
                    : <Image source={tokwaLogo} style={styles.merchantLogo} resizeMode="contain"/>
                }
            </View>
            <View style={{marginTop: 10,alignItems:"center"}}>
            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L}}>{merchant.merchantName} {branch.branchName}</Text>
            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,color: COLOR.ORANGE}}>{terminal.terminalCode}</Text>
            </View>
        </View>

            <View style={styles.information}>
                    <View style={{flex:1,alignItems:"flex-start"}}>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Account Name</Text>  
                    </View>
                    <View style={{flex:1,alignItems:"flex-end"}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,textAlign: 'right'}}>{tokwaAccount.person.firstName} {tokwaAccount.person.lastName}</Text>
                    </View>
            </View>

            <View style={styles.information}>
                    <View style={{flex:1,alignItems:"flex-start"}}>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Account Number</Text>  
                    </View>
                    <View style={{flex:1,alignItems:"flex-end"}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,textAlign: 'right'}}>{tokwaAccount.mobileNumber}</Text>
                    </View>
            </View>

            <View style={styles.information}>
                    <View style={{flex:1,alignItems:"flex-start"}}>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Total Amount</Text>  
                    </View>
                    <View style={{flex:1,alignItems:"flex-end"}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,textAlign: 'right'}}>{numberFormat(amount)}</Text>
                    </View>
            </View>
      
      
            {
                data.note != "" &&
                <View style={styles.information}>
                        <View style={{flex:1,alignItems:"flex-start"}}>
                            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Note</Text>  
                        </View>
                        <View style={{flex:1,alignItems:"flex-end"}}>
                            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,textAlign: 'right'}}>{note}</Text>
                        </View>
                </View>
            }
            
       </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    information: {
        paddingVertical: 15,
        borderBottomColor: COLOR.YELLOW,
        borderBottomWidth: 1,
        flexDirection:"row"
    },
    merchantInfo: {
        justifyContent:"center",
        alignItems:"center",
    },
    merchantLogoView: {
        height: 70,
        width: 70,
        borderRadius: 65,
        borderWidth: 1,
        borderColor: COLOR.ORANGE,
        flex: 1,
        justifyContent:"center",
        alignItems:"center"
    },
    merchantLogo: {
        height: 50,
        width: 45
    }
})
