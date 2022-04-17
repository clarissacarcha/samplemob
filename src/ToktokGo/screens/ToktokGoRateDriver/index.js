import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../components';
import CONSTANTS from '../../../common/res/constants';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import Feedback1 from '../../../assets/images/Feedback1.png';
import Feedback2 from '../../../assets/images/Feedback2.png';
import Feedback3 from '../../../assets/images/Feedback3.png';
import Feedback4 from '../../../assets/images/Feedback4.png';
import Feedback5 from '../../../assets/images/Feedback5.png';
import Feedback6 from '../../../assets/images/Feedback6.png';
import {COLOR, DARK, MEDIUM, LIGHT, ORANGE, APP_FLAVOR} from '../../../res/constants';
import {FeedbackModal} from './components';
import {useDispatch} from 'react-redux';

const Star = ({onPress, color, isLast}) => {
  return <FAIcon onPress={onPress} name="star" size={35} style={{marginRight: isLast ? 0 : 25}} color={color} />;
};
const StarRating = ({onChange}) => {
  const [rating, setRating] = useState(0);

  const onStarPress = index => {
    setRating(index);
    onChange(index);
  };

  const starColor = index => {
    if (index <= rating) {
      return COLOR;
    } else {
      return LIGHT;
    }
  };

  return (
    <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginLeft: '7%'}}>
      <Star onPress={() => onStarPress(1)} color={starColor(1)} />
      <Star onPress={() => onStarPress(2)} color={starColor(2)} />
      <Star onPress={() => onStarPress(3)} color={starColor(3)} />
      <Star onPress={() => onStarPress(4)} color={starColor(4)} />
      <Star onPress={() => onStarPress(5)} color={starColor(5)} />
    </View>
  );
};

const RateDriver = ({navigation, route}) => {
  const {popTo} = route.params;
  const dropDownRef = useRef(null);
  const [rating, setRating] = useState(0);
  const [selected, setSelected] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [feedBack, setFeedback] = useState({
    text: '',
    textLength: 0,
  });

  const dispatch = useDispatch();
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['', '']} />,
  });
  const starStatus = () => {
    if (rating == 1) {
      return 'Poor';
    } else if (rating == 2) {
      return 'Fair';
    } else if (rating == 3) {
      return 'Good';
    } else if (rating == 4) {
      return 'Very Good';
    } else if (rating == 5) {
      return 'Excellent';
    }
  };
  const showBookingReason = () => {
    setShowModal(!showModal);
  };

  const onChangeValue = value => {
    if (selected.includes(value)) {
      let index = selected.indexOf(value);
      setSelected([...selected.slice(0, index), ...selected.slice(index + 1)]);
    } else {
      setSelected(prevState => [...prevState, value]);
    }
  };
  const onFeedBack = text => {
    if (text.length <= 320)
      setFeedback({
        textLength: text.length,
        text: text,
      });
  };

  const rateDriverDone = () => {
    dispatch({type: 'SET_TOKTOKGO_BOOKING_INITIAL_STATE'});
    navigation.pop(popTo);
  };
  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.containerTitle}>
        <Text style={styles.titleQuestion}>How was your driver?</Text>
        <Text style={styles.starStyle}>{starStatus()}</Text>
        <StarRating onChange={value => setRating(value)} />
        <Text style={styles.yourFeedbackText}>Your feedback helps us to improve our service.</Text>
      </View>
      <View style={{flexDirection: 'column'}}>
        <View style={styles.containerFeedback1}>
          <View style={{alignItems: 'center', opacity: selected.includes(1) ? 1 : 0.5}}>
            <TouchableOpacity onPress={() => onChangeValue(1)}>
              <Image source={Feedback1} style={{height: 70, width: 70}} />
            </TouchableOpacity>
            <Text style={styles.typesOfText}>Winning Service</Text>
          </View>

          <View style={{alignItems: 'center', opacity: selected.includes(2) ? 1 : 0.5}}>
            <TouchableOpacity onPress={() => onChangeValue(2)}>
              <Image source={Feedback2} style={{height: 70, width: 70}} />
            </TouchableOpacity>
            <Text style={styles.typesOfText}>Squeaky Clean</Text>
          </View>

          <View style={{alignItems: 'center', opacity: selected.includes(3) ? 1 : 0.5}}>
            <TouchableOpacity onPress={() => onChangeValue(3)}>
              <Image source={Feedback3} style={{height: 70, width: 70}} />
            </TouchableOpacity>
            <Text style={styles.typesOfText}>Comfortable Ride</Text>
          </View>
        </View>

        <View style={styles.containerFeedback2}>
          <View style={{alignItems: 'center', opacity: selected.includes(4) ? 1 : 0.5}}>
            <TouchableOpacity onPress={() => onChangeValue(4)}>
              <Image source={Feedback4} style={{height: 70, width: 70}} />
            </TouchableOpacity>
            <Text style={styles.typesOfText}>Friendly Driver</Text>
          </View>

          <View style={{alignItems: 'center', marginLeft: 20, opacity: selected.includes(5) ? 1 : 0.5}}>
            <TouchableOpacity onPress={() => onChangeValue(5)}>
              <Image source={Feedback5} style={{height: 70, width: 70}} />
            </TouchableOpacity>
            <Text style={styles.typesOfText}>Great Music</Text>
          </View>

          <View style={{alignItems: 'center', opacity: selected.includes(6) ? 1 : 0.5}}>
            <TouchableOpacity onPress={() => onChangeValue(6)}>
              <Image source={Feedback6} style={{height: 70, width: 70}} />
            </TouchableOpacity>
            <Text style={styles.typesOfText}>Love the Amenities</Text>
          </View>
        </View>
      </View>
      <View style={styles.containerTextInput}>
        <TextInput
          ref={dropDownRef}
          // value={description}
          placeholder="Write your feedback"
          keyboardType="default"
          onChangeText={value => onFeedBack(value)}
          style={styles.Input}
          numberOfLines={10}
          multiline
          maxLength={320}
        />
        <View style={{alignItems: 'flex-end'}}>
          <Text style={styles.textInputLength}>{feedBack.textLength}/320</Text>
        </View>
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btnConfirm} onPress={() => showBookingReason()}>
          <Text style={styles.btnTextSubmit}>Submit</Text>
        </TouchableOpacity>
      </View>
      <FeedbackModal
        showModal={showModal}
        showBookingReason={() => showBookingReason()}
        popTo={popTo}
        navigation={navigation}
        rateDriverDone={rateDriverDone}
      />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  Input: {
    height: 100,
    textAlignVertical: 'top',
    fontSize: CONSTANTS.FONT_SIZE.S,
    padding: 8,
    backgroundColor: '#F8F8F8',
    borderRadius: 5,
    width: '100%',
  },
  btnConfirm: {
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 5,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: '39%',
  },
  btnTextSubmit: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.XL,
    color: CONSTANTS.COLOR.WHITE,
  },
  btnContainer: {
    flexDirection: 'row',
    marginHorizontal: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingTop: 20,
    marginVertical: 24,
  },
  containerTextInput: {
    backgroundColor: '#F8F8F8',
    borderColor: 'red',
    marginHorizontal: 20,
    borderRadius: 5,
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  textInputLength: {
    marginRight: 15,
    marginBottom: 10,
    color: '#9E9E9E',
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    fontSize: CONSTANTS.FONT_SIZE.S,
  },
  typesOfText: {
    fontSize: CONSTANTS.FONT_FAMILY.REGULAR,
    fontSize: CONSTANTS.FONT_SIZE.S,
  },
  titleQuestion: {
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    fontSize: CONSTANTS.FONT_SIZE.XL + 1,
  },
  starStyle: {
    paddingTop: 40,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.XL + 1,
    paddingBottom: 10,
  },
  containerFeedback2: {
    flexDirection: 'row',
    paddingTop: 30,
    justifyContent: 'space-evenly',
    marginHorizontal: 25,
  },
  containerFeedback1: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: 25,
  },
  containerTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    flexDirection: 'column',
  },
  yourFeedbackText: {
    paddingVertical: 20,
    fontSize: CONSTANTS.FONT_SIZE.S,
  },
});

export default RateDriver;
