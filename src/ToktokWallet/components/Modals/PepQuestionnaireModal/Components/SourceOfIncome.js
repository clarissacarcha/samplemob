import React , {useState,useEffect} from "react";
import { View , Text , StyleSheet, TouchableOpacity, TouchableHighlight, TextInput } from 'react-native';
import { YellowButton , VectorIcon , ICON_SET } from 'src/revamp';
import {useLazyQuery} from '@apollo/react-hooks'
import { TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_SOURCE_OF_INCOME } from 'toktokwallet/graphql'
import { onErrorAlert } from 'src/util/ErrorUtility';
import { useAlert } from 'src/hooks';
import CONSTANTS from 'common/res/constants'
//SELF IMPORTS 
import {
    SourceOfIncomeModal
} from "./SourceOfIncomeModal"

const {COLOR, FONT_FAMILY: FONT ,SIZE,FONT_SIZE} = CONSTANTS

export const SourceOfIncome = ({
    pepInfoAnswer,
    setPepInfo
})=> {

    const [data,setData] = useState([]);
    const [visible,setVisible] = useState(false);
    const [selectedData,setSelectedData] = useState([])
    const alert = useAlert();
   
    const [getSourceOfIncome , {loading}] = useLazyQuery(GET_SOURCE_OF_INCOME , {
        client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
        fetchPolicy:"network-only",
        onCompleted: ({getSourceOfIncome})=> {
          const data = [...getSourceOfIncome , {id: "0" , description: "Others"}]
          const finalData = data.map((item,index)=> {
              return {
                  ...item,
                  selected: false
              }
          } )
 
          setData(finalData)
        },
        onError: (error) => {
          onErrorAlert({alert, error});
        }
      })

    const openModal = ()=> {
        setVisible(true)
    }

    const doneProcess = ()=> {
        const sourceOfIncomeArray = selectedData.map((data)=>data.id)
        setPepInfo(state=>{
            return {
                ...state,
                questionnaire: {
                    ...state.questionnaire,
                    sourceOfIncomeId: sourceOfIncomeArray,
                }
            }
        })
    }

    const removeSelected = (index)=> {
        const findIndex = data.findIndex((d)=> d.id === selectedData[index].id )
        const currentData = [...data]
        currentData[findIndex] = {
            ...currentData[findIndex],
            selected: !currentData[findIndex].selected
        }
        if(selectedData[index].id == 0){
            setPepInfo(state=>{
                return {
                    ...state,
                    questionnaire: {
                        ...state.questionnaire,
                        sourceOfIncome: ""
                    }
                }
            })
        }

        setData(currentData)
        doneProcess()
    }

    const onChangeText = (value)=>{
        setPepInfo(state=>{
            return {
                ...state,
                questionnaire: {
                    ...state.questionnaire,
                    sourceOfIncome: value
                }
            }
        })
    }

    useEffect(()=>getSourceOfIncome(),[])
    useEffect(()=>doneProcess(),[selectedData])
    useEffect(()=> {
        const selected = data.filter((item,index)=> {
            if(item.selected){
                return item
            }
        })
        setSelectedData(selected)
    },[data])

    return (
        <>
        <SourceOfIncomeModal
            visible={visible}
            setVisible={setVisible}
            data={data}
            setData={setData}
            loading={loading}
            doneProcess={doneProcess}
        />
        <View style={{marginTop: 10}}>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>3) Source of Income</Text>
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
        {
            selectedData.length > 0 &&
            <View style={{ marginTop: 10, flexDirection: "row",flexWrap:"wrap",alignItems:"center"}}>
                {
                    selectedData.map((item,index)=>(
                        <View style={{...styles.input,padding: 2, height: 30, marginHorizontal: 2, justifyContent:'center',alignItems:"center",flexDirection:"row"}}>
                            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{item.description}</Text>
                            <TouchableHighlight hitSlop={{top: 40,right: 40,bottom: 40,left: 40}} onPress={()=>removeSelected(index)} underlayColor={"transparent"}>
                                <View style={{height: 30,width: 20,justifyContent:'center',alignItems:"flex-end"}}>
                                <VectorIcon color={"black"} size={10} iconSet={ICON_SET.FontAwesome5} name="times"/>
                                </View>
                            </TouchableHighlight>
                        </View>
                    ))
                }
            </View>
        }
        {
            pepInfoAnswer?.value.includes("0") &&
            <View style={{marginTop: 10,}}>
                <TextInput 
                    placeholder="Specify source of income"
                    style={styles.input}
                    value={pepInfoAnswer.others}
                    onChangeText={onChangeText}
                />
            </View>
        }
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