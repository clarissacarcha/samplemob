import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Dimensions,TouchableHighlight} from 'react-native'
import { COLOR, FONT , FONT_SIZE } from '../../../../../../res/variables'
import { Separator } from '../../Components'
import {VectorIcon , ICON_SET} from '../../../../../../revamp'

const {width,height} = Dimensions.get("window")

const MySavedAccounts = ()=> {

    const addAccount = ()=> {
        console.log("ADD NEW ACCOUNT")
    }

    return(
        <>
        <View style={styles.container}>
           <View style={styles.headings}>
           <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,textAlign: "left",flex: 1}}>My Saved Accounts</Text>
           <TouchableOpacity style={styles.edit}>
                <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,textAlign: "right",color: COLOR.ORANGE}}>Edit</Text>
           </TouchableOpacity>
           </View>

           <View style={styles.body}>
               <View style={{justifyContent:'center',alignItems:"center",marginRight: 10}}>
                    <View style={styles.account}>

                    </View>
                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.S}}>My BPI</Text>
               </View>

               <TouchableHighlight onPress={addAccount} underlayColor={"transparent"} style={{justifyContent:'center',alignItems:"center",marginRight: 10}}>
                   <>
                    <View style={styles.addAccount}>
                        <VectorIcon iconSet={ICON_SET.FontAwesome5} name="plus" size={12} color="#000000"/>
                    </View>
                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.S}}>Add Account</Text>
                    </>
                </TouchableHighlight>
           </View>
        </View>
        <Separator/>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 125,
        backgroundColor:"white",
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    headings: {
        flexDirection: 'row'
    },
    edit: {
        flex: 1,
        paddingLeft: 5,
    },
    body: {
        flexDirection: "row",
        alignItems:'center',
        flex: 1,
    },
    account: {
        height: 50,
        width: width / 5 - 20,
        backgroundColor:"green",
        borderRadius: 100,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    addAccount: {
        height: 50,
        width: width / 5 - 20,
        backgroundColor:COLOR.YELLOW,
        borderRadius: 100,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        justifyContent:"center",
        alignItems:'center'
    }
})

export default MySavedAccounts