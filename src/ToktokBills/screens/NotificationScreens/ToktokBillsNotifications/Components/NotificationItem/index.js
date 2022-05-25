import React from "react";
import { Text , View, StyleSheet } from 'react-native';
import moment from 'moment';
import CONSTANTS from 'common/res/constants';
import { useNavigation } from '@react-navigation/native';
import { moderateScale } from 'toktokbills/helper';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS

const getStatus = (status) => {
  switch(status){
    case 1:
      return { text: "Success"}
    case 3:
      return { text: "Failed"}
    
    default: 
      return { text: "Pending"}
  }
}

export const NotificationItem = ({
    item,
})=> {
    const navigation = useNavigation();
    const statusData = getStatus(item.status)
    const dateCreated = moment(item.createdAt).tz('Asia/Manila').format('MMM D, YYYY')
    const timeCreated = moment(item.createdAt).tz('Asia/Manila').format('hh:mm A')

    return (
        <View style={styles.container}> 
            <View style={{flex:1,marginRight: 16}}>
                    <Text style={styles.title}>{statusData.text}</Text>
                    <Text style={styles.message}>{item.body}</Text>
            </View>
            <View style={styles.date}>
                <Text numberOfLines={1} style={styles.datetime}>{dateCreated}</Text>
                <Text numberOfLines={1} style={styles.datetime}>{timeCreated}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: moderateScale(15),
        paddingVertical: moderateScale(8),
        flexDirection:"row",
        borderBottomColor: COLOR.LIGHT,
        borderBottomWidth: 2,
    },
    title: {
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.M
    },
    message: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.S,
        color: COLOR.ALMOST_BLACK
    },
    date:{
        alignItems:"flex-end",
        flexBasis: "auto",
        justifyContent:"center"
    },
    datetime: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.S,
        color: COLOR.GRAY,
    }
})
