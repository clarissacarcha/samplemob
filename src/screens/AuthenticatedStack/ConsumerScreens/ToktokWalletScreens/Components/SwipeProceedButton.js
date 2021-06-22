import React from 'react'
import {View,StyleSheet} from 'react-native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import SwipeButton from 'rn-swipe-button'
import { COLORS, FONTS, NUMBERS, SIZES } from '../../../../../res/constants'

const thumbIconComponent = ()=> (
    <View style={{...NUMBERS.SHADOW}}>
        <FIcon5 name="chevron-right" size={15}/>
    </View>
)
export const SwipeProceedButton = ({
    enabled,
    title,
    onSwipeFail,
    onSwipeSuccess,
})=> {

    return (
        <SwipeButton
                disabled={!enabled}
                title={title}
                onSwipeFail={onSwipeFail}
                onSwipeSuccess={onSwipeSuccess}
                containerStyles={styles.swipeContainer}
                // width={width - 50}
                width={"90%"}
                swipeSuccessThreshold={100}
                titleStyles={{
                    fontSize: SIZES.M,
                    fontFamily: FONTS.BOLD,
                    paddingLeft: 20,
                }}
                titleColor={COLORS.MEDIUM}
                railBackgroundColor="#F7F7FA"
                railBorderColor="#F7F7FA"
                railStyles={{
                        backgroundColor:COLORS.YELLOW,
                        borderWidth: 0,
                        ...NUMBERS.SHADOW,
                      
                }}
                thumbIconBackgroundColor="white"
                thumbIconBorderColor="#F7F7FA"
                thumbIconStyles={{
                    borderWidth: 0,
                }}
                height={50}
                thumbIconComponent={thumbIconComponent}
                resetAfterSuccessAnimDelay={0}
                resetAfterSuccessAnimDuration={0}
                shouldResetAfterSuccess={true}
        />
    )
}

const styles = StyleSheet.create({
    swipeContainer: {
        alignSelf:"center",
        marginBottom: 0,
    },
})
