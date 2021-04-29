import React, { useState } from 'react'
import {View,Text,StyleSheet , FlatList , Image , Modal , Dimensions , TouchableHighlight , TouchableOpacity} from 'react-native'
import { FONT_MEDIUM, SIZES } from '../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'

const SampleAdvertisementsData = [
    {key: 0,image: require('../../../../../assets/images/sampleAds/ad1.png')},
    {key: 1,image: require('../../../../../assets/images/sampleAds/ad2.png')},
    {key: 2,image: require('../../../../../assets/images/sampleAds/ad3.png')},
    // {key: 3,image: require('../../../../../assets/images/sampleAds/ad3.png')},
]

const {width,height} = Dimensions.get("window")

const AdvertisementModal = ({isVisible,setIsVisible, index })=> {


    return (
        <Modal
            visible={isVisible}
            onRequestClose={()=>setIsVisible(false)}
            transparent={true}
            style={styles.adModal}
        >
            <View style={styles.adModalContent}>
                    <View style={styles.adBodyContent}>
                            <TouchableOpacity onPress={()=>setIsVisible(false)} style={styles.adClosebtn}>
                                <FIcon5 name="times" size={18} color="white"/>
                            </TouchableOpacity>
                            <Image style={styles.adBodyContentImage} resizeMode="contain" source={SampleAdvertisementsData[index].image}/>
                    </View>
            </View>
        </Modal>
    )
}


const RenderAdvertisement = ({item,index,onPress})=> {

    return (
        <TouchableHighlight underlayColor onPress={()=>onPress(index)} style={styles.adContent} key={`ad-${index}`}>
               <Image resizeMode="stretch" style={styles.adImage} source={SampleAdvertisementsData[index].image}/>
        </TouchableHighlight>
    )
}

const WalletAdvertisements = ()=> {

    const [isVisible,setIsVisible] = useState(false)
    const [adIndex,setAdIndex] = useState(0)

    const onPress = (index)=>{
        setAdIndex(index)
        setIsVisible(true)
    }

    return (
        <>
        <AdvertisementModal isVisible={isVisible} setIsVisible={setIsVisible} index={adIndex} />
        <View style={styles.container}>
                <Text style={{fontSize: SIZES.M,color: "#212529",fontFamily: FONT_MEDIUM}}>Promos and Freebies</Text>
                <FlatList 
                        style={styles.adsContainer}
                        data={SampleAdvertisementsData}
                        keyExtractor={ad=>ad.key}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({item,index})=>(
                            <RenderAdvertisement item={item} index={index} onPress={(index)=>onPress(index)}/>
                        )}
                />
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    adsContainer: {
        marginTop: 5
    },
    adContent: {
        borderRadius: 10,
    },
    adImage: {
        height: 86, 
        width: 140,
        marginRight: 8
    },
    adModal: {
        flex: 1,
    },
    adModalContent: {
        flex: 1,
        justifyContent:"center",
        alignItems:'center',
        backgroundColor:"rgba(0,0,0,0.5)"
    },
    adBodyContent: {
        width: width * 0.9,
        height: height * 0.5,
        position:"relative"
    },
    adBodyContentImage: {
        position:"absolute",
        height:"100%",
        width:"100%"
    },
    adClosebtn: {
        position:"absolute",
        right: 0,
        top:-30,
        height: 40,
        width: 40,
        backgroundColor:"transparent",
        borderRadius: 40,
        borderWidth: 1,
        borderColor: "white",
        justifyContent:"center",
        alignItems:"center",
        zIndex: 2,
        elevation: 2
    }
})

export default WalletAdvertisements