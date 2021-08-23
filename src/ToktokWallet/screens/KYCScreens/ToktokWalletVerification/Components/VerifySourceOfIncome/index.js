import React , {useContext , useState , useRef} from 'react';
import { View , Text , StyleSheet , TouchableOpacity , TextInput , Alert } from 'react-native';
import validator from 'validator';
import { YellowButton , VectorIcon , ICON_SET} from 'src/revamp';
import {VerifyContext} from '../VerifyContextProvider';
import CONSTANTS from 'common/res/constants';
//SELF IMPORTS
import BottomSheetSourceOfIncome from "./BottomSheetSourceOfIncome";

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS

export const VerifySourceOfIncome = ()=> {

    const {
        setCurrentIndex , 
        incomeInfo,
        changeIncomeInfo
    } = useContext(VerifyContext)

    const SourceOfIncomeRef = useRef()

    const Proceed = ()=>{
        if(incomeInfo.source == "") return Alert.alert("","Source of Income is required.")
        if (validator.isEmpty(incomeInfo.occupation, {ignore_whitespace: true})) {
            return Alert.alert("","Occupation is required.")
        }
        setCurrentIndex(oldval => oldval + 1)
    }

    return (
        <>
            <View style={styles.content}>

                    <Text style={styles.labelText}>Source of Income</Text>
                    <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color:"#929191"}}>Please declare your source of income.</Text>  

                    <View style={{flex: 1}}>
                        <View style={styles.formField}>
                             <Text style={styles.labelText}>Source of Income</Text>
                             <TouchableOpacity onPress={()=>SourceOfIncomeRef.current.expand()} style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center"}]}>
                             {
                                incomeInfo.source == ""
                                ? <Text style={{flex: 1,color: COLOR.DARK,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>- Select -</Text>
                                : <Text style={{flex: 1,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{incomeInfo.source.description}</Text>
                             }
                                <VectorIcon iconSet={ICON_SET.Feather} name="chevron-right"/>
                             </TouchableOpacity>
                        </View>
                        <View style={styles.formField}>
                            <Text style={styles.labelText}>Occupation</Text>
                            <TextInput 
                                placeholder="Enter Occupation here"
                                style={styles.input}
                                value={incomeInfo.occupation}
                                onChangeText={(value)=>changeIncomeInfo("occupation",value)}
                            />
                        </View>
                    </View>

                    <View style={styles.proceedBtn}>
                        <YellowButton label="Next" onPress={Proceed} />
                    </View>
            </View>
            <BottomSheetSourceOfIncome ref={SourceOfIncomeRef} changeIncomeInfo={changeIncomeInfo}/>
        </>
    )
}

const styles = StyleSheet.create({
    content: {
        padding: 16,
        flex: 1,
    },
    labelText: {
        fontSize: FONT_SIZE.M,
        fontFamily: FONT.BOLD
    },
    proceedBtn: {
        width: "100%",
        // marginBottom: 10,
        marginTop: 20,
    },
    formField: {
        marginTop: 20,
    },
    input: {
        paddingHorizontal: 10,
        height: SIZE.FORM_HEIGHT,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        fontSize: FONT_SIZE.M,
    },
})