import React from "react";
import { Text , View, StyleSheet } from 'react-native';
import moment from 'moment';
import CONSTANTS from 'common/res/constants';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS

export const Notification = ({
    item,
    index
})=> {
    
    const status = item.type == "postPayLoadSuccessful" ? "Load success" : "Load failed";
    const dateCreated = moment(item.createdAt).tz('Asia/Manila').format('MMM D, YYYY')
    const timeCreated = moment(item.createdAt).tz('Asia/Manila').format('hh:mma')

    return (
        <View style={styles.container}> 
            <View style={{flex:1,marginRight: 16}}>
                    <Text style={styles.title}>{status}</Text>
                    <Text numberOfLines={2} style={styles.message}>{item.body}</Text>
            </View>
            <View style={{alignItems:"flex-end",flexBasis: "auto",justifyContent:"center"}}>
                <Text numberOfLines={1} style={styles.datetime}>{dateCreated}</Text>
                <Text numberOfLines={1} style={styles.datetime}>{timeCreated}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        flexDirection:"row"
    },
    title: {
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.M
    },
    message: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.S,
        color: COLOR.DARK
    },
    datetime: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.S,
        color: COLOR.DARK
    }
})