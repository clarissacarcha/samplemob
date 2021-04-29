import React from 'react'
import {View,Text,StyleSheet} from 'react-native'
import { numberFormat } from '../../../../../../helper'
import { FONT_MEDIUM, FONT_REGULAR, SIZES } from '../../../../../../res/constants'

const ConfirmModalContent = ({amount,recipientDetails})=> {

    return (
                <View style={styles.modalbody}>
                    <View style={styles.modalconfirmdetails}>
                         <View style={{flexDirection: "row",paddingVertical: 6,borderColor: "silver",width: "100%",}}>
                            <View style={{flexShrink: 1}}>    
                                <Text style={{color: "gray",fontSize: SIZES.M, fontFamily: FONT_REGULAR}}>Send money to</Text>
                            </View>
                            <View style={{flex: 1}}>   
                                <Text style={{color: "gray",fontSize: SIZES.M,alignSelf: "flex-end",fontFamily: FONT_REGULAR}}>{`${recipientDetails.person.firstName} ${recipientDetails.person.middleName ? recipientDetails.person.middleName + " " : ""}${recipientDetails.person.lastName}`} </Text>
                            </View>  
                        </View>
                        <View style={{flexDirection: "row",paddingVertical: 6,borderColor: "silver",width: "100%",}}>
                            <View style={{flexShrink: 1}}>    
                                <Text style={{color: "gray",fontSize: SIZES.M, fontFamily: FONT_REGULAR}}>Send money via</Text>
                            </View>
                            <View style={{flex: 1}}>   
                                <Text style={{color: "gray",fontSize: SIZES.M,alignSelf: "flex-end",fontFamily: FONT_REGULAR}}>toktokwallet</Text>
                            </View>  
                        </View>
                        <View style={{flexDirection: "row",paddingVertical: 6,borderColor: "silver",}}>
                            <View style={{flexShrink: 1}}>    
                                <Text style={{color: "gray",fontSize: SIZES.M,fontFamily: FONT_REGULAR}}>Amount</Text>
                            </View>
                            <View style={{flex: 1}}>   
                                <Text style={{color: "gray",fontSize: SIZES.M,alignSelf: "flex-end",fontFamily: FONT_REGULAR}}>PHP {numberFormat(amount)}</Text>
                            </View>  
                        </View>
                        <View style={{flexDirection: "row",paddingVertical: 6,}}>
                            <View style={{flexShrink: 1}}>    
                                <Text style={{fontFamily: FONT_MEDIUM, fontSize: SIZES.M}}>Total</Text>
                            </View>
                            <View style={{flex: 1}}>   
                                <Text style={{fontFamily: FONT_MEDIUM,alignSelf: "flex-end", fontSize: SIZES.M}}>PHP {numberFormat(amount)}</Text>
                            </View>  
                        </View>
                </View>
            </View>
    )
}

const styles = StyleSheet.create({
    modalbody: {
        flex: 1,
        paddingHorizontal: 10,
    },
    modalHeader: {
        height: 50,
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
    },
    modalconfirmdetails: {
        flex: 1,
    },
    modalconfirmbtn: {
        height: 50,
        width: "100%",
        paddingVertical: 10,
        marginBottom: 20,
    },
})

export default ConfirmModalContent