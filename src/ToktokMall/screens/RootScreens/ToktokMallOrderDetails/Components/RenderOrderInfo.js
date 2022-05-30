import React from 'react'
import {View, Text, Image, StyleSheet} from 'react-native';
import { FONT } from '../../../../../res/variables';
import {
    carIcon, 
    cancelledIcon, 
    deliveredIcon, 
    walletIcon,
    paypandalogo
} from './../../../../assets';
import { DisplayDateAndTime } from '../../../../helpers';

export const RenderOrderInfo = ({ data }) => {
    const status = ['All', 'Confirmed', 'To Ship', 'To Receive', 'Delivered', 'Cancelled']
    
    const date = DisplayDateAndTime(data?.status?.date);

    return (
        <>
            <View style={styles.line} />
            <View style={styles.order}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text style={styles.orderInfo}>Order ID </Text>
                    <Text style={[styles.refNum,styles.textBold]}>
                        {data?.referenceNum}
                    </Text>
                </View>
                <View style={styles.imgView1}>
                    <Image 
                        style={styles.img1}
                        source={
                            data?.status?.status === 5 ? cancelledIcon
                            : data?.status?.status === 4 ? deliveredIcon
                            : carIcon
                        }
                    />
                <Text style={styles.status} >
                    {status[data?.status?.status]}
                </Text>
                </View>
            </View>
        
            <View style={styles.delivery}>
                <View style={{flex: 1.5, flexDirection: 'column'}}>
                    <Text style={styles.orderInfo}>Delivery Information</Text>
                    <Text style={[styles.subText, { color: "#525252" } ]}>{date}</Text>
                </View>
                <View style={styles.imgView2}>
                    <Image 
                        style={styles.img2}
                        source={
                            data.paymentMethod == "TOKTOKWALLET" ? walletIcon : paypandalogo
                        }
                    />
                    {/* <Text style={[styles.subText, { color: "#F6841F" } ]}>Waiting for payment</Text> */}
                </View>
            </View>
            <View style={[ styles.line, { marginHorizontal:16 } ]} />
        </>
    )
}

const styles = StyleSheet.create({
    line: {
        height: 2, 
        backgroundColor: '#F7F7FA'
    },
    order: {
        flexDirection: 'row', 
        justifyContent:'space-between', 
        paddingVertical: 16, 
        paddingHorizontal: 16, 
        backgroundColor: '#FFFCF4'
    },
    orderInfo: {
        fontSize: 13, 
        fontFamily: FONT.BOLD,
    },
    refNum: {
        color: "#FDBA1C",
        paddingLeft: 10,
        fontSize: 13, 
        fontWeight: '600',
    },
    status: {
        fontSize: 13, 
        paddingLeft: 10
    },
    imgView1: {
        flexDirection: 'row', 
        alignItems:'center'
    },
    img1: {
        height: 20, 
        width: 20, 
        resizeMode: 'contain' 
    },
    delivery: {
        flexDirection: 'row', 
        justifyContent:'space-between',
        paddingVertical: 16, 
        paddingHorizontal: 16
    },
    subText: {
        fontSize: 11,
        paddingTop: 8
    },
    imgView2: {
        flexDirection: 'column', 
        alignItems:'flex-end'
    },
    img2: {
        height: 20, 
        width: 90, 
        resizeMode: 'contain'
    },
  }) 