import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import {HeaderBack, HeaderTitle, SomethingWentWrong , AlertOverlay} from '../../../../../../components'
import QRCode from 'react-native-qrcode-svg'
import {useSelector} from 'react-redux'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM} from '../../../../../../res/constants'

const RequestWalletComponent = ({navigation})=> {
    navigation.setOptions({
        headerLeft: ()=> <HeaderBack />,
        headerTitle: ()=> <HeaderTitle label={['Request Money','']} />,
    })

    const session = useSelector(state=>state.session)
    return (
        <View style={styles.container}>
            <View style={{
                alignItems: "center",
                marginTop: 20,
                flex: 1,
            }}>
                    <Text style={{fontSize: 18}}>Ask sender to scan QR code</Text>
                    <View style={styles.QRContainer}>
                    <QRCode
                        value={session.user.userId} //Give value when there's no session as it will throw an error if value is empty.
                        size={220}
                        color="black"
                        backgroundColor="transparent"
                        // onPress={() => alert('Pressed')}
                    />
                    </View>

            </View>
            <View style={{justifyContent: "flex-end"}}>
                <TouchableOpacity style={{padding: 10,justifyContent: "center",alignItems: "center",backgroundColor: DARK,borderRadius: 10}}>
                    <Text style={{color: COLOR}}>REQUEST MONEY VIA LINK</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 20,
    },
    QRContainer: {
        height: 300,
        width: 300,
        marginTop: 50,
        borderColor: "silver",
        borderWidth: .5,
        justifyContent: "center",
        alignItems: "center"
    }
})

export default RequestWalletComponent