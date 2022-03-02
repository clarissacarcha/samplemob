import React, {useContext} from 'react'
import { View , Text , StyleSheet , Modal, TouchableHighlight , Dimensions, FlatList , Image  } from 'react-native'
import { load_logo } from 'toktokload/assets/images'
import { useThrottle } from 'src/hooks'
import { LoadingIndicator } from "src/ToktokLoad/components";
import { VerifyContext } from '../VerifyContextProvider';
import CONSTANTS from 'common/res/constants';

const { MARGIN , COLOR , FONT_SIZE , FONT_FAMILY: FONT } = CONSTANTS
const { width , height } = Dimensions.get("window")

const RenderItem = ({item,index,onPress}) => {

    const onPressThrottle = useThrottle(()=>onPress(index), 2000)

    return (
        <TouchableHighlight onPress={onPressThrottle} underlayColor={COLOR.LIGHT} style={styles.network}>
            <View style={{flexDirection:"row" ,justifyContent:"center" , alignItems:'center'}}>
                  <Image style={styles.image} source={{
                      uri: item.iconUrl
                  }} resizeMode="contain"/>
                  <View style={{flex:1}}>
                    <Text numberOfLines={2} style={styles.text}>{item.name}</Text>
                  </View>
            </View>
        </TouchableHighlight>
    )
}

export const NetworkListModal = ({
    visible,
    setVisible,
    activeNetwork,
    setActiveNetwork,
    loading,
    data,
    activeCategory
})=> {

    const { setMobileNumber } = useContext(VerifyContext)

    const onPress = (index)=> {
        setVisible(false)
        setActiveNetwork(data[index])
        if(activeCategory != "Telco") setMobileNumber("")
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
                  :  <FlatList 
                            style={styles.networkList}
                            ListHeaderComponent={()=> data.length == 0 && !loading && <View><Text>No Available Network</Text></View>}
                            data={data}
                            keyExtractor={item=>item.id}
                            ItemSeparatorComponent={()=><View style={styles.separator}/>}
                            renderItem={({item,index})=><RenderItem onPress={onPress} index={index} item={item}/>}
                            ListFooterComponent={()=><View style={{height: 30}}/>}
                        />
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
        padding: 16,
        backgroundColor:"white",
        flexGrow: 0,
        maxHeight: height * 0.5,
        borderRadius: 10,
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
     }
})

