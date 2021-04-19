import React from 'react'
import {View,Text,Image,StyleSheet} from 'react-native'
import { FONT_LIGHT, FONT_MEDIUM } from '../../../../../../res/constants'

const ContentItem = ({icon , label , message, onPress})=> {
    return (
        <View onPress={onPress} style={styles.contentItem}>
                <View style={styles.contentItemIcon}>
                    <Image style={{height: 30,width: 30}} resizeMode="contain" source={icon} />
                </View>
                <View style={styles.contentItemContent}>
                    <Text style={{fontFamily: FONT_MEDIUM,fontSize: 14}}>{label}</Text>
                    <Text style={{fontFamily: FONT_LIGHT,fontSize: 12}}>{message}</Text>
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    contentItem: {
        paddingVertical: 10,
        paddingHorizontal: 3,
        flexDirection:"row"
    },
    contentItemContent: {
        flex: 1,
    },
    contentItemIcon: {
        width: 45,
        justifyContent:"flex-start",
        alignItems:"flex-start"
    },
})

export default ContentItem