import React from 'react'
import {View,Text,StyleSheet,ScrollView} from 'react-native'
import { Separator } from 'toktokwallet/components'
import moment from 'moment'
import { YellowButton } from 'src/revamp'
import {useNavigation} from '@react-navigation/native'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

const Information = ({label,value})=> {
    return (
        <>
        <View style={styles.info}>
            <View>
                <Text style={styles.labelText}>{label}</Text>
            </View>
            <View style={{flex: 1}}>
                <Text style={styles.valueText}>{value}</Text>
            </View>
        </View>
        <View style={styles.divider}/>
        </>
    )
}


export const PendingEnrollment = ({record})=> {

    const navigation = useNavigation()

    return (
        <>
        <Separator/>
        <View style={styles.container}>
            <Text style={styles.labelTitle}>PENDING VERIFICATION</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.record}>   
                    <Information label="Mobile Number" value={record.mobile}/>
                    <Information label="First Name" value={record.firstName}/>
                    <Information label="Middle Name" value={record.middleName}/>
                    <Information label="Last Name" value={record.lastName}/>
                    <Information label="Birthdate" value={moment(record.birthdate).tz('Asia/Manila').format('MMM DD, YYYY')}/>
                    <Information label="Street Address" value={record.streetAddress}/>
                    <Information label="Barangay Town" value={record.barangayTown}/>
                    <Information label="Province City" value={record.provinceCity}/>
                    <Information label="Country" value={record.country}/>
            </ScrollView>
            <View>
                    <YellowButton label="Ok" onPress={()=>navigation.pop()}/>
                </View>
           
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
        padding: 16,
    },
    labelTitle: {
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.M,
        marginBottom: 10,
    },
    record: {
        flex: 1,
        marginBottom: 16
    },
    info: {
        paddingVertical: 16,
        flexDirection:"row"
    },
    labelText: {
        fontSize: FONT_SIZE.M,
        fontFamily: FONT.REGULAR,
        textAlign: "left"
    },
    valueText: {
        fontSize: FONT_SIZE.M,
        fontFamily: FONT.BOLD,
        alignSelf:"flex-end",
        textAlign:"right"
    },
    divider: {
        height: 1,
        width: "100%",
        backgroundColor: COLOR.LIGHT,
    }
})
