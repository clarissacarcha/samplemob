import React , {useContext} from 'react'
import {Text,Dimensions,Platform,View,StyleSheet} from 'react-native'
import { Separator } from 'toktokwallet/components'
import validator from 'validator'
import { ContextEnterpriseApplication } from "../ContextProvider"
import {ReactNativeFile} from 'apollo-upload-client';
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import ChooseImage  from './ChooseImage';
import ImageIDSet from './ImageIDSet';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS

const TakePhoto = ({validID,index})=> {
    const { 
        setValidID1,
        setValidID2,    
    } = useContext(ContextEnterpriseApplication)

    const setImage = (data,placement)=> {
        const rnFile = new ReactNativeFile({
            ...data,
            name: 'documentValidID.jpg',
            type: 'image/jpeg',
        });
        if(index == 1){
            return setValidID1(state=> {
                return {
                    ...state,
                    ...(placement === "front"
                        ? {
                            frontFilename: data.uri,
                            frontFile: rnFile,
                            frontErrorMessage: ""
                        }
                        : {
                            backFilename: data.uri,
                            backFile: rnFile,
                            backErrorMessage: ""
                        }
                    )
                }
            })
        }

        return setValidID2(state=> {
            return {
                ...state,
                ...(placement === "front"
                    ? {
                        frontFilename: data.uri,
                        frontFile: rnFile,
                        frontErrorMessage: "",
                    }
                    : {
                        backFilename: data.uri,
                        backFile: rnFile,
                        backErrorMessage: "",
                    }
                )
            }
        })
    }


    return (
        <>
            <View style={{flex: 1, padding: 16, marginTop: 0}}>
                <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Front of ID</Text>
                {
                    validID.frontFilename != "" 
                    ? <ImageIDSet setImage={setImage} validID={validID} placement="front" index={index}/> 
                    : <ChooseImage setImage={setImage}  placement="front" index={index}/>
                }
                {
                    validID.frontErrorMessage != "" && validID.frontErrorMessage != "Valid ID is required."
                    && <Text style={styles.errorMessage}>{validID.frontErrorMessage}</Text>
                }
            </View>
            {
                validID.isBackRequired == 1 &&
                <View style={{flex: 1, padding: 16, marginTop: 0}}>
                <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Back of ID</Text>
                    {
                        validID.backFilename != "" 
                        ? <ImageIDSet setImage={setImage} validID={validID} placement="back" index={index}/> 
                        : <ChooseImage setImage={setImage} placement="back" index={index}/>
                    }
                     {
                    validID.backErrorMessage != "" && validID.backErrorMessage != "Valid ID is required."
                    && <Text style={styles.errorMessage}>{validID.backErrorMessage}</Text>
                }
                </View>
            }
            <Separator/>
        </>
    )

}

const styles = StyleSheet.create({
    errorMessage: {
        marginHorizontal: 16,
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.XS,
        color: COLOR.RED,
        textAlign:'center',
        marginTop: 10
    },
})

export default TakePhoto