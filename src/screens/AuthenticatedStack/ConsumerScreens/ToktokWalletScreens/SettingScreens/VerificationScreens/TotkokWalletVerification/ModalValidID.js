import React , {useState,useContext} from 'react'
import {Modal,View,Text,StyleSheet,FlatList,TouchableOpacity,TextInput} from 'react-native'
import {VerifyContext} from './VerifyContextProvider'
import FIcon from 'react-native-vector-icons/Feather';
import { SIZES, INPUT_HEIGHT, FONTS, COLORS } from '../../../../../../../res/constants';
import {Separator} from '../../../Components';

let validIDList = [
    {label: "Passport" ,value: "Passport"},
    {label: "Driver's License" ,value: "Driver's License"},
    {label: "SSS UMID Card" ,value: "SSS UMID Card"},
    {label: "Philhealth ID" ,value: "Philhealth ID"},
    {label: "TIN Card" ,value: "TIN Card"},
    {label: "Postal ID" ,value: "Postal ID"},
    {label: "Voter's ID" ,value: "Voter's ID"},
    {label: "Professional Regulation Commission ID" ,value: "Professional Regulation Commission ID"},
    {label: "Senior Citizen ID" ,value: "Senior Citizen ID"},
    {label: "OFW ID" ,value: "OFW ID"},
]

validIDList = validIDList.sort((a,b)=> a.value > b.value ? 1 : -1)


const ModalValidID = ({visible,setVisible})=> {
    const {changeVerifyID} = useContext(VerifyContext)
    const [filteredValidID,setFilteredValidID] = useState(validIDList)


    const selectValidID = (index)=> {
        const validID = filteredValidID[index].value
        changeVerifyID("idType",validID)
        setVisible(false)
        setFilteredValidID(validIDList)
    }

    const filterSearch = (value) => {
        const filtered = validIDList.filter(validID=> validID.value.toLowerCase().includes(value.toLowerCase()))
        setFilteredValidID(filtered)
    }


    const renderValidID = ({item,index})=> {
        return (
            <TouchableOpacity onPress={()=>selectValidID(index)} style={[styles.validID]}>
                    <Text style={{fontFamily: FONTS.REGULAR, fontSize: SIZES.M}}>{item.value}</Text>
            </TouchableOpacity>
        )
    }

  

    return (
        <Modal
            visible={visible}
            onRequestClose={()=>{
                setVisible(false)
                setFilteredValidID(validIDList)
            }}
            style={styles.container}
            animationType="slide"
        >
            <View style={styles.content}>
                <TouchableOpacity onPress={()=>setVisible(false)} style={{justifyContent: "center",alignItems:"center"}}>
                    <FIcon name="chevron-down" size={20}/>
                </TouchableOpacity>
                <View style={styles.search}>
                    <TextInput 
                        placeholder="Search valid ID type"
                        style={styles.input}
                        onChangeText={filterSearch}
                    />
                    <FIcon style={{alignSelf: "center",position:"absolute", right: 25}} name={'search'} size={24}/>
                </View>

                <Separator/>

                <FlatList
                        style={{marginVertical: 15,}}
                        data={filteredValidID}
                        keyExtractor={validID=>validID.label}
                        renderItem={renderValidID}
                        showsVerticalScrollIndicator={false}
                        // scrollEnabled={true}
                />
            </View>
            
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        marginTop: 15,
    },
    search: {
        flexDirection: "row",
        marginTop: 10,
        paddingHorizontal: 16,
        height: 50,
        marginBottom: 10,
    },
    input: {
        fontFamily: FONTS.REGULAR,
        flex: 1,
        height: "100%",
        width:"100%",
        fontSize: SIZES.M,
        backgroundColor: "#F7F7FA",
        paddingLeft: 10,
        borderRadius: 5,
        color: COLORS.DARK
    },
    validID: {
        height: INPUT_HEIGHT,
        justifyContent:"center",
        borderBottomWidth: .2,
        borderColor: "silver",
        paddingHorizontal:16,
    },
})

export default ModalValidID