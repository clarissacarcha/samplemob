import React, { useState ,useRef , useEffect } from 'react'
import {View,Text,StyleSheet,TouchableHighlight,TouchableOpacity,TextInput,KeyboardAvoidingView,Platform,ScrollView} from 'react-native'
import { DARK,SIZES, BUTTON_HEIGHT, COLORS, FONTS} from '../../../../../../../res/constants'
import { YellowButton } from '../../../../../../../revamp'
import {DisabledButton, NumberBoxes} from '../../../Components'

const CreatePin = ({pinCode,setPinCode,pageIndex,setPageIndex,tokwaAccount})=> {

    const [showPin,setShowPin] = useState(false)
    const inputRef = useRef();

    const onNumPress = () => {
        setTimeout(() => {
          inputRef.current.focus();
        }, 10);
    };
    
    const onSubmit = () => {
       setPageIndex(oldstate=>oldstate+1)
    };


    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                    <Text style={{fontSize: SIZES.M,fontFamily: FONTS.BOLD,marginTop: 20,alignSelf:"center"}}>Enter your {tokwaAccount.pinCode ? "new ": ""}PIN</Text>
                    <View style={{position: 'relative',marginTop: 50,}}>
                        <NumberBoxes pinCode={pinCode} onNumPress={onNumPress} showPin={showPin}/>
                        <TextInput
                            caretHidden
                            value={pinCode}
                            ref={inputRef}
                            style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
                            keyboardType="number-pad"
                            returnKeyType="done"
                            onChangeText={(value) => {
                            if (value.length <= 6) {
                                const num = value.replace(/[^0-9]/g, '')
                                setPinCode(num);
                            }
                            }}
                            onSubmitEditing={pinCode.length == 6 ? onSubmit: null}
                        />

                        <TouchableOpacity
                                style={{marginTop: 18,paddingVertical: 10,alignItems: "center"}}
                                onPress={()=>setShowPin(!showPin)}
                        >
                                <Text style={{color: COLORS.ORANGE,fontSize: SIZES.M,fontFamily: FONTS.BOLD}}>{showPin ? "HIDE PIN" : "SHOW PIN"}</Text>
                        </TouchableOpacity>
                    </View>
            </ScrollView>
            {/* <TouchableOpacity
                disabled={pinCode.length < 6}
                onPress={onSubmit}
                style={{alignItems: "center",height: BUTTON_HEIGHT,backgroundColor: pinCode.length < 6 ? "#F7F7FA" : COLORS.YELLOW,margin: 16,justifyContent: "center",borderRadius: 10,}}
            >
                    <Text style={{color: pinCode.length < 6 ? "gray" : COLORS.DARK,fontSize: SIZES.L,fontFamily: FONTS.BOLD}}>Next</Text>
            </TouchableOpacity> */}
             <View style={{padding: 16}}>
                {
                    pinCode.length < 6
                    ? <DisabledButton label="Next"/>
                    : <YellowButton label="Next" onPress={onSubmit}/>
                }
            </View>
       </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    content: {
        // alignItems: "center",
        padding: 16,
        flex: 1,
    },
    inputView: {
        backgroundColor: 'white',
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 25,
        color: DARK,
        width: 30,
    },
})

export default CreatePin