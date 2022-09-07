import React from 'react'
import { View , Modal , StyleSheet , Dimensions , Text } from 'react-native'
import { YellowButton } from 'src/revamp';
import CONSTANTS from 'common/res/constants';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS;
const { width , height } = Dimensions.get("window");
const ForCompliancePrompt = ({visible,setVisible , data})=> {

    const closeModal = ()=> setVisible(false)

    return (
        <Modal
            style={styles.container}
            visible={visible}
            transparent={true}
            onRequestClose={closeModal}
        >

            <View style={styles.modalBody}>
                <View style={styles.content}>

                    <Text>{data.status}</Text>
                    <View style={{textAlign:"justify"}}>
                        <Text style={{textAlign:"justify"}}>{data.reasons}</Text>
                    </View>
                    
                    <View style={{justifyContent:"flex-end",width: "50%",marginTop: 20}}>
                            <YellowButton label="OK" onPress={closeModal}/>
                    </View>
                 </View>
            </View>

        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalBody: {
        flex: 1,
        backgroundColor:"rgba(0,0,0, 0.7)",
        justifyContent:"center",
        alignItems:"center",
    },
    content: {
        width: width * 0.8,
        backgroundColor:"white",
        borderRadius: SIZE.BORDER_RADIUS,
        padding: 16,
        alignItems:'center'
    },
})

export default ForCompliancePrompt