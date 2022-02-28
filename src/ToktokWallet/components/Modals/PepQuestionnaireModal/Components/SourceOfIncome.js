import React , {useState,useEffect} from "react";
import { View , Text , StyleSheet, TouchableOpacity } from 'react-native';
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
    const [sourceOfIncomes,setSourceOfIncomes] = useState([])

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

    useEffect(()=>getSourceOfIncome(),[])

    return (
        <>
        <SourceOfIncomeModal
            visible={visible}
            setVisible={setVisible}
            data={data}
            setData={setData}
            setSourceOfIncomes={setSourceOfIncomes}
            loading={loading}
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
            data[0]?.selected &&
            <View>
                <Text>Others here</Text>
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