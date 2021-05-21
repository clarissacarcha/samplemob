import React , {useRef, useState} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Platform,Dimensions,Alert,StatusBar,Image} from 'react-native'
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions'
import FIcon from 'react-native-vector-icons/Feather'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import ViewShot , {captureScreen,releaseCapture} from "react-native-view-shot";
import RNFS from 'react-native-fs'
import CameraRoll from "@react-native-community/cameraroll";
import { BlackButton, YellowButton } from '../../../../../../../revamp';
import Toast from 'react-native-simple-toast';
import moment from 'moment'
import { COLOR, COLORS, FONTS, SIZES } from '../../../../../../../res/constants';

//const path = RNFS.PicturesDirectoryPath
// const path = RNFS.DocumentDirectoryPath
// const path = RNFS.MainBundlePath
const path = Platform.OS === "ios" ? RNFS.LibraryDirectoryPath : RNFS.DownloadDirectoryPath

const {width,height} = Dimensions.get("window")

const VerifyPendingScreen = ({navigation})=> {

    return (
        <>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <View style={styles.container}>
             
             <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <View style={styles.checkIcon}>
                    <FIcon5 name="check" color="white" size={60}/> 
                </View>
                <View>
                    <Text style={styles.titleText}>Success!</Text>
                </View>
                <View style={{padding: 8}}>
                    <Text style={{color: "gray"}}>
                        Please wait for the approval of your verification.
                    </Text>
                </View>
             </View>
            
            <View style={styles.actionBtn}>
                <YellowButton label="Done" onPress={() => {
                    navigation.pop()
                    navigation.navigate("ToktokWalletHomePage")
                    navigation.replace("ToktokWalletHomePage")
                }} />
            </View>
        </View>
        </>
    )
}

export default VerifyPendingScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE
    },
    checkIcon: {
        height: 98,
        width: 98,
        backgroundColor: COLORS.YELLOW,
        borderRadius: 100,
        justifyContent:"center",
        alignItems:"center"
    },  
    titleText: {
        marginTop: 17,
        fontSize: SIZES.XL,
        fontFamily: FONTS.BOLD,
        color: COLORS.DARK,
    },
    actionBtn: {
        height: 70,
        padding: 16,
        justifyContent:"flex-end",
        marginBottom: Platform.OS == "ios" ? 25 : 0
    }
})
