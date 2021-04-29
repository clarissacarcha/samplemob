import React , {useRef,useState,useMemo} from 'react'
import {View,Text,Modal,StyleSheet,TouchableOpacity,Image, Dimensions} from 'react-native'
import SwipeButton from 'rn-swipe-button';
import { BUTTON_HEIGHT, FONT_MEDIUM, SIZES ,ORANGE,COLOR} from '../../../../../res/constants';
import { BlackButton } from '../../../../../revamp';
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import BottomSheet, {BottomSheetBackdrop, BottomSheetScrollView, BottomSheetView} from '@gorhom/bottom-sheet';

const {width,height} = Dimensions.get("window")

const thumbIconComponent = ()=> (
    <View>
        <Image style={{height: 15,width: 20}} source={require('../../../../../assets/icons/walletSwipenext.png')}/>
    </View>
)

const SwipeButtonRender = ({SwipeButtonArgs})=> {
    return (
        <SwipeButton
            disabled={!SwipeButtonArgs.enabled}
            title={SwipeButtonArgs.title}
            onSwipeFail={SwipeButtonArgs.onSwipeFail}
            onSwipeSuccess={SwipeButtonArgs.onSwipeSuccess}
            disabledRailBackgroundColor="dimgray"
            containerStyles={styles.swipeContainer}
            // width={width - 50}
            width={"90%"}
            swipeSuccessThreshold={100}
            titleStyles={{
                fontSize: SIZES.S,
                fontFamily: FONT_MEDIUM,
                paddingLeft: 20,
            }}
            titleColor="white"
                railBackgroundColor="black"
                railStyles={{
                    backgroundColor: "white",
                    margin: 0,
                    borderColor: "black"
            }}
            thumbIconBackgroundColor="white"
            thumbIconBorderColor="black"
            thumbIconStyles={{
                borderWidth: 1,
                borderColor:"black"
            }}
            height={BUTTON_HEIGHT}
            thumbIconComponent={thumbIconComponent}
            resetAfterSuccessAnimDelay={0}
            resetAfterSuccessAnimDuration={0}
            shouldResetAfterSuccess={true}
        />
    )
}

const ConfirmBottomSheet = ({
    children,
    headerTitle,
    btnLabel,
    onPress,
    visible,
    setVisible,
    SwipeButtonEnabled,
    SwipeButtonArgs,
    bottomSheetRef
})=> {

    const snapPoints = useMemo(() => [0, 300], []);

    return (
        <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        handleComponent={() => (
        <View
            style={{
            height: 20,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            borderTopWidth: 3,
            borderRightWidth: 2,
            borderLeftWidth: 2,
            borderColor: ORANGE,
            marginHorizontal: -2,
            }}
        />
        )}
        enableContentPanningGesture={true}
        enableHandlePanningGesture={true}
        backdropComponent={BottomSheetBackdrop}>
      
            <BottomSheetView style={styles.contentContainer}>
                <View style={styles.modalbody}>
                    <View style={styles.modalHeader}>
                        {/* <TouchableOpacity onPress={()=>bottomSheetRef.current.snapTo()} style={{position: "absolute",left: 0,paddingVertical: 10}}>
                            <FIcon5 name="times" size={20}/>
                        </TouchableOpacity> */}
                        <Text style={{fontSize: SIZES.L,fontFamily: FONT_MEDIUM}}>{headerTitle}</Text>
                    </View>
                    <View style={styles.modalconfirmdetails}>
                        <View style={{flex: 1}}>
                        {children}
                        </View>
                    
                
                        <View style={{flex: 1,justifyContent:"flex-end",marginBottom: 10}}>
                        {
                            SwipeButtonEnabled
                            ? <SwipeButtonRender SwipeButtonArgs={SwipeButtonArgs}/>
                            : <BlackButton label={btnLabel} onPress={onPress} />
                        }
                        </View>
                    </View>
                </View>
            </BottomSheetView>
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        flex:1,
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: "white",
        flexGrow: 1,
    },
    swipeContainer: {
        alignSelf:"center",
        marginBottom: 0,
    },
    modalbody: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: "white",
        flex: 1,
        paddingHorizontal: 10,
       
    },
    modalHeader: {
        height: 50,
        position: "relative",
        justifyContent: "center",
        alignItems: "center"
    },
    modalconfirmdetails: {
        flex: 1,
    },
})

export default ConfirmBottomSheet