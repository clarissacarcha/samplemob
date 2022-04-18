import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, StatusBar, ImageBackground} from 'react-native';
import {useSelector} from 'react-redux';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {Shadow} from '../../../../../../../revamp';
import {ThrottledHighlight} from '../../../../../../../components_section';
import TypeWriter from 'react-native-typewriter';
import {useNavigation} from '@react-navigation/core';

import {FONT, FONT_SIZE, COLOR, SIZE} from '../../../../../../../res/variables';

import HeaderImage from '../../../../../../../assets/toktok/images/HeaderBackground.png';

const SearchTypeWriter = ({onTypingEnd}) => (
  <TypeWriter typing={1} style={{color: COLOR.MEDIUM}} maxDelay={80} minDelay={40} onTypingEnd={onTypingEnd}>
    Search the toktok app!
  </TypeWriter>
);

const TypeTypeWriter = ({onTypingEnd}) => (
  <TypeWriter typing={1} style={{color: COLOR.MEDIUM}} maxDelay={80} minDelay={40} onTypingEnd={onTypingEnd}>
    Type a location or an establishment!
  </TypeWriter>
);

const SearchInput = () => {
  const navigation = useNavigation();

  const [renderWriter, setRenderWriter] = useState(true);

  const switchWriter = () => {
    setTimeout(() => {
      setRenderWriter(!renderWriter);
    }, 1000);
  };

  const RenderedWriter = renderWriter ? (
    <SearchTypeWriter onTypingEnd={switchWriter} />
  ) : (
    <TypeTypeWriter onTypingEnd={switchWriter} />
  );

  return (
    <View style={styles.searchContainer}>
      <ThrottledHighlight
        underlayColor={COLOR.WHITE_UNDERLAY}
        onPress={() => {
          navigation.push('ToktokSearch');
        }}
        delay={100}
        style={styles.searchBox}>
        <View style={styles.inputBox}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FeatherIcon name="search" size={20} color={COLOR.ORANGE} />
            <View style={{flex: 1, marginLeft: 10}}>{RenderedWriter}</View>
          </View>
        </View>
      </ThrottledHighlight>
    </View>
  );
};

export const HeaderSearchField = () => {
  const session = useSelector(state => state.session);

  return (
    <>
      <View style={styles.headerBox}>
        <View style={styles.greetingBox}>
          <Text style={styles.greetingText}>
            Hello, {session.user.person.firstName} {session.user.person.lastName}
          </Text>
        </View>
        <SearchInput />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    alignItems: 'center',
    // backgroundColor:COLOR.TRANSPARENT_YELLOW
  },
  headerBox: {
    backgroundColor: 'white',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 5,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  greetingBox: {
    justifyContent: 'center',
    // backgroundColor: COLOR.TRANSPARENT_YELLOW,
    paddingHorizontal: SIZE.MARGIN,
  },
  greetingText: {
    marginTop: 24,
    marginBottom: 16,
    color: COLOR.ORANGE,
    fontSize: FONT_SIZE.XL,
    fontFamily: FONT.BOLD,
  },
  searchBox: {
    bottom: 5,
    borderRadius: 5,
    backgroundColor: 'white',
    marginHorizontal: 16,
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
