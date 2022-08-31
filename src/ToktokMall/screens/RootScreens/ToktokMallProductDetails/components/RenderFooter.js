import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { FONT } from '../../../../../res/variables';
import { Header } from '../../../../Components';
import CustomIcon from '../../../../Components/Icons';

export const RenderFooter = ({hideBuyNow, onPressVisitStore, onPressBuyNow, onPressAddToCart, onPressAddToFavorites}) => {
	
  if(hideBuyNow){
    return (
      <>
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <View style={{flex: 2}} />
            <View style={{flex: 3.5, paddingHorizontal: 4}}>
              <TouchableOpacity 
                onPress={onPressVisitStore} 
                style={[styles.bottomContainer, { backgroundColor: '#FFF' }]}
              >
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <CustomIcon.MIcon name="store" size={20} color="#F6841F" />
                </View>
                <View style={{flex: 3, alignItems: 'center'}}>
                  <Text style={{fontSize: 13, color: '#F6841F'}}>Visit Store</Text>
                </View>              
                <View style={{flex: 0.5}} />
              </TouchableOpacity>
            </View>
            <View style={{flex: 2}} />
            {/* <View style={{flex: 5, paddingHorizontal: 4}}>
              <TouchableOpacity onPress={onPressAddToFavorites} style={{backgroundColor: '#FFF', paddingVertical: 12, alignItems: 'center', justifyContent: 'center',  borderRadius: 5, borderColor: "#F6841F", borderWidth: 1}}>
                <Text style={{fontSize: 13, color: '#F6841F', fontFamily: FONT.BOLD}}>Add to Favorites</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      </>
    )
  }else{
    return (
      <>
        <View style={styles.container}>
          <View style={styles.subContainer}>
            {/* <View style={{flex: 1.8, paddingHorizontal: 4}}>
              <TouchableOpacity onPress={onPressVisitStore} style={{backgroundColor: '#FFF', flexDirection: 'row', paddingVertical: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 5,  borderColor: "#F6841F", borderWidth: 1}}>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <CustomIcon.MIcon name="store" size={14} color="#F6841F" />
                </View>
                <View style={{flex: 4, alignItems: 'center'}}>
                  <Text style={{fontSize: 13, color: '#F6841F'}}>Visit Store</Text>
                </View>              
              </TouchableOpacity>
            </View> */}
            <View style={{flex: 0.5}} />
            <View style={{flex: 5, paddingHorizontal: 4}}>
              <TouchableOpacity 
                onPress={onPressBuyNow} 
                style={[styles.bottomContainer, { backgroundColor: '#F6841F' }]}
              >
                <Text style={{fontSize: 14, color: '#fff'}}>Buy Now</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 0.1}} />
            <View style={{flex: 5, paddingHorizontal: 4}}>
              <TouchableOpacity 
                onPress={onPressAddToCart} 
                style={[styles.bottomContainer, { backgroundColor: '#FFF' }]}
              >
                <Text style={{fontSize: 13, color: '#F6841F', fontFamily: FONT.BOLD}}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 0.5}} />
          </View>
        </View>
      </>
    )
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#fff', 
    position: 'absolute', 
    bottom: 0, 
    width: '100%'
  },
  subContainer:{
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 8, 
    paddingTop: 12, 
    paddingBottom: 8
  },
  bottomContainer: {
    flexDirection: 'row', 
    paddingVertical: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 5,  
    borderColor: "#F6841F", 
    borderWidth: 1
  }
})