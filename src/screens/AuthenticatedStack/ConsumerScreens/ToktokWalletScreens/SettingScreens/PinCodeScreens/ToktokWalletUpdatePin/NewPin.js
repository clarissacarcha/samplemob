import React , {useRef, useState} from 'react'
import {View,Text,StyleSheet,ScrollView,TextInput,TouchableOpacity} from 'react-native'
import { BUTTON_HEIGHT, COLORS, DARK, FONTS, SIZES } from '../../../../../../../res/constants'
import { YellowButton } from '../../../../../../../revamp'
import {DisabledButton, NumberBoxes} from '../../../Components'

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
        <View style={styles.content}>
                <Text style={{fontSize: SIZES.M,fontFamily: FONTS.BOLD,marginTop: 20,alignSelf:"center"}}>Enter your new PIN</Text>
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
                            // onSubmitEditing={onSubmit}
                        />

                        <TouchableOpacity
                                style={{marginTop: 18,paddingVertical: 10,alignItems: "center"}}
                                onPress={()=>setShowPin(!showPin)}
                        >
                                <Text style={{color: COLORS.ORANGE,fontSize: SIZES.M,fontFamily: FONTS.BOLD}}>{showPin ? "HIDE PIN" : "SHOW PIN"}</Text>
                        </TouchableOpacity>

                </View>
            </View>

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

export default NewPin