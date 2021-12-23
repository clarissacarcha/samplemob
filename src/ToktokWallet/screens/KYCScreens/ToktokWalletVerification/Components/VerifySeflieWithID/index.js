import React, { useState ,useRef , useContext } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Alert,Dimensions,Modal,Image,Platform,ScrollView} from 'react-native'
import EIcon from 'react-native-vector-icons/EvilIcons'
import {VerifyContext} from '../VerifyContextProvider'
import {useNavigation} from '@react-navigation/native'
import { ICON_SET, VectorIcon, YellowButton } from 'src/revamp'
import { BuildingBottom } from 'toktokwallet/components'
import { moderateScale } from 'toktokwallet/helper'
import CONSTANTS from 'common/res/constants'
import ImageCropper from 'react-native-simple-image-cropper'

const { COLOR, FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

const {width,height} = Dimensions.get("window")

const CROP_AREA_WIDTH = width * 0.90;
const CROP_AREA_HEIGHT = CROP_AREA_WIDTH + 50;

const ratio = Math.min(width / CROP_AREA_WIDTH , height / CROP_AREA_HEIGHT)

const Reminder = ({children})=> {
    return (
        <View style={{flexDirection: "row",marginVertical: 5,paddingHorizontal: 16}}>
            <View>
                <View style={{padding: 2, borderRadius: 100, borderColor: COLOR.YELLOW, borderWidth: 1,marginRight: 10}}>
                    <VectorIcon size={12} iconSet={ICON_SET.Feather} name="check"/>
                </View>
            </View>
            <View style={{paddingRight: 20}}>
                  {children}
           </View>
    </View>
    )
}


const MainComponent = ({children , onPress })=> {
    return (
        <>
        <ScrollView contentContainerStyle={{flexGrow: 1}} style={styles.content}>
        <View style={styles.mainInput}>
                {/* <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.BOLD}}>One last step before you get a verified toktokwallet</Text>
                <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color:"#929191"}}>Take a photo to verify your identity.</Text>  
                 */}
               <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.BOLD}}>Take a selfie with your Valid ID</Text>
                <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color:"#929191"}}>One last step before you get a verified toktokwallet.</Text>  
                
                <View style={{marginTop: 20,flex: 1}}>
                {/* <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.BOLD}}>Take a selfie with your Valid ID</Text> */}
                        {children}
                </View>
                <View style={{flex: 1,alignItems:"center",justifyContent:"center"}}>
                        <Text style={{textAlign:"left",fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L,marginBottom: 10,}}>Reminders</Text>
                        <View>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: moderateScale(FONT_SIZE.M)}}><Text style={{color: COLOR.YELLOW}}>Position</Text> your face within the frame</Text>
                            </Reminder>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: moderateScale(FONT_SIZE.M)}}><Text style={{color: COLOR.YELLOW}}>Take selfie</Text> with your valid government ID</Text>
                            </Reminder>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: moderateScale(FONT_SIZE.M)}}><Text style={{color: COLOR.YELLOW}}>Same valid government ID</Text> uploaded in the system</Text>
                            </Reminder>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: moderateScale(FONT_SIZE.M)}}><Text style={{color: COLOR.YELLOW}}>Show front side</Text> of the ID and do not cover while
taking a selfie </Text>
                            </Reminder>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: moderateScale(FONT_SIZE.M)}}><Text style={{color: COLOR.YELLOW}}>Don't</Text> wear anything covering your face</Text>
                            </Reminder>
                            <Reminder>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: moderateScale(FONT_SIZE.M)}}><Text style={{color: COLOR.YELLOW}}>Follow</Text> instructions</Text>
                            </Reminder>
                        </View>
                   
                </View>
               
              
            </View>
            <View style={styles.proceedBtn}>
                    <YellowButton label="Next" onPress={onPress}/>
            </View>
        </ScrollView>
       
        <BuildingBottom/>
        </>
    )
}

export const VerifySelfieWithID = ()=> {

    const [showPepQuestionnaire,setShowPepQuestionnaire] = useState(false)
    const VerifyUserData = useContext(VerifyContext)
    const {setCacheImagesList, setCurrentIndex , selfieImageWithID, setSelfieImageWithID , setTempSelfieImageWithID, tempSelfieImageWithID} = VerifyUserData
    const [cropperParams, setCropperParams] = useState({});
    const navigation = useNavigation()
    const cropSize = {
        // width: width,
        // height: height,
        width: CROP_AREA_WIDTH,
        height: CROP_AREA_HEIGHT,
    }
    const cropAreaSize = {
        // width: width,
        // height: height,
        width: CROP_AREA_WIDTH,
        height: CROP_AREA_HEIGHT,
    }

    const setImage = (data)=> {
       // setSelfieImageWithID(data);
        setCacheImagesList(state=> {
            return [...state, data.uri]
        })
        setTempSelfieImageWithID(data);
        // setCurrentIndex(oldval => oldval + 1)
    }

    const [postVerifyIfPep, {loading}] = useMutation(POST_VERIFY_IF_PEP, {
        client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
        onError: (error)=> onErrorAlert({alert,error}),
        onCompleted: ({postVerifyIfPep})=>{
            if(postVerifyIfPep){
                setPepInfo(state=> {
                    return {
                        ...state,
                        isPep: true,
                    }
                })
                return setShowPepQuestionnaire(true);
            }

            return setCurrentIndex(oldval => oldval + 1)
        }
    })

    const Proceed = async ()=> {
        if(tempSelfieImageWithID == null){
            return navigation.push("ToktokWalletSelfieImageWithIDCamera", {setImage})
        }
        try {
            const croppedResult = await ImageCropper.crop({
                ...cropperParams,
                // imageUri: selfieImage.uri,
                imageUri: tempSelfieImageWithID.uri,
                cropSize,
                cropAreaSize,
            });

            setSelfieImageWithID(state => ({
                ...state,
                uri: croppedResult
            }))

            postVerifyIfPep({
                variables: {
                    input: {
                        firstName: person.firstName,
                        middleName: person.middleName,
                        lastName: person.lastName,
                        birthDate: birthInfo.birthdate,
                        placeOfBirth: birthInfo.birthPlace,
                        gender: person.gender,
                        nationality: nationalityId
                    }
                }
            })
        }catch(error){  
            throw error;
        }
       
    }

    if(tempSelfieImageWithID){
        return(
            <>
             <AlertOverlay visible={loading}/>
             <PepQuestionnaireModal 
                visible={showPepQuestionnaire} 
                setVisible={setShowPepQuestionnaire}
                onRequestClose={()=>setShowPepQuestionnaire(false)}
                pepInfo={pepInfo}
                setPepInfo={setPepInfo}
                callback={()=>{
                    setShowPepQuestionnaire(false)
                    navigation.navigate("ToktokWalletPepVideoCallSchedule" , {
                        setCurrentIndex,
                        pepInfo,
                        setPepInfo
                    })
                }}
            />
            <MainComponent onPress={Proceed}>
                <View style={styles.PreviewImage}>
                    {/* <Image style={{height:290,width: 280,flex: 1}} resizeMode="stretch" source={{uri: selfieImageWithID.uri}}/> */}
                    <ImageCropper
                        imageUri={tempSelfieImageWithID.uri}
                         cropAreaWidth={Platform.OS === "ios" ? CROP_AREA_WIDTH : CROP_AREA_WIDTH - 110}
                        cropAreaHeight={Platform.OS === "ios" ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT - 100}
                        containerColor="transparent"
                        areaColor="black"
                        setCropperParams={cropperParams =>{
                            setCropperParams(cropperParams)
                        }}
                    />
                <TouchableOpacity onPress={()=>navigation.push("ToktokWalletSelfieImageWithIDCamera", {setImage})} style={styles.changePhoto}>
                    <EIcon name="camera" color={COLOR.YELLOW} size={20} />
                    <Text style={{textAlign:"center",color: COLOR.YELLOW,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,marginTop: -2}}>Change Photo</Text>
                </TouchableOpacity>
                </View>
            </MainComponent>
            </>
        )
    }
    

    return (
        <>
        <MainComponent onPress={Proceed}>
                <TouchableOpacity onPress={()=>{
                    navigation.push("ToktokWalletSelfieImageWithIDCamera", {setImage})
                }} style={styles.selfieBtn}>
                    <EIcon name="camera" color="#CCCCCC" size={25} />
                    <Text style={{color:"#CCCCCC",marginBottom:5,fontFamily: FONT.BOLD,fontSize: FONT_SIZE.S}}>Take a photo</Text>
                </TouchableOpacity>
        </MainComponent>
        </>
    )
}

const styles = StyleSheet.create({
    content: {
        padding: 16,
        flex: 1,
    },
    mainInput: {
        flex: 1,
    },
    proceedBtn: {
        height: 70,
        width: "100%",
        marginBottom: 32,
        marginTop: 40,
        justifyContent:"flex-end"
    },
    input: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "silver",
        marginTop: 20,
    },
    camera: {
        flex: 1,
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: "black"
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        height: 60,
        width: 60,
        borderRadius: 30,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
      },
    inCapture: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: 'white',
    },
    selfieBtn: {
        height: 180,
        width: 180,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: "#F7F7FA",
        alignSelf:"center",
        marginTop: 7,
        borderStyle: "dashed",
        borderColor: "#CCCCCC",
        borderWidth: 2,
        borderRadius: 5,
        marginBottom: 10,
    },
    PreviewImage: {
        // width: 290,
        // height: 300,
        height: Platform.OS === "ios" ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT - 100 + 10, 
        width: Platform.OS === "ios" ? CROP_AREA_WIDTH : CROP_AREA_WIDTH - 110 + 10, 
        alignSelf:"center",
        justifyContent:"center",
        marginTop: 7,
        padding: 2,
        borderStyle: "dashed",
        borderColor: COLOR.YELLOW,
        borderWidth: 2,
        borderRadius: 5,
        marginBottom: 5,
        transform: [
            {
                scaleX: -1,
            }
        ]
    },
    changePhoto: {
        position:"absolute",
        bottom: 15,
        width: 180,
        height: 20, 
        justifyContent:"center",
        alignItems:"center",
        alignSelf:"center",  
        transform: [
        {
            scaleX: -1,
        }
    ]}
})
