import React from 'react'
import { View , Text , StyleSheet , Modal , Dimensions , Image , TouchableOpacity } from 'react-native'
import { moderateScale } from 'toktokwallet/helper'
import CONSTANTS from 'common/res/constants'

const { FONT_SIZE, COLOR , SIZE , FONT_FAMILY: FONT , MARGIN} = CONSTANTS
const { width } = Dimensions.get("window");
const SCREEN_WIDTH = width;
const BANNER_WIDTH = SCREEN_WIDTH;
const BANNER_HEIGHT = BANNER_WIDTH * 0.8;

const AdModal = ({visible,setVisible,ad})=> {

    const closeModal = ()=> setVisible(false)

    return (
       <Modal
            style={styles.container}
            visible={visible}
            onRequestClose={closeModal}
            transparent={true}
       >
            <View style={styles.modalBody}>
                <View style={styles.content}>
                       <Image
                        style={styles.image}
                        source={{
                            uri: ad.squareImage
                        }}
                       />
                       <TouchableOpacity 
                            onPress={closeModal}
                            style={{
                                padding: 16,
                            }}>
                                <Text style={{fontFamily: FONT.REGULAR, fontSize: moderateScale(FONT_SIZE.L), color:"white"}}>Close this ad</Text>
                       </TouchableOpacity>
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
        backgroundColor:"transparent",
        borderRadius: SIZE.BORDER_RADIUS,
        padding: 16,
        alignItems:'center'
    },
    image: {
        height: BANNER_HEIGHT,
        width: BANNER_HEIGHT,
        borderRadius: SIZE.BORDER_RADIUS,
        overflow: 'hidden',
      },
})

export default AdModal