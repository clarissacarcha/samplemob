import React from 'react'
import {Modal,StyleSheet,View,Text,TouchableOpacity,ScrollView,Platform} from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { DARK } from '../../../../../../res/constants';
import MoneyProtected from './MoneyProtected'
import LayeredSecurity from './LayeredSecurity'

const DisplayContent = (index)=> {
        
    switch(index){
        case 0:
            return <LayeredSecurity />
        case 1:
            return <MoneyProtected />
        default:

            break
    }
}


const SecurityModal = ({visible,setVisible,index})=> {

   
    return (
        <Modal
            visible={visible}
            style={styles.container}
            onRequestClose={()=>setVisible(false)}
        >
            <TouchableOpacity style={{width: 40,marginLeft: 10,marginTop: Platform.select({
                ios: 55,
                android: 10
            }),marginBottom: 5}} onPress={()=>setVisible(false)}>
                    <MaterialIcon style={{alignSelf:"flex-start"}} name="arrow-back" size={30} color={DARK} />
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
              
                    {DisplayContent(index)}
            </ScrollView>

        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        backgroundColor:"white",
        paddingHorizontal: 20,
    }
})

export default SecurityModal