import {Dimensions, Platform} from 'react-native';

export const LIGHT_THEME = {
  color: {
    primary: '#2178FF',

    blue: '#0076FE',
    lightblue: '#E1EFFF',

    black: '#000000',
    white: '#FFFFFF',
    whitesmoke: '#EFEFEF',
    dirtywhite: '#F9F9F9',

    gray: '#9E9E9E',
    darkgray: '#525252',
    lightgray: '#CCCCCC',
    bordergray: '#C8C8C8',
    faintgray: '#F4F4F4',
    palegray: '#F4F5F8',
    semigray: '#ECECEC',
    gray91: '#E8E8E8',
    silver: '#DCDCDC',

    green: '#198754',
    red: '#ED3A19',
    orange: '#F6841F',
    orangedisabled: '#F6841F', // opacity 50%
    yellow: '#FDBA1C',
  },
  divider: {
    active: '#F7F7FA',
    inactive: '#DDDDDD',
  },
  tabs: {
    active: '#0076FF',
    inactive: '#8E8E93',
    background: '#FFFFFF',
  },
  textInput: {
    container: '#F8F8F8',
    notecontainer: '#FFFCF4',
    color: 'black',
    placeholder: '#8E8E93',
    disabled: '#F2F2F2',
    bottomBorder: {
      inactive: '#F2F2F2',
      active: '#0076FF',
      error: '#E93333',
    },
    prefixDivider: '#F2F2F2',
    limit: '#DCDCDC',
  },
  button: {
    enabled: '#2178FF',
    disabled: '#A7A7A7',
    textColor: '#FFFFFF',
  },
  avatar: {
    defaultBackground: '#D4D4D4',
    liveBorderColor: '#0076ff',
    badgeBackground: '#e1efff',
    liveBackground: '#C2001F',
    roundedBorderColor: '#d8d8d8',
  },
  header: {
    defaultBackground: '#FFFFFF',
    defaultBackButton: '#0076FF',
  },
  searchBox: {
    background: '#F4F4F4',
    iconColor: '#C6C6C6',
  },
  messages: {
    threadBackground: '#FFFFFF',
    unreadBackground: '#E1EFFF',
    borderColor: '#F4F4F4',
    name: '#000000',
    date: '#8E8E93',
    recentMessage: '#8E8E93',
    unreadIndicator: '#0076FF',
    actions: {
      textColor: '#FFFFFF',
      tintColor: '#FFFFFF',
      delete: '#F44336',
      mute: '#A9A9A9',
      pin: '#CACACA',
    },
  },
  chat: {
    backgroundColor: '#FFFFFF',
    disabledSend: '#DEDEDE',
    enabledSend: '#2178FF',
    headerTitle: '#000000',
    onlineText: '#8E8E93',
    reply: {
      container: '#E8E8E8',
      label: '#8E8E93',
      message: '#171717',
      displayedReply: {
        name: {
          isSender: '#2178FF',
        },
        message: {
          isSender: '#000000',
        },
        container: {
          isSender: '#E1EFFF',
        },
      },
    },
    groupChat: {
      actionItemContainer: '#F1F1F1',
      itemColor: '#0076FF',
      settingsNegativeIcon: '#E02020',
    },
  },
  account: {
    transaction: {
      method: '#171717',
      description: '#8E8E93',
      credit: '#0076FF',
      debit: '#E93333',
      borderTop: '#F2F2F2',
      borderDashed: '#0076FF',
    },
  },
  pinnedPost: {
    label: '#0076FF',
  },
  deliveryStatus: {
    forPickupText: '#E4AE00',
    forPickupTextBackground: '#FFF6E1',
    pickupText: '#2BAD0D',
    pickupTextBackground: '#D5F3CE',
    completedText: '#0076FF',
    completedTextBackground: '#E1EFFF',
    expiredText: '#E93333',
    expiredTextBackground: '#FCE1E1',
    cancelledText: '#B2B2B2',
    cancelledTextBackground: '#F4F4F4',
    pendingText: '#5D77FF',
    pendingTextBackground: '#E8EBFF',
  },
};

const {width, height} = Dimensions.get('window');

export const WIDTH = width;
export const HEIGHT = height;
export const GUIDELINE_BASE_WIDTH = 375;
export const GUIDELINE_BASE_HEIGHT = 667;
export const IS_ANDROID = Platform.OS === 'android';
