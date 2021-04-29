import React, { useState ,useRef , useEffect } from 'react'
import {View,Text,StyleSheet,TouchableHighlight,TouchableOpacity,TextInput,KeyboardAvoidingView,Platform,ScrollView} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE, FONT_MEDIUM, SIZES, BUTTON_HEIGHT} from '../../../../../res/constants'
import NumberBoxes from './Components/NumberBoxes'

const CreatePin = ({pinCode,setPinCode,pageIndex,setPageIndex,walletinfo})=> {

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
                    <Text style={{fontSize: SIZES.M,fontFamily: FONT_MEDIUM,marginTop: 20,alignSelf:"center"}}>Enter your {walletinfo.pincode ? "new ": ""}PIN</Text>
                    <View style={{position: 'relative',marginTop: 50,}}>
                        <NumberBoxes pinCode={pinCode} onNumPress={onNumPress} showPin={showPin}/>
                        <TextInput
                            autoFocus={true}
                            caretHidden
                            value={pinCode}
                            ref={inputRef}
                            style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
                            keyboardType="number-pad"
                            returnKeyType="done"
                            onChangeText={(value) => {
                            if (value.length <= 6) {
                                setPinCode(value);
                            }
                            }}
                            onSubmitEditing={onSubmit}
                        />

                        <TouchableOpacity
                                style={{marginTop: 40,paddingVertical: 10,alignItems: "center"}}
                                onPress={()=>setShowPin(!showPin)}
                        >
                                <Text style={{color: "#F6841F",fontSize: SIZES.S,fontFamily: FONT_MEDIUM}}>{showPin ? "HIDE PIN" : "SHOW PIN"}</Text>
                        </TouchableOpacity>
                    </View>
            </ScrollView>
            <TouchableOpacity
                disabled={pinCode.length < 6}
                onPress={onSubmit}
                style={{alignItems: "center",height: BUTTON_HEIGHT,backgroundColor: pinCode.length < 6 ? "gray" : DARK,margin: 20,justifyContent: "center",borderRadius: 10,}}
            >
                    <Text style={{color: pinCode.length < 6 ? "white" : COLOR,fontSize: SIZES.M,fontFamily: FONT_MEDIUM}}>Next</Text>
            </TouchableOpacity>
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
        padding: 10,
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