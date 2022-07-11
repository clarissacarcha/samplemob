import React, {useState, useContext, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {HeaderBack, HeaderTitle} from 'src/revamp';
import CONSTANTS from 'common/res/constants';
import {Separator, CheckIdleState, Prev} from 'toktokwallet/components';
import {
  ChannelList,
  ContextProvider,
  Submit,
  ContextChannelForm,
  modifyPlaceholderAccordingToChannel,
} from './components';
import {YellowButton} from 'src/revamp';
import {Transitioning, Transition} from 'react-native-reanimated';

const {FONT_FAMILY: FONT, FONT_SIZE, COLOR, SHADOW, SIZE} = CONSTANTS;

const MainComponent = props => {
  const {selectedCallChannel, callChannels} = useContext(ContextChannelForm);
  const transitionRef = useRef();
  const transition = <Transition.Change interpolation="easeOut" />;

  const onPress = () => {
    transitionRef.current.animateNextTransition();
  };

  if (callChannels.length === 0) {
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator color={COLOR.YELLOW} size={24} />
      </View>
    );
  }

  return (
    <Transitioning.View ref={transitionRef} transition={transition} style={styles.container}>
      <FlatList
        data={callChannels}
        renderItem={({item, index}) => {
          return <ChannelList index={index} item={item} onPress={onPress} />;
        }}
        extraData={selectedCallChannel.channelName}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{padding: 16}}
        ListHeaderComponent={() => (
          <View style={{marginBottom: 16}}>
            <Text style={{fontFamily: FONT.BOLD}}>Video Call Schedule</Text>
            <Text style={{paddingTop: 8, color: '#525252', fontSize: FONT_SIZE.S}}>
              Select your preferred platform and schedule and be ready to be called by one of our team for identity
              confirmation.{' '}
            </Text>
          </View>
        )}
      />
      <Submit {...props} />
    </Transitioning.View>
  );
};

export const PepRequestVideoCall = props => {
  return (
    <ContextProvider {...props}>
      <MainComponent {...props} />
    </ContextProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
