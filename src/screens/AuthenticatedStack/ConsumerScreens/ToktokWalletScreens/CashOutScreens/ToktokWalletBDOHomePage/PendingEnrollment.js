import React from 'react'
import {View , Text , StyleSheet,ScrollView} from 'react-native'
import { COLOR, FONT, FONT_SIZE } from '../../../../../../res/variables'
import { Separator } from '../../Components'
import moment from 'moment'
import { YellowButton } from '../../../../../../revamp'
import {useNavigation} from '@react-navigation/native'

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

const PendingEnrollment = ({record})=> {
    const navigation = useNavigation()
    
    return (
        <>
        <Separator/>
        <View style={styles.container}>
            <Text style={styles.labelTitle}>PENDING VERIFICATION</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.record}>   
                    <Information label="Account Number" value={record.accountNumber}/>
                    <Information label="Account Name" value={record.accountName}/>
                    <Information label="Email Address" value={record.emailAddress}/>
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

export default PendingEnrollment