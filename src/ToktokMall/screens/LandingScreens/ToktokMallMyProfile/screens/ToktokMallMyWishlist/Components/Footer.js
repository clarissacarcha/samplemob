import React from 'react';
import {View, Text, Image, FlatList, SectionList, ImageBackground, TouchableOpacity, StyleSheet} from 'react-native';

export const RenderFooter = ({onPressVisitStore, onPressBuyNow, onPressAddToCart}) => {
	return (
		<>
			<View style={styles.container}>
        <View style={styles.subContainer}>
          <View style={styles.flex2} />
          <View style={styles.deleteContainer}>
            <TouchableOpacity onPress={onPressBuyNow} style={styles.deleteButton}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.flex2} />
        </View>
      </View>
		</>
	)
}
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#fff', 
    position: 'absolute', 
    bottom: 0, 
    width: '100%'
  },
  subContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 8, 
    paddingTop: 12, 
    paddingBottom: 8
  },
  flex2: {
    flex: 2
  },
  deleteContainer: {
    flex: 3, 
    paddingHorizontal: 4
  },
  deleteButton: {
    backgroundColor: '#F6841F', 
    paddingVertical: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 5, 
    borderColor: "#F6841F", 
    borderWidth: 1
  },
  deleteText: {
    fontSize: 14, 
    color: '#fff'
  },

})