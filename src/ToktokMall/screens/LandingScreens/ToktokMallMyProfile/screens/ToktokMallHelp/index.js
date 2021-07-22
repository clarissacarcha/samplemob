import React from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity} from 'react-native'
import { HeaderBack, HeaderTitle, HeaderRight, Card } from '../../../../../Components';
import CustomIcon from '../../../../../Components/Icons';
import { AlertOverlay} from '../../../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../../../res/variables';

export const ToktokMallHelp = ({navigation})=> {

    navigation.setOptions({
        headerLeft: () => <HeaderBack />,
        headerTitle: () => <HeaderTitle label={['Help', '']} />,
        headerRight: () => <HeaderRight hidden={true} />
    });

    return (
        <>
        <View style={styles.container}>
            <View style={{flex: 1, paddingVertical: 30, paddingHorizontal: 15}}>              
              <Card>
                <View style={{flex: 0, padding: 15}}>
                  <View style={{flex: 0, alignItems: 'center', justifyContent: 'center', paddingVertical: 10}}>
                    <Text style={{fontSize: 24, fontFamily: FONT.BOLD, color: COLOR.ORANGE}}>Contact Us</Text>
                  </View>
                  <View style={{flex: 0, paddingVertical: 10, paddingHorizontal: 10}}>
                    <Text style={{fontSize: 12}}>Email us with any of your inquiries or contact us with the contact information provided below. We will gladly discuss with you the best possible solution to your needs.</Text>
                  </View>

                  <View style={{flex: 0, paddingVertical: 0, paddingHorizontal: 10}}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                          <CustomIcon.FeIcon name="phone" size={25} color={COLOR.ORANGE} />
                        </View>
                        <View style={{flex: 3, justifyContent: 'center'}}>
                          <Text>(632) 8424 8617</Text>
                        </View>
                      </View>
                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
                          <CustomIcon.FeIcon name="mail" size={25} color={COLOR.ORANGE} />
                        </View>
                        <View style={{flex: 3, justifyContent: 'center', alignItems: 'flex-end'}}>
                          <Text>mall@toktok.ph</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* <View style={{height: 120}}></View> */}

                </View>
              </Card>
            </View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.WHITE
    }
})
