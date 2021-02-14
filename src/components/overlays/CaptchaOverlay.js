import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  Modal,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import FIcon from 'react-native-vector-icons/Feather';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SizedBox} from '../../components/widgets';
import _ from 'lodash';
import {COLOR, DARK, MEDIUM, LIGHT, ORANGE, APP_FLAVOR, COLOR_UNDERLAY, FONT_COLOR} from '../../res/constants';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PIN_HEIGHT = (SCREEN_WIDTH - 120) / 3;

const NumberButton = ({number, onPress}) => {
  return (
    <TouchableHighlight onPress={() => onPress({number})} underlayColor={COLOR_UNDERLAY} style={styles.numberButton}>
      <Text style={{fontFamily: 'Rubik-Medium', fontSize: 25, color: MEDIUM}}>{number}</Text>
    </TouchableHighlight>
  );
};

const AnswerBox = ({number, answer}) => {
  let color = LIGHT;
  if (answer === undefined) {
    color = LIGHT;
  } else {
    if (number === answer) {
      color = COLOR;
    } else {
      color = 'red';
    }
  }

  return (
    <TouchableHighlight onPress={() => {}} underlayColor={COLOR_UNDERLAY} style={styles.answerButton}>
      <Text style={{fontFamily: 'Rubik-Medium', fontSize: 25, color}}>{number}</Text>
    </TouchableHighlight>
  );
};

const DeleteButton = ({onPress}) => {
  return (
    <TouchableHighlight onPress={onPress} underlayColor={COLOR_UNDERLAY} style={styles.numberButton}>
      <FIcon name="delete" size={30} color={MEDIUM} />
    </TouchableHighlight>
  );
};

const CancelButton = ({onPress}) => {
  return (
    <TouchableHighlight onPress={onPress} underlayColor={COLOR_UNDERLAY} style={styles.numberButton}>
      <MCIcon name="cancel" size={30} color={MEDIUM} />
    </TouchableHighlight>
  );
};

const NumberRow = ({children}) => {
  return <View style={styles.numberRow}>{children}</View>;
};

const PinRow = ({children}) => {
  return <View style={styles.pinRow}>{children}</View>;
};

const generateKeypadNumbers = () => {
  let digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    randomDigits = [],
    i = digits.length,
    j = 0;

  while (i--) {
    j = Math.floor(Math.random() * (i + 1));
    randomDigits.push(digits[j]);
    digits.splice(j, 1);
  }

  return randomDigits;
};

const CaptchaOverlayRender = ({visible, onSuccess, onCancel}) => {
  const generateRandom = () => _.random(100, 999).toString();

  const [keypadNumbers, setKeypadNumbers] = useState(generateKeypadNumbers());
  const [question, setQuestion] = useState(generateRandom());
  const [answer, setAnswer] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onNumberPress = ({number}) => {
    setAnswer(`${answer}${number}`);
  };

  const onDelete = () => {
    setAnswer(answer.slice(0, -1));
  };

  useEffect(() => {
    if (answer.length === 3) {
      if (answer !== question) {
        setKeypadNumbers(generateKeypadNumbers());
        setQuestion(generateRandom());
        setAnswer('');
        setErrorMessage('Incorrect answer, please try again.');
      } else {
        onSuccess();
      }
    }
  }, [answer]);

  if (!visible) {
    return null;
  }

  return (
    <Modal animationType="fade" transparent={true} visible={true} style={StyleSheet.absoluteFill}>
      <View style={styles.card}>
        <View style={{backgroundColor: 'white', borderRadius: 10, padding: 20}}>
          <PinRow>
            <AnswerBox number={question[0]} answer={answer[0]} />
            <AnswerBox number={question[1]} answer={answer[1]} />
            <AnswerBox number={question[2]} answer={answer[2]} />
          </PinRow>
          <SizedBox />
          <View style={{alignItems: 'center'}}>
            <Text style={{fontFamily: 'Rubik-Medium', color: MEDIUM}}>Enter the numbers above to accept order.</Text>
            {errorMessage !== '' && (
              <Text style={{fontFamily: 'Rubik-Medium', color: 'red', fontSize: 12}}>{errorMessage}</Text>
            )}
          </View>
          <SizedBox />
          <NumberRow>
            <NumberButton number={keypadNumbers[0]} onPress={onNumberPress} />
            <NumberButton number={keypadNumbers[1]} onPress={onNumberPress} />
            <NumberButton number={keypadNumbers[2]} onPress={onNumberPress} />
          </NumberRow>
          <SizedBox />
          <NumberRow>
            <NumberButton number={keypadNumbers[3]} onPress={onNumberPress} />
            <NumberButton number={keypadNumbers[4]} onPress={onNumberPress} />
            <NumberButton number={keypadNumbers[5]} onPress={onNumberPress} />
          </NumberRow>
          <SizedBox />
          <NumberRow>
            <NumberButton number={keypadNumbers[6]} onPress={onNumberPress} />
            <NumberButton number={keypadNumbers[7]} onPress={onNumberPress} />
            <NumberButton number={keypadNumbers[8]} onPress={onNumberPress} />
          </NumberRow>
          <SizedBox />
          <NumberRow>
            <CancelButton onPress={onCancel} />
            <NumberButton number={keypadNumbers[9]} onPress={onNumberPress} />
            <DeleteButton onPress={onDelete} />
          </NumberRow>
        </View>
      </View>
    </Modal>
  );
};

export const CaptchaOverlay = (props) => {
  return props.visible && <CaptchaOverlayRender {...props} />;
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
    justifyContent: 'center',
  },
  answerButton: {
    height: PIN_HEIGHT / 3,
    width: PIN_HEIGHT,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: DARK,
    // borderWidth: 1,
  },
  numberButton: {
    height: PIN_HEIGHT / 2,
    width: PIN_HEIGHT,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: MEDIUM,
  },
  blankButton: {
    height: PIN_HEIGHT / 2,
    width: PIN_HEIGHT,
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
