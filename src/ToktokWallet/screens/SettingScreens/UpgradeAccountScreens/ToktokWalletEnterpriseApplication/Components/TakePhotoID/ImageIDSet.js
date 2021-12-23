import React from 'react'
import { View, TouchableOpacity, Text , Dimensions, Platform , StyleSheet , Image } from 'react-native'
import { VectorIcon , ICON_SET } from 'src/revamp'
import {useNavigation} from '@react-navigation/native'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS

const {height,width} = Dimensions.get("window")

const CROP_AREA_WIDTH = width * 0.90;
const CROP_AREA_HEIGHT = height * 0.40;

const ImageIDSet = ({validID, placement, setImage, index}) => {
    const navigation = useNavigation();
    const onPress = ()=> {
        navigation.push("ToktokWalletValidIDCamera",{setImage, placement: placement, checkTimeout: true})
    }

    return (
        <>
        {/* <Text>{JSON.stringify(validID)}</Text>
        <Text>{placement}</Text>
        <Text>{index}</Text> */}
        <View style={styles.container}>
                <Image resizeMode="stretch" 
                    style={{
                        height:  Platform.OS === "ios" ? CROP_AREA_HEIGHT - 10 : CROP_AREA_HEIGHT - 110,
                        width:  Platform.OS === "ios" ? CROP_AREA_WIDTH - 10 : CROP_AREA_WIDTH - 120,
                    }} 
                    source={{uri: placement == "front" ? validID.frontFilename : validID.backFilename}} 
                />
                 <TouchableOpacity
                    onPress={onPress}
                    style={styles.chooseImage}
                >
                    <VectorIcon iconSet={ICON_SET.EvilIcons} name="camera" size={18} color={COLOR.YELLOW}/>
                    <Text style={styles.chooseImageText}>Change Photo</Text>
                </TouchableOpacity>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf:"center",
        marginTop: 7,
        padding: 2,
        borderStyle: "dashed",
        borderColor: COLOR.YELLOW,
        borderWidth: 2,
        borderRadius: 3,
        marginBottom: 5,
        height:  Platform.OS === "ios" ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT - 100,
        width:  Platform.OS === "ios" ? CROP_AREA_WIDTH : CROP_AREA_WIDTH - 110,
    },
    chooseImage: {
        position:"absolute",
        alignSelf:"center", 
        bottom: 15,
        width: 283,
        height: 20, 
        justifyContent:"center",
        alignItems:"center"
    },
    chooseImageText:{
        color: COLOR.YELLOW,
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.S,
        marginTop: -2
    }
})

export default ImageIDSet