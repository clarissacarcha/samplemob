import React , {createRef , useContext } from "react";
import { View , Text , StyleSheet , TextInput } from 'react-native'
import { CheckIdleStateContext } from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'
const {COLOR , FONT_FAMILY: FONT , FONT_SIZE, SIZE } = CONSTANTS

export const InputText = ({
    style,
    placeholder,
    placeholderTextColor = COLOR.DARK,
    value,
    onChangeText,
    returnKeyType = "done",
    onSubmitEditing,
    keyboardType= "default",
    maxLength = null,
    onBlur,
    onFocus,
    caretHidden,
    editable=true,
})=> {

    const idleStateRef = createRef();
    const { resetIdleActivity } = useContext(CheckIdleStateContext)

    return (
        <TextInput 
            editable={editable}
            onBlur={onBlur}
            onFocus={onFocus}
            caretHidden={caretHidden}
            style={[styles.input, {...style}]} 
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            value={value}
            onChangeText={(value)=> {   
                resetIdleActivity()
                onChangeText(value)
            }}
            returnKeyType={returnKeyType}
            keyboardType={keyboardType}
            onSubmitEditing={onSubmitEditing}
            maxLength={maxLength}
            min
        />
    )
}

const styles = StyleSheet.create({
    input: {
        paddingHorizontal: 10,
        height: SIZE.FORM_HEIGHT,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        fontSize: FONT_SIZE.M,
        fontFamily: FONT.REGULAR
      },
})