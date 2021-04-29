import React , {useRef, useState} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Platform,Dimensions,Alert} from 'react-native'
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions'
import FIcon from 'react-native-vector-icons/Feather'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import ViewShot , {captureScreen,releaseCapture} from "react-native-view-shot";
import RNFS from 'react-native-fs'
import { BlackButton, YellowButton } from '../../../../../revamp';
import Toast from 'react-native-simple-toast';
import moment from 'moment'
import { COLOR, COLORS, FONTS, SIZES } from '../../../../../res/constants';
import Separator from './Separator';

//const path = RNFS.PicturesDirectoryPath
// const path = RNFS.DocumentDirectoryPath
// const path = RNFS.MainBundlePath
const path = Platform.OS === "ios" ? RNFS.LibraryDirectoryPath : RNFS.DownloadDirectoryPath

const {width,height} = Dimensions.get("window")

const Receipt = ({children, format, refNo ,refDate, onPress})=> {

    const viewshotRef = useRef()

    const ScreenshotAndSave =async ()=> {
        
        const checkAndRequest = Platform.select({
            android: async ()=>{
                const checkResult = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
                if (checkResult === RESULTS.GRANTED) {
                    return true;
                }
                if (checkResult === RESULTS.BLOCKED) {
                    Alert.alert(
                      '',
                      "Read storage access have been blocked. Please allow toktok to access your storage in your phone's settings.",
                    );
                    return false;
                }
                if (checkResult === RESULTS.UNAVAILABLE) {
                    Alert.alert('', 'Access to storage is unavailable.');
                    return false;
                }

                    if (checkResult === RESULTS.DENIED) {
                        const requestResult = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
                        console.log(requestResult)
                        if (checkResult === RESULTS.GRANTED) {
                            return true;
                        }
                        if (checkResult === RESULTS.BLOCKED) {
                            Alert.alert(
                              '',
                              "Read storage access have been blocked. Please allow toktok to access your storage in your phone's settings.",
                            );
                            return false;
                        }
                       
            
                        if (requestResult === RESULTS.DENIED) {
                        Alert.alert('', "Sorry, we can't access your contacts without sufficient permission.");
                        return false;
                        }
                    }
            },
            ios: async ()=> {
                // const checkResult = await check(PERMISSIONS.IOS.MEDIA_LIBRARY);
                // console.log(checkResult)
                // return true
                const checkResult = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);

                if (checkResult === RESULTS.GRANTED) {
                    return true;
                }
                if (checkResult === RESULTS.BLOCKED) {
                    Alert.alert(
                      '',
                      "Read storage access have been blocked. Please allow toktok to access your storage in your phone's settings.",
                    );
                    return false;
                }
                if (checkResult === RESULTS.UNAVAILABLE) {
                    Alert.alert('', 'Access to storage is unavailable.');
                    return false;
                }

                if (checkResult === RESULTS.DENIED) {
                    const requestResult = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
                    if (requestResult === RESULTS.GRANTED) {
                      return true;
                    }
          
                    if (requestResult === RESULTS.BLOCKED) {
                      Alert.alert(
                        '',
                        "Read storage access have been blocked. Please allow toktok to access your storage in your phone's settings.",
                      );
                      return false;
                    }
                  }

            }
        })

        const result = await checkAndRequest();

        if(result){
            viewshotRef.current.capture().then(uri => {
                const timestamp = +moment()
                const filename = `${timestamp.toString()}_${refNo}.${format ? format : "jpg"}`
                // RNFS.copyFile(uri, path + `/${filename}`)
                RNFS.moveFile(uri, path + `/${filename}`)
                Toast.show(`Receipt ${filename} has been downloaded.`)
            });
        }
    
    }

    return (
        <View style={styles.container}>
            <ViewShot 
                style={styles.viewShot} 
                ref={viewshotRef}
                options={{ format: format ? format : "jpg", quality: 0.9,width: width,height: height * 0.6 }}
            >
               
               <View style={styles.checkIcon}>
                     <FIcon5 name="check" color="white" size={60}/>
               </View>

               <Text style={styles.titleText}>
                    Transaction Completed
               </Text>

               <Text style={styles.refNo}>
                    Ref No. {refNo}
               </Text>

               <Text style={styles.refDate}>
                    {moment(refDate).tz('Asia/Manila').format('MMM DD YYYY h:mm a')}
               </Text>

              
                {children}

            </ViewShot>
            <Separator />
            <View style={{flex: 1,}}>
                <View style={{alignItems:"center"}}>
                    <TouchableOpacity onPress={ScreenshotAndSave} style={styles.downloadBtn}>
                        <FIcon name="download" size={20} color={"#FF8A48"}/>
                        <Text style={{fontSize: SIZES.M,fontFamily: FONTS.BOLD,marginLeft: 5,color:"#FF8A48"}}>Download</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.actionBtn}>
                    <YellowButton label="Confirm" onPress={onPress} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    viewShot: {
        paddingTop: 20,
        paddingBottom: 50,
        paddingHorizontal: 16,
        marginTop: 60,
        backgroundColor:"white",
        alignItems:"center"
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
    refNo: {
        marginTop: 11,
        fontSize: SIZES.M,
        fontFamily: FONTS.REGULAR,
        color: COLORS.DARK,
    },
    refDate: {
        fontSize: SIZES.M,
        fontFamily: FONTS.REGULAR,
        color:"#CCCCCC",
    },
    downloadBtn: {
       flexDirection:'row',
       marginTop: 15,
    },
    actionBtn: {
        height: 70,
        padding: 16,
        justifyContent:"flex-end",
        marginBottom: Platform.OS == "ios" ? 25 : 0
    }
})

export default Receipt