import React from 'react'
import {View,Text,StyleSheet} from 'react-native'
import { COLORS, FONTS, SIZES } from '../../../../../../res/constants'
import { YellowButton } from '../../../../../../revamp'
import moment from 'moment'

const Information = ({label,value})=> {
    return (
        <View style={styles.info}>
            <View>
                <Text style={styles.labelText}>{label}</Text>
            </View>
            <View style={{flex: 1}}>
                <Text style={styles.valueText}>{value}</Text>
            </View>
        </View>
    )
}


const ViewForm = ({navigation,session,record})=> {
    let status
    let ButtonRender
    switch(record.status){
        case 0:
             status = "Account Verification Pending"
             ButtonRender =  <YellowButton label="Close" onPress={()=>navigation.pop()}/>
             break
        case 1:
             status = "Account Verified"
             ButtonRender = <YellowButton label="Change" onPress={()=>navigation.navigate("ToktokWalletGcashUpdate", {record})}/>
             break
        default:
             status = "Previous Account Rejected, Please Update."
             ButtonRender = <YellowButton label="Update" onPress={()=>navigation.navigate("ToktokWalletGcashUpdate", {record})}/>
             break
    }

 
    return (
       <View style={styles.container}>
           <View style={{flex: 1,}}>
                <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M,color: COLORS.DARK}}>GCash Account Information</Text>
                <Information label="Status" value={status}/>
                <Information label="Mobile Number" value={record.mobileNumber}/>
                <Information label="First Name" value={record.firstName}/>
                <Information label="First Name" value={record.middleName}/>
                <Information label="Last Name" value={record.lastName}/>
                <Information label="Street Address" value={record.streetAddress}/>
                <Information label="Birthdate" value={moment(record.birthdate, 'MM-DD-YYYY').tz('Asia/Manila').format('MMM DD, YYYY')}/>
           </View>
           <View style={{flex: 1,justifyContent:"flex-end"}}>
                {ButtonRender}
           </View>
       </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    info: {
        paddingVertical: 16,
        borderBottomColor: "#F4F4F4",
        borderBottomWidth: 1,
        flexDirection:"row"
    },
    labelText: {
        fontSize: SIZES.M,
        fontFamily: FONTS.REGULAR,
        color: COLORS.DARK,
    },
    valueText: {
        fontSize: SIZES.M,
        fontFamily: FONTS.BOLD,
        color: COLORS.DARK,
        alignSelf:"flex-end"
    }
})

export default ViewForm