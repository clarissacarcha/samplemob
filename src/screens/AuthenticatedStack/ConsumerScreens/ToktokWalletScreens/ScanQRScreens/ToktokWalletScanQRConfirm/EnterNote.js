import React from 'react'
import {View,StyleSheet,TextInput,Text} from 'react-native'
import { COLORS, FONTS, INPUT_HEIGHT, SIZES } from '../../../../../../res/constants'

const EnterNote = ({note,setNote})=> {

    return (
       <View style={styles.container}>
            <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M,color: COLORS.DARK}}>Note <Text style={{fontFamily: FONTS.BOLD,fontSize: 11,color: COLORS.DARK}}>(Optional)</Text></Text>
            <View style={styles.input}>
                        <TextInput
                                value={note}
                                multiline={false}
                                height={50}
                                onChangeText={value=>setNote(value)}
                                placeholder="Enter note here..." 
                                returnKeyType="done"
                                maxLength={60}
                                style={{fontSize: SIZES.M,fontFamily: FONTS.REGULAR,padding: 0,marginLeft: 5,alignSelf: "center",flex: 1,color: COLORS.DARK}}
                        />
                </View>
                <Text style={{fontFamily: FONTS.REGULAR,marginTop: 5,fontSize: SIZES.S}}>{note.length}/60</Text>
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
        height: INPUT_HEIGHT,
        paddingHorizontal: 5,
        width: "100%",
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        borderRadius: 5,
        flexDirection: "row",
        fontSize: SIZES.M
    }
})

export default EnterNote