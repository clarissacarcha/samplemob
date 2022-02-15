import React , {useState} from 'react'
import { View , Text , StyleSheet , Dimensions , Image ,TouchableHighlight, FlatList } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useThrottle } from 'src/hooks'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import AdModal from './AdModal';

const { FONT_SIZE, COLOR , SIZE , FONT_FAMILY: FONT , MARGIN} = CONSTANTS
const { width , height } = Dimensions.get("window");
const SCREEN_WIDTH = width;
const BANNER_WIDTH = SCREEN_WIDTH - MARGIN.M * 2;
// const BANNER_HEIGHT = BANNER_WIDTH / 2;
const BANNER_HEIGHT = 150;

const RenderItem = ({ad,index,bannerType})=> {

    const [visible,setVisible] = useState(false);

    const onPress = () => setVisible(true)

    const onPressThrottled = useThrottle(onPress , 1000)

    return (
        <>
        <AdModal
            visible={visible}
            setVisible={setVisible}
            ad={ad}
        />
        <View style={[styles.adv,{  ...(bannerType == "2" ? {width: width * 0.4,marginRight:16,} : {width: width * 0.7,marginRight: 16})}]}>
        <TouchableHighlight style={styles.touchable} underlayColor="transparent" onPress={onPressThrottled}>
          <View>
            <View style={styles.imageBox}>
              <Image
                style={[styles.image, { width: bannerType == "2" ? width * 0.4 : width * 0.7,}]}
                source={{
                //   uri: ad.squareImage,
                uri:  bannerType == "2" ? ad.squareImage : ad.rectangleImage,
                }}
                resizeMode="contain"
              />
            </View>
             
          </View>
        </TouchableHighlight>
            {
              bannerType == "2" &&
              <View style={styles.textBox}>
                <Text style={{fontFamily: FONT.REGULAR}} numberOfLines={2}>
                      {ad.title}
                </Text>
               </View>
            }
      </View>
      </>
    )
}

const Slider = ({ads,bannerType})=>{

    const [activeIndex,setActiveIndex] = useState(0);
  
    return(
        <FlatList
          horizontal
          style={[styles.container, { height: bannerType == "2" ?BANNER_HEIGHT + 40 : BANNER_HEIGHT }]}
          showsHorizontalScrollIndicator={false}
          data={ads}
          keyExtractor={(item)=>item.id}
          renderItem={({item,index})=><RenderItem bannerType={bannerType} ad={item} index={index}/>}
        />
    )
}

const styles = StyleSheet.create({
    container: {
      flexDirection:"row",
      marginHorizontal: 16,
    },  
    adv: {
        height: BANNER_HEIGHT,
        alignItems:"center"
    },
    box: {
        paddingHorizontal: MARGIN.M / 2,
      },
      touchable: {
        borderRadius: SIZE.BORDER_RADIUS,
      },
    
      imageBox: {
        // backgroundColor: COLOR.WHITE,
      },
      image: {
        height: BANNER_HEIGHT,
        borderRadius: SIZE.BORDER_RADIUS,
        overflow: 'hidden',
      },
      textBox: {
        height: 40,
        backgroundColor: COLOR.WHITE,
      },
      iconDateRow: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      date: {color: COLOR.DARK, marginLeft: 5},
})

export default Slider