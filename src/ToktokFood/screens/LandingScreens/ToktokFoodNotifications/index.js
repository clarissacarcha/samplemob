import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {FlatList, View, Text, TouchableOpacity} from 'react-native';

import FIcon5 from 'react-native-vector-icons/FontAwesome5';

import styles from './styles';

// Strings
import {notifications} from 'toktokfood/helper/strings';

const ToktokFoodNotifications = () => {
  const navigation = useNavigation();

  const onBack = () => {
    navigation.goBack();
  };

  const renderItem = ({item}) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationIcon}>
        <FIcon5 name="envelope" size={18} color="#FFFFFF" />
      </View>
      <View style={styles.infoWrapper}>
        <View style={styles.notificationInfo}>
          <Text numberOfLines={2} style={styles.notificationTitle}>
            {item.title}
          </Text>
          <Text numberOfLines={2} style={styles.notificationContent}>
            {item.content}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onBack()}>
          <FIcon5 name="chevron-left" size={20} color="#FDBA1C" />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Text style={styles.headerLabel}>Notifications</Text>
        </View>
      </View>
      <View style={styles.listContainer}>
        <FlatList data={notifications} renderItem={renderItem} />
      </View>
    </View>
  );
};

export default ToktokFoodNotifications;
