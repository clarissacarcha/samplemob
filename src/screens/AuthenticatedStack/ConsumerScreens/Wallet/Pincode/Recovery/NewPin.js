import React , {useRef, useState} from 'react'
import {View,Text,StyleSheet,ScrollView,TextInput,TouchableOpacity} from 'react-native'
import { COLOR, DARK, FONT_MEDIUM } from '../../../../../../res/constants'
import NumberBoxes from '../Components/NumberBoxes'

const NewPin = ({pinCode,setPinCode , pageIndex, setPageIndex})=> {

    const inputRef = useRef();
    const [showPin,setShowPin] = useState(false)

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
                <Text style={{fontSize: 14,fontFamily: FONT_MEDIUM,marginTop: 20,alignSelf:"center"}}>Enter your new PIN</Text>
                <View style={{position: 'relative',marginTop: 50,}}>
                    <NumberBoxes pinCode={pinCode} onNumPress={onNumPress} showPin={showPin}/>
                    <TextInput
                            // autoFocus={true}
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
                                <Text style={{color: "#F6841F",fontSize: 12,fontFamily: FONT_MEDIUM}}>{showPin ? "HIDE PIN" : "SHOW PIN"}</Text>
                        </TouchableOpacity>

                </View>
            </ScrollView>
            <TouchableOpacity
                disabled={pinCode.length < 6}
                onPress={onSubmit}
                style={{alignItems: "center",height: 40,backgroundColor: pinCode.length < 6 ? "gray" : DARK,margin: 20,justifyContent: "center",borderRadius: 10,}}
            >
                    <Text style={{color: pinCode.length < 6 ? "white" : COLOR,fontSize: 12,fontFamily: FONT_MEDIUM}}>Next</Text>
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
        padding: 20,
        flex: 1,
    },
    input: {
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        paddingHorizontal: 20,
        fontSize: 25,
        color: DARK,
        width: 30,
    },
})

export default NewPin