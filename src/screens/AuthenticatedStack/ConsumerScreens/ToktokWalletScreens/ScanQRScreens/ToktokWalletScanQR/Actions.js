import React , {useState} from 'react'
import {View,Text,TouchableOpacity,Dimensions,StyleSheet} from 'react-native'
import {COLOR , FONT , FONT_SIZE} from '../../../../../../res/variables'
import FIcon from 'react-native-vector-icons/FontAwesome';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNQRGenerator from 'rn-qr-generator';
import {useAlert} from '../../../../../../hooks/useAlert';
import {useNavigation} from '@react-navigation/native'

//SELF IMPORTS
import MyQRCode from './MyQRCode'

const {height,width} = Dimensions.get("window")

const Actions = ({onUploadSuccess,account})=> {

    const alertHook = useAlert()
    const navigation = useNavigation()
    const [myqrVisible,setMyqrVisible] = useState(false)

    const handleSelectFile = ()=> {
        try {
            console.log("ImagePicker");
            launchImageLibrary({}, async (response) => {
                 if (response.didCancel) {
                    console.log("User cancelled image picker");
                  } else if (response.error) {
                    console.log("ImagePicker Error: ", response.error);
                  } else if (response.customButton) {
                    console.log("User tapped custom button: ", response.customButton);
                  } else {
                    if (response.uri) {
                        var path = response.path;
                        if (!path) {
                          path = response.uri;
                        }

                        await DecodeQR(path)

                    }
               
                 }
            })
        }catch (err) {
            throw err
        }
    }

    const DecodeQR = async (path)=> {
        RNQRGenerator.detect({
            uri: path
          })
        .then(response => {
            const { values } = response; // Array of detected QR code values. Empty if nothing found.
            if(values.length == 0 ) return alertHook({message:"No QR code detected!"})
             values.map(async (qrcode)=>{
                await onUploadSuccess(qrcode)
             })
        })
        .catch(error => console.log('Cannot detect QR code in image', error));
    }

    return (
        <>
        <MyQRCode account={account} visible={myqrVisible} setVisible={setMyqrVisible} />
        <View style={styles.container}>
            <View style={styles.actionBtnContainer}>
                <TouchableOpacity onPress={handleSelectFile} style={styles.actionBtn}
                >
                        {/* <FIcon color={COLOR} size={20} style={{marginBottom: 5}} name="upload" /> */}
                        <Text style={styles.actionBtnText}>Upload QR Code</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.actionBtnContainer}>
                <TouchableOpacity onPress={()=>setMyqrVisible(true)} style={styles.actionBtn}>
                        {/* <FIcon color={COLOR} size={20} style={{marginBottom: 5}} name="qrcode" /> */}
                        <Text style={styles.actionBtnText}>My QR Code</Text>
                </TouchableOpacity>
            </View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        position:"absolute",
        height: 100, 
        width: width, 
        bottom: 80,
        flexDirection:"row",
        zIndex: 1
    },
    actionBtnContainer: {
        flex: 1,
        justifyContent:"center",
        alignItems:"center",
        zIndex: 9999
    },
    actionBtn: {
        width:width * 0.4,
        paddingVertical: 15,
        backgroundColor:"rgba(255,255,255,0.1)",
        borderRadius: 5,
        justifyContent:"center",
        alignItems:"center",
       //  borderWidth: 2,
       //  borderColor:COLOR,
    },
    actionBtnText: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        color: COLOR.YELLOW,
    }
})

export default Actions