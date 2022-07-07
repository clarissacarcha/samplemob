import React, {useState, useEffect} from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, FlatList} from 'react-native'
import { HeaderBack, HeaderTitle, HeaderRight } from '../../../../Components';
import { AlertOverlay} from '../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables';
import CheckBox from 'react-native-check-box';
import { Price } from '../../../../helpers';

export const CheckoutFooter = ({subtotal, onSubmit}) => {
    return (
        <>
            <View 
                style={styles.container}
            >
                <View style={styles.subContainer}>
                    <View style={styles.subTotalContainer}>
                        <Text style={styles.subTotalTitle}>Subtotal </Text>
                        <Text style={styles.subTotalText}><Price amount={subtotal} /></Text>
                    </View>
                    <View style={styles.checkoutContainer}>
                        <TouchableOpacity onPress={onSubmit} style={styles.checkoutButton}>
                            <Text style={styles.checkoutText}>Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#fff', 
        position: 'absolute', 
        bottom: 0, 
        width: '100%'
    },
    subContainer: {
        flexDirection: 'row', 
        paddingVertical: 15, 
        paddingHorizontal: 15
    },
    subTotalContainer: {
        flex: 1, 
        justifyContent: 'center'
    },
    subTotalTitle: {
        fontSize: 14, 
        fontFamily: FONT.SEMI_BOLD, 
        color: "#000000"
    },
    subTotalText: {
        fontSize: 18, 
        fontFamily: FONT.SEMI_BOLD, 
        color: "#F6841F"
    },
    checkoutContainer: {
        justifyContent: 'center'
    },
    checkoutButton: {
        backgroundColor: '#F6841F', 
        paddingVertical: 15, 
        paddingHorizontal: 40, 
        borderRadius: 5
    },
    checkoutText: {
        fontSize: 14, 
        color: '#fff', 
        fontFamily: FONT.SEMI_BOLD
    }
})