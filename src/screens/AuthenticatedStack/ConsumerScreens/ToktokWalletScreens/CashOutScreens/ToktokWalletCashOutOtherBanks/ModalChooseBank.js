import React , {useEffect,useCallback,useState} from 'react'
import { View , Text ,StyleSheet, Modal , Dimensions, TouchableHighlight ,FlatList,TouchableOpacity,TextInput} from 'react-native'
import { COLOR, SIZE,FONT_SIZE , FONT } from '../../../../../../res/variables'
import { ICON_SET ,VectorIcon} from '../../../../../../revamp'
import {CustomModalBottomSheet} from '../../Components'
import { useNavigation } from '@react-navigation/native';

const {height,width} = Dimensions.get("window")

const ModalChooseBank = ({visible,setVisible,banks , onPress})=> {

    const [filteredBanks,setFilteredBanks] = useState([])
    const navigation = useNavigation()

    const filterSearch = (value) => {
        const filtered = banks.filter(bank=> bank.name.toLowerCase().includes(value.toLowerCase()))
        setFilteredBanks(filtered)
      }

    useEffect(()=>{
        setFilteredBanks(banks)
      },[banks])

    return (
        <>
            <CustomModalBottomSheet visible={visible} setVisible={setVisible}>
                    <View style={styles.container}>
                        <TouchableHighlight onPress={()=>setVisible(false)} underlayColor={"transparent"} style={[styles.header]}>
                            <View/>
                        </TouchableHighlight>
                    
                    <View style={styles.body}>

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

                            <View style={styles.sheet}>
                                <View style={{flexDirection:"row"}}>
                                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L,marginBottom: 10}}>Choose Bank</Text>
                                    <TouchableOpacity onPress={()=>setVisible(false)} style={{flex: 1,alignItems:"flex-end",justifyContent:"flex-start"}}>
                                    <VectorIcon iconSet={ICON_SET.FontAwesome5} name="chevron-down" color="black"/>
                                    </TouchableOpacity>
                                </View>

                                <View>
                                    <TextInput 
                                        style={{height:SIZE.FORM_HEIGHT,borderRadius: SIZE.BORDER_RADIUS,backgroundColor:"#F7F7FA",marginBottom:5,paddingHorizontal: 16}}
                                        returnKeyType="done"
                                        onChangeText={filterSearch}
                                        placeholder="Search Bank"
                                    />
                                </View>

                            </View>
                            <FlatList 
                                data={filteredBanks}
                                style={{paddingHorizontal: 16, paddingBottom: 16, flex: 1,}}
                                keyExtractor={item => item.id}
                                ItemSeparatorComponent={() => <View style={{height: 1, borderColor: COLOR.LIGHT}} />}
                                renderItem={({item,index})=>(
                                    <TouchableHighlight underlayColor="#FFFFE5" onPress={()=>onPress(item)} style={[styles.banks]}>
                                        <>
                                        <View style={{flex: 1}}>
                                           <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>{item.name}</Text>
                                            {/* <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.XS,color: COLOR.DARK}}>
                                                {item.isInstaPay 
                                                    ? `Maximum cash out limit per transaction: PHP 50,000.00`  // instapay
                                                    : "Maximum cash out limit per transaction: no limit" // pesonet
                                                }
                                                </Text> */}
                                        </View>
                                        <View>
                                            <VectorIcon size={12} iconSet={ICON_SET.Feather} name="chevron-right" color={COLOR.DARK} />
                                        </View> 
                                        </>
                                    </TouchableHighlight>
                                )}
                            />    
                    </View>
                    </View>
            </CustomModalBottomSheet>
        </>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"transparent"
    },
    header: {
        flex: 1,
        backgroundColor:"transparent"
    },
    body: {
        height: height * 0.7,
        backgroundColor:"white",
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15
    },
    sheet: {
        paddingHorizontal: 16,
    },
    banks: {
        height: SIZE.FORM_HEIGHT,
        alignItems:"center",
        borderBottomWidth: .2,
        borderColor: "silver",
        flexDirection:"row"
      },
})

export default ModalChooseBank