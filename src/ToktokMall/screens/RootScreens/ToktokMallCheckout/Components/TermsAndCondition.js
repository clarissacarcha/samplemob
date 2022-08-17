import React, { useState, useEffect, useRef } from 'react'
import { 
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icons from '../../../../Components/Icons';

export const TermsAndCondition = (props) => {
  
    const navigation = useNavigation();

    const fadeAnim = useRef(new Animated.Value(0)); 

    useEffect(() => {
        if(props.onPressPlaceOrder) {
            if(!props.TCEnabled) {
                props?.scrollViewRef.current.scrollToEnd({ animated: true });

                Animated.timing(fadeAnim.current, {
                    duration: 100,
                    toValue: 1
                }).start(res1 => {
                    if(res1.finished) {
                        setTimeout(() => {
                            Animated.timing(fadeAnim.current, {
                                duration: 1000,
                                toValue: 0
                            }).start(res2 => {
                                if(res2.finished) props.onDoneFade();
                            })
                        }, 500)
                    }
                });
            }
        }
    }, [props.onPressPlaceOrder])

    const onPressTC = () => {
        props.onPressTCbutton();
    }

    const onNavigate = () => {
        navigation.navigate("ToktokMallTermsAndConditions");
    }

    return (
        <View style={styles.tcContainer}>
            <Animated.View style={[styles.tcSubContainer, {opacity: fadeAnim.current}]} />          
            <TouchableOpacity onPress={onPressTC} style={[styles.tcButton, props.TCEnabled && {backgroundColor: '#F6841F'}]}>
                {props.TCEnabled && <Icons.MIcon name="check" size={9} color="white"/> }
            </TouchableOpacity>
            <Text style={styles.tcText}>
                I hereby confirm that all order details and delivery information are correctly entered. Furthermore, I have read and agreed with the <Text onPress={onNavigate} style={styles.tcUnderlineText}>Terms and Conditions</Text> of this service.
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    tcContainer: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 15,
        marginBottom: 50
    },
    tcSubContainer: {
        ...StyleSheet.absoluteFillObject,
        position: 'absolute',
        backgroundColor: "#FFF3E8",
    },
    tcButton: {
        height: 12,
        width: 12,
        borderWidth: 1,
        borderColor: "#F6841F",
        borderRadius: 2,
        marginRight: 11,
        marginTop: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tcText: {
        flex: 1,
        fontSize: 11,
        color: "#525252"
    },
    tcUnderlineText: {
        color: "#F6841F",
        fontSize: 11,
        textDecorationLine: 'underline',
    }
})