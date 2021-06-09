import React , {useRef} from 'react'
import {Modal,View,Text,StyleSheet,Dimensions,TouchableOpacity,Image} from 'react-native'
import { BlackButton, YellowButton } from '../../../../../../revamp'
import QRCode from 'react-native-qrcode-svg'
import {useSelector} from 'react-redux'
import {COLOR , FONT , FONT_SIZE} from '../../../../../../res/variables'
import FIcon from 'react-native-vector-icons/Feather'
import { Separator } from '../../Components/Separator'
import ViewShot , {captureScreen,releaseCapture} from "react-native-view-shot";
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions'
import RNFS from 'react-native-fs'
import CameraRoll from "@react-native-community/cameraroll";
import Toast from 'react-native-simple-toast';
import moment from 'moment'

const {width,height} = Dimensions.get("window")

const MyQRCode = ({visible,setVisible,tokwaAccount})=> {

    const session = useSelector(state=>state.session)

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
       
        viewshotRef.current.capture().then(async (uri ) => {
            const timestamp = +moment()
            const filename = `${timestamp.toString()}_${tokwaAccount.mobileNumber}.jpg`
    
            RNFS.moveFile(uri, pathCache + `/${filename}`)
            const newFileUri = `${pathCache}/${filename}`
    
            await CameraRoll.save(newFileUri, { type: "photo", album: "toktok" })
            Toast.show(`QRCode ${filename} has been downloaded.` , Toast.LONG)
        });

    }


    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={()=>setVisible(false)}
            style={styles.container}
            animationType="fade"
        >
            <View style={styles.content}>
                        <View style={styles.qrContainer}>
                           
                            <ViewShot 
                                ref={viewshotRef} 
                                style={{flex: 1,justifyContent:"center",alignItems:"center",backgroundColor:"white",borderRadius: 5,}}
                                options={{ format: "jpg", quality: 0.9,width: 400,height: 400 ,result: 'tmpfile' }}
                            >
                                     <Image resizeMode="contain" style={{height: 23,width: 130,marginBottom: 15}} source={require('../../../../../../assets/toktokwallet-assets/toktokwallet.png')}/>
                                     <QRCode
                                        value={tokwaAccount.mobileNumber} //Give value when there's no session as it will throw an error if value is empty.
                                        // size={width * 0.7}
                                        size={250}
                                        color="black"
                                        backgroundColor="transparent"
                                        // onPress={() => alert('Pressed')}
                                    />
                                    <View style={{marginTop: 10,}}>
                                     <Text style={{fontFamily: FONT.BOLD,fontSize:FONT_SIZE.M}}>{tokwaAccount.mobileNumber}</Text>
                                    </View>
                            </ViewShot>
                            <Separator/>
                            <View style={{height: 50,alignItems:"center",marginTop: 10,}}>
                                <TouchableOpacity onPress={DownloadReceipt} style={styles.downloadBtn}>
                                    <FIcon name="download" size={20} color={"#FF8A48"}/>
                                    <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,marginLeft: 5,color:"#FF8A48"}}>Download</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{height: 80,padding: 10,justifyContent:"flex-end"}}>
                                <YellowButton label="Close" onPress={()=>setVisible(false)}/>
                            </View>
                        </View>
            </View>

        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        backgroundColor:"rgba(0,0,0,0.5)",
        flex: 1,
        justifyContent:'center',
        alignItems:'center'
    },
    qrContainer: {
        // width: width * 0.9,
        // height: height * 0.6,
        height: 500,
        width: 320,
        backgroundColor:"white",
        borderRadius: 5,
    },
    downloadBtn: {
        flexDirection:'row',
     },
})

export default MyQRCode