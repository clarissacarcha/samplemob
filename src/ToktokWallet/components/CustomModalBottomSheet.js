import React  from 'react'
import { View , Modal , Dimensions} from 'react-native'

const {height,width} = Dimensions.get("window")

export const CustomModalBottomSheet = ({visible , setVisible, children })=> {

    return (
        <>
            {
                visible &&
                <View
                    style={{flex: 1,backgroundColor:"rgba(0,0,0,0.5)", position:"absolute", height: height,width: width}}
                >
                     <Modal
                        animationType="slide"
                        transparent={true}
                        visible={visible}
                        onRequestClose={()=>setVisible(false)}
                    >
                        {children}
                    </Modal>
                </View>
            }
        </>
    )
}