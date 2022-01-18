import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  PanResponder,
  Animated,
  Image,
  Modal,
  Text,
  Platform,
  Easing,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Dimensions
} from "react-native";
import { floatingIcon, food1 } from "toktokfood/assets/images";
import {
    getDeviceWidth,
    getDeviceHeight,
    getStatusbarHeight,
    verticalScale,
    scale,
    isIphoneXorAbove,
    getIphoneNotchSize,
    isIphoneHasNotch, 
    moderateScale
} from "toktokfood/helper/scale";
import {COLORS, FONTS, SIZES} from 'res/constants';
import FA5Icon, { TabBarItem } from 'react-native-vector-icons/FontAwesome5';
import { DetailsModal } from "./components";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const DraggableIcon = ({ data, title, viewHeight }) => {

    const tabBarHeight = useBottomTabBarHeight(); 
    const [visible, setVisible] = useState(false)
    // const [viewHeight, setViewHeight] = useState(getDeviceHeight)
    const pan = useRef(new Animated.ValueXY({ x: getDeviceWidth, y: getDeviceHeight - verticalScale(200) })).current;
    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => Platform.OS === "android", // Android that we allow dragging
        onMoveShouldSetPanResponderCapture: () => Platform.OS === "ios", // iOS that we allow dragging
        onPanResponderGrant: (e, gestureState) => {
            pan.setOffset({
                x: pan.x._value,
                y: pan.y._value
            });
            pan.setValue({
                x: 0,
                y: 0
            });
        },
        onPanResponderMove: Animated.event(
          [
            null,
            { dx: pan.x, dy: pan.y },
          ],
          {useNativeDriver: false}
        ),
        onPanResponderRelease: (e, gestureState) => {
            pan.flattenOffset();
        },
        onPanResponderTerminate: (evt, gestureState) => {
            pan.flattenOffset();
        },
        onPanResponderTerminationRequest: (evt, gestureState) => true,
      })
    ).current;

    // when floating icon is pressed
    const onPressFloatingIcon = () => {
        Animated.timing(pan, {
            toValue: { x: scale(284), y: Platform.OS == "ios" ? verticalScale(470) : verticalScale(520) },
            duration: 500,
            useNativeDriver: true,
            easing: Easing.linear,
        }).start(() => { 
            setVisible(true)
        });
    }

    // when modal details icon is pressed
    const onPressClose = () => {
        Animated.timing(pan, {
            toValue: { x: pan.x._value, y: pan.y._value },
            duration: 500,
            useNativeDriver: true,
            easing: Easing.linear,
        }).start()
        setVisible(false)
    }

    const scaleHeight = (viewHeight) => {
        if(viewHeight > 550 && viewHeight < 667){
            return  viewHeight + (getStatusbarHeight - verticalScale(10))
        } else if(viewHeight > 300 && viewHeight < 550){
            return viewHeight + getStatusbarHeight
        } else {
            return viewHeight
        }
    }

    const translateYBottom = () => {
        let height = scaleHeight(viewHeight);
        let iosSize = isIphoneHasNotch() ? viewHeight - ((tabBarHeight) + ((viewHeight / 667) * 22)) : viewHeight - scale(55)
        let bottom = Platform.OS === "ios" ? iosSize : height - (tabBarHeight * 2) + ((height / 667) * 30)
        return bottom
    }
    
    const translateYTop = Platform.OS === "ios" ? 0 : getStatusbarHeight

    if(viewHeight === 100){ return null }
    return (
        <>
        <Animated.View
            style={[
                {
                    position: "absolute",
                    zIndex: 2,
                    transform: [
                        { 
                            translateX: pan.x.interpolate({
                                inputRange: [0, getDeviceWidth - verticalScale(55)],
                                outputRange: [0, getDeviceWidth - verticalScale(55)],
                                extrapolate: "clamp"
                             })
                        },
                        { 
                            translateY: pan.y.interpolate({
                                inputRange: [translateYTop, translateYBottom()],
                                outputRange: [translateYTop, translateYBottom()],
                                extrapolate: "clamp",
                            })
                        }
                    ]
                }
            ]}
            {...panResponder.panHandlers}
        >
            { !visible && (
                <TouchableWithoutFeedback
                    style={{ zIndex: 5 }}
                    keyboardShouldPersistTaps='always'
                    onPress={() => visible ? onPressClose() : onPressFloatingIcon()}
                >
                    <Image source={floatingIcon} style={styles.floatingIcon} />
                </TouchableWithoutFeedback>
            )}
        </Animated.View>
        <DetailsModal
            visible={visible}
            onPressClose={() =>onPressClose()}
            data={data}
            title={title}
        />
        </>
    );
}
export default DraggableIcon;

const styles = StyleSheet.create({
    floatingIcon: {
        resizeMode: "cover",
        width: verticalScale(55),
        height: verticalScale(55)
    }
});
  