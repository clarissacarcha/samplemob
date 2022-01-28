import React from 'react'
import { View , Text , StyleSheet ,Dimensions , TouchableOpacity} from 'react-native'
import CONSTANTS from "common/res/constants";

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR, SHADOW, SIZE } = CONSTANTS;
const { width } = Dimensions.get("window")
export const ContactSuggestion = ({style , onPress , contactInfo , setContactInfo})=> {

    if(!contactInfo){
        return null
    }

    const close = ()=>{
        onPress(contactInfo.number)
        setContactInfo(null)
    }

    return (
        <TouchableOpacity onPress={close} style={[styles.container,{...style}]}>
            <View style={styles.body}>
                <Text style={{marginRight: 10,fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>{contactInfo.name}</Text>
                <Text style={{flex: 1,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{contactInfo.number}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: SIZE.FORM_HEIGHT - 10,
        backgroundColor:"transparent",
        position:"absolute",
        width: width,
        marginTop: -SIZE.FORM_HEIGHT + 10,
        justifyContent:"center",
        alignItems:'center',
        flex: 1
    },
    body: {
        backgroundColor:"white",
        width: width * 0.75,
        height: SIZE.FORM_HEIGHT - 20,
        borderRadius: 5,
        alignItems:"center",
        flexDirection:"row",
        paddingHorizontal: 10,
        backgroundColor:"rgba(255,255,255,0.8)"
    }
})