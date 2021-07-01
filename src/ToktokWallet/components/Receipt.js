import React , {useRef, useState , useEffect} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Platform,Dimensions,Alert,StatusBar,Image} from 'react-native'
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions'
import FIcon from 'react-native-vector-icons/Feather'
import ViewShot , {captureScreen,releaseCapture} from "react-native-view-shot";
import RNFS from 'react-native-fs'
import CameraRoll from "@react-native-community/cameraroll";
import { BlackButton, YellowButton } from 'src/revamp';
import Toast from 'react-native-simple-toast';
import moment from 'moment'
import {Separator} from './Separator';
import CONSTANTS from 'common/res/constants'

const { COLOR, FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS


//const path = RNFS.PicturesDirectoryPath
// const path = RNFS.DocumentDirectoryPath
// const path = RNFS.MainBundlePath
const path = Platform.OS === "ios" ? RNFS.LibraryDirectoryPath : RNFS.DownloadDirectoryPath

const {width,height} = Dimensions.get("window")

export const Receipt = ({children, format, refNo ,refDate, onPress})=> {

    const viewshotRef = useRef()

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
                    Alert.alert('', "Sorry, we can't access your storage without sufficient permission.");
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



    const DownloadReceipt = async ()=> {

        const result = await checkAndRequest();
        
        const pathCache = RNFS.CachesDirectoryPath
        console.log(pathCache)
        
    //    const albums = await CameraRoll.getAlbums({assetType: "Photos"})
    //    console.log(albums)
       
        viewshotRef.current.capture().then(async (uri ) => {
            const timestamp = +moment()
            const filename = `${timestamp.toString()}_${refNo}.${format ? format : "jpg"}`
    
            RNFS.moveFile(uri, pathCache + `/${filename}`)
            const newFileUri = `${pathCache}/${filename}`
    
            await CameraRoll.save(newFileUri, { type: "photo", album: "toktok" })
            // // RNFS.copyFile(uri, path + `/${filename}`)
            // // RNFS.moveFile(uri, path + `/${filename}`)
            Toast.show(`Receipt ${filename} has been downloaded.` , Toast.LONG)
        });

    }

    return (
        <>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <View style={styles.container}>
            <ViewShot 
                style={styles.viewShot} 
                ref={viewshotRef}
                options={{ format: format ? format : "jpg", quality: 0.9,width: width,height: height * 0.6 ,result: 'tmpfile' }}
            >
               
               {/* <View style={styles.checkIcon}>
                    <FIcon5 name="check" color="white" size={60}/> 
               </View> */}

               <Image source={require('toktokwallet/assets/images/success.png')}/>
               
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
                    <TouchableOpacity onPress={DownloadReceipt} style={styles.downloadBtn}>
                        <FIcon name="download" size={20} color={"#FF8A48"}/>
                        <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,marginLeft: 5,color:"#FF8A48"}}>Download</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.actionBtn}>
                    <YellowButton label="Back to Home" onPress={onPress} />
            </View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    viewShot: {
        paddingBottom: 20,
        paddingHorizontal: 16,
        marginTop: 50,
        backgroundColor:"white",
        alignItems:"center"
    },
    checkIcon: {
        height: 70,
        width: 70,
        backgroundColor: COLOR.YELLOW,
        borderRadius: 100,
        justifyContent:"center",
        alignItems:"center"
    },  
    titleText: {
        marginTop: 17,
        fontSize: FONT_SIZE.XL,
        fontFamily: FONT.BOLD,
        color: COLOR.DARK,
    },
    refNo: {
        marginTop: 11,
        fontSize: FONT_SIZE.M,
        fontFamily: FONT.REGULAR,
        color: COLOR.DARK,
    },
    refDate: {
        fontSize: FONT_SIZE.M,
        fontFamily: FONT.REGULAR,
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
