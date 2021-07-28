import React , {useRef , useContext , useState} from 'react'
import { View , Text , StyleSheet ,TouchableOpacity } from 'react-native'
import { VectorIcon , ICON_SET  } from 'src/revamp'
import { useThrottle } from 'src/hooks'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import TakePhoto from "./TakePhoto";
import { ContextEnterpriseApplication } from "../ContextProvider"

const { COLOR , FONT_SIZE , FONT_FAMILY: FONT  } = CONSTANTS

const ChooseIDType = ({index , onPress})=> {
    
    const {
        validID1,
        validID2
    } = useContext(ContextEnterpriseApplication)

    const onPressThrottled = useThrottle(onPress,1000)

    const displayText = (index) => {
        if(index == 1){
            return validID1.IDTypeDescription != "" ? validID1.IDTypeDescription : "Valid ID 1"
        }
        return validID2.IDTypeDescription != "" ? validID2.IDTypeDescription : "Valid ID 2"
    } 

    return (
        <>
        <TouchableOpacity onPress={onPressThrottled} style={styles.chooseIDType}>
            <Text style={styles.formName}>{displayText(index)}</Text>
            <View style={{flex: 1,}}>
                 <VectorIcon style={{textAlign:"right"}} iconSet={ICON_SET.Feather} name="chevron-right" size={14} color={'#9E9E9E'}/>
            </View>
        </TouchableOpacity>
        <View style={styles.divider}/>
        {
            index == 1
            ? validID1.IDType != "" &&
                <TakePhoto validID={validID1} index={1}/>
            : validID2.IDType != "" &&
                <TakePhoto validID={validID2} index={2}/>
        }
        </>
    )
}

export const TakePhotoID = ({onPress})=> {

    return (
        <>
        <View style={styles.container}>
            <Text style={styles.formName}>2 Valid Government ID</Text>
            <ChooseIDType index={1} onPress={()=>onPress(1)}/>
            <ChooseIDType index={2} onPress={()=>onPress(2)}/>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
      //  paddingHorizontal: 16,
      marginBottom: 16
    },
    formName: {
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        textAlign:"left",
        marginHorizontal: 16,
    }, 
    chooseIDType: {
        paddingVertical: 10,
        flexDirection:"row",
        marginRight: 16,
    },
    divider: {
        height: 1,
        backgroundColor: COLOR.LIGHT,
        marginHorizontal: 16,
    }
})