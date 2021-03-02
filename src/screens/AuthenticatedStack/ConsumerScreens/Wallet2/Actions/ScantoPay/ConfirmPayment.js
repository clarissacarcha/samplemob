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

            </View>
            <SwipeButton 
                    containerStyles={styles.swipeContainer}
                    width={300}
                    title={`Swipe to Pay ${'\u20B1'} 500.00`}
                    titleFontSize={14}
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
    }

})

export default ConfirmPayment