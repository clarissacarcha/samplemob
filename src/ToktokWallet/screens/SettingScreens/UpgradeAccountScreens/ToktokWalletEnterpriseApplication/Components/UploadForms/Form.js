import React from 'react';
import { View , Text , StyleSheet , TouchableOpacity } from 'react-native';
import CONSTANTS from 'common/res/constants'
import { Separator } from 'toktokwallet/components';
import { VectorIcon , ICON_SET  } from 'src/revamp'
import { useThrottle } from 'src/hooks'

const { COLOR , FONT_SIZE , FONT_FAMILY: FONT  } = CONSTANTS


const Form = ({form, index , onPress})=> {

    const onPressThrottled = useThrottle(()=>onPress(index), 1000);

    return (
        <>
        <View style={styles.container}>
            <Text style={styles.formName}>{form.name}</Text>
            <TouchableOpacity onPress={onPressThrottled} style={{flexDirection:'row',flex: 1,justifyContent:"flex-end"}}>
                <VectorIcon iconSet={ICON_SET.MaterialCommunity} name="upload" size={16} color={'#9E9E9E'}/>
                <Text style={styles.uploadText}>Upload</Text>
            </TouchableOpacity>
        </View>
        {
            form.errorMessage != "" &&
            <Text style={styles.errorMessage}>{form.errorMessage}</Text>
        }
        <View style={styles.divider}/>
        {
                form.filename != "" && 
                <View style={styles.filename}>
                    <Text style={styles.filenameText}>{form.filename}</Text>
                    <Separator/>
                </View>
        }
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        flexDirection:"row",
    },
    formName: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        textAlign:"left",
    },  
    uploadText: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.S,
        marginLeft: 2,
        color:"#9E9E9E"
    },
    filename: {
        paddingVertical: 10,
    },
    filenameText: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.S,
        color:COLOR.ORANGE,
        marginHorizontal: 16,
        textAlign:"left",
        marginBottom: 10,
    },  
    errorMessage: {
        marginHorizontal: 16,
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.XS,
        color: COLOR.RED,
    },
    divider: {
        height: 1,
        backgroundColor: COLOR.LIGHT,
        marginHorizontal: 16,
    }
})

export default Form