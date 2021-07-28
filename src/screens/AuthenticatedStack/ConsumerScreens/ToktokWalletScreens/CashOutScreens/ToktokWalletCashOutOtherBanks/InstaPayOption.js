import React from 'react'
import {View,Text,StyleSheet,Image,TouchableOpacity} from 'react-native'
import { FONT, FONT_SIZE ,COLOR} from '../../../../../../res/variables'
import { ICON_SET , VectorIcon } from '../../../../../../revamp'

const Comment = ({label}) => {
    return (
        <View style={styles.comment}>
            <View style={{marginRight: 10,justifyContent:'center'}}>
                <View style={{padding: 3 ,borderRadius: 100,borderWidth: 1, borderColor: COLOR.ORANGE}}>

                </View>
            </View>
            <View style={{flex: 1}}>
                <Text style={{fontFamily: FONT.REGULAR,fontSize: 8}}>{label}</Text>
            </View>
        </View>
    )
}

const InstaPayOption = ({onPress})=> {

    return (
        <>
            <TouchableOpacity onPress={onPress} style={styles.container}>
                <View style={{flex: 1}}>
                    <Image style={{height: 30,width: 105}} source={require('../../../../../../assets/toktokwallet-assets/cash-out-providers/instapay.png')}/>
                    <View style={styles.comments}>
                        <Comment label="Real-time transfer"/>
                        <Comment label="PHP 50,000.00 daily transaction limit per source account"/>
                        <Comment label="PHP 0.00 fee per transaction"/>
                    </View>
                </View>

                <View style={styles.arrowright}>
                    <VectorIcon iconSet={ICON_SET.Feather} name="chevron-right" color={"#222222"}/>
                </View>
            </TouchableOpacity>
            <View style={styles.divider}/>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        flexDirection:"row"
    },
    comments: {
        marginTop: 10,
    },
    comment: {
        flexDirection: "row",
        marginBottom: 2,
    },
    arrowright: {
        justifyContent: "center",
    },
    divider: {
        height: 1,
        width:"100%",
        backgroundColor: COLOR.LIGHT
    }
})

export default InstaPayOption