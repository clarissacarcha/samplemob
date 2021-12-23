import React , {useRef,useEffect,useState} from 'react'
import {View,Text,StyleSheet,Image,FlatList,Dimensions,Animated,TouchableHighlight} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { HeaderImageBackground , HeaderTitle , Separator , BuildingBottom } from 'toktokwallet/components'
import { YellowButton , VectorIcon , ICON_SET } from 'src/revamp'
import {useSelector} from 'react-redux'
import { getStatusbarHeight } from 'toktokwallet/helper'
import {useThrottle} from 'src/hooks'
import CONSTANTS from 'common/res/constants'

//SELF  IMPORTS
import RenderDots from './RenderDots'
import PageOne from './PageOne'
import PageTwo from './PageTwo'
import PageThree from './PageThree'
import PageFour from './PageFour'

const  { COLOR , FONT_SIZE , FONT_FAMILY: FONT } = CONSTANTS
const {width} = Dimensions.get("window")


const Template1 = ({label , rotate , scale})=> {

    return (
        <Animated.View style={{flex: 1,justifyContent:"center",alignItems:"center",width:width , transform: [{scale: scale}]}}>
                <Text style={{fontSize: 25}}>Template 1</Text>
        </Animated.View>
    )
}

const Template2 = ({label , rotate , scale})=> {

    return (
        <Animated.View style={{flex: 1,justifyContent:"center",alignItems:"center",width:width,transform: [{scale: scale}]}}>
              <Text style={{fontSize: 25}}>Template 2 {label}</Text>
        </Animated.View>
    )
}

const data = [PageOne,PageTwo,PageThree,PageFour]


export const ApprovedRegistration = ()=> {
    const navigation = useNavigation()

    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const slider = useRef(null)

    navigation.setOptions({
        headerShown:false,
    })

    const scrollX = useRef(new Animated.Value(0)).current
    const dotPosition = Animated.divide(scrollX,width)
    const [currentIndex,setCurrentIndex] = useState(0)

    const skip = ()=> {
        return navigation.push("ToktokWalletRestricted" , {component: "noMpin"})
    }

    const onPressThrottled = useThrottle(skip, 2000);

    return (
        <>
        <View style={styles.container}>
                <TouchableHighlight underlayColor="transparent" onPress={onPressThrottled} style={styles.skip}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableHighlight>
                <Separator/>
                <Animated.FlatList
                    ref={slider}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    data={data}
                    bounces={false}
                    scrollEventThrottle={16}
                    snapToAlignment="center"
                    pagingEnabled
                    onScroll={
                        Animated.event([
                            { nativeEvent: { contentOffset: { x: scrollX } } },
                          ],{useNativeDriver: false,listener: event => {
                            const offsetX = event.nativeEvent.contentOffset.x
                    
                            let index = Math.ceil(
                                offsetX / width
                            );

                            if(index % 1 == 0){
                                setCurrentIndex(index)
                                return
                            }

                          },})
                    }
                    // onEndReachedThreshold={0.5}
                    // onEndReached={()=>{
                    //     console.log("END")
                    // }}
                    renderItem={({item,index})=>{
              
                        
                        const rotate = dotPosition.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: ["-180deg", "0deg", "180deg"]
                        })
                
                        const scale = dotPosition.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [0, 1, 0]
                        })

                        return item({label: `Template ${index}` , rotate , scale , tokwaAccount})
                    }}
                />

                <RenderDots
                    scrollX={scrollX}
                    data={data}
                    sliderRef={slider}
                    dotPosition={dotPosition}
                    setCurrentIndex={setCurrentIndex}
                    currentIndex={currentIndex}
                />


                <BuildingBottom/>


             {/* <View style={styles.headings}>
                <HeaderImageBackground>
                        <HeaderTitle isLogo={true} />
                </HeaderImageBackground>
            </View>
            <Separator/>
            <View style={styles.content}>
                <Image style={{width: 225, height: 170}} source={require('toktokwallet/assets/images/welcome.png')}/>
                <View style={{alignItems:"center",marginTop: 20,}}>
                    <Text style={styles.verifyWalletText}>Welcome to <Text style={{ ...styles.verifyWalletText , color: COLOR.YELLOW}}>toktok</Text><Text style={{...styles.verifyWalletText, color: COLOR.ORANGE}}>wallet</Text> !</Text>
                    <Text style={[styles.clickVerifyText, {marginHorizontal: 10,}]}>Hi, Ka-toktok {tokwaAccount.person.firstName}! We are thrilled to announce that you are now a toktokwallet user! You can send money to your loved ones, cash in to any toktokwallet partner of your choice, and transfer funds. So easy!</Text>
                </View>
            </View>

            <View style={{height: 70,padding: 16,justifyContent:'flex-end'}}>
                <YellowButton label="Ok" onPress={()=> {
                     navigation.push("ToktokWalletRestricted" , {component: "noMpin"})
                }}/>
            </View> */}
        
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
        marginTop: getStatusbarHeight
    },
    headings: {
        height: 92,
        backgroundColor:"black"
    },  
    skip: {
        height: 40,
        justifyContent:"center",
        alignItems:"flex-end",
        paddingHorizontal: 16,
    },  
    skipText: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        color: COLOR.ORANGE,
    },
    content: {
        flex: 1,
        padding: 16,
        paddingTop: 30,
        justifyContent:'center',
        alignItems:'center'
    },
    verifyWalletText: {
        fontFamily: FONT.BOLD,
        fontSize: 16,
        textAlign:'center'
    },
    clickVerifyText: {
        marginTop: 5,
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.S,
        textAlign:'center'
    },
    listItem: {
        fontFamily: FONT.REGULAR,
        marginBottom: 5,
        fontSize: FONT_SIZE.S
    },
    dots: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        // flex: 1,
        width: width,
        flexDirection: "row"
    }
})
