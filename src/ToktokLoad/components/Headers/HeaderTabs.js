import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet, Platform, Image, View, Text } from "react-native";

//FONTS & COLORS
import { COLOR, FONT, FONT_SIZE } from "src/res/variables";

const Tab = createMaterialTopTabNavigator();

export const HeaderTabs = ({ tabs }) => {

  return (
    <Tab.Navigator
      tabBarOptions={{
        allowFontScaling: false,
        style: [ styles.bottomLine ],
        indicatorStyle: [ styles.indicator ],
        activeTintColor: "#F6841F",
        inactiveTintColor: "#707070",
      }}
    >
      { tabs.map((tab) => {
          return(
            <Tab.Screen
              key={tab}
              name={tab.name}
              options={{
                tabBarLabel: ({ color }) => {
                  return (
                    <View style={{ flexDirection: "row" }}>
                      <Text style={[ styles.tabText, { color } ]}>
                        {tab.name}
                      </Text>
                    </View>
                  )
                },
              }}
            >
              {() => tab.screen }
            </Tab.Screen>
          )
        })
      }
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  bottomLine: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  indicator: {
    backgroundColor: "#F6841F",
    height: 3
  },
  tabText: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M
  }
})
