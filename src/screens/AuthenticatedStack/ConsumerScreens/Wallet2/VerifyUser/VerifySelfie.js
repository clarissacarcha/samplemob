import React, { useState } from 'react'
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE} from '../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'

const VerifySelfie = ({setCurrentIndex})=> {

    return (
        <>
            <View style={styles.content}>
                <View style={styles.mainInput}>
                        <Text style={{fontSize: 18, fontWeight: '400'}}>One last step before you get a Premium Wallet!</Text>
                        <Text style={{color: 'gray',marginTop: 8}}>Take a photo to verify your identity.</Text>  
                        
                       
                        <View style={[styles.input,{padding: 20,}]}>
                            <Text style={{fontSize: 18, fontWeight: '400'}}>Take a selfie</Text>
                            <Text style={{color: 'gray',marginTop: 8}}>Show us that you match your photo ID with a live selfie</Text>  

                            <TouchableOpacity style={[styles.input,{borderColor: "#F6841F",justifyContent: "center",alignItems: "center",marginTop: 40,}]}>
                                <Text style={{color: "#F6841F"}}>Start Now</Text>
                            </TouchableOpacity>
                        </View>
                    

                </View>

                <View style={styles.proceedBtn}>
                    <TouchableOpacity onPress={()=>{
                        setCurrentIndex(oldval => oldval - 1)
                    }} style={{height: "100%",flex: 1,marginRight: 5,backgroundColor: DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: COLOR}}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>{
                        // start saving to DB
                    }} style={{height: "100%",flex: 1,marginLeft: 5,backgroundColor: DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: COLOR}}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    content: {
        padding: 20,
        flex: 1,
    },
    mainInput: {
        flex: 1,
    },
    proceedBtn: {
        height: 40,
        width: "100%",
        flexDirection: "row"
    },
    input: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "silver",
        marginTop: 20,
    },
})

export default VerifySelfie