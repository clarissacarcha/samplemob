import React , {useState} from 'react'
import {View,Text,StyleSheet,Image,FlatList,Dimensions,Animated,TouchableOpacity} from 'react-native'
import { VectorIcon , ICON_SET } from 'src/revamp'
import {useSelector} from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import CONSTANTS from 'common/res/constants'

const  { COLOR , FONT_SIZE , FONT_FAMILY: FONT } = CONSTANTS
const {width} = Dimensions.get("window")

const RenderDots = ({scrollX , data, sliderRef , dotPosition , setCurrentIndex,currentIndex})=> {

    const navigation = useNavigation();

    return (
        <>
            <View style={styles.dots}>

                <TouchableOpacity 
                disabled={currentIndex == 0 ? true : false}
                onPress={()=>{
                   if(currentIndex > 0 ){
                    sliderRef.current.scrollToIndex({
                        index: currentIndex - 1,
                        animated: true,
                    })
                    // setCurrentIndex(oldstate=>oldstate+1)
                   }
                }} 
                style={styles.prevPage}>
                    <VectorIcon style={{opacity: currentIndex == 0 ? 0.5 : 1}} iconSet={ICON_SET.Feather} color={COLOR.ORANGE} name="arrow-left"/>
                    <Text style={[styles.dotsText, {opacity: currentIndex == 0 ? 0.5 : 1}]}>PREV</Text>
                </TouchableOpacity>

                {
                    data.map((d,index)=>{

                        
                        const opacity = dotPosition.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: "clamp"
                        })

                        const dotSize = dotPosition.interpolate({
                            // inputRange: [index - 1 * width, index * width, index * width + 1],
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [10, 20, 10],
                            extrapolate: "clamp"
                        })
                    
                        const dotColor = dotPosition.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: ['#898C95', COLOR.ORANGE, '#898C95'],
                            extrapolate: "clamp"
                        })
                                            
                        return (
                            <>
                            <Animated.View
                                key={`dot-${index}`}
                                opacity={opacity}
                                style={{
                                    borderRadius: 100,
                                    marginHorizontal: 4,
                                    width: dotSize,
                                    height: 10,
                                    backgroundColor: dotColor
                                }}
                            >
                                
                            </Animated.View>
                            </>
                          )
                    })
                }

                <TouchableOpacity onPress={()=>{
                   if(currentIndex + 1 < data.length){
                        sliderRef.current.scrollToIndex({
                            index: currentIndex + 1,
                            animated: true,
                        })
                        setCurrentIndex(oldstate=>oldstate+1)
                   }else{
                        return navigation.push("ToktokWalletRestricted" , {component: "noMpin"})
                   }
                }} 
                disabled={currentIndex === data.length - 1}
                style={[ styles.nextPage, { opacity: currentIndex < data.length - 1 ? 1 : .3 }]}>
                    <Text style={styles.dotsText}>{currentIndex < data.length - 1 ? "NEXT" : "DONE"}</Text>
                    {/* <Text style={styles.dotsText}> {"NEXT"}</Text> */}
                    <VectorIcon iconSet={ICON_SET.Feather} color={COLOR.ORANGE} name="arrow-right"/>
                </TouchableOpacity>
            </View>
        </>
    )
            
            
}

const styles = StyleSheet.create({
    dots: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        // flex: 1,
        width: width,
        flexDirection: "row"
    },
    nextPage: {
        flexDirection:"row",
        marginHorizontal: 10,
        alignItems: "center"
    },
    prevPage: {
        flexDirection: "row",
        marginHorizontal: 10,
        alignItems: "center"
    },
    dotsText: {
        fontFamily: FONT_SIZE.REGULAR,
        color: COLOR.ORANGE
    }
})

export default RenderDots