import React , {useEffect,useCallback,useState} from 'react'
import { View , Text ,StyleSheet, Modal , Dimensions, TouchableHighlight ,FlatList,TouchableOpacity,TextInput} from 'react-native'
import { COLOR, SIZE,FONT_SIZE , FONT } from '../../../../../../res/variables'
import { ICON_SET ,VectorIcon} from '../../../../../../revamp'
import {CustomModalBottomSheet} from '../../Components'
import { useNavigation } from '@react-navigation/native';

const {height,width} = Dimensions.get("window")

const ModalChooseAccount = ({visible,setVisible,accounts})=> {

    const navigation = useNavigation()

    const selectAccount = (bankAccount)=> {
        setVisible(false)
        return navigation.navigate("ToktokWalletCashOutViewAccount" , {bankAccount: bankAccount})
    }

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
                                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L,marginBottom: 10}}>Choose Account</Text>
                                        <TouchableOpacity onPress={()=>setVisible(false)} style={{flex: 1,alignItems:"flex-end",justifyContent:"flex-start"}}>
                                        <VectorIcon iconSet={ICON_SET.FontAwesome5} name="chevron-down" color="black"/>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <FlatList 
                                    data={accounts}
                                    style={{paddingHorizontal: 16, paddingBottom: 16, flex: 1,}}
                                    keyExtractor={item => item.id}
                                    ItemSeparatorComponent={() => <View style={{height: 1, borderColor: COLOR.LIGHT}} />}
                                    renderItem={({item,index})=>{
                                        const splitAlias = item.nickName.split(" ")
                                        const initialAlias = `${splitAlias[0][0]}${splitAlias[1] ? " "+splitAlias[1][0]: ""}`
                                        return (
                                            <TouchableHighlight underlayColor={'#FFFFE5'} onPress={()=>selectAccount(item)} style={[styles.banks]}>
                                            <>
                                                <View style={[styles.bankLogo,{justifyContent:'center',alignItems:"center"}]}>
                                                          <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M}}>{initialAlias.toUpperCase()}</Text>
                                                </View>
                                                <View style={{flex: 1}}>
                                                    <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.S}}>{item.bank.name}</Text>
                                                    <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S}}>Account Number: {item.accountNumber}</Text>
                                                    <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S}}>Account Name: {item.accountName}</Text>
                                                </View>
                                                <View>
                                                    <VectorIcon iconSet={ICON_SET.Feather} name="chevron-right" color={COLOR.DARK} />
                                                </View> 
                                            </>
                                          </TouchableHighlight>     
                                        )
                                    }}
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
        height: SIZE.FORM_HEIGHT + 30,
        alignItems:"center",
        borderBottomWidth: .2,
        borderColor: "silver",
        flexDirection:"row",
        paddingHorizontal: 2
      },
      bankLogo: {
        height: 50,
        width: 50,
        backgroundColor: COLOR.YELLOW,
        borderRadius: 100,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginRight: 10,
      },
      accountValue: {
        fontSize: FONT_SIZE.M,
        fontFamily: FONT.REGULAR
      }
})

export default ModalChooseAccount