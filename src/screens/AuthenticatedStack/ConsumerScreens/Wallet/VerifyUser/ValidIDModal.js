import React from 'react'
import {Modal,View,FlatList,TouchableOpacity, Text} from 'react-native'
import { FONT_REGULAR } from '../../../../../res/constants'

const ValidIDModal = ({validIdModal,setValidIdModal,changeVerifyID})=> {

    const ValidIDList = [
        "Passport",
        "Driver's Licence",
        "SSS UMID Card",
        "Philhealth ID",
        "TIN Card",
        "Postal ID",
        "Voter's ID",
        "Professional Regulation Commission ID",
        "Senior Citizen ID",
        "OFW ID",
        // "School ID",
    ]

    return (
        <Modal
        visible={validIdModal}
        onRequestClose={()=>setValidIdModal(false)}
        transparent={true}
    >

        <View style={{flex: 1,justifyContent:"center",alignItems:"center",backgroundColor:"rgba(0,0,0,0.5)"}}> 
            <View style={{height: "90%", width: "85%",backgroundColor:"white",paddingVertical: 20,borderRadius: 10}}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={ValidIDList}
                    keyExtractor={item=>item}
                    renderItem={({item,index})=>{
                        return (
                            <TouchableOpacity
                                    onPress={()=> {
                                        changeVerifyID("idType", item)
                                        setValidIdModal(false)
                                    }}
                            >
                                <Text style={{fontFamily: FONT_REGULAR,fontSize:14,padding: 15,}}>{item}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        </View>

    </Modal>
    )

}

export default ValidIDModal