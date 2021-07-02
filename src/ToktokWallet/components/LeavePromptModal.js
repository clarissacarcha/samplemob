import React from 'react'
import { Modal , StyleSheet , View , StatusBar , Dimensions , Text , TouchableOpacity} from 'react-native'
import CONSTANTS from 'common/res/constants'

const { COLOR, FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

const {width,height} = Dimensions.get("window")

export const LeavePromptModal = ({visible,setVisible, onConfirm})=> {
    return (
        <>
        <StatusBar barStyle="dark-content" backgroundColor={visible ? "rgba(34, 34, 34, 0.5)" : "transparent"} />
        <Modal
            visible={visible}
            onRequestClose={()=>setVisible(false)}
            style={styles.container}
            transparent={true}
        >
            <View style={styles.content}>
                    <View style={styles.closePrompt}>
                        <View style={{flex: 1}}>
                            <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.L}}>Are you sure you want to leave?</Text>
                        </View>
                        <View style={styles.actions}>

                        <TouchableOpacity onPress={()=>setVisible(false)} style={{borderRadius: 5, marginRight: 10, height: "100%",backgroundColor:"#F7F7FA",flex: 1,justifyContent:"center",alignItems:"center"}}>
                                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L ,color: "gray"}}>No</Text>
                           </TouchableOpacity>
                           
                           <TouchableOpacity onPress={()=>{
                               setVisible(false)
                               onConfirm()
                           }} style={{borderRadius: 5, marginLeft: 10, height: "100%",backgroundColor:COLOR.YELLOW,flex: 1,justifyContent:"center",alignItems:"center"}}>
                                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L ,color: COLOR.DARK}}>Yes</Text>
                           </TouchableOpacity>
                        </View>
                    </View>
            </View>
        </Modal>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        backgroundColor:"rgba(34, 34, 34, 0.5)",
        justifyContent:"center",
        alignItems:"center"
    },
    closePrompt: {
        height: 130,
        width: 300,
        backgroundColor:"white",
        borderRadius: 10,
        padding: 16,
    },
    actions: {
        flexDirection: "row",
        height: 50,
    }
})

