import React , {useState} from 'react'
import { View , Text , StyleSheet , Dimensions , Image ,TouchableHighlight } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useThrottle } from 'src/hooks'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import AdModal from './AdModal';

const { FONT_SIZE, COLOR , SIZE , FONT_FAMILY: FONT , MARGIN} = CONSTANTS
const { width } = Dimensions.get("window");
const SCREEN_WIDTH = width;
const BANNER_WIDTH = SCREEN_WIDTH - MARGIN.M * 3;
const BANNER_HEIGHT = BANNER_WIDTH / 2;

const RenderDots = ({entries, activeSlide})=> {
    
    return (
        <Pagination
        dotsLength={entries.length}
        activeDotIndex={activeSlide}
        containerStyle={{ }}
        dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 0,
            backgroundColor: COLOR.ORANGE
        }}
        inactiveDotStyle={{
            // Define styles for inactive dots here
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 0,
            backgroundColor: COLOR.DARK
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    )
}


const RenderItem = ({ad,index})=> {

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
        <View style={styles.adv}>
        <TouchableHighlight style={styles.touchable} underlayColor="transparent" onPress={onPressThrottled}>
          <View>
            <View style={styles.imageBox}>
              <Image
                style={styles.image}
                source={{
                //   uri: ad.squareImage,
                uri: ad.rectangleImage,
                }}
                resizeMode="contain"
              />
            </View>
          </View>
        </TouchableHighlight>
        {/* <View style={styles.textBox}>
          <Text style={{fontFamily: FONT.BOLD}} numberOfLines={2}>
            {ad.title}
          </Text>
        </View> */}
      </View>
      </>
    )
}

const Slider = ({ads})=>{

    const [activeIndex,setActiveIndex] = useState(0);
  
    return(
        <>
            <Carousel
                layout="default"
                data={ads}
                renderItem={({item,index})=><RenderItem ad={item} index={index}/>}
                onSnapToItem={(index) => setActiveIndex(index) }
                sliderWidth={width}
                sliderHeight={BANNER_HEIGHT}
                itemWidth={width * 0.9}
                // autoplay={true}
                // loop={true}
            />
          <RenderDots
                entries={ads}
                activeSlide={activeIndex}
          />
        </>
    )
}

const styles = StyleSheet.create({
    adv: {
        height: BANNER_HEIGHT,
        width: width * 0.8,
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
        width: BANNER_HEIGHT * 2,
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