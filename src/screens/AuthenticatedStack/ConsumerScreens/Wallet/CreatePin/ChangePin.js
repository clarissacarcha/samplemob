import React, { useState } from 'react'
import {View , Text , StyleSheet , TouchableHighlight,Dimensions} from 'react-native'
import {HeaderBack, HeaderTitle} from '../../../../../components'
import { COLOR, COLOR_UNDERLAY, DARK, FONT_MEDIUM, MEDIUM } from '../../../../../res/constants';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FIcon from 'react-native-vector-icons/Feather';
import {CONFIRM_TOKTOK_WALLET_PIN} from '../../../../../graphql'
import {useLazyQuery} from '@apollo/react-hooks'
import {onError} from '../../../../../util/ErrorUtility'

const SCREEN_WIDTH = Dimensions.get('window').width;
const PIN_HEIGHT = (SCREEN_WIDTH-120) / 3;

const NumberRow = ({children})=> {
    return <View style={styles.numberRow}>{children}</View>;
}

const NumberButton = ({number, onPress}) => {
    return (
      <TouchableHighlight onPress={() => onPress({number})} underlayColor={COLOR_UNDERLAY} style={styles.numberButton}>
        <Text style={{fontFamily: 'Rubik-Medium', fontSize: 25, color: MEDIUM}}>{number}</Text>
      </TouchableHighlight>
    );
  };

  const DeleteButton = ({onPress , opacity}) => {
    return (
      <TouchableHighlight onPress={onPress} underlayColor={COLOR_UNDERLAY} style={[styles.numberButton,{opacity: opacity}]}>
        <FIcon name="delete" size={30} color={MEDIUM} />
      </TouchableHighlight>
    );
  };

  const ConfirmButton = ({onPress , opacity}) => {
      return (
        <TouchableHighlight onPress={onPress} underlayColor={COLOR_UNDERLAY} style={[styles.numberButton,{opacity: opacity}]}>
            <FIcon name="check" size={30} color={MEDIUM} />
        </TouchableHighlight>
    )
  }

  const NumberBox = ({onPress,value}) => (
    <TouchableHighlight onPress={onPress} underlayColor={COLOR} style={{borderRadius: 10,marginHorizontal: 5,}}>
      <View style={styles.inputView}>
        <Text style={{fontSize: 25}}>{value ? "*" : "_"}</Text>
      </View>
    </TouchableHighlight>
);

const NumberBoxes = ({pinCode}) => {

    const numberBoxes = [];
    var i;
    for (i = 0; i <= 3; i++) {
      numberBoxes.push(<NumberBox value={pinCode[i]}/>);
    }
    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20}}>
            {numberBoxes}
        </View>
    );
 };

const ChangePin = ({navigation})=> {

    navigation.setOptions({
        headerTitle: ()=> <HeaderTitle  label={['Change PIN']}/>
    })

    const [pinCode,setPinCode] = useState("")

    const [confirmToktokWalletPIN, {data,error,loading}] = useLazyQuery(CONFIRM_TOKTOK_WALLET_PIN,{
        fetchPolicy: 'network-only',
        onError: onError,
        onCompleted: (response)=> {
           navigation.navigate("TokTokWalletSettingsCreatePIN")
        }
    })

    const onNumberPress = (value)=> {
       if(pinCode.length <= 3)  setPinCode(`${pinCode}${value}`)
    }

    const onDelete = () => {
        setPinCode(pinCode.slice(0, -1));
    };

    const onConfirm = ()=> {
        confirmToktokWalletPIN({
            variables: {
                input: {
                    pincode: pinCode
                }
            },
       })
    }

    return(
        <View style={styles.container}>
            <View style={styles.PinContainer}>
                    <Text style={{fontSize: 14,fontFamily: FONT_MEDIUM,marginVertical: 20,}}>Enter your Current PIN</Text>
                    <NumberBoxes pinCode={pinCode}/>
            </View>

            <View style={styles.numberPad}>
                <NumberRow>
                    <NumberButton number={1} onPress={()=>onNumberPress(1)} />
                    <NumberButton number={2} onPress={()=>onNumberPress(2)} />
                    <NumberButton number={3} onPress={()=>onNumberPress(3)} />

                </NumberRow>

                <NumberRow>
                    <NumberButton number={4} onPress={()=>onNumberPress(4)} />
                    <NumberButton number={5} onPress={()=>onNumberPress(5)} />
                    <NumberButton number={6} onPress={()=>onNumberPress(6)} />

                </NumberRow>

                <NumberRow>
                    <NumberButton number={7} onPress={()=>onNumberPress(7)} />
                    <NumberButton number={8} onPress={()=>onNumberPress(8)} />
                    <NumberButton number={9} onPress={()=>onNumberPress(9)} />

                </NumberRow>

                <NumberRow>
                    <ConfirmButton onPress={onConfirm} opacity={pinCode.length == 4 ? 1 : 0}/>
                    <NumberButton number={0} onPress={()=>onNumberPress(0)} />
                    <DeleteButton onPress={onDelete} opacity={pinCode.length > 0 ? 1 : 0}/>
                </NumberRow>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    },
    PinContainer: {
        flex: 1,
        justifyContent:"center",
        alignItems:"center"
    },
    numberPad: {
        flex: 2,
        justifyContent:"flex-start",
        alignItems: "center",
        width: SCREEN_WIDTH
    },
    numberRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    numberButton: {
        height: PIN_HEIGHT / 2,
        width: PIN_HEIGHT,
        borderRadius: 10,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    inputView: {
        backgroundColor: 'white',
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        paddingHorizontal: 20,
        fontSize: 25,
        color: DARK,
        width: 30,
    },
})

export default ChangePin