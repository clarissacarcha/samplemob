import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity} from 'react-native'
import { HeaderBack, HeaderTitle, HeaderRight, Card } from '../Components';
import CustomIcon from '../Components/Icons';
import { AlertOverlay} from '../../../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../../../res/variables';

export const ListItem = (props) => {

    let state = props?.status == "active" ? true : false || false
    let expiry = state ? "Valid Until: 5-24-2021" : "Expired"

    return (
        <>
            <View style={styles.container}>
                <View style={styles.freeShippingContainer}>
                    <Text style={styles.freeShippingText}>FREE SHIPPING</Text>
                </View>
                <View style={styles.expiryContainer}>
                    <Text style={styles.expiryTitleText}>Free Shipping Voucher</Text>
                    <Text style={styles.expiryBodyText}>{expiry}</Text>
                </View>
                <TouchableOpacity style={styles.expiryLeftContainer}>
                    {state && <Text style={styles.expiryLeftText}>Expiring: 24 hours left</Text>}
                </TouchableOpacity>
            </View>
            <View style={styles.margin1} />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', 
        paddingVertical: 15, 
        paddingHorizontal: 15
    },
    freeShippingContainer: {
        flex: 0, 
        width: 60, 
        height: 60, 
        backgroundColor: state ? '#FCC442' : "#DADADA", 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    freeShippingText: {
        textAlign: 'center', 
        fontSize: 12, 
        padding: 4, 
        fontFamily: FONT.BOLD, 
        color: "#fff"
    },
    expiryContainer: {
        flex: 9, 
        alignItems: 'flex-start', 
        justifyContent: 'center', 
        paddingHorizontal: 10
    },
    expiryTitleText: {
        fontSize: 14, 
        fontFamily: FONT.REGULAR, 
        color: state ? "#222222" : "#9E9E9E"
    },
    expiryBodyText: {
        color: "#9E9E9E", 
        fontSize: 11
    },
    expiryLeftContainer: {
        flex: 0, 
        alignItems: 'flex-end', 
        justifyContent: 'center'
    },
    expiryLeftText: {
        fontSize: 9, 
        color: "#F6841F"
    },
    margin1: {
        height: 2, 
        backgroundColor: '#F7F7FA'
    }
})