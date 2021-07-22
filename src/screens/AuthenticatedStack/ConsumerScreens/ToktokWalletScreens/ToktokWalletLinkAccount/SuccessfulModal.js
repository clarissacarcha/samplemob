import React from 'react'
import {View, Text, StyleSheet , Modal , Image} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import { FONT, FONT_SIZE, SIZE } from '../../../../../res/variables'
import { YellowButton } from '../../../../../revamp'

const SuccessfulModal = ({visible, setVisible})=> {

    const navigation = useNavigation()

    const redirect = ()=> {
        navigation.pop()
        return navigation.replace("ToktokWalletHomePage")
    }

    return (
        <Modal
            visible={visible}
            style={styles.container}
            onRequestClose={redirect}
        >

            <View style={styles.modalBody}>
                <View style={{flex: 1,alignItems:"center",marginTop: 100}}>
                <Image style={{marginBottom: 20}} source={require('../../../../../assets/toktokwallet-assets/success.png')}/>
                <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.L}}>Linking Successful!</Text>
                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>You have successfully linked your toktokwallet account.</Text>
                </View>
                <View style={{height: SIZE.BUTTON_HEIGHT}}>
                        <YellowButton label="Ok" onPress={redirect}/>
                </View>
            </View>

        </Modal>
    )
}

const styles =  StyleSheet.create({
    container: {
        flex: 1,
    },
    modalBody: {
        flex:1,
        backgroundColor:"white",
        padding: 16
    }
})

export default SuccessfulModal