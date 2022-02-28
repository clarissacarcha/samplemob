import React , {useState} from "react";
import { View , Text , StyleSheet, TouchableOpacity } from 'react-native';
import { YellowButton , VectorIcon , ICON_SET } from 'src/revamp';
import CONSTANTS from 'common/res/constants'
//SELF IMPORTS 
import {
    SourceOfWealthModal
} from "./SourceOfWealthModal"

const {COLOR, FONT_FAMILY: FONT ,SIZE,FONT_SIZE} = CONSTANTS

export const SourceOfWealth = ({
    pepInfoAnswer,
    setPepInfo
})=> {

    const [data,setData] = useState([]);
    const [visible,setVisible] = useState(false);
    const [sourceOfWealths,setSourceOfWealths] = useState([])

    const openModal = ()=> {
        setVisible(true)
    }

    return (
        <>
        <SourceOfWealthModal
            visible={visible}
            setVisible={setVisible}
            data={data}
            setSourceOfWealths={setSourceOfWealths}
        />
        <View style={{marginTop: 10}}>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>4) Source of Wealth</Text>
                <TouchableOpacity onPress={openModal} style={[styles.input , {flexDirection:"row", justifyContent:"flex-start",alignItems:"center"}]}>
                    <Text
                        style={pepInfoAnswer.des != "" 
                            ? {flex: 1,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR} 
                            : {flex: 1,color: COLOR.DARK,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}
                        }
                    >
                       Check all that applies
                    </Text>
                    <VectorIcon iconSet={ICON_SET.Feather} name="chevron-down"/>
                </TouchableOpacity>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 50,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        paddingHorizontal: 10,
    }
})