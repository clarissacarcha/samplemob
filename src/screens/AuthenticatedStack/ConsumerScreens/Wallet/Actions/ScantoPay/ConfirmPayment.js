import React from 'react'
import {View,Text,StyleSheet,Image,Alert} from 'react-native'
import SwipeButton from 'rn-swipe-button';
import {HeaderBack, HeaderTitle} from '../../../../../../components'

const ConfirmPayment = ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack />,
        headerTitle: ()=> <HeaderTitle label={['Choose a Recipient','']}/>,
    })

    const onSwipeSuccess = ()=> {
        console.log("Success")
        Alert.alert("Success")
    }

    const onSwipeFail = (e)=> {
        console.log(e)
    }


    const thumbIconComponent = ()=> (
        <View>
            <Image style={{height: 15,width: 20}} source={require('../../../../../../assets/icons/walletSwipenext.png')}/>
        </View>
    )


    return (
        <View style={styles.container}>
            <View style={styles.content}>
                    <View style={styles.receiverInfo}>
                        <Image style={{height: 50,width: 50,marginRight: 10}} resizeMode="contain" source={require('../../../../../../assets/icons/ToktokLogo.png')}/>
                        <View>
                            <Text style={{fontWeight:"bold",fontSize: 14}}>Alvin Sison Raquem</Text>
                            <Text style={{fontSize:12,color:"gray",marginTop:5,}}>+639123456789</Text>
                        </View>
                    </View>
                    <View style={{padding: 20}}>
                        <Text style={{fontWeight:"bold",fontSize: 16}}>Amount: {'\u20B1'} 500.00</Text>
                    </View>
            </View>
            <SwipeButton 
                    containerStyles={styles.swipeContainer}
                    width={250}
                    title={`Swipe to Pay ${'\u20B1'} 500.00`}
                    titleFontSize={12}
                    titleColor="white"
                    railBackgroundColor="black"
                    railStyles={{
                        backgroundColor: "white",
                        margin: 2,
                    }}
                    thumbIconBackgroundColor="white"
                    thumbIconComponent={thumbIconComponent}
                    onSwipeFail={onSwipeFail}
                    onSwipeSuccess={onSwipeSuccess}
                    resetAfterSuccessAnimDelay={0}
                    resetAfterSuccessAnimDuration={0}
                    shouldResetAfterSuccess={false}
                />
          
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    content: {
        flex: 1,
    },
    swipeContainer: {
       alignSelf:"center",
       marginBottom: 20,
    },
    receiverInfo: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        flexDirection:"row",
        borderBottomWidth: 0.5,
        borderColor:"silver"
    }

})

export default ConfirmPayment