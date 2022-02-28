import React from 'react'
import { View , Text , StyleSheet , Modal, TouchableHighlight , Dimensions, FlatList , Image , TouchableOpacity  } from 'react-native'
import { useThrottle } from 'src/hooks'
import { LoadingIndicator } from "toktokwallet/components";
import CONSTANTS from 'common/res/constants';

const { MARGIN , COLOR , FONT_SIZE , FONT_FAMILY: FONT } = CONSTANTS
const { width , height } = Dimensions.get("window")

const RenderItem = ({item,index,onPress}) => {

    const onPressThrottle = useThrottle(()=>onPress(index), 2000)

    return (
        <View underlayColor={COLOR.LIGHT} style={styles.network}>
            <View style={{flexDirection:"row" ,justifyContent:"center" , alignItems:'center'}}>
                <TouchableOpacity onPress={onPressThrottle} style={[styles.answerbox, {height: 20, backgroundColor: item.selected ? COLOR.YELLOW : "transparent"}]}/>
                <View style={{flex:1}}>
                    <Text numberOfLines={2} style={styles.text}>{item.description}</Text>
                </View> 
            </View>
        </View>
    )
}

export const SourceOfIncomeModal = ({
    visible,
    setVisible,
    loading,
    data,
    setSourceOfIncomes,
    setData,
})=> {


    const onPress = (index)=> {
        // setVisible(false)
        const currentData = [...data]
        currentData[index] = {
            ...currentData[index],
            selected: !currentData[index].selected
        }
        setData(currentData)
      
    }

    return(
        <Modal 
            style={styles.container}
            visible={visible}
            onRequestClose={()=>setVisible(false)}
            transparent={true}
        >
            <View style={styles.modalContent}>
              {
                  loading
                  ? <View style={styles.container}>
                        <LoadingIndicator isLoading={true} isFlex />
                    </View>
                  : <View style={styles.networkList}>
                        <FlatList        
                            ListHeaderComponent={()=> data.length == 0 && !loading && <View><Text>No Available Data</Text></View>}
                            data={data}
                            keyExtractor={item=>item.id}
                            ItemSeparatorComponent={()=><View style={styles.separator}/>}
                            renderItem={({item,index})=><RenderItem onPress={onPress} index={index} item={item}/>}
                        />
                        <View style={styles.doneButton}>

                        </View>
                    </View>
              }
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalContent: {
        flex: 1,
        backgroundColor:"rgba(0,0,0, 0.4)",
        justifyContent:"center",
        alignItems:"center",
    },
    networkList: {
        width: width * 0.8,
        backgroundColor:"white",
        flexGrow: 0,
        maxHeight: height * .7,
        borderRadius: 10,
        padding: 16,
    },
    separator: {
        height: 1,
        backgroundColor: COLOR.LIGHT,
        marginVertical: 8,
     },
     network: {
         paddingVertical: 5,
         flexDirection:'row',
         alignItems:"center"
     },
     image: {
         height: 15,
         width: 40,
     },
     text: {
         fontFamily: FONT.REGULAR,
         fontSize: FONT_SIZE.M,
         marginLeft: 5
     },
     doneButton: {
         height: 70,
         backgroundColor:"green",
         padding: 16,
         marginTop: 10,
     },
     answerbox: {
        borderWidth: 0.5,
        borderColor:COLOR.YELLOW,
        padding: 10,
        marginRight: 10,
    },
})

