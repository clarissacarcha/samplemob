import React from 'react'
import {View,Text,StyleSheet,Image} from 'react-native'
import SwipeButton from 'rn-swipe-button';
const ConfirmPayment = ()=> {

    const onSwipeSuccess = ()=> {
        console.log("Success")
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
                        <Image />
                        <View>
                            <Text style={{fontWeight:"bold"}}>Noctic Lucis Caelum</Text>
                            <Text style={{fontSize:11,color:"gray",marginTop:5,}}>+639123456789</Text>
                        </View>
                    </View>
                    <View style={{padding: 20}}>
                        <Text style={{fontWeight:"bold"}}>Amount: {'\u20B1'} 500.00</Text>
                    </View>
            </View>
            <SwipeButton 
                    containerStyles={styles.swipeContainer}
                    width={300}
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
        padding: 20,
        flexDirection:"row",
        borderBottomWidth: 0.5,
        borderColor:"silver"
    }

})

export default ConfirmPayment