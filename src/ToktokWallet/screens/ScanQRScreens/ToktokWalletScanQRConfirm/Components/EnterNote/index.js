import React from 'react'
import {View,StyleSheet,TextInput,Text} from 'react-native'
import CONSTANTS from 'common/res/constants'
const { COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE } = CONSTANTS

export const EnterNote = ({note,setNote})=> {

    return (
       <View style={styles.container}>
            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Note <Text style={{fontFamily: FONT.BOLD,fontSize: 11}}>(Optional)</Text></Text>
            <View style={styles.input}>
                        <TextInput
                                value={note}
                                multiline={true}
                                numberOfLines={4}
                                height={50}
                                onChangeText={value=>setNote(value)}
                                placeholder="Enter note here..." 
                                returnKeyType="done"
                                maxLength={60}
                                style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR,padding: 0,marginLeft: 5,alignSelf: "center",flex: 1}}
                        />
                </View>
                <Text style={{fontFamily: FONT.REGULAR,marginTop: 5,fontSize: FONT_SIZE.S}}>{note.length}/60</Text>
       </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal:16,
        marginTop: 10
    },
    input: {
        height: SIZE.FORM_HEIGHT,
        paddingHorizontal: 5,
        width: "100%",
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        borderRadius: 5,
        flexDirection: "row",
        fontSize: FONT_SIZE.M
    }
})
