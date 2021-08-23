import React, {forwardRef , useMemo , useState , useEffect} from 'react'
import { View , Text , StyleSheet , FlatList , TouchableOpacity } from 'react-native'
import BottomSheet, {BottomSheetBackdrop, BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {useLazyQuery} from '@apollo/react-hooks'
import { TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_SOURCE_OF_INCOME } from 'toktokwallet/graphql'
import { onErrorAlert } from 'src/util/ErrorUtility';
import { useAlert } from 'src/hooks';
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS

const BottomSheetSourceOfIncome = forwardRef(({changeIncomeInfo} , ref)=> {
    const snapPoints = useMemo(() => [0, 550], []);
    const alert = useAlert();
    const [filteredSourceOfIncome, setFilteredSourceOfIncome] = useState([])

    const [getSourceOfIncome] = useLazyQuery(GET_SOURCE_OF_INCOME , {
      client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
      fetchPolicy:"network-only",
      onCompleted: ({getSourceOfIncome})=> {
        setFilteredSourceOfIncome(getSourceOfIncome)
      },
      onError: (error) => {
        onErrorAlert({alert, error});
      }
    })

    const selectSourceOfIncome = (index)=> {
        changeIncomeInfo("source",filteredSourceOfIncome[index])
        ref.current.collapse()
    }

    useEffect(()=>getSourceOfIncome(),[])

    return (
        <BottomSheet
            ref={ref}
            index={-1}
            snapPoints={snapPoints}
            enableHandlePanningGesture={false}
            enableContentPanningGesture={false}
            handleComponent={() => (
                <View
                  style={{
                    height: 20,
                    borderTopRightRadius: 15,
                    borderTopLeftRadius: 15,
                    borderTopWidth: 3,
                    borderRightWidth: 2,
                    borderLeftWidth: 2,
                    borderColor: COLOR.ORANGE,
                    marginHorizontal: -2,
                  }}
                />
              )}
            backdropComponent={BottomSheetBackdrop}
        >
        <View style={styles.sheet}>
            <Text style={{fontFamily: FONT.BOLD}}>Select Source of Income</Text>
            <View style={{height: 10}} />
            <FlatList
                data={filteredSourceOfIncome}
                ItemSeparatorComponent={() => <View style={{borderBottomWidth: 1, borderColor: COLOR.LIGHT}} />}
                renderItem={({item, index}) => (
                    <TouchableOpacity onPress={()=>selectSourceOfIncome(index)} style={[styles.validID]}>
                            <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>{item.description}</Text>
                    </TouchableOpacity>     
                )}
            />
        </View>

        </BottomSheet>
    )
})

const styles = StyleSheet.create({
    box: {
      marginBottom: 20,
    },
    sheet: {
      paddingHorizontal: 16,
    },
    spacing: {height: 2},
    validID: {
        height: SIZE.FORM_HEIGHT,
        justifyContent:"center",
        borderBottomWidth: .2,
        borderColor: "silver",
        paddingHorizontal:12,
      }
});

export default BottomSheetSourceOfIncome;