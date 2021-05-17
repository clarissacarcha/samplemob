import React from 'react'
import {View,Text,Modal,StyleSheet,TouchableOpacity, Dimensions} from 'react-native'
import { COLOR, COLORS, FONTS, SIZES } from '../../../../../res/constants'

const {width,height} = Dimensions.get("window")

export const TransactionDetails = ({
    visible,
    setVisible,
    refNo,
    refDate,
    label,
    phrase,
    amount,
    status,
})=> {

    return (
        <>
            <Modal
                visible={visible}
                setVisible={setVisible}
                transparent={true}
                onRequestClose={()=>setVisible(false)}
                style={styles.container}
            >
                <View style={styles.content}>
                    <View style={{
                        height: 200,
                        width: width * 0.9,
                        backgroundColor:"white",
                        borderRadius: 5,
                        padding: 16,
                    }}>
                        <View style={{flex: 1}}>
                            <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M,color: COLORS.DARK}}>{label}</Text>
                            <Text style={styles.labelText}>{phrase}</Text>
                            { status && <Text style={styles.labelText}>Status: {status}</Text>}
                            <View style={{marginTop: 10}}>
                                <Text style={styles.labelText}>Amount: {amount}</Text>
                                <Text style={styles.labelText}>Ref No: {refNo}</Text>
                                <Text style={styles.labelText}>Ref Date & Time: {refDate}</Text>
                            </View>
                        </View>
                        <View style={{flex: 1,justifyContent:"flex-end"}}>
                            <TouchableOpacity onPress={()=>setVisible(false)} style={{alignItems:"center",justifyContent:"center"}}>
                                    <Text style={{fontFamily: FONTS.BOLD, fontSize: SIZES.M ,color: COLORS.ORANGE}}>Ok</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>

            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        backgroundColor:"rgba(0,0,0, 0.1)",
        justifyContent:"center",
        alignItems:"center"
    },
    labelText: {
        fontFamily: FONTS.REGULAR,
        fontSize: SIZES.M,
        color:COLORS.DARK
    }
})
