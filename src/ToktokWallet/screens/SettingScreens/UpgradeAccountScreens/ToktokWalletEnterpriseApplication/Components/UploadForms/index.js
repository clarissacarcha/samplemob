import React , {useContext,useRef} from 'react';
import { View , Text , StyleSheet , FlatList } from 'react-native';
import DocumentPicker from "react-native-document-picker";
import Toast from 'react-native-simple-toast';
import { stat } from 'react-native-fs';
import { ContextEnterpriseApplication } from "../ContextProvider";

//SElF IMPORTS 
import Form from "./Form";


const bytesToMb = (value)=> {
    return value / 1000000
}


export const UploadForms = ()=> {
    const {
        forms,
        setFileUpload,
        setFileError,
    } = useContext(ContextEnterpriseApplication)

    const onPress = async (index)=> {  
        try {
            const res = await DocumentPicker.pick({
                type: [
                    DocumentPicker.types.pdf,
                    DocumentPicker.types.images
                ]
            })
            const fileTypesAccepted = ["pdf","jpeg","jpg","PDF","JPEG","JPG"]
            const filetype = res.type.split("/")[1]
            if(!fileTypesAccepted.includes(filetype)){
               // setFileError(index, 'Accepted file types are JPG, JPEG and PDF')
                return  Toast.show(`Accepted file types are JPG, JPEG and PDF` , Toast.LONG)
            }
            const fileSize = bytesToMb(+res.size)
            if(fileSize > 2){
              //  setFileError(index, 'File size should be max of 2mb')
                return  Toast.show(`File size should be max of 2mb` , Toast.LONG)
            }

            setFileUpload(index , res)

        }catch(error){
            if(DocumentPicker.isCancel(error)){
                // User cancelled the picker , exit any dialogs
            }else{  
                throw error;
            }
        }
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={forms}
                keyExtractor={item=>item.name}
                renderItem={({item,index})=> {
                    return <Form form={item} index={index} onPress={onPress}/>
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
    }
})