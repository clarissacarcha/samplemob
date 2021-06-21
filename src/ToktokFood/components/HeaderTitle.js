import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import ContentLoader from 'react-native-easy-content-loader';
import {useSelector} from 'react-redux';

const HeaderTitle = () => {
  const {location} = useSelector((state) => state.toktokFood);

  const renderText = () => (
    <>
      <Text style={styles.headerLabel}>TokTok PH</Text>
      <Text numberOfLines={1}>{location.formattedAddress}</Text>
    </>
  );

  const renderLoader = () => (
    <ContentLoader
      active
      pRows={2}
      pWidth={['40%', '70%']}
      title={false}
      primaryColor="#FFFFFF"
      secondaryColor="rgba(256,186,28,0.4)"
    />
  );

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerBack}>
        <FIcon5 name="chevron-left" size={15} />
      </TouchableOpacity>
      <View style={styles.headerTextContainer}>{!location ? renderLoader() : renderText()}</View>
    </View>
  );
};

export default HeaderTitle;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingVertical: 40,
  },
  headerBack: {
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  headerLabel: {
    fontWeight: '500',
    fontSize: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
});
