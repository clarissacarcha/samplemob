import React , {useContext} from 'react'
import { View , Text , StyleSheet , TouchableOpacity , Platform , Dimensions } from 'react-native';
import {useNavigation} from '@react-navigation/native'
import { VectorIcon , ICON_SET } from 'src/revamp'
import validator from 'validator'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS

const {height,width} = Dimensions.get("window")

const CROP_AREA_WIDTH = width * 0.90;
const CROP_AREA_HEIGHT = height * 0.40;

const ChooseImage = ({placement ,  setImage , index })=> {
    const navigation = useNavigation();

    const onPress = ()=> {
        navigation.push("ToktokWalletValidIDCamera",{setImage, placement: placement})
    }
    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.container}
        >
            <VectorIcon iconSet={ICON_SET.EvilIcons} name="camera" size={20} color={'#CCCCCC'}/>
            <Text style={{color:"#CCCCCC",marginBottom:5,fontFamily: FONT.BOLD}}>Take a photo</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        borderRadius: 5,
        borderStyle: "dashed",
        height:  Platform.OS === "ios" ? CROP_AREA_HEIGHT : CROP_AREA_HEIGHT - 100,
        width:  Platform.OS === "ios" ? CROP_AREA_WIDTH : CROP_AREA_WIDTH - 110,
        borderWidth: 2,
        borderColor: "#CCCCCC",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"#F7F7FA",
        alignSelf:"center"
    }
})

export default ChooseImage